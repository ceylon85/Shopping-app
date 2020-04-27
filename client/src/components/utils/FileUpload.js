import React, {useState} from 'react'
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import Axios from 'axios';

function FileUpload() {

    // const [FilePath,
    //     setFilePath] = useState("")
    // const [Duration,
    //     setDuration] = useState("")
    // const [Thumbnail,
    //     setThumbnail] = useState("")
    // const onDrop = (files) => {

    //     let formData = new FormData();
    //     const config = {
    //         header: {
    //             'content-type': 'multipart/form-data'
    //         }
    //     }
    //     formData.append("file", files[0])

    //     Axios
    //         .post('/api/product/upload', formData, config)
    //         .then(response => {
    //             if (response.data.success) {

    //                 let variable = {
    //                     filePath: response.data.filePath,
    //                     fileName: response.data.fileName
    //                 }
    //                 setFilePath(response.data.filePath)

    //                 //gerenate thumbnail with this filepath !

    //                 Axios
    //                     .post('/api/product/thumbnail', variable)
    //                     .then(response => {
    //                         if (response.data.success) {
    //                             setDuration(response.data.fileDuration)
    //                             setThumbnail(response.data.thumbsFilePath)
    //                         } else {
    //                             alert('썸네일 생성에 실패했습니다.');
    //                         }
    //                     })

    //             } else {
    //                 alert('상품 저장에 실패했습니다')
    //             }
    //         })

    // }

    return (
        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Dropzone  multiple={false} maxSize={800000000}>
                {({getRootProps, getInputProps}) => (
                    <div
                        style={{
                        width: '300px',
                        height: '240px',
                        border: '1px solid lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        {...getRootProps()}>
                        <input {...getInputProps()}/>

                        <Icon
                            type="plus"
                            style={{
                            fontSize: '3rem'
                        }}/>

                    </div>
                )}
            </Dropzone>
            {/* {Thumbnail !== "" && <div>
                <img src={`http://localhost:5000/${Thumbnail}`} alt="haha"/>
            </div> */}

        </div>
    )
}

export default FileUpload
