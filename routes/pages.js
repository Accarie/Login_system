const express= require("express");
const router= express.Router();
const userController=require("../controllers/users");
router.get("/",(req,res)=>{

    res.render('login');
}) 
router.get("/register",(req,res)=>{
   
    res.render('register');
})
router.get("/profile", userController.isLoggedIn,(req,res)=>{
    // if(req.login){
        res.render('profile');
    // }else{
    //     res.redirect("/login")
    // }
});
router.get("/Home",userController.isLoggedIn,(req,res)=>{
   // console.log(req.name);
// if(req.login){
    res.render('Home');
//    }else{
//     res.redirect("/login");
//    }
});
module.exports= router; 