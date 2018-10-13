$(document).ready(function(){
     $.ajax({
     	method:'GET',
     	url:"/todos",
  
     })
	.then(addtodos)
	.catch(function(err){
		console.log(err);
	})
});


$('#Urg-Imp').keypress(function(event){
	var ttype='Urg-Imp';
	
	if(event.which==13){
		createTodo(ttype);
	}
});
$('#N-Urg-Imp').keypress(function(event){
	var ttype='N-Urg-Imp';
	if(event.which==13){
		
		createTodo(ttype);
	}
});
$('#Urg-N-Imp').keypress(function(event){
	var ttype='Urg-N-Imp';
	if(event.which==13){
		createTodo(ttype);
	}
});
$('#N-Urg-N-Imp').keypress(function(event){
	var ttype='N-Urg-N-Imp';
	if(event.which==13){
		createTodo(ttype);
	}
});



function createTodo(ttype){
	var tttype='#'+ttype;
	var userinput=$(tttype).val();
	$.post('/todos',{text:userinput,completed:false,ttype:ttype})
	.then(function(newtodo){

		$(tttype).val('');
		addtodo(newtodo);


	})
	.catch(function(err){
		console.log(err);

	})
};

$('.button').on('click',function(){

	var deleteuserurl='/users/me/token';
	
	$.ajax({
		method:'DELETE',
		url:deleteuserurl,
		success:window.location.replace("/login")
	}).catch(function(e){
		console.log(e);
	});
});

$('.Urg-ImpC').on('click','li',function(){
	updateTodo($(this));
});

$('.N-Urg-N-ImpC').on('click','li',function(){
	updateTodo($(this));
});$('.N-Urg-ImpC').on('click','li',function(){
	updateTodo($(this));
});$('.Urg-N-ImpC').on('click','li',function(){
	updateTodo($(this));
});


$('.Urg-ImpC').on('click','span',function(e){
    e.stopPropagation();
    removetodo($(this).parent());
});

$('.N-Urg-ImpC').on('click','span',function(e){
    e.stopPropagation();
    removetodo($(this).parent());
});
$('.Urg-N-ImpC').on('click','span',function(e){
    e.stopPropagation();
    removetodo($(this).parent());
});
$('.N-Urg-N-ImpC').on('click','span',function(e){
    e.stopPropagation();
    removetodo($(this).parent());
});










function addtodos(todos){
	todos.forEach(function(todo){
		addtodo(todo);
	});
};



function updateTodo(todo){
	var todoid=todo.data('id');
	var updateurl='/todos/'+todoid;
	var isdone=todo.data('completed');
	var text=todo.data('text');
	var ttype=todo.data('ttype');

	var updatedata={text:text,completed:!isdone,ttype:ttype};

	$.ajax({
		method:'PATCH',
		url:updateurl,
		data:updatedata
	})
	.then(function(data){
		todo.toggleClass('done');
		todo.data('completed',!isdone);
	})
	.catch(function(err){
		console.log(err);
	});
};






function addtodo(todo){

    var newtodo=$('<li class="taskitem">'+todo.text+'<span>X</span></li>');
    newtodo.data('text',todo.text);
    newtodo.data('id',todo._id);
    newtodo.data('completed',todo.completed);
    newtodo.data('ttype',todo.ttype);
   

    if(todo.completed){
    	newtodo.addClass('done');
    }
    classoftodo='.'+todo.ttype+'C';
    

    $(classoftodo).append(newtodo);
}






function removetodo(todo){
	var todoid=todo.data('id');
	var deleteurl='/todos/'+todoid;
	$.ajax({
		method:'DELETE',
		url:deleteurl
	})
	.then(function(data){
		todo.remove();
	})
	.catch(function(err){
		console.log(err);
	})
}