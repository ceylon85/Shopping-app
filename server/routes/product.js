const express = require('express');
const router = express.Router();
const multer = require('multer');
const {Product} = require("../models/Product");

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

var upload = multer({storage: storage}).single("file")

router.post('/image', (req, res) => {
    //가져온 이미지를 저장
    upload(req, res, err => {
        if (err) {
            return req.json({success: false, err})
        }
        //파일 저장 경로와 이름을 전달
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })
});

//받아온 정보들을 DB에 저장
router.post('/', (req, res) => {

    const product = new Product(req.body)

    product.save((err) => {
        if (err) 
            return res.status(400).json({success: false, err})
        return res
            .status(200)
            .json({success: true})
    })
});

router.post('/products', (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    //product collection에 들어 있는 모든 상품 정보를 가져오기
    Product.find().populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({success: true, productInfo})
        })

})

module.exports = router;
