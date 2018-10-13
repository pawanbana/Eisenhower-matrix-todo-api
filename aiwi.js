var express =require("express");
var app=express();



var cookieParser = require("cookie-parser");

app.use(cookieParser());


app.get('/',(req,res)=>{
	res.setHeader('Set-Cookie',[`x-auth=hithere`,'pawan=tada','hi=there']);
          res.redirect('/t');

});


app.get('/z',(req,res)=>{
	res.setHeader('Set-Cookie',[`x-auth=it-was-reseted`,'pawan=taddfdfdsda','hi=tbgfhgfhfhere',`x-auth=it-was-reseted2time`]);
          res.redirect('/t');

});
app.get('/t',(req,res)=>{
	var t=req.headers.cookie;
	var y = t.replace(/(?:(?:^|.*;\s*)x-auth\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	console.log("================");
   console.log(y);
	console.log("================");
	console.log(t);
   res.send('hi thee');
}); 

app.get('/y',(req,res)=>{
	//res.setHeader('Set-Cookie',['expires=Thu, 01 Jan 1970 00:00:01 GMT;']);
	res.redirect('/z');
})


app.listen(3100,()=>{
	console.log(`I am listening at port `);
})

