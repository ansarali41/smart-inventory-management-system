import { DeleteOutlined, EditOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
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
        if (!searchPhone) {
            message.warning('Please enter a phone number to search');
            return;
        }

        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            const { data } = await axios.get(`/api/customers/get-customers-by-number?phone=${searchPhone}&createdBy=${userId}`);
            setSearchResults(data);
            dispatch({
                type: 'HIDE_LOADING',
            });

            if (data.length === 0) {
                message.info('No customer found with this number. Would you like to create a new customer?');
            }
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            message.error('Error searching for customer');
            console.log(error);
        }
    };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
        },
        {
            title: 'Contact Number',
            dataIndex: 'phone',
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
                <h2>All Customers </h2>
                <div className="d-flex gap-3">
                    <div className="d-flex gap-2">
                        <Input placeholder="Search by phone number" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} style={{ width: '200px' }} />
                        <Button icon={<SearchOutlined />} onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                    <Button
                        className="add-new"
                        icon={<UserAddOutlined />}
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

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="mb-4">
                    <h3>Search Results</h3>
                    <Table dataSource={searchResults} columns={columns} bordered pagination={false} className="mb-4" />
                </div>
            )}

            {/* All Customers Table */}
            <Table dataSource={customersData} columns={columns} bordered />

            {/* add/edit customer modal */}
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
                        <Input placeholder="Enter customer name" />
                    </FormItem>
                    <FormItem name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number' }]}>
                        <Input placeholder="Enter phone number" />
                    </FormItem>
                    <FormItem name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}>
                        <Input placeholder="Enter address" />
                    </FormItem>

                    <div className="form-btn-add">
                        <Button htmlType="submit" className="add-new">
                            {editCustomer ? 'Update Customer' : 'Add Customer'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Customers;
