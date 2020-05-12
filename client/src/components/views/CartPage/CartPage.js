import React,{useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import {getCartItems, removeCartItem} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import {Typography} from 'antd';

const {Title} = Typography; 

function CartPage(props) {

    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)

    useEffect(() => {
        let cartItems = [];
        //리덕스 user state 안에 cart 안에 상품이 있는지 확인
        if (props.user.userData && props.user.userData.cart) {
            //상품이 1개 이상 들어있다면
            if (props.user.userData.cart.length > 0) {
                //forEach로 상품의 정보를 가져온다. 
                props.user.userData.cart.forEach(item => {
    //cartItems에 item의 id를(cart 필드의 상품 id) 넣어준다.
                    cartItems.push(item.id)
                });
                //redux를 이용하니 dispatch로..
                dispatch(getCartItems(cartItems, props.user.userData.cart)).then(response =>{
                    calculateTotal(response.payload)
                })
                    
            }
        }

    }, [props.user.userData])

    let calculateTotal = (cartDetail) =>{
        let total = 0;
        cartDetail.map(item =>{
            total += parseInt(item.price, 10) * item.quantity
        })
        setTotal(total)
    }

    let removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
        .then(response => {

        })
    }

    return (
        <div style = {{width: '85%', margin: '3rem auto'}}>
            <Title>My Cart</Title> 
            <div>
            <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>
            </div>
            <div style={{marginTop: '3rem'}}>
                  <h2>총 금액: $ {Total}</h2>
            </div>
        </div>
    )
}

export default CartPage
