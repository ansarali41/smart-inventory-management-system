import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, message, Modal, Select, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import './cart.css';

const Cart = () => {
    const [userId, setUserId] = useState(() => {
        const auth = localStorage.getItem('auth');
        return auth ? JSON.parse(auth)._id : null;
    });

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            setUserId(JSON.parse(auth)._id);
        }
    }, []);

    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector(state => state.rootReducer);

    const handlerIncrement = record => {
        dispatch({
            type: 'UPDATE_CART',
            payload: { ...record, quantity: record.quantity + 1 },
        });
    };

    const handlerDecrement = record => {
        if (record.quantity !== 1) {
            dispatch({
                type: 'UPDATE_CART',
                payload: { ...record, quantity: record.quantity - 1 },
            });
        }
    };

    const handlerDelete = record => {
        dispatch({
            type: 'DELETE_FROM_CART',
            payload: record,
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image, record) => <img src={image} alt={record.name} height={60} width={60} />,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: price => <strong>{price}৳</strong>,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            render: stock => <strong>{stock}</strong>,
        },
        {
            title: 'Quantity',
            dataIndex: '_id',
            render: (id, record) => (
                <div>
                    <MinusCircleOutlined className="cart-minus" onClick={() => handlerDecrement(record)} />
                    <strong className="cart-quantity">{record.quantity}</strong>
                    <PlusCircleOutlined className="cart-plus" onClick={() => handlerIncrement(record)} />
                </div>
            ),
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (id, record) => <DeleteOutlined className="cart-action" onClick={() => handlerDelete(record)} />,
        },
    ];

    useEffect(() => {
        let temp = 0;
        cartItems.forEach(product => (temp = temp + product.price * product.quantity));
        setSubTotal(temp);
    }, [cartItems]);

    const handlerSubmit = async value => {
        try {
            if (!userId) {
                message.error('User authentication error. Please login again.');
                return;
            }

            // First check if customer exists
            const customerResponse = await axios.get(`/api/customers/get-customers-by-number?phone=${value.phone}&createdBy=${userId}`);
            let customerId;

            if (customerResponse.data.length === 0) {
                // Create new customer
                const newCustomer = {
                    name: value.name,
                    phone: value.phone,
                    address: value.address,
                    createdBy: userId,
                };
                try {
                    const createResponse = await axios.post('/api/customers/add-customers', newCustomer);
                    if (createResponse.data.customer) {
                        customerId = createResponse.data.customer._id;
                        message.success('New customer created successfully!');
                    } else {
                        throw new Error('Failed to create customer');
                    }
                } catch (error) {
                    console.error('Error creating customer:', error);
                    message.error('Failed to create customer');
                    return;
                }
            } else {
                customerId = customerResponse.data[0]._id;
            }

            const newObject = {
                customerName: value.name,
                customerPhone: Number(value.phone),
                customerAddress: value.address,
                cartItems,
                subTotal,
                tax: Number(((subTotal / 100) * 5).toFixed(2)),
                totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 5).toFixed(2))).toFixed(2)),
                paymentMethod: value.paymentMethod,
                createdBy: userId,
                customerId: customerId,
            };

            // check the stock
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems[i].stock < cartItems[i].quantity) {
                    message.error(`Only ${cartItems[i].stock} items in stock for ${cartItems[i].name}`);
                    return;
                }
            }

            try {
                const billResponse = await axios.post('/api/bills/addbills', newObject);
                if (billResponse.data) {
                    message.success('Bill Generated Successfully!');
                    // update product stock
                    for (let i = 0; i < cartItems.length; i++) {
                        await axios.put('/api/products/updateproducts', {
                            stock: cartItems[i].stock - cartItems[i].quantity,
                            productId: cartItems[i]._id,
                        });
                    }

                    //clear cart
                    dispatch({
                        type: 'CLEAR_CART',
                    });
                    navigate('/bills');
                    setBillPopUp(false);
                }
            } catch (error) {
                console.error('Error generating bill:', error);
                message.error(error.response?.data?.message || 'Failed to generate bill');
            }
        } catch (error) {
            message.error('Error!');
            console.log(error);
        }
    };

    return (
        <Layout>
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h2 className="empty-text">Cart is empty!</h2>
                    <Empty />
                </div>
            ) : (
                <div>
                    <Table dataSource={cartItems} columns={columns} bordered />
                    <div className="subTotal">
                        <h2>
                            Sub Total: <span>{subTotal.toFixed(2)}৳</span>
                        </h2>
                        <Button onClick={() => setBillPopUp(true)} className="add-new">
                            Generate Invoice
                        </Button>
                    </div>
                    <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false)} footer={false}>
                        <Form layout="vertical" onFinish={handlerSubmit} form={form}>
                            {/* find customer by number or create new customer */}
                            <FormItem name="phone" label="Customer Phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
                                <Input
                                    onBlur={async e => {
                                        const phone = e.target.value;
                                        if (phone && userId) {
                                            try {
                                                const response = await axios.get(`/api/customers/get-customers-by-number?phone=${phone}&createdBy=${userId}`);
                                                if (response.data.length > 0) {
                                                    const customer = response.data[0];
                                                    form.setFieldsValue({
                                                        name: customer.name,
                                                        address: customer.address,
                                                    });
                                                    message.success('Customer found!');
                                                } else {
                                                    form.setFieldsValue({
                                                        name: '',
                                                        address: '',
                                                    });
                                                }
                                            } catch (error) {
                                                console.error('Error finding customer:', error);
                                            }
                                        }
                                    }}
                                />
                            </FormItem>
                            <FormItem name="name" label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
                                <Input />
                            </FormItem>
                            <FormItem name="address" label="Customer Address" rules={[{ required: true, message: 'Please enter customer address' }]}>
                                <Input />
                            </FormItem>
                            <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true, message: 'Please select payment method' }]}>
                                <Select>
                                    <Select.Option value="cash">Cash</Select.Option>
                                    <Select.Option value="mobilePay">Mobile Pay</Select.Option>
                                    <Select.Option value="card">Card</Select.Option>
                                </Select>
                            </Form.Item>
                            <div className="total">
                                <span>SubTotal: {subTotal.toFixed(2)}৳</span>
                                <br />
                                <span>Tax: {((subTotal / 100) * 5).toFixed(2)}৳</span>
                                <h3>Total: {(Number(subTotal) + Number(((subTotal / 100) * 5).toFixed(2))).toFixed(2)}৳</h3>
                            </div>
                            <div className="form-btn-add">
                                <Button htmlType="submit" className="add-new">
                                    Generate Invoice
                                </Button>
                            </div>
                        </Form>
                    </Modal>
                </div>
            )}
        </Layout>
    );
};

export default Cart;
