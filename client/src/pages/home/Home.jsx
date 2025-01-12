import { Col, Empty, Row } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LayoutApp from '../../components/Layout';
import Product from '../../components/Product';
import './home.css';

import allCategories from '../../asset/images/all-cat.png';

const Home = () => {
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
    const dispatch = useDispatch();

    const [productData, setProductData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const categories = [
        {
            name: 'all',
            imageUrl: allCategories,
        },
        {
            name: 'pizzas',
            imageUrl: 'https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/27954/pizza-pepperoni-clipart-xl.png',
        },
        {
            name: 'burgers',
            imageUrl: 'https://cdn.pixabay.com/photo/2022/01/04/23/00/fast-food-6916101_960_720.png',
        },
        {
            name: 'drinks',
            imageUrl: 'https://images.vexels.com/media/users/3/246333/isolated/preview/9626dce3278f72220ea2736de64e6233-pink-cocktail-color-stroke.png',
        },
    ];

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                dispatch({
                    type: 'SHOW_LOADING',
                });
                const { data } = await axios.get(`/api/products/getproducts?createdBy=${userId}`);
                setProductData(data);
                dispatch({
                    type: 'HIDE_LOADING',
                });
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        };

        getAllProducts();
    }, [dispatch, userId]); // Added userId as a dependency

    return (
        <LayoutApp>
            <div>
                <h2>POS System</h2>
            </div>
            {productData.length === 0 ? (
                <div className="no-product">
                    <h3 className="no-product-text">No Product Found</h3>
                    <Empty />
                </div>
            ) : (
                <div>
                    <div className="category">
                        {categories?.map(category => (
                            <div
                                key={category.name}
                                className={`categoryFlex ${selectedCategory === category.name && 'category-active'}`}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                <h3 className="categoryName">{category.name}</h3>
                                <img src={category.imageUrl} alt={category.name} height={60} width={60} />
                            </div>
                        ))}
                    </div>
                    <Row>
                        {selectedCategory === 'all' ? (
                            productData?.map(product => (
                                <Col xs={24} sm={6} md={6} lg={6} key={product._id}>
                                    <Product key={product._id} product={product} />
                                </Col>
                            ))
                        ) : productData?.filter(i => i.category === selectedCategory).length > 0 ? (
                            productData
                                ?.filter(i => i.category === selectedCategory)
                                .map(product => (
                                    <Col xs={24} sm={6} md={6} lg={6} key={product._id}>
                                        <Product key={product._id} product={product} />
                                    </Col>
                                ))
                        ) : (
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <div className="empty-container">
                                    <Empty description={<span>No Product Found</span>} />
                                </div>
                            </Col>
                        )}
                    </Row>
                </div>
            )}
        </LayoutApp>
    );
};

export default Home;
