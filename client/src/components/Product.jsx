import React from 'react';
import { Button, Card } from 'antd';
import { useDispatch } from 'react-redux';

const Product = ({ product }) => {
    const dispatch = useDispatch();

    const handlerToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity: 1 },
        });
    };

    const { Meta } = Card;

    return (
        <Card hoverable style={{ width: 240, marginBottom: 30 }} cover={<img alt={product.name} src={product.image} style={{ height: 200 }} />}>
            <Meta title={product.name} />
            <Meta title={`Price: ${product.price}৳`} />

            <p>Stock: {product?.stock < 10 ? <span style={{ color: 'red' }}>{product.stock}</span> : <span style={{ color: 'green' }}>{product.stock}</span>}</p>

            {product?.stock === 0 && <Meta title={'Status: '} description={`Out of stock`} />}
            <div className="product-btn">{product?.stock > 0 && <Button onClick={() => handlerToCart()}>Add To Cart</Button>}</div>
        </Card>
    );
};

export default Product;
