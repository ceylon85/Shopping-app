import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux';
import {getCartItems} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import {Typography} from 'antd';

const {Title} = Typography; 

function CartPage(props) {

    const dispatch = useDispatch();

    useEffect(() => {
        let cartItems = [];
        //리덕스 user state 안에 cart 안에 상품이 있는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    
            }
        }

    }, [props.user.userData])

    return (
        <div style = {{width: '85%', margin: '3rem auto'}}>
            <Title>My Cart</Title>
            <div>
            <UserCardBlock products={props.user.cartDetail} />
            </div>
        </div>
    )
}

export default CartPage
