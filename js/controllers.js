var firebaseUrl = "https://educe.firebaseio.com/";


/**
 *  loginCtrl - controller
 */

 function loginCtrl($scope, $rootScope, $state, userDataService) {

    // All data will be store in this object
   /* var i = 'bhumi_.gmail.com'
    encryptemail(i);

    var n = encryptemail(i);
     alert(n);
    var j = decryptemail(n);
    alert(j);*/

    $scope.formData = {};
    $scope.error = {};
    //$('#loadingDiv').show();
    // After login submit
    $scope.loginForm = function() {
    	if($scope.formData.email && $scope.formData.password && $scope.formData.brand){    		
    		var ref = new Firebase(firebaseUrl);
    		ref.authWithPassword({
			  email    : $scope.formData.email,
			  password : $scope.formData.password
			}, function(error, authData) {
			  if (error) {
			  	$scope.$apply(function() {
			  		$scope.error.msg = error.message;
			  	});				   
			  } else {
			  	//var mobile = '91'+$scope.formData.mobile;
			  	//localStorage.setItem("mobile", mobile)
			  	var email = encryptemail($scope.formData.email); 
			  	localStorage.setItem("email", email) 
				localStorage.setItem("brand", $scope.formData.brand);

				userDataService.setbrand($scope.formData.brand)
			   	$state.go('dashboards')
			  }
			});    		
    	}        
    }

    
}

function registerCtrl($scope, $rootScope, $state, userDataService){
	$scope.formData = {};
	$scope.error = {};

	$scope.submitForm = function() {
		if($scope.formData.email && $scope.formData.password){
			if($scope.formData.mobile){
				if($scope.formData.brand){
					var ref = new Firebase(firebaseUrl);
					ref.createUser({
					  email    : $scope.formData.email ,
					  password : $scope.formData.password,
					}, function(error, userData) {
					  if (error) {
					    $scope.$apply(function() {
					  		$scope.error.msg = error.message;
					  	});	
					  } else {
					   	//$state.go('dashboards')
					   	var userref = new Firebase(firebaseUrl+"users");
					   	var mobile = '91'+$scope.formData.mobile;
					   	var brand = $scope.formData.brand;	
					   	var name = $scope.formData.name;
					   	var email = encryptemail($scope.formData.email);

					   	//var userRef = new Firebase("https://educe.firebaseio.com/users");
					   	userref.child(email).set(mobile);					   	

					    var n  = userref.child(mobile);
					    n.child(brand).set({cards:'ss'})

					    var brandref = new Firebase(firebaseUrl+"brands");
					   
					    var brandchild  = brandref.child(brand);
					    var adminch = brandchild.child('admins');
					    adminch.child(mobile).set(name)
					    localStorage.setItem("email", email) 
					    localStorage.setItem("brand", brand)
					    userDataService.setbrand(brand)
					    $state.go('dashboards')
					  }
					});
				}else{
					$scope.error.brand = "please enter your brand"
				}
			}else{
				$scope.error.mobile = "please enter valid mobile"
			}
			
		}else{
			$scope.error.email = "please enter email and password"
		}
	}
}

/*navigationCtrl*/
function navigationCtrl($scope, $state, $firebaseObject, $firebaseArray, $timeout, userDataService){
	var email = localStorage.getItem("email");
	var brand = localStorage.getItem("brand");
	var name = '';
	var mobile = '';

	$scope.brand = userDataService.getbrand(brand);
	var userbrandref = new Firebase(firebaseUrl+"brands/"+brand+"/admins");
	var userref = new Firebase(firebaseUrl+"users");

	userref.orderByKey().equalTo(email).on("child_added", function(snapshot) {
		mobile =  snapshot.val();
		userDataService.setMobile(mobile);
		userbrandref.orderByKey().equalTo(mobile).on("child_added", function(snapshot) {
		  	name = snapshot.val();
		  	userDataService.setName(name);
		  	$timeout(function(){
			  	$scope.$apply(function() {
			  		$scope.name = name;
			  		console.log($scope.name )
			  	});
		  	},0,false);
		});
	});

	

	/*var userbrands = new Firebase("https://educe.firebaseio.com/users/"+mobile);
	$scope.userbrands = $firebaseArray(userbrands);*/

	/*$scope.logout = function(){
		localStorage.clear();
		$state.go('login')
	}

	$scope.chooseBrand = function(brand){
		alert(brand)
	}
*/
	/*var nameQuery = userbrandref.orderByKey().equalTo(mobile);
	var data = $firebaseObject(nameQuery);*/
	/*
	function nameAdd(mobile){
		userbrandref.orderByKey().equalTo(mobile).on("child_added", function(snapshot) {
		  console.log(snapshot.key());
		  	name = snapshot.val();
		  	
		 // $scope.name = snapshot.val()
		});
	}*/
	/*var array = $firebaseArray(userbrandref);*/
	//console.log(array)
}

