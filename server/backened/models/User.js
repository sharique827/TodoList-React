const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
      username:{
        type:String,
        required:[true,'UserName Is Mandatory Field']
      },
      name:{
        type:String,
        required:[true,'Name Is Mandatory Field']
      },
      email:{
        type:String,
        required:[true,'Email Is Mandatory Field'],
        unique:true
      },
      password:{
        type:String,
        required:[true,'Password Is Required']
      },
      phone:{
        type:String,
        required:[true,'Phone Number Is Mandatory Field']
      },
      otp:{
        type:Number
      },
      date:{
        type:String,
        default:''
      },
      token:[],
      task:[]
})
const Data=mongoose.model('Data',UserSchema)
module.exports=Data;