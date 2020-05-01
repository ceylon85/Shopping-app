import React, {useEffect, useState} from 'react'
import Axios from 'axios';
import {
    Icon,
    Col,
    Card,
    Row,
    Typography,
    Button
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';

const {Title} = Typography;

function LandingPage() {

    const [Products,
        setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }

        Axios
            .post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.productInfo)
                } else {
                    alert('상품들을 가져오는데 실패')
                }
            })
    }, [])

    const loadmoreHandler = () => {
          
    }

    const renderCards = Products.map((product, index) => {
        return <Col key={index} lg={6} md={8} xs={24} >
            <Card 
            cover={< ImageSlider image={product.images} />}>
                <Meta 
                title={product.title} 
                description={`$${product.price}`}/>
            </Card>
        </Col>
    })

    return (

        <div
            style={{
            width: '75%',
            margin: '3rem auto'
        }}>
            <div style={{
                textAlign: 'center'
            }}>
                <Title>Let`s Travel Anywhere!!!<Icon type="rocket"/></Title><hr/>
            </div>

            {/* Filter */}

            {/* Search */}

            {/* Cards */}
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
            <br/>

            <div
                style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Button onClick={loadmoreHandler}>더 보기</Button>
            </div>
        </div>

    )
}

export default LandingPage
