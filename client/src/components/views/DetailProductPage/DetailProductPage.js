import React, {useEffect} from 'react'
import Axios from 'axios';

function DetailProductPage(props) {

    const productId = props.match.params.productId
    useEffect(() => {

        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response=>{
            if(response.data.success){
                console.log('성공하면', response.data)
            }else{
                alert('상세 정보를 가져오는데 실패했습니다.')
            }
        })
    }, [])

    return (
        <div>
            detail
        </div>
    )
}

export default DetailProductPage
