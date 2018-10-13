//==========================================
//All dependencies will be here.
//==========================================

var express =require("express");
var app=express();
var {mongoose}=require("./db/mongoose.js");
var {Todo}=require('./models/todo.js');
var bodyparser=require('body-parser');
var {ObjectID}=require("mongodb");
var {User}=require('./models/user.js');
const _=require('lodash');
const {authenticate}=require('./middleware/authenticate');

var cookieParser = require("cookie-parser");

app.use(cookieParser());

const port=process.env.PORT||3200;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/views'));
//==========================================
// All routes and process here 
//==========================================
   

   app.get('/',(req,res)=>{
      
      res.sendFile(__dirname+"/views/loginmain.html");

   });
   app.get('/login',(req,res)=>{
      

    res.sendFile(__dirname+"/views/loginmain.html");
   });

    app.get('/Signup',(req,res)=>{
      
    res.sendFile(__dirname+"/views/signup.html");
   });


    app.get('/landing',authenticate,(req,res)=>{
      

      res.sendFile(__dirname+"/views/landing.html");
    });
     
 
    //Post route
			app.post('/todos',authenticate,(req,res)=>{
                
                var todo=new Todo({
                	text:req.body.text,
                	completed:req.body.completed,
                  _creater:req.user._id,
                  ttype:req.body.ttype
                });

               todo.save().then((doc)=>{
               	res.send(doc);
               },
               (e)=>{
               	res.status(400).send(e);

               });


			});

     

	//Get Route
			app.get('/todos',authenticate,(req,res)=>{
				
				Todo.find({
          _creater:req.user._id
        }).then((todos)=>{
					res.send(todos);
				},(e)=>{
					console.log("there might be an error");
				});
				
			});		

	//Get by id
	
	    app.get('/todos/:id',authenticate,(req,res)=>{
	    	var id =req.params.id;
             if(!ObjectID.isValid(id)){
             	return res.send("id is not valid");
             }
             Todo.findOne({
              _id:id,
              _creater:req.user._id
             }).then((todo)=>{
             	if(!todo){
                 return res.status(404).send("no such todo is present");
             	}
             	res.send(todo);


             }).catch((e)=>{
             	res.status(400).send(e);
             });

	    });

	//Delete Route

	   app.delete('/todos/:id',authenticate,(req,res)=>{
	   	var id=req.params.id;
	   	if(!ObjectID.isValid(id)){
	   		return res.send("id is not valid");
	   	}
	   	Todo.findOneAndRemove({
        _id:id,
        _creater:req.user._id
      }).then((todo)=>{
	   		if(!todo){
	   			return res.send("no item is deleted");
	   		}
	   		res.send(todo);
	   	}).catch((e)=>{
	   		res.status(400).send(e);
	   	});
	   });

    //update Route

       app.patch("/todos/:id",authenticate,(req,res)=>{
       	var id =req.params.id;
       	if(!ObjectID.isValid(id)){
       		return res.send("id is not valid");
       	}
        var body=req.body;
       	Todo.findOneAndUpdate({_id:id,_creater:req.user._id},{$set:body},{new:true}).then((todo)=>{
       		if(!todo){
       			return res.status(400).send("no such todo exist");
       		}
       		res.send(todo);

       	}).catch((e)=>{
       		res.status(400).send();
       	});
       });






//================================================
// user routes 
//================================================
    //post route


     app.post('/users',(req,res)=>{

         var body=_.pick(req.body,['email','password']);
         var user =new User(body);

         user.save().then(()=>{
          return user.generateAuthToken();
          
         }).then((token)=>{
          
          res.setHeader('Set-Cookie',[`x-auth=${token}`]);
          res.redirect('/landing');
         }).catch((e)=>{
        
          res.status(400).redirect('/signup');
         });

     });
  //get route

  app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
  });

  //post route fro login

  app.post('/users/login',(req,res)=>{
    

         var body=_.pick(req.body,['email','password']);
         User.findByCredentials(body.email,body.password).then((user)=>{
         return user.generateAuthToken();
         }).then((token)=>{
            
          res.redirect('/direct?token='+token);
            
          })
          .catch((e)=>{
          res.status(400).redirect('/login');
         });

  });
   

   //delete route for user
    app.delete('/users/me/token',authenticate,(req,res)=>{
     
        req.user.removeToken(req.token).then(()=>{
          
          res.status(200).send();
        },()=>{
          res.status(400).send();
        });
    });

   
    app.get('/direct',(req,res)=>{
         
         res.setHeader('Set-Cookie',[`x-auth=${req.query.token}`]);
          res.redirect('/landing');


    });
//==========================================
//authenticate function
//==========================================



//==========================================
// The server  port Route
//==========================================



app.listen(port,()=>{
	console.log(`I am listening at port ${port}`);
})