//======================================
//Todo model
//======================================

const mongoose =require("mongoose");


var Todo= mongoose.model('Todo',{

	text:{
		type:String,
		required:true,
		minlength:1
	},
	completed:{
		type:Boolean
	},
	completedAt:{
		type:Date,
		default:null
	},
	createdAt:{
		type:Date,
		default:Date.now
	},
	_creater:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	},
	ttype:{
		type:String,
		required:true
	}

});

module.exports={Todo};