const mysql= require("mysql");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");// for authetication
const {promisify} = require("util");
// creating a connection at thea database
    const db=mysql.createConnection({
        host:process.env.database_host,
        user:process.env.database_user,
        database:process.env.database,

    });
exports.login= async(req,res)=>{
    //console.log(req.body)
    try {
        const {email,password,}= req.body; 
        if( !email || !password){
            return res.status(400).render("login",{msg: " please enter email and password " ,msg_type: "error",});
        }   
    
     db.query('select * from login where email=?',
     [email],
      async(error,result)=>{
        console.log(result);
        if(result.length <= 0){
            return res.status(401).render("login",
            {msg:"please enter email and password",
            msg_type:"error",
          }) ;
      }else{
        if(! (await bcrypt.compare(password,result[0].pass))){
            return res.status(401).render("login",
                     {msg:"please enter email and password",
                     msg_type:"error",
                    }) ;
 }else{
   // res.send("Good");
const id= result[0].ID;
const token=jwt.sign({ id:id},process.env.jwt_secret,{expiresIn:process.env.jwt_expires_in,}); 
console.log("the token is"+ token);
const cookieOptions={
    expires:new Date(Date.now()
    +process.env.jwt_cookie_expires*24*60*60*1000
    ),
    httpOnly:true,
};
res.cookie("Joe",token,cookieOptions);
res.status(200).redirect("/Home");

 }
}
}
 );
}
     catch (error) {
       console.log(error) 
    } 
};    
exports.register=(req,res)=>{
    console.log(req.body);
 
    const {name,email,password,confirm_password}= req.body; 
    db.query('select * from login where email=?',[email],
    async (error,result)=>{
       if(error){
        console.log(error);
       }
       if(result.length>0){
        return res.render("register",{msg: "Email id already Taken",msg_type:"error"});
       }
       else if(password!==confirm_password){
        return res.render("register",{msg: "passwords do not match",msg_type:"error"});
       }
       let hashedPassword= await bcrypt.hash(password,8);
      // console.log(hashedPassword);
      db.query('insert into login set ?',{name:name,email:email,pass:hashedPassword},
      (error,result)=>{
        if(error){
            console.log(error)
        }else {
            console.log(result);
            return res.render("register",{msg:"user registration success" ,msg_type:"good"});
        }
      }
      ); 
    });   
};
exports.isLoggedIn=async(req,res,next)=>{
   // req.name="Check login...";
    //console.log(req.cookies);
    if(req.cookies.joe){
        try{
    const decode = await promisify(jwt.verify)(
        req.cookies.joe,
        process.env.jwt_secret
     );
     console.log(decode);
     db.query("select * from login where id=?",[decode.id],(err,results)=>{
        //console.log(results);
        if(!results){
            return next();
        }
        req.user= results[0];
        return next();
     });
    }catch(error){
        console.log(error);
        return next();
    }
    }else{
        next();
    }
    
};
exports.logout=async(req,res)=>{
   res.cookie("joe","logout",{
    expires:new Date(Date.now()+ 2*1000),
    httpOnly:true
   });
   res.status(200).redirect("/")
};


























    
    