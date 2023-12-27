const mongoose=require('mongoose')
const diary=mongoose.Schema({
    date:String,
    entry:String
})
module.exports=mongoose.model("DiaryEntry",diary)