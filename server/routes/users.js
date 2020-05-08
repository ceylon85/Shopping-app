const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

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

module.exports = router;
