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

router.post('/getProducts', (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;

    let findArgs = {};
    for(let key in req.body.filters){
        //filters state에 key값은 continent와 price
        //값으로 1이상 들어있다면
        if(req.body.filters[key].length>0){
            console.log('key', key);

            if (key === "price") {
                findArgs[key] = {
                    //greater than equal
                    $gte: req.body.filters[key][0],
                    ///less than equal
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        } 
    }

    console.log('findArgs', findArgs);

    if(term) {
        Product.find(findArgs)
        //sql의 like 문법처럼.. 대소문자 구분 x
        .find({ "title": { '$regex': term ,'$options': 'i'} })
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, productInfo,
                postSize: productInfo.length})
    })
    //product collection에 들어 있는 모든 상품 정보를 가져오기
    }else{
        Product.find(findArgs).populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, productInfo,
                postSize: productInfo.length})
    })
}
})

router.get('/products_by_id', (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    if(typs === "array"){
        let ids = req.query.id.split(',')
        productIds = ids.map(item =>{
            return item
        })
    }
//productId를 이용, DB에서 productId와 같은 상품 정보를 가져온다
    Product.find({_id: { $in: productIds}})
    .populate('writer')
    .exec((err, product)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).send({success: true, product})
    })
});

module.exports = router;
