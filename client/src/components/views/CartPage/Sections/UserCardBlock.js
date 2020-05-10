import React from 'react'

function UserCardBlock(props) {

    const renderCartImage =(images)=>{
        if(images.length >0){
            let image = images[0]
        }
    }
    const renderItems =() =>{
        props.products && props.products.map(product => (
          <tr>
              <td>
                  <img style={{width: '70%'}} alt="product" src={renderCartImage(product.images)}/>
              </td>
          </tr>  
        ))
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>상품 이미지</th>
                        <th>상품 수량</th>
                        <th>상품 가격</th>
                        <th>카트에서 삭제</th>
                    </tr>
                </thead>
                <tbody>
            {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
