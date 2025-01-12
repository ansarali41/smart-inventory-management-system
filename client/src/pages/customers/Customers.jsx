import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';

const Customers = () => {
    const [userId, setUserId] = useState(() => {
        const auth = localStorage.getItem('auth');
        return auth ? JSON.parse(auth)._id : null;
    });
    const dispatch = useDispatch();
    const [customersData, setCustomersData] = useState([]);
    const [popModal, setPopModal] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);
    const [searchPhone, setSearchPhone] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            setUserId(JSON.parse(auth)._id);
        }
    }, []);

    const getAllCustomers = async () => {
        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            const { data } = await axios.get('/api/customers/get-customers');
            setCustomersData(data);
            dispatch({
                type: 'HIDE_LOADING',
            });
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCustomers();
    }, []);

    const handlerSubmit = async value => {
        try {
            const customerData = {
                name: value.name,
                phone: value.phone,
                address: value.address,
                createdBy: userId,
            };

            dispatch({
                type: 'SHOW_LOADING',
            });

            if (editCustomer) {
                await axios.put('/api/customers/update-customers', {
                    ...customerData,
                    customerId: editCustomer._id,
                });
                message.success('Customer Updated Successfully!');
            } else {
                await axios.post('/api/customers/add-customers', customerData);
                message.success('Customer Added Successfully!');
            }

            getAllCustomers();
            setPopModal(false);
            setEditCustomer(null);
            form.resetFields();
            dispatch({
                type: 'HIDE_LOADING',
            });
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            message.error(editCustomer ? 'Error updating customer' : 'Error adding customer');
            console.log(error);
        }
    };

    const handleEdit = record => {
        setEditCustomer(record);
        form.setFieldsValue(record);
        setPopModal(true);
    };

    const handleDelete = async record => {
        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            await axios.post('/api/customers/delete-customers', { customerId: record._id });
            message.success('Customer Deleted Successfully!');
            getAllCustomers();
            dispatch({
                type: 'HIDE_LOADING',
            });
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            message.error('Error deleting customer');
            console.log(error);
        }
    };

    const handleSearch = async () => {
        const cleanPhone = searchPhone.replace(/\D/g, '');

        try {
            dispatch({ type: 'SHOW_LOADING' });
            const response = await axios.get('/api/customers/get-customers-by-number', {
                params: {
                    phone: cleanPhone,
                    createdBy: userId,
                },
            });

            setSearchResults(response.data);

            dispatch({ type: 'HIDE_LOADING' });
        } catch (error) {
            console.error('Search error:', error);
            message.error('Error searching customers');
            dispatch({ type: 'HIDE_LOADING' });
        }
    };

    // Debounce search with shorter delay for better responsiveness
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchPhone]);

    // Handle phone input with partial search support
    const handlePhoneInput = e => {
        const value = e.target.value.replace(/\D/g, '');
        setSearchPhone(value);
    };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
        },
        {
            title: 'Contact Number',
            dataIndex: 'phone',
            render: phone => <span>+880{phone}</span>,
        },
        {
            title: 'Customer Address',
            dataIndex: 'address',
        },
        {
            title: 'Created On',
            dataIndex: 'createdAt',
            render: createdAt => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <div>
                    <EditOutlined className="cart-edit mx-2" onClick={() => handleEdit(record)} />
                    <DeleteOutlined className="cart-action" onClick={() => handleDelete(record)} />
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>All Customers</h2>
                <div className="d-flex gap-3">
                    <Input
                        placeholder="Search by phone number"
                        value={searchPhone}
                        onChange={handlePhoneInput}
                        style={{ width: '200px' }}
                        suffix={<SearchOutlined />}
                        maxLength={15}
                    />
                    <Button
                        className="add-new"
                        onClick={() => {
                            setEditCustomer(null);
                            form.resetFields();
                            setPopModal(true);
                        }}
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            <Table
                dataSource={searchPhone ? searchResults : customersData}
                columns={columns}
                bordered
                pagination={false}
                locale={{
                    emptyText: searchPhone ? 'No matching customers found' : 'No customers available',
                }}
            />

            <Modal
                title={editCustomer ? 'Edit Customer' : 'Add New Customer'}
                visible={popModal}
                onCancel={() => {
                    setPopModal(false);
                    setEditCustomer(null);
                    form.resetFields();
                }}
                footer={false}
            >
                <Form layout="vertical" onFinish={handlerSubmit} form={form} initialValues={editCustomer}>
                    <FormItem name="name" label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
                        <Input />
                    </FormItem>
                    <FormItem
                        name="phone"
                        label="Contact Number"
                        rules={[
                            { required: true, message: 'Please enter contact number' },
                            { pattern: /^\d+$/, message: 'Please enter only numbers' },
                        ]}
                    >
                        <Input
                            maxLength={15}
                            onChange={e => {
                                const value = e.target.value.replace(/\D/g, '');
                                form.setFieldsValue({ phone: value });
                            }}
                        />
                    </FormItem>
                    <FormItem name="address" label="Customer Address" rules={[{ required: true, message: 'Please enter customer address' }]}>
                        <Input />
                    </FormItem>

                    <div className="form-btn-add">
                        <Button htmlType="submit" className="add-new">
                            {editCustomer ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Customers;