/*addcontactCtrl*/
function addcontactCtrl($scope, $rootScope, userDataService) {
    // All data will be store in this object
    var brand = userDataService.getbrand();
    $scope.formData = {};
    // After login submit
    
    $scope.submitForm = function() {
    	if($scope.formData.name && $scope.formData.mobile &&  $scope.formData.email){
    		var userref = new Firebase(firebaseUrl+"users");
		   	var mobile = '91'+$scope.formData.mobile;
		   	var name = $scope.formData.name;
		   	var email = encryptemail($scope.formData.email);
		   	var company = $scope.formData.company;
		   	var address = $scope.formData.address;
		   	var image = $scope.formData.image;

		   	var userData = {
		   		'company':company,
		   		'name':name,
		   		'email':email,
		   		'address':address,
		   		'image':image
		   	}
		   	//var userRef = new Firebase("https://educe.firebaseio.com/users");
		   	userref.child(email).set(mobile);					   	

		    var n  = userref.child(mobile);
		    n.child(brand).set(userData)

		    var brandref = new Firebase(firebaseUrl+"brands/"+brand);
		    var adminch = brandref.child('users');
		    adminch.child(mobile).set(name);
		    $scope.message = "Data succesfully Inserted";
		    $scope.formData = '';
    	}        
    };

}


/*uploadcontactsCtrl*/
function uploadcontactsCtrl($scope, $rootScope, userDataService) {
    // All data will be store in this object
    $scope.MyFiles=[];
    var userref = new Firebase(firebaseUrl+"users");
    var brand = userDataService.getbrand();
    var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/users");

	$scope.handler = function(e,files){
	    var reader = new FileReader();
	    reader.onload=function(e){
	        var string = e.target.result.split("\n");	        
	       // 
	        $(string).each(function( index, value ) {
	        	console.log(value)
	        	if(value != ''){
	        		//alert(index)
	        		if(index !=0){
	        			var csvvalue = value.split(",");
				   
					   	var name = csvvalue[0];
					   	var mobile = '91'+csvvalue[1];
					   	var company = csvvalue[2];
					   	var email = encryptemail(csvvalue[3]);;				   	
					   	var address = csvvalue[4];
					   	var image = csvvalue[5];

					   	var userData = {
					   		'company':company,
					   		'name':name,
					   		'email':email,
					   		'address':address,
					   		'image':image
					   	}
					   	//var userRef = new Firebase("https://educe.firebaseio.com/users");
					   	userref.child(email).set(mobile);					   	

					    var n  = userref.child(mobile);
					    n.child(brand).set(userData)

					   /* var brandref = new Firebase("https://educe.firebaseio.com/brands/"+brand);
					    var adminch = brandref.child('users');*/
					    brandref.child(mobile).set(name);
					   // $scope.message = "Data succesfully Inserted";

		        		$("#uploadedDetail").append("<h3> <strong>"+name+" "+mobile+" "+company+" "+email+" "+address+"</h3> </strong>")
		        		
	        		}
	        	}
			});
	        //console.log(csvvalue)
	        /*var myString = string.split("\n");
	        console.log(myString +' i')*/
	        //$("#uploadedDetail").append(myString);
	        //var obj= $filter('csvToObj')(string);
	        //do what you want with obj !
	    }
	    reader.readAsText(files[0]);
	}

}

