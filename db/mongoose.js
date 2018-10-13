//======================================
//mongoose Setting

//======================================
var mongoose=require("mongoose");
mongoose.promise=global.promise;


mongoose.connect('mongodb://ricky:123abc@ds243931.mlab.com:43931/todoapibyme',{ useNewUrlParser: true });


module.exports={mongoose};