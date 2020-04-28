const express = require('express');
const router = express.Router();
const multer = require('multer');

// multer
var storage = multer.diskStorage({
    //파일이 어디에 저장되는지 root/uploads에 저장
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    //어떤 이름으로 저장할 것인가
    filename: function (req, file, cb) {
        //현재 날짜가 먼저 나오고 파일 오리지날 이름으로 저장
      cb(null, `${Date.now()}_${file.originalname}`)
    } 
  })
   
  var upload = multer({ storage: storage }).single("file")

router.post("/image", (req, res) => {
    //가져온 이미지를 저장
    upload(req, res, err => {
        if(err) {
            return req.json({success: false, err})
        }
        //파일 저장 경로와 이름을 전달
        return res.json({success: true,
            filePath: res.req.file.path , 
            fileName: res.req.file.fileName })
    })
});
 

module.exports = router;
