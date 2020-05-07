import React from 'react'
import {Button, Descriptions} from 'antd'

function ProductInfo(props) {

    const clickHandler=()=>{

    }
    
    return (
        <div>
            <Descriptions title="상품 정보" bordered>
                <Descriptions.Item label="가격">
                {props.detail.price}
                </Descriptions.Item>
                <Descriptions.Item label="Sold">
                {props.detail.sold}
                    </Descriptions.Item>
                    <Descriptions.Item label="View">
                    {props.detail.views}
                </Descriptions.Item>
                <Descriptions.Item label="설명">
                    {props.detail.description}
                </Descriptions.Item>
            </Descriptions>
        
        <br/>
        <br/>
        <br/>
        <div style={{display:'flex', justifyContent:'center'}}>
            <Button size="large" shape="round" type="danger" onClick={clickHandler}>장바구니 담기</Button>
        </div>
        </div>
    )
}

export default ProductInfo
