import React, {useEffect, useState} from 'react'
import Axios from 'axios';
import {Typography, Row, Col} from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

const {Title} = Typography; 

function DetailProductPage(props) {

    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
        })
        .catch(err => alert(err))
    }, [])

    return (
        <div style={{width: '100%', padding: '3rem 4rem'}}>
            <div style={{display:'flex', justifyContent:'center'}}>
            <Title>{Product.title}</Title>
            </div>
            <br/>

            <Row gutter={[16,16]}>
                <Col lg={12} sm={24}>
                {/* ProductImage */}
                <ProductImage detail={Product}/>

                </Col>

                <Col lg={12} sm={24}>
                {/* ProductInfo */}
                <ProductInfo detail={Product} />

                </Col>
            </Row>

        </div>
    )
}

export default DetailProductPage 
