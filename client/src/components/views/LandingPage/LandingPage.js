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
import CheckBox from './Sections/CheckBox';
import { continents, price } from './Sections/Data';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
const {Title} = Typography;

function LandingPage() {

    const [Products,
        setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0) 
    const [Filters, setFilters] = useState({continents: [], price: []})
    const [SearchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts = (body) =>{
        Axios
        .post('/api/product/getProducts', body)
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
            cover={<a href={`/product/${product._id}`}><ImageSlider image={product.images} /></a>}
                >
                <Meta 
                title={product.title} 
                description={`$${product.price}`}/>
            </Card>
        </Col>
    })

    const showFilteredResults = (filters)=>{

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value)=>{
       const data = price;
       let array = [];
       
       for(let key in data){
           if(data[key]._id === parseInt(value, 10)){
               array = data[key].array;
               //data[key].array; === "array": [0, 199]
           } 
       }
       return array;
    }
     
    const handleFilters = (filters, category) =>{
        const newFilters = {...Filters}
        // 새로운 newChecked를 firlters로 바꿔줌
        newFilters[category] = filters
        console.log("filters", filters);

        if(category === "price"){

            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) =>{
        
        let body ={
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (

        <div
            style={{
            width: '75%',
            margin: '3rem auto'
        }}>
            <div style={{
                textAlign: 'center'
            }}>
                <Title>Let`s Travel Anywhere!!!<Icon type="rocket"/></Title>
            </div>

            {/* Filter */}
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                 {/* CheckBox */}
            <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
                </Col>
                <Col lg={12} xs={24}>
            {/* RadioBox */}
            <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/>
                </Col>
            </Row>
 
           

            
            {/* Search */}
            <div style={{display:'flex', justifyContent:'center', margin:'1rem auto'}}>
            <SearchFeature refreshFunction={updateSearchTerm}/>
            </div>
            <hr/>

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
