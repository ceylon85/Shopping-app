import React ,{useEffect}from 'react'
import Axios from 'axios';

function LandingPage() {

    useEffect(() => {
    
        Axios.post('/api/product/products')
        .then(response => {
            if(response.data.success){

            }else{
                alert('상품들을 가져오는데 실패 ㅠ ㅠ')
            }
        })
    }, [])


    return (
        
        <div>
            landig
        </div>
       
    )
}

export default LandingPage
