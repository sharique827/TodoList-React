const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/TodoList')
.then(()=>{
    console.log(`DataBase Is Connnected To Server.`)
})
.catch((e)=>{
    console.log(`Something Goes Wrong In Connection.`)
})