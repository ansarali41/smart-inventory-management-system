import { Button, Form, Input, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../asset/images/brand-logo.png';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlerSubmit = async value => {
        console.log('value login', value);
        try {
            dispatch({
                type: 'SHOW_LOADING',
            });
            const res = await axios.post('/api/users/login', value);
            dispatch({
                type: 'HIDE_LOADING',
            });

            message.success('User Login Successfully!');
            //delete res.data.password
            delete res?.data?.user?.password;
            localStorage.setItem('auth', JSON.stringify(res?.data?.user));
            navigate('/');
        } catch (error) {
            dispatch({
                type: 'HIDE_LOADING',
            });
            message.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            localStorage.getItem('auth');
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="form">
            <img src={logo} alt="logo" className="brand-logo-lg" />
            <h2>Welcome to Smart Inventory Management System</h2>
            <p>Login</p>
            <div className="form-group">
                <Form layout="vertical" onFinish={handlerSubmit}>
                    <FormItem name="email" label="Email Address">
                        <Input placeholder="Enter Email Address" />
                    </FormItem>
                    <FormItem name="password" label="Password">
                        <Input type="password" placeholder="Enter Password" />
                    </FormItem>
                    <div className="form-btn-add">
                        <Button htmlType="submit" className="add-new">
                            Login
                        </Button>
                        <Link className="form-other" to="/register">
                            Register Here!
                        </Link>
                    </div>
                </Form>
            </div>

            <small>Powered by Binary Brigade</small>
        </div>
    );
};

export default Login;