/*productCtrl*/
function productCtrl($scope, $rootScope, $firebaseArray, userDataService) {

	var brand = userDataService.getbrand();
	var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/products")
	$scope.productList = $firebaseArray(brandref);

	$scope.searchCategory = function(category){
		/*var mainRef = new Firebase("https://educe.firebaseio.com//products/products")
		mainRef.child('category/saree').once('value', function(userSnap) {
		   console.log(mainRef)
		});*/
	}
    /*$scope.productsData = {
    	name:'dfgdf',
    	name:'dd',
    	name:'ddfgfgdf',
    	name:'dfgdf',
    	
    }*/
    /*var ListView = DataListRef.limitToLast(10);
    ListView.on('child_added', function (Snapshot, prevScoreName) {
    	var i = Snapshot.val()	    
	});*/
	/*var brandref = new Firebase("https://educe.firebaseio.com//brands/atisundar/products")
	$scope.obj = $firebaseObject(brandref);
	 $scope.obj.$loaded().then(function() {
     console.log("record has id", record.$id);
  });*/
	
	//console.log(obj)
	/*var brandref = new Firebase("https://educe.firebaseio.com//brands/atisundar/products")
	$scope.productList = $firebaseArray(brandref);
	var allproductsRef = new Firebase("https://educe.firebaseio.com//products/products")
	$scope.productListMain = $firebaseArray(allproductsRef);*/
	/*ref3.once("value", function (ss) {
        resolve(ss.val())
    })*/
	


}

/*productdetailCtrl*/
function productdetailCtrl($scope, $rootScope, $stateParams, $firebaseObject, userDataService) {
	$scope.productId = $stateParams.productId;
	var allproductsRef = new Firebase(firebaseUrl+"products/products/"+$scope.productId)
    $scope.productDails = $firebaseObject(allproductsRef);
    console.log($scope.productDails)
}

/*addproductCtrl*/

function addproductCtrl($scope, $rootScope, $stateParams, $firebaseArray, $http, Upload, userDataService) {

	
	  var brand = userDataService.getbrand();
	/*var mainRef = new Firebase("https://educe.firebaseio.com//products/products")
	mainRef.child('category').equalTo('Saree').once('value', function(snapshot) {
	   console.log(snapshot)
	});*/
   /*var dataObj = {
			name : '$scope.name',
			employees : '$scope.employees',
			headoffice : '$scope.headoffice'
	};	
	 $http.post('http://localhost:3030/upload',
                {
                    headers: {
                        //'Authorization': 'Basic dGVzdDp0ZXN0',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: dataObj,
                    withCredentials: true
                });*/
    /*$http.post('http://localhost:3030/upload', headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },data: {dataObj}).
	  success(function(data, status, headers, config) {
	  	alert(data)
	    // this callback will be called asynchronously
	    // when the response is available
	  }).
	  error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    alert('msg')
	    // or server returns response with an error status.
	  });*/

	$scope.files = [] ;
	$scope.formData = {};
	$scope.errors = {};
    var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/products/products/")     
    $scope.products = $firebaseArray(brandref);
    $scope.formData.brand = 'atisundar';

    //$scope.message = "Product succesfully Added";
    /*$scope.products.$loaded(function() {
    	
    	$scope.products.$add({
	      category:"Saree",
	      circle:"atisundar",
	      name:'as'

	    });
      //if ($scope.products.length === 0) {
      	/
    });*/

    $scope.submitForm = function() {
    	$scope.errors ={};
    	if($scope.formData.name){
    		if($scope.formData.category){
    			if($scope.formData.price){
    				var mainref = new Firebase(firebaseUrl+"products/products")    	
			    	/*$scope.products = $firebaseArray(brandref);
			    	var i = $scope.products.push($scope.formData);*/
			    	/*brandref.on('child_added', function(snapshot) {
			    		 var message = snapshot.val();
			    		var id = snapshot.key();
			    		console.log(id)
					});*/
					//var postID = i.key();
					var brandProductData = {
						name:$scope.formData.name,
						price: $scope.formData.price
					}
					var newProductRef = mainref.push($scope.formData);
					// Get the unique ID generated by push()
					var productIdID = newProductRef.key();
					console.log(productIdID)
					if(productIdID){
						var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/products");			
						brandref.child(productIdID).set(brandProductData);
						$scope.message = "Product succesfully Added";
						$scope.formData = '';
					}
	    		}else{    			
	    			$scope.errors.price = "please enter Product Price"
	    		}
    		}else{    			
    			$scope.errors.category = "please select Product Category"
    		}
    	}else{
    		$scope.errors.name = "please enter Product Name"
    	}
    	

		/*brandref.orderByKey().on("child_added", function(snapshot) {
		  var message = snapshot.val();
    		var id = snapshot.key();
    		console.log(id)
		});*/
    	/*if($scope.formData.name && $scope.formData.category){
			  // add new items to the array
			  // the message is automatically added to Firebase!			 
			 
    	}else{
    		console.log('enter details')
    	}   */    
    };

    $scope.MyFiles=[];
/*
    $('#fileUpload').on('change',function ()
        {
            var uploadedImg = $('#fileUpload').val();
			alert(uploadedImg)
			console.log(uploadedImg)
        });*/

	$scope.handler = function(e,files){
		var reader = new FileReader();
		//console.log(files[0])		

		for (var i = 0, f; f = files[i]; i++) {
			var tmppath = URL.createObjectURL(e.target.files[i]);
		    console.log(tmppath)
				//$("img").fadeIn("fast").attr('src',tmppath);
			var img = $('<img class="dynamic">'); //Equivalent: $(document.createElement('img'))
			img.attr('src', tmppath);
			img.appendTo('#imagediv');
		}

	    reader.onload=function(e){
	        var string = e.target.result;
	    }

	    //var i  = reader.readAsDataURL(element.files[0]);
		//var tmppath = URL.createObjectURL(event.target.files[0]);
		/*console.log(tmppath)
    	$("img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
    */

    /*for (var i = 0, f; f = files[i]; i++) {

	    $http({
	        url: 'http://localhost:3030/upload',
	        method: "POST",
	        data: { 'files' : 'sdfsd' }
	    })
	    .then(function(response) {
	    	alert('msg')
	            // success
	    }, 
	    function(response) { // optional
	           alert('msg')
	    });
	}*/
    /*var request = $http({
		method: "post",
		url: "http://localhost:3030/upload",
		data: {
		    files: files
		},
		headers : {'Content-Type': 'application/x-www-form-urlencoded'}  
		});

		
		request.success(function (data) {
			alert('d' +data)
		});
		request.error(function (data) {
			alert('errd')
		});*/
    	/*var file = files[0];
        console.log(file);
        $scope.upload = Upload.upload({
        	method: 'POST',    
            url: 'upload.php',	                      
            file: file
        }).success(function(data, status, headers, config) {
            $scope.message = data;                
        }).error(function(data, status) {
            $scope.message = data;
        });*/
    	/*for (var i = 0; i < files.length; i++) {
	        
	    }*/
	    
	}
}

