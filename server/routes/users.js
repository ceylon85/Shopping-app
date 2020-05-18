const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");
const { auth } = require("../middleware/auth");
const async = require("async");
//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res)=>{
    //먼저 User 컬렉션에서 해당 유저의 모든 정보를 가져오기
    //auth안에 있는 req.user === user
    User.findOne({_id: req.user._id},
        (err, userInfo)=>{
    //가져온 정보에서 카트에 넣으려 하는 상품이 이미 들어있는지 확인
            let duplicatie = false;
            userInfo.cart.forEach((item)=>{
            //item id와 상품 id가 하나라도 같으면 동일 상품 존재
                if(item.id === req.body.productId){
                    duplicatie = true; 
                }
            })   
            //상품이 이미 있다면
            if(duplicatie){
            User.findOneAndUpdate(
                //먼저 user를 찾고, cart를 찾는다
                {_id: req.user._id, "cart.id" :req.body.productId},
                {$inc: {"cart.$.quantity": 1} },
                {new: true},
                //userInfo에 update한 정보를 받기 위해 new: true 옵션을 줘야 한다
                (err, userInfo)=>{
                    if(err) return res.status(400).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
            //상품이 없을 때
            }else{
            User.findOneAndUpdate(
                //id를 추가하고
                {_id: req.user._id},
                //mongoDB의 Push 를 사용 정보를 넣어준다.
                //기본정보는 id/수량/날짜
                { 
                    $push:{
                        cart:{
                            id:req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                //update한 정보를 얻기 위해 주는 옵션
                {new: true},
                (err, userInfo)=>{
                    if(err) return res.status(400).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
            }
    })

});

router.get('/removeFromCart', auth,(req,res)=>{

    //먼저 cart 안에 있는 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id},
        //$pull 을 이용해서 cart 안에 있는 id를 찾아 제거
        {"$pull": {"cart":{"id":req.query.id} } 
    }, {new: true},
    (err, userInfo) => {
        let cart = userInfo.cart;
        let array = cart.map(item => {
            return item.id
        })

    //product collection에서 현재 남아있는 상품들의 정보 가져오기
    //남은 상품의 정보를 새로운 배열에 추가, 모든 정보를 가져온다.    
    Product.find({_id: {$in: array}})
        .populate('writer')
        .exec((err, productInfo)=>{
            return res.status(200).json({
                productInfo,
                cart
            })
        })
    })

})

router.post('/successBuy', auth,(req,res)=>{
    //1. User Collection 안에 history 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    //redux에 있는 cartDetail 이용
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase : Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })
    //2. Payment Collection 안에 자세한 결제 정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    //카트페이지에 있는 paymentData에 모든 정보가 있음
    transactionData.data = req.body.paymentData
    //User collection에 들어간 history의 정보와 같음
    transactionData.product = history
        //모아둔 정보를 user Collection의 history 에 저장
        User.findOneAndUpdate(
            { _id: req.user._id},
            {   $push: {history: history},
                $set: {cart: []} },//결제가 끝나면 카트를 비운다
            { new: true },
            (err, user)=> {
            if(err) return res.json({success: false, err})
                
            //payment 에다가 transactionData 정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc)=>{
                if(err) return res.json({success: false, err})

            //3. Product Collection 안에 있는 Sold 필드 정보 업데이트 넣어주기
            //상품 당 몇개의 quantity가 있는지(몇 개를 샀는지..)
            let products = [];
            //doc는 payment에 대한 정보가 들어있음
            doc.product.forEach(item=> {
                //products 빈 array에  id,quantity 넣는다.
                products.push({ id: item.id, quantity: item.quantity })
            })

            async.eachSeries(products, (item, callback)=>{
                Product.update(
                    {_id: item.id},
                    { $inc: {
                        "sold": item.quantity
                    }}, 
                    {new: false},//업데이트 된 doc를 프론트에 보내주지 않는다.
                callback
                )
             }, (err)=> {
                if(err) return res.status(400).json({ success: false, err})
                res.status(200).json({
                    success: true,
                    cart: user.cart,
                    cartDetail: [] //결제가 성공하면 카트가 빈다.
                })
            })
        })
        }
    )
})

router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})

module.exports = router;
