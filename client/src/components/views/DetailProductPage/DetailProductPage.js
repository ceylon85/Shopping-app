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
        .then(response=>{
            if(response.data.success){
                console.log('성공하면', response.data)
                setProduct(response.data.product[0])
            }else{
                alert('상세 정보를 가져오는데 실패했습니다.')
            }
        })
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
                <ProductInfo />

                </Col>
            </Row>

        </div>
    )
}

export default DetailProductPage 
