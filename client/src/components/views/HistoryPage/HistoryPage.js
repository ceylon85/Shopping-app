import React,{useState, useEffect} from 'react'
import Axios from 'axios';
import { response } from 'express';

function HistoryPage() {
    const [History, setHistory] = useState([])

    useEffect(() => {
       Axios.get('/api/users/history')
       .then(response => {
           if(response.data.success){
            setHistory()
           }else{
               alert('히스토리 정보를 가져오는데 실패')
           }
       }) 
    }, [])
    return (
        <div>
            history
        </div>
    )
}

export default HistoryPage
