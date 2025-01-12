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
    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);

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
        //console.log(value);
        try {
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                tax: Number(((subTotal / 100) * 5).toFixed(2)),
                totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 5).toFixed(2))).toFixed(2)),
                userId: JSON.parse(localStorage.getItem('auth'))._id,
            };
            // check the stock
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems[i].stock < cartItems[i].quantity) {
                    message.error(`Only ${cartItems[i].stock} items in stock for ${cartItems[i].name}`);
                    return;
                }
            }
            await axios.post('/api/bills/addbills', newObject);
            message.success('Bill Generated!');
            // update product stock
            for (let i = 0; i < cartItems.length; i++) {
                await axios.put('/api/products/updateproducts', { stock: cartItems[i].stock - cartItems[i].quantity, productId: cartItems[i]._id });
            }

            //clear cart
            dispatch({
                type: 'CLEAR_CART',
            });
            navigate('/bills');
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
                        <Form layout="vertical" onFinish={handlerSubmit}>
                            {/* find customer by number or create new customer */}

                            <FormItem name="phone" label="Customer Phone">
                                <Input />
                            </FormItem>
                            <FormItem name="name" label="Customer Name">
                                <Input />
                            </FormItem>
                            <FormItem name="address" label="Customer Address">
                                <Input />
                            </FormItem>
                            <Form.Item name="paymentMethod" label="Payment Method">
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
