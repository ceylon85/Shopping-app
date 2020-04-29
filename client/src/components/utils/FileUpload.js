import React, {useState} from 'react'
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import Axios from 'axios';

function FileUpload(props) {

    //이미지 정보를 state에 저장, array안에 string이 들어갈 수 있게!
    const [Images,
        setImages] = useState([])

    const dropHandler = (files) => {
        //파일을 전할때 같이 전달해야 된다.
        let formData = new FormData();
        //back에서 어떤 타입인지 content 타입을 정해서 back에서 request를 받을 때 error 가 없이 받을 수 있게 해주는 것
        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
        }
        //formData에 append를 하여 업로드하는 파일에 대한 정보가 들어간다.
        formData.append("file", files[0])

        Axios.post('/api/product/image', formData, config)
            .then(response => {
                //response 안에 파일의 정보가 있음
                if (response.data.success) {
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])


                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        //Images의 정보의 값을 newImages에 복제 
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        //현재 index 부터 1개의 이미지를 삭제
        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem' }} />
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                        
            {Images.map((image, index) => (
                //index를 갖기 위해 이미지를 넣어준다.

                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                            alt="haha"
                        />
                    </div>
                ))}


            </div>

        </div>
    )
}

export default FileUpload