/*uploadproductsCtrl*/
function uploadproductsCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.MyFiles=[];

	$scope.handler = function(e,files){
	    var reader = new FileReader();
	    reader.onload=function(e){
	        var string = e.target.result.split("\n");	        
	       // 
	        $(string).each(function( index, value ) {
	        	console.log(value)
	        	if(value != ''){
	        		var csvvalue = value.split(",");
	        		$("#uploadedDetail").append("<h3> <strong>"+csvvalue[0]+" "+csvvalue[1]+"</h3> </strong>")
	        	}
			});
	        //console.log(csvvalue)
	        /*var myString = string.split("\n");
	        console.log(myString +' i')*/
	        //$("#uploadedDetail").append(myString);
	        //var obj= $filter('csvToObj')(string);
	        //do what you want with obj !
	    }
	    reader.readAsText(files[0]);
	}

}

function timelineCtrl($scope, $rootScope, $stateParams, $firebaseArray, userDataService) {
	var paginator=undefined;
	var itemsPerPage = 10;
	var itemsAvailable=true;
	var cards=[]

	$scope.loader = {
	 loading: false,
	};
	$scope.loader.loading = true ;

	var brand = userDataService.getbrand();
	var mobile = userDataService.getMobile();

	var cardref = new Firebase(firebaseUrl+"users/"+mobile+"/"+brand+"/cards") 


	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		$scope.loader.loading = false ;
		
	});

	//var ref = new Firebase("http://mj6uc.firebaseio.com/users/"+userID+"/"+brand+"/cards")
	
	//$scope.cards = {};

	/*var cardsQuery = cardref.orderByValue().limitToFirst(2)
	$scope.cards = $firebaseArray(cardsQuery);*/
	$scope.cards = $firebaseArray(cardref);


	
	/*cardref.orderByKey().startAt(2).limitToFirst(2).on("child_added", function(snapshot) {
	  console.log(snapshot.key())
	  alert(snapshot.key())
	  console.log('-----------********')
	});*/
	var addData = function($scope, key){
		cardref.orderByKey().startAt(key).limit(2).on("child_added", function(snapshot) {
		  $scope.cards.push(snapshot)		 
		});
	}

	var addCards = function(c){
        if ($.inArray(c,cards)== -1){
            cards.push(c)
        }else{
            console.log("Not adding duplicate card "+c)
        }

    }
	
	$scope.cardPagination = function(){
		paginator = new Paginator(cardref, itemsPerPage);
		paginator.nextPage(function (vals) {
                            //console.log("Got vals = "+vals)
	        console.log("Got vals = " + JSON.stringify(vals))
	        for (x in vals) {
	            addCards(x)
	        }
	       
	        $scope.cards = cards;
	      })
		/*if($scope.start  == 0){
			$scope.start = 11;
		}
		var Query = cardref.startAt(3).limitToFirst(2);
		$scope.start = parseInt($scope.start) + 10;
		$scope.cards = $firebaseArray(Query);
		alert($scope.start )*/
	}
	/*var cardref = new Firebase("https://educe.firebaseio.com//cards") 
	firstMessagesQuery = cardref.limitToFirst(10)
	$scope.cards = $firebaseArray(firstMessagesQuery);*/
	/*$scope.cards = $firebaseArray(cardref);*/
	
	/*var ref = new Firebase('https://educe.firebaseio.com/chat');
	var message = {
		name:'admin',
		text: 'welcome to Atisundar'
	}
	var chatuser = '';
	$scope.login = function(user)	{
		$scope.newUser = user;		
		chatuser = user
		ref.child(user).push(message);
		var chatuserref = new Firebase('https://educe.firebaseio.com/chat/'+chatuser);
		$scope.messages = $firebaseArray(chatuserref);
	}

	
	
	//var messages = $firebaseObject(ref.child('messages')).$asArray();

	$scope.handleKeyup = function handleKeyup(e) {
		var chatuserref = new Firebase('https://educe.firebaseio.com/chat/'+chatuser);
		if(e.keyCode == 13) {
			var name = 'admin';
			var text = $scope.newMessage.text;
			var message = {
				name:'admin',
				text: $scope.newMessage.text
			}
			chatuserref.push(message);
            $('#messageInput').val('');
		}
	}*/
}

