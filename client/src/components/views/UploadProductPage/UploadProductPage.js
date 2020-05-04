import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const {Title} = Typography;
const {TextArea} = Input;

const ContinentsOptions = [
    {
        key: 1,
        value: "아프리카"
    }, {
        key: 2,
        value: "유럽"
    }, {
        key: 3,
        value: "아시아"
    }, {
        key: 4,
        value: "북미 지역"
    }, {
        key: 5,
        value: "남미 지역"
    }, {
        key: 6,
        value: "호주"
    }, {
        key: 7,
        value: "남극 대륙"
    }
]
function UploadProductPage(props) {
    const [ProductTitle,
        setProductTitle] = useState("")
    const [Description,
        setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent,
        setContinent] = useState(0)
    const [Images, setImages] = useState([])

    const onTitleChange = (e) => {
        setProductTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPriceChange = (e) => {
        setPrice(e.currentTarget.value)
    }
    const onContinentChange = (e) => {
        setContinent(e.currentTarget.value)
    }

    //부모 컴포넌트에 있는 prop에 받는 정보들
    const updateImages = (newImages) =>{
        setImages(newImages)
    }

    const onSubmit = (e) => {
        //페이지 자동 refresh 방지
        e.preventDefault();

        if (!ProductTitle || !Description || !Price || !Continent || !Images) {
            return alert('빈칸 없이 채워주세요.')
        }

        const body = {
            //로그인 된 사람의 Id
            writer: props.user.userData._id,
            title: ProductTitle,
            description: Description,
            price: Price,
            images: Images,
            continents: Continent

        }
        //서버에 채운 값들(body)을 가지고 request를 보냄
        Axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드에 성공!') 
                    props.history.push('/')
                } else {
                    alert('상품 업로드에 실패')
                }
            })
    } 

    return (
        <div
            style={{
            maxWidth: '700px',
            margin: '2rem auto'
        }}>
            <div
                style={{
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <Title level={2}>
                 Travel Product </Title>
            </div>

            <Form onSubmit={onSubmit}>
               
                <FileUpload refreshFunction={updateImages}/>    
                <br/><br/>
                <label>Title</label>
                <Input onChange={onTitleChange} value={ProductTitle}/>
                <br/><br/>
                <label>Description</label>
                <TextArea onChange={onDescriptionChange} value={Description}/>
                <br/><br/>
                <label>Price($)</label>
                <Input type="number" onChange={onPriceChange} value={Price}/>
                <br/><br/>
                <select onChange={onContinentChange} value={Continent}>
                    {ContinentsOptions.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br/><br/>

                <Button type="submit" size="large" onClick={onSubmit}>
                    확인
                </Button>

            </Form>
        </div>
    )
}

export default UploadProductPage
