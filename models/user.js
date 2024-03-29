const mongoose=require('mongoose');
const validator=require('validator');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var UserSchema=new mongoose.Schema({

    email:{
    	type:String,
    	required:true,
    	trim:true,
    	minlength:2,
    	unique:true,
    	validate:{
    		validator:(value)=>{
    			return validator.isEmail(value);
    		},
    		message:`{value} is not a valid email`
    	}
    },
    password:{
    	type:String,
    	required:true,
    	minlength:6
    },
    tokens:[{
    	access:{
    		type:String,
    		required:true
    	},
    	token:{
    		type:String,
    		required:true
    	}
    }]

});


/*UserSchema.methods.toJSON=function(){
	var user=this;
	var userobject=user.toObject();
	return _.pick(userobject,['_id','email']);
};
*/

UserSchema.methods.generateAuthToken=function(){
     var user=this;
     var access='auth';
     var token=jwt.sign({_id:user._id.toHexString(),access},'ironman').toString();
     user.tokens.push({access,token});
     return user.save().then(()=>{
     	return token;
     });

};


UserSchema.methods.removeToken=function(token){
         var user=this;
         return user.update({
         	$pull:{
         		tokens:{token}
         	}
         });
};

UserSchema.statics.findByToken=function(token){
	var user=this;
	var decoded;
	try{
		decoded=jwt.verify(token,'ironman');
	}catch(e){
		return Promise.reject();
	}
	return User.findOne({
		'_id':decoded._id,
		'tokens.token':token,
		'tokens.access':'auth'
	});
};


UserSchema.statics.findByCredentials=function(email,password){
	var User=this;
	return User.findOne({email}).then((user)=>{
		if(!user){
			return Promise.reject();
		}
		return new Promise((resolve,reject)=>{
			bcrypt.compare(password,user.password,(err,res)=>{
				if(res){
					resolve(user);
				}else{
					reject();
				}
			});
		});
	});
};





UserSchema.pre('save',function(next){
	var user=this;
	if(user.isModified('password')){
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
				user.password=hash;
				next();
			});
		});
	}else{
		next();
	}
});

var User=mongoose.model('User',UserSchema);
module.exports={User};