function topnavbarCtrl($scope, $rootScope, $stateParams, $state){
	$scope.logout = function(){
		localStorage.clear();
		$state.go('login')
	}
}

function homepageCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject){
	$scope.formData = {};

	var brand = userDataService.getbrand();
	var homeref = new Firebase(firebaseUrl+"brands/"+brand);

	var homeData  = new Firebase(firebaseUrl+"brands/"+brand+'/home');
	$scope.formData = $firebaseObject(homeData);

	$scope.submitForm = function(){
		var imgName = $scope.formData.image; 
		var text = $scope.formData.text;
		var query = $scope.formData.query;
		var logo = $scope.formData.logo;
		
		var data = {
			"image" : imgName,
	        "logo" : logo,
	        "query" : query,
	        "text" : text,
		}

		if(imgName && text && query && logo){
			homeref.child('home').set(data);
			$scope.message = "Data succesfully Updated";
		}
	}
}

function backgroundCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject){
	$scope.formData = {};

	var brand = userDataService.getbrand();
	var homeref = new Firebase(firebaseUrl+"brands/"+brand);

	var homeData  = new Firebase(firebaseUrl+"brands/"+brand+'/background');
	$scope.formData = $firebaseObject(homeData);

	$scope.submitForm = function(){
		if($scope.formData.image){
			var data = {
				'image':$scope.formData.image
			}
			homeref.child('background').set(data);
			$scope.message = "Data succesfully Updated";
		}		
	}
}

function formlistCtrl ($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	$scope.formData = {};
	var brand = userDataService.getbrand();
	var brandformref = new Firebase(firebaseUrl+"brands/"+brand+"/forms");
	$scope.formslist = $firebaseArray(brandformref);
}

