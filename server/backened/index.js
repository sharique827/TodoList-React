const express = require("express");
const jsonwebtoken=require('jsonwebtoken')
const app = express();
const Data = require("./models/User");
const PORT = 8000;
app.use(express.json());
require("./dbconnect");

const JSONSALTKEY = "mynameishariquezafariamasoftwaredeveloper";
var passwordValidator = require("password-validator");

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

app.post("/user", async (req, res) => {
  try {
    if (schema.validate(req.body.password)) {
      var data = new Data(req.body);
      await data.save();
      res.send({ result: "Done", message: "Data Inserted Succesfully" });
    } else {
      res.send({
        result: "Fail",
        message:
          "Pasword must be containing a CAPITAL letter a small letter and has minumum 8 length and maximum 100 and has 2 digit and should not containing any spaces",
      });
    }
  } catch (e) {
    if (e.keyValue) {
      res.send({ result: "Fail", message: "Email Is Already Taken" });
    }
    else if (e.errors.username) {
      res.send({ result: "Fail", message: e.errors.username.message });
    }
    else if (e.errors.name) {
      res.send({ result: "Fail", message: e.errors.name.message });
    }
    else if (e.errors.email) {
      res.send({ result: "Fail", message: e.errors.email.message });
    }
    else if (e.errors.password) {
      res.send({ result: "Fail", message: e.errors.password.message });
    }
    else if (e.errors.phone) {
      res.send({ result: "Fail", message: e.errors.phone.message });
    }
    else{
        res.send({ result: "Fail", message: "Internal Server Error." });
    }
  }
});




app.get('/user',async(req,res)=>{
    try{
       var data=await Data.find()
       res.send({result:"Done",data:data})
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})



app.get('/user/:_id',async(req,res)=>{
    try{
       var data=await Data.findOne({_id:req.params._id})
       if(data){
       res.send({result:"Done",data:data})}
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})



app.post('/user/add',async(req,res)=>{
    try{
       var data=await Data.findOne({username:req.body.username})
       if(data){
          data.task.unshift(req.body.task)
          await data.save()
          res.send({result:"Done",data:data})
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})




app.post('/user/remove',async(req,res)=>{
    try{
       var data=await Data.findOne({username:req.body.username})
       if(data){
         var index=data.task.findIndex((item)=>item===req.body.task)
         if(index!==-1){
           data.task.splice(index,1)
           await data.save()
           res.send({result:"Done",data:data})
         }
         else{
            res.send({result:"Fail",message:"Internal Server Error"})
         }
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})




app.post('/user/edit',async(req,res)=>{
    try{
       var data=await Data.findOne({username:req.body.username})
       if(data){
         var index=data.task.findIndex((item)=>item===req.body.task)
         if(index!==-1){
           data.task.splice(index,1,req.body.newtask)
           await data.save()
           res.send({result:"Done",data:data,message:"Task Updated."})
         }
         else{
            res.send({result:"Fail",message:"Internal Server Error"})
         }
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})




app.post('/login',async(req,res)=>{

    try{
      var data=await Data.findOne({email:req.body.email})
      if(data){
        if(data.password===req.body.password){
        jsonwebtoken.sign({data},JSONSALTKEY,async(e,tokens)=>{
            if(e){
                res.send({ result: "Fail", message: "Internal Server Error." })
            }
            else{
                if(data.token.length<3){
                   data.token.push(tokens)
                   await data.save()
                   res.send({result:"Done",message:"Logged In",data:data,token:tokens})
                }
                else{
                    res.send({result:"Fail",message:"You're Already Logged In With 3 Devices. Logout From Any One To Login Here."})
                }
            }
        })
        }
        else{
            res.send({result:"Fail",message:"Password Is Incorrect"})
          }
      }
      else{
        res.send({result:"Fail",message:"Email ID Doesn't Exist"})
      }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }

})



app.post('/logout',async(req,res)=>{
    try{
       var data=await Data.findOne({email:req.body.email})
       if(data){
         var index=data.token.findIndex((item)=>item===req.body.token)
         if(index!==-1){
           data.token.splice(index,1)
           await data.save()
           res.send({result:"Done",messaage:"Logged Out"})
         }
         else{
            res.send({ result: "Fail", message: "Internal Server Error." })
           }
       }
       else{
        res.send({ result: "Fail", message: "Internal Server Error." })
       }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})




app.post('/logoutall',async(req,res)=>{
    try{
       var data=await Data.findOne({email:req.body.email})
       if(data){
         var index=data.token.findIndex((item)=>item===req.body.token)
         if(index!==-1){
           data.token=[]
           await data.save()
           res.send({result:"Done",messaage:"Logged Out From All Devices"})
         }
         else{
            res.send({ result: "Fail", message: "Internal Server Error." })
           }
       }
       else{
        res.send({ result: "Fail", message: "Internal Server Error." })
       }
    }
    catch(e){
        res.send({ result: "Fail", message: "Internal Server Error." })
    }
})



app.post("/user/search",async(req,res)=>{
  try{
     var data=await Data.find({$or:[
      {name:{$regex:`.*${req.body.search}.*`,$options:"i"}}
     ]})
     res.send({result:"Done",data:data})
  }
  catch(e){
      res.send({result:"Fail",message:"Internal Server Error"})
  }
})


app.listen(PORT, () => {
  console.log(`Server Is Listening At Port ${PORT}`);
});




