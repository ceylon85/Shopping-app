import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';
import {useSelector} from "react-redux";

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
    const user = useSelector(state => state.user);

    const [ProductTitle,
        setProductTitle] = useState("")
    const [Description,
        setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent,
        setContinent] = useState(1)
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

    const onSubmit = (e) => {

        e.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            return alert('로그인 먼저 해주세요')
        }

        if (ProductTitle === "" || Description === "" || Price === "" || Continent) {
            return alert('빈칸 없이 채워주세요.')
        }

        const variables = {
           
        }
        //variables 를 가지고 request를 보냄
        Axios
            .post('/api/product/upload', variables)
            .then(response => {
                if (response.data.success) {
                    alert('업로드에 성공!')

                    setTimeout(() => {
                        props
                            .history
                            .push('/')
                    }, 3000);

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
               
                <FileUpload/>    
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
                <select onChange={onContinentChange} value={3}>
                    {ContinentsOptions.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br/><br/>

                <Button type="success" size="large" onClick={onSubmit}>
                    확인
                </Button>

            </Form>
        </div>
    )
}

export default UploadProductPage
