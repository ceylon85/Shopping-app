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
    const [PostSize, setPostSize] = useState(0)
    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts = (body) =>{
        Axios
        .post('/api/product/products', body)
        .then(response => {
            if (response.data.success) {
                if(body.loadMore){
                    setProducts([...Products, ...response.data.productInfo])
                }else{
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize)
            } else {
                alert('상품들을 가져오는데 실패')
            }
        })
}
    
    const loadmoreHandler = () => {
        //skip 재정의함 기존 product를 제외하고 새로 가져옴
        //처음: 0 + 8/ 더보기 1: 8 + 8/ 더보기 2: 16 + 8/..
        let skip = Skip+Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(body)
        setSkip(skip)
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
            {/* PostSize가 Limit보다 크거나 같으면 버튼 보이기 */}
            {PostSize >= Limit && 
            <div
                style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Button onClick={loadmoreHandler}>더 보기</Button>
            </div>
        }
        </div>

    )
}

export default LandingPage
