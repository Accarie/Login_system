const express= require("express");// to use express in your
const dotenv= require("dotenv");// for 
const path=require("path");
//const hbs= require("hbs");// was used for connceting ama navbars 
const mysql= require("mysql"); // to create a connection in database
const cookieParser =require("cookie-parser");
const app= express();
  dotenv.config({
     path:"./.env", 
 })
 
 //creating a connection in the database
    const db=mysql.createConnection({
        host:process.env.database_host,
      user:process.env.database_user,
        database:process.env.database,

   });
   db.connect((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("connected to database successfully")
        }
    })
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());// to use cookies
const location=path.join(__dirname,"./public");// to acces the fronted codes
 app.use(express.static(location));
 app.set("view engine","hbs");// the front part
//  const partialsPath=path.join(__dirname,"./views/partials");
//  hbs.registerPartials(partialsPath);
app.use("/",require('./routes/pages'));
app.use("/auth",require('./routes/auth'));
app.listen(5000, ()=>{
    console.log("server is running ...")
});
