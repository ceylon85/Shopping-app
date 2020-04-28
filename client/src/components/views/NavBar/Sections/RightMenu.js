/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Icon, Badge } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      //로그인 하지 않은 사람이 보는 페이지
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">들어가기</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">가입하기</a>
        </Menu.Item>
      </Menu>
    )
    // 로그인 한 사람이 보는 페이지
  } else {   
    return ( 
      <Menu mode={props.mode}>
        <Menu.Item key="History">
          <a href="/">History</a>
        </Menu.Item>
         <Menu.Item key="upload">
          <a href="/product/upload">상품 올리기</a>
        </Menu.Item>

        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
        <Badge >
         <a href="/user/cart" style={{ marginRight: -22 , color:'#667777'}}>
           <Icon type="shopping-cart" style={{ fontSize: 32, marginBottom: 3 }} size="x-large" /></a>
        </Badge>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>나가기</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