function addformCtrl ($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	$scope.formData = {};
	var brand = userDataService.getbrand();
	var brandref = new Firebase(firebaseUrl+"brands/"+brand);
	var brandformref = new Firebase(firebaseUrl+"brands/"+brand+"/forms");
	var name = userDataService.getName();

	$scope.submitForm = function(){
		var ctime = new Date().getTime();
		if($scope.formData.name && $scope.formData.id){
			var id = $scope.formData.id;
			var data = {
				'html':$scope.formData.html,
				'name':$scope.formData.name,
				'id':$scope.formData.id,
				'added-on': ctime,
				'created-by':name
			}
			brandformref.child(id).set(data);
			//brandformref.set(data);
			$scope.message = "Data succesfully Created";
			$scope.formData = {};
		}		
	}

}

function editformCtrl ($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	$scope.formData = {};

	var brand = userDataService.getbrand();
	var brandref = new Firebase(firebaseUrl+"brands/"+brand);

	var formId = $stateParams.formId;
	var brandformref = new Firebase(firebaseUrl+"brands/"+brand+"/forms/"+formId);

	$scope.formData = $firebaseObject(brandformref);

	var name = userDataService.getName();

	$scope.submitForm = function(){
		var ctime = new Date().getTime();
		if($scope.formData.name && $scope.formData.id){
			var id = $scope.formData.id;
			var data = {
				'html':$scope.formData.html,
				'name':$scope.formData.name,
				'added-on': ctime,
				'created-by':name
			}
			brandformref.set(data);
			//brandformref.set(data);
			$scope.message = "Data succesfully Updated";
			$scope.formData = {};
		}		
	}

}

function contactlistCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	/*$scope.userlist = {};*/
	var brand = userDataService.getbrand();
	var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/users');
	$scope.userlist = $firebaseArray(branduserref);
}

function editcontactCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	/*$scope.userlist = {};*/
	var brand = userDataService.getbrand();
	var contactId = $stateParams.contactId;

	var branduserref = new Firebase(firebaseUrl+"users/"+contactId+'/'+brand);
	$scope.formData = $firebaseObject(branduserref);

	console.log($scope.formData)

	$scope.submitForm = function() {
    	if($scope.formData.name){
		   	var name = $scope.formData.name;
		   	var email = $scope.formData.email;
		   	var company = $scope.formData.company;
		   	var address = $scope.formData.address;
		   	var image = $scope.formData.image;

		   	var userData = {
		   		'company':company,
		   		'name':name,
		   		'email':email,
		   		'address':address,
		   		'image':image
		   	}			   	

		   	var userRef = new Firebase(firebaseUrl+"users/"+contactId);
		   	
		   	userRef.child(brand).set(userData)

		    
		    $scope.message = "Data succesfully Updated";
    	}        
    };
}

function adminlistCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	/*$scope.userlist = {};*/
	var brand = userDataService.getbrand();
	var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/admins');
	$scope.userlist = $firebaseArray(branduserref);

}
/**
 *  MainCtrl - controller
 */
function MainCtrl($location ,userDataService) {
	if(localStorage.getItem("email") && localStorage.getItem("brand")){
		userDataService.setbrand(localStorage.getItem("brand"))
		$location.url('#/dashboards')
	}else{
		$location.url('#/login')
	}
    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};


function encryptemail(email){
	var emailFn = email.replace(".", "{"); 
	return emailFn
}

function decryptemail(email){
	var emailFn = email.replace("{", "."); 
	return emailFn
}




angular
    .module('atisundar')
    .controller('MainCtrl', MainCtrl)
    .controller('loginCtrl', loginCtrl)
    .controller('registerCtrl', registerCtrl)
    .controller('addcontactCtrl', addcontactCtrl)
    .controller('uploadcontactsCtrl', uploadcontactsCtrl)
    .controller('productCtrl', productCtrl)
    .controller('productdetailCtrl', productdetailCtrl)
    .controller('addproductCtrl', addproductCtrl)
    .controller('uploadproductsCtrl', uploadproductsCtrl)
    .controller('timelineCtrl', timelineCtrl)
    .controller('topnavbarCtrl', topnavbarCtrl)
    .controller('navigationCtrl', navigationCtrl)
    .controller('homepageCtrl', homepageCtrl)
    .controller('backgroundCtrl', backgroundCtrl)
    .controller('formlistCtrl', formlistCtrl)
    .controller('addformCtrl', addformCtrl)
    .controller('editformCtrl', editformCtrl)
    .controller('contactlistCtrl', contactlistCtrl)
    .controller('editcontactCtrl', editcontactCtrl)
    .controller('adminlistCtrl', adminlistCtrl)
    
