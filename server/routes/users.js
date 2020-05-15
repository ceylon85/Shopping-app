const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { auth } = require("../middleware/auth");

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

router.get('/successBuy', auth,(req,res)=>{
    //1. User Collection 안에 history 필드 안에 간단한 결제 정보 넣어주기
    let = history = [];
    let = transactionData = {};
    
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase : Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentId
        })
    })
    //2. Payment Collection 안에 자세한 결제 정보를 넣어주기

    //3. Product Collection 안에 있는 Sold 필드 정보 업데이트 넣어주기
    

})

module.exports = router;
