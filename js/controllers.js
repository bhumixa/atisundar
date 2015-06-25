var firebaseUrl = "https://ccbeta.firebaseio.com/";
var client = new Keen({
    projectId: "55430ee796773d5aa89d86a4",
    readKey: "ca294e81b3964d2eab952d3ba67a1cffba7cc091943e0612df8d102281efcadb1b0b382c4928919b13ed977575ddf91e4bbe4d9eb24961f862b88984729d58c2a16a6daa2d30427d254500689175394e96b6436e09c69b96e0cd3ff909ad39eea097b033319e942ac1ca794726c88894"
});

var clientWrite = new Keen({
  projectId: "55430ee796773d5aa89d86a4",
  writeKey: "11ad817b8e08ae848ad5a2c369fdf447db946153bb829e0b1b6c685b076a20519389f5dc36a8978bdc5e5c564cea3e14ef9b4a1ab16fe5d70f354181743881eaf816501f094bd43bee12e7eb63e29fe3183c8446f824a46eb2cb25a236aff85a4cd2213693f4d85d05dc7734e1088e06"
});
/**
 *  loginCtrl - controller
 */

function loginCtrl($scope, $rootScope, $state, userDataService) {
 	$("#cb").hide();
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
			   	$state.go('dashboards.main')
			  }
			});    		
    	}        
    }
}

function registerCtrl($scope, $rootScope, $state, userDataService){
	$("#cb").hide();
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

					   	var ctime = new Date().getTime();
		   				var date = moment().format('YYYY-MM-DD')
					   
					   	//userref.child(email).set(mobile);	

					   	var emailref = new Firebase(firebaseUrl+"userEmailMap");
					   	emailref.child(email).set(mobile);				   	

					    var n  = userref.child(mobile);
					    n.child('profile').set({'email':email, 'name':name, 'created': ctime, 'date':date})

					    var ref = new Firebase(firebaseUrl+"users/"+mobile+'/brands')
			   			ref.child(brand).set('admin')
			   			ref.child('support').set('user')


					   /* var n  = userref.child(mobile);
			    //n.child(brand).set(userData)
			    n.child('profile').set(userData)

			   	//var i = userref.child(mobile);
			   	var ref = new Firebase("https://educe.firebaseio.com/users/"+mobile+'/brands')
			   	ref.child(brand).set('user')*/

					    var brandref = new Firebase(firebaseUrl+"brands");
					   	

					   	var lastupdateref = new Firebase(firebaseUrl+"brands/"+brand+'/lastUpdated');
		    			lastupdateref.child('admin').set(mobile);

		    			var supportRef = new Firebase(firebaseUrl+"brands/support/users");
    					supportRef.child(mobile).set(name);

					    var brandchild  = brandref.child(brand);
					    var adminch = brandchild.child('admins');
					    adminch.child(mobile).set(name)
					    localStorage.setItem("email", email) 
					    localStorage.setItem("brand", brand)
					    userDataService.setbrand(brand)
					    $state.go('dashboards.main')
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
function navigationCtrl($scope, $state, $firebaseObject, $firebaseArray, $timeout, userDataService, firebaseServices){
	var email = localStorage.getItem("email");
	var brand = localStorage.getItem("brand");
	var name = '';
	var mobile = '';

	$scope.$on('nameUpdated', function() {	    
	   $scope.name = userDataService.getName();     
    });

	$scope.brand = userDataService.getbrand(brand);
	var userbrandref = new Firebase(firebaseUrl+"brands/"+brand+"/admins");
	var userref = new Firebase(firebaseUrl+"userEmailMap");

	userref.orderByKey().equalTo(email).on("child_added", function(snapshot) {
		mobile =  snapshot.val();
		firebaseServices.fetchContactData(mobile, brand).then(function(result){
		if (result){
			$timeout(function(){
			  	$scope.$apply(function() {
			  		console.log(result)
			  		var image = "person_avatar_h9fddj"
			  		if(result.pImage){
			  			image = result.pImage
			  		}

			  		console.log(result.pImage)
			  		$scope.pImage = image;
			  	});
		  	},0,false);
		}
	});
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
    var brand = userDataService.getbrand();
    $scope.formData = {};
    $scope.formData.pImage = "person_avatar_h9fddj"
    

    $scope.submitForm = function() {
    	if($scope.formData.name && $scope.formData.mobile &&  $scope.formData.email && $scope.formData.company && $scope.formData.pImage){
    		var userref = new Firebase(firebaseUrl+"users");
		   	var mobile = '91'+$scope.formData.mobile;
		   	var name = $scope.formData.name;
		   	var email = encryptemail($scope.formData.email);
		   	var company = encryptemail($scope.formData.company);
		   	var address = $scope.formData.address;
		   	var pImage = $scope.formData.pImage;
		   	var ctime = new Date().getTime();
		   	var date = moment().format('YYYY-MM-DD')
		   	var userData = {
		   		'company':company,
		   		'name':name,
		   		'email':email,
		   		'address':address,
		   		'pImage':pImage,
		   		'created': ctime,
		   		'date':date
		   	}
		   	//var userRef = new Firebase("https://educe.firebaseio.com/users");
		   	//userref.child(email).set(mobile);	
		   	/*var emailref = new Firebase(firebaseUrl+"userEmailMap");
			emailref.child(email).set(mobile);				   	

		    var n  = userref.child(mobile);
		   // n.child(brand).set(userData)
		   	n.child('profile').set(userData)*/

		   	var queueData = {
          		'data': userData,
          		'user':mobile,
          		'brand':brand,
				"_state": "add_user_to_circle",
          	}

          	var queueRef = new Firebase(firebaseUrl+"/queue/tasks");
          	queueRef.push(queueData);
		   
		   /*	var ref = new Firebase(firebaseUrl+"users/"+mobile+'/brands')
		   	ref.child(brand).set('user')
		   	ref.child('support').set('user')

		    var brandref = new Firebase(firebaseUrl+"brands/"+brand);
		    var adminch = brandref.child('users');
		    adminch.child(mobile).set(name);

		    supportRef.child(mobile).set(name);

		    var company = companyref.child(company);
		    company.child(mobile).set(name);

		    var lastupdateref = new Firebase(firebaseUrl+"brands/"+brand+'/lastUpdated');
		    lastupdateref.child('contact').set(mobile);*/

		    $scope.message = "Data succesfully Inserted";
		    /*$scope.formData = '';*/
    	}else{
    		$scope.error = "Please insert all fields";
    	}       
    };

}


/*uploadcontactsCtrl*/
function uploadcontactsCtrl($scope, $rootScope, userDataService, $timeout) {

    // All data will be store in this object
    $scope.MyFiles=[];
    var userref = new Firebase(firebaseUrl+"users");
    var brand = userDataService.getbrand();
    var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/users");
    var supportRef = new Firebase(firebaseUrl+"brands/support/users");
    var companyref = new Firebase(firebaseUrl+"brands/"+brand+"/companyusers");
		   
    var contactList = [];
	$scope.handler = function(e,files){
		contactList.length = 0
		$scope.contactList = '';
	    var reader = new FileReader();
	    reader.onload=function(e){
	        var string = e.target.result.split("\n");
	        $(string).each(function( index, value ) {
	        	console.log(value)
	        	if(value != ''){
	        		if(index !=0){
	        			var csvvalue = value.split(",");
				   		var status = true;
				   		var errors = [];
					   	var name = csvvalue[0];
					   	var mobile = csvvalue[1];
					   	var company = csvvalue[2];
					   	var email = '';
					   	
					   	if(csvvalue[3]){
					   		if(!isValidEmailAddress(csvvalue[3])){
					   			status = false;
		        				errors.push({"error":"Email is invalid"})
					   		}else{
					   			email = encryptemail(csvvalue[3]);
					   		}					   		
					   	}else{
					   		email = mobile+"@gmail.com"
					   		email = encryptemail(email);
					   	}
					   				   	
					   	var address = csvvalue[4];
					   	var pImage = "person_avatar_h9fddj";

					   	if(csvvalue[5]){
					   		pImage = csvvalue[5];
					   	}

					   	if(!csvvalue[0]){
		        			status = false;
		        			errors.push({"error":"Name not found"})
		        		}

		        		if(!csvvalue[1]){
		        			status = false;
		        			errors.push({"error":"Mobile not found"})
		        		}else{
		        			if(isNaN(csvvalue[1]) == true){
		        				status = false;
		        				errors.push({"error":"Mobile is invalid"})
		        			}
		        		}

		        		if(!csvvalue[2]){
		        			status = false;
		        			errors.push({"error":"Company not found"})
		        		}

		        		if(!csvvalue[3]){
		        			status = false;
		        			errors.push({"error":"Email not found"})
		        		}

		        		if(!csvvalue[4]){
		        			status = false;
		        			errors.push({"error":"Address not found"})
		        		}

		        		if(!csvvalue[5]){
		        			status = false;
		        			errors.push({"error":"Image not found"})
		        		}


		        		var diaplaydata = {
					   		'company':company,
					   		'name':name,
					   		'mobile':mobile,
					   		'email':email,
					   		'address':address,
					   		'pImage':pImage,
					   		'status':status,
					   		'errors':errors
					   	}
					   	contactList.push(diaplaydata);
	        		}
	        	}
	        	if(index == string.length-1){
        		    $timeout(function(){
					  	$scope.$apply(function() {
					  		$scope.contactList = contactList;
					  	});
				  	},0,false);
				}
			});
	    }
	    reader.readAsText(files[0]);
	}

	$scope.Save = function (){
		var contactData = $scope.contactList		
		var count = 0;

		contactData.forEach(function(items){ 
			count++;
		 	var company = encryptemail(items.company);
		 	var mobile = "";
		 	var name = items.name;
		 	var email = items.email;
		 	var address = items.address;		 	
		 	var pImage = items.pImage; 	
			var ctime = new Date().getTime();
		   	var date = moment().format('YYYY-MM-DD')

		   	/*if(!items.mobile){
		   		'91'+
		   	}else{
		   		mobile = '91'+items.mobile
		   	}*/
		   	if(items.mobile){
		   		mobile = '91'+items.mobile
		   		var userData = {
			   		'company':company,
			   		'name':name,
			   		'email':email,
			   		'address':address,
			   		'pImage':pImage,
			   		'created': ctime,
			   		'date':date
			   	}	        			

			   	//userref.child(email).set(mobile);		
			   	/*var emailref = new Firebase(firebaseUrl+"userEmailMap");
				emailref.child(email).set(mobile);			   	

			    var n  = userref.child(mobile);
			    //n.child(brand).set(userData)
			    n.child('profile').set(userData)

			   	//var i = userref.child(mobile);
			   	var ref = new Firebase(firebaseUrl+"users/"+mobile+'/brands')
			   	ref.child(brand).set('user')
			   	ref.child('support').set('user')

			    brandref.child(mobile).set(name);
			    supportRef.child(mobile).set(name);

			    var company = companyref.child(company);
				company.child(mobile).set(name);

				var lastupdateref = new Firebase(firebaseUrl+"brands/"+brand+'/lastUpdated');
			    lastupdateref.child('contact').set(mobile);*/

			    var queueData = {
	          		'data': userData,
	          		'user':mobile,
	          		'brand':brand,
					"_state": "add_user_to_circle",
	          	}

	          	var queueRef = new Firebase(firebaseUrl+"/queue/tasks");
	          	queueRef.push(queueData);
				
	            if(count == contactData.length){
	            	$scope.message = "Data succesfully Inserted";
	            }
		   	}else{
		   		console.log('not')
		   	}
			/**/
		 })
	}

	$scope.reset = function(){
		contactList.length = 0
		$scope.contactList = '';
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
	var brand = userDataService.getbrand();
	$scope.productId = $stateParams.productId;

	var allproductsRef = new Firebase(firebaseUrl+"products/products/"+$scope.productId)
    $scope.formData = $firebaseObject(allproductsRef);

    $scope.submitForm = function() {
    	if($scope.formData.name && $scope.formData .price && $scope.formData.category){
    		var brandProductData = {
				name:$scope.formData.name,
				price: $scope.formData.price
			}
			var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/products/"+$scope.productId);			
			brandref.update(brandProductData);
			var images = [];
			if($scope.formData.cimages){	
				var i = $scope.formData.cimages.toString();
				images = i.split(',');
			}
			
    		var data = {
    			'category':$scope.formData.category,
    			'cimages':images,
    			'circle':brand,
    			'color':$scope.formData.color,
    			'details':$scope.formData.details,
    			'fabric':$scope.formData.fabric,
    			'handle':$scope.formData.handle,
    			'mrprice':$scope.formData.mrprice,
    			'name':$scope.formData.name,
    			'price':$scope.formData.price,
    			'sku':$scope.formData.sku,
    			'work':$scope.formData.work,
    		}
    		allproductsRef.update(data);
    		$scope.message = "Product succesfully Updated";
    	}
    }
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
					var ctime = new Date().getTime();
		   			var date = moment().format('YYYY-MM-DD')

					var images = [];
					images = $scope.formData.cimages.split(',');
		    		var data = {
		    			'category':$scope.formData.category,
		    			'cimages':images,
		    			'circle':brand,
		    			'color':$scope.formData.color,
		    			'details':$scope.formData.details,
		    			'fabric':$scope.formData.fabric,
		    			'handle':$scope.formData.handle,
		    			'mrprice':$scope.formData.mrprice,
		    			'name':$scope.formData.name,
		    			'price':$scope.formData.price,
		    			'sku':$scope.formData.sku,
		    			'work':$scope.formData.work,
		    			'created': ctime,
		   				'date':date
		    		}

					var newProductRef = mainref.push(data);
					// Get the unique ID generated by push()
					var productIdID = newProductRef.key();
					console.log(productIdID)
					if(productIdID){
						var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/products");			
						brandref.child(productIdID).set(brandProductData);

		    			var queueData = {
		              		'productId':productIdID,
		              		'brand':brand,
		  					"_state": "product_added"
		              	}

		              	var queueRef = new Firebase(firebaseUrl+"/queue/tasks");
		              	queueRef.push(queueData);

		              	var autoqueueData = {
                            'productId':productIdID,
                            'brand': brand,
                            "_state": "auto_forward"
                        }
                        queueRef.push(autoqueueData);

						$scope.message = "Product succesfully Added";
						/*$scope.formData = '';*/
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
function uploadproductsCtrl($scope, $rootScope, userDataService, $timeout) {
    // All data will be store in this object
    

}

function uploadproductcategoryCtrl($scope, $stateParams, $rootScope, userDataService, $timeout) {
	var categoryId = $stateParams.categoryId;
	$scope.category = '';

	$scope.categoryId = $stateParams.categoryId;
	if(categoryId == "saree"){
		$scope.category =  "Saree"
	}else if(categoryId == "salwar"){
		$scope.category = "Salwar Suits"
	}else if(categoryId == "gowns"){
		$scope.category = "Gowns"
	}else if(categoryId == "lehenga"){
		$scope.category = "Lehenga"
	}else if(categoryId == "kurti"){
		$scope.category = "Kurti"
	}

	$scope.MyFiles=[];
    var brand = userDataService.getbrand();
    var mainref = new Firebase(firebaseUrl+"products/products")


    var productList = [];
	$scope.handler = function(e,files){
		productList.length = 0
		$scope.productList = '';
	    var reader = new FileReader();
	    reader.onload=function(e){
	        var string = e.target.result.split("\n");    

	        $(string).each(function( index, value ) {
	        	if(value != ''){
	        		if(index !=0){
	        		var csvvalue = value.split(",");
	        		var category = csvvalue[0];
	        		var cimages = csvvalue[1];
	        		//var circle = csvvalue[2];
	        		var color = csvvalue[2]; 
	        		var details = csvvalue[3];
	        		var fabric = csvvalue[4];
	        		//var handle = csvvalue[5];
	        		var mrprice = csvvalue[5];
	        		var name = csvvalue[6];
	        		var price = csvvalue[7];
	        		var sku = csvvalue[8];
	        		var work = csvvalue[9];
	        		var images = new Array();
 					var circle = brand

	        		var status = true;
				   	var errors = [];

	        		if(cimages){
	        			images = cimages.split('/');
	        		}

	        		if(!csvvalue[0]){
	        			status = false;
	        			errors.push({"error":"Category not found"})
	        		}
	        		if(!csvvalue[1]){
	        			status = false;
	        			errors.push({"error":"Image not found"})
	        		}/*
	        		if(!csvvalue[2]){
	        			status = false;
	        			errors.push({"error":"Circle not found"})
	        		}*/
	        		if(!csvvalue[2]){
	        			status = false;
	        			errors.push({"error":"Color not found"})
	        		}
	        		if(!csvvalue[3]){
	        			status = false;
	        			errors.push({"error":"Details not found"})
	        		}
	        		if(!csvvalue[4]){
	        			status = false;
	        			errors.push({"error":"Fabric not found"})
	        		}
	        		/*if(!csvvalue[6]){
	        			status = false;
	        			errors.push({"error":"Handle not found"})
	        		}*/
	        		if(!csvvalue[5]){
	        			status = false;
	        			errors.push({"error":"Mrprice not found"})
	        		}
	        		if(!csvvalue[6]){
	        			status = false;
	        			errors.push({"error":"Name not found"})
	        		}
	        		if(!csvvalue[7]){
	        			status = false;
	        			errors.push({"error":"Price not found"})
	        		}
	        		if(!csvvalue[8]){
	        			status = false;
	        			errors.push({"error":"SKU not found"})
	        		}
	        		if(!csvvalue[9]){
	        			status = false;
	        			errors.push({"error":"Work not found"})
	        		}


	        		var diaplaydata = {
				   		'category':category,
	        			'cimages':images,
	        			'circle':circle,
	        			'color':color,
	        			'details':details,
	        			'fabric':fabric,
	        			//'handle':handle,
	        			'mrprice':mrprice,
	        			'name':name,
	        			'price':price,
	        			'sku':sku,
	        			'work':work,
				   		'status':status,
				   		'errors':errors
				   	}
					productList.push(diaplaydata)

	        		
				   }
	        	}
	        	if(index == string.length-1){
        		    $timeout(function(){
					  	$scope.$apply(function() {
					  		$scope.productList = productList;
					  	});
				  	},0,false);
				}
			});	        
	    }
	    reader.readAsText(files[0]);
	}

	$scope.Save = function (){
		var productData = $scope.productList		
		var count = 0;

		productData.forEach(function(items){ 
			count++;
		 	var category = items.category;
		 	var cimages = items.cimages;
		 	var circle = items.circle;
		 	var color = items.color;
		 	var details = items.details;		 	
		 	var fabric = items.fabric;  
		 	//var handle = items.handle;
		 	var mrprice = items.mrprice;
		 	var name = items.name;
		 	var price = items.price;
		 	var sku = items.sku;		 	
		 	var work = items.work; 	
			var ctime = new Date().getTime();
		   	var date = moment().format('YYYY-MM-DD')

			var data = {
    			'category':category,
    			'cimages':cimages,
    			'circle':circle,
    			'color':color,
    			'details':details,
    			'fabric':fabric,
    			//'handle':handle,
    			'mrprice':mrprice,
    			'name':name,
    			'price':price,
    			'sku':sku,
    			'work':work,
    			'created': ctime,
		   		'date':date
    		}

    		
    		var brandProductData = {
				name:name,
				price:price
			}

    		var newProductRef = mainref.push(data);
			var productIdID = newProductRef.key();
			console.log(productIdID)

			

			var pRef = new Firebase(firebaseUrl+"products/products/"+productIdID)
			pRef.child('handle').set(productIdID)

			if(productIdID){
				var brandref = new Firebase(firebaseUrl+"brands/"+brand+"/products");			
				brandref.child(productIdID).set(brandProductData);

				var queueData = {
	          		'productId':productIdID,
	          		'brand':brand,
					"_state": "product_added"
	          	}

	          	var queueRef = new Firebase(firebaseUrl+"/queue/tasks");
	          	queueRef.push(queueData);     

	          	var autoqueueData = {
                    'productId':productIdID,
                    'brand': brand,
                    "_state": "auto_forward"
                }
                queueRef.push(autoqueueData);     	
				
			}			
            if(count == productData.length){
            	$scope.message = "Data succesfully Inserted";
            }
		 })
	}

	$scope.reset = function(){
		productList.length = 0
		$scope.productList = '';
	}

}

function timelineCtrl($scope, $rootScope, $stateParams, $firebaseArray, userDataService) {
	var paginator= undefined;
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
	console.log()


	
	/*cardref.orderByKey().startAt(2).limitToFirst(2).on("child_added", function(snapshot) {
	  console.log(snapshot.key())
	  alert(snapshot.key())
	  console.log('-----------********')
	});*/
	var addData = function($scope, key){
		cardref.orderByKey().startAt(key).on("child_added", function(snapshot) {
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

function topnavbarCtrl($scope, $rootScope, $stateParams, $state, userDataService, $timeout, $firebaseArray){
	var brand = userDataService.getbrand();
	var mobile = userDataService.getMobile();
	var name = userDataService.getName();

	$scope.$on('mobileUpdated', function() {
	    brand = userDataService.getbrand();
	    mobile = userDataService.getMobile();
	    name = userDataService.getName();
	    
	    var userRef = new Firebase(firebaseUrl+"users/"+mobile+"/"+brand);
	    userRef.child('unreadnotifications').once('value', function(snapshot) {
	    	$timeout(function(){
			  	$scope.$apply(function() {
			  		$scope.notiCount = snapshot.val();
			  	});
		  	},0,false);	     
	    }); 

	    var userRenotificationRef = new Firebase(firebaseUrl+"users/"+mobile+"/"+brand+"/notifications");
	    $scope.notifications = $firebaseArray(userRenotificationRef);	       
    });

	if(mobile && brand){
		var userRef = new Firebase(firebaseUrl+"users/"+mobile+"/"+brand);
	    userRef.child('unreadnotifications').once('value', function(snapshot) {
	    	$timeout(function(){
			  	$scope.$apply(function() {
			  		$scope.notiCount = snapshot.val();
			  	});
		  	},0,false);	     
	    }); 

	    var userRenotificationRef = new Firebase(firebaseUrl+"users/"+mobile+"/"+brand+"/notifications");
	    $scope.notifications = $firebaseArray(userRenotificationRef);
	}
    
	$scope.logout = function(){
		localStorage.clear();
		$state.go('login')
	}
}

function paymentMethodCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject){
	$scope.formData = {};

	var brand = userDataService.getbrand();
	var paymentRef =  new Firebase(firebaseUrl+"brands/"+brand+'/paymentMethod');
	var homeref = new Firebase(firebaseUrl+"brands/"+brand);
	$scope.checkboxModel = $firebaseObject(paymentRef);
	
	$scope.submitForm = function(){
		var online = 0;
		var onaccount = 0;
		var COD = 0;

		if($scope.checkboxModel.online){
			online = 1;
		}
		if($scope.checkboxModel.onaccount){
			onaccount = 1;
		}
		if($scope.checkboxModel.COD){
			COD = 1;
		}

		var data = {
			'onaccount':onaccount,
			'online':online,
			'COD':COD
		}
		
		homeref.child('paymentMethod').set(data);
		$scope.message = "Data succesfully Updated";
	}
}

function homepageCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject){
	$scope.formData = {};

	var brand = userDataService.getbrand();
	var homeref = new Firebase(firebaseUrl+"brands/"+brand);

	var menuRef = new Firebase(firebaseUrl+"brands/"+brand+'/menuButtons');
	//$scope.menuData = $firebaseObject(menuRef);
	menuRef.once('value', function(snapshot) {
		if(snapshot){
			$scope.menuButtons = snapshot.val()
		}
	});

	var homeData  = new Firebase(firebaseUrl+"brands/"+brand+'/home');
	$scope.formData = $firebaseObject(homeData);

	$scope.submitForm = function(){
		//console.log($scope.checkboxModel)
		var imgName = $scope.formData.image; 
		var text = $scope.formData.text;
		var query = $scope.formData.query;
		var logo = $scope.formData.logo;

		var left = $scope.formData.left; 
		var scrollx = $scope.formData.scrollx;
		var scrolly = $scope.formData.scrolly;
		var zoom = $scope.formData.zoom;
		var top = $scope.formData.top;

		var menuButtons = $scope.menuButtons;
		
		
		var data = {
			"image" : imgName,
	        "logo" : logo,
	        "query" : query,
	        "text" : text,
	        "left":left,
	        "scrollx":scrollx,
	        "scrolly":scrolly,
	        "zoom":zoom,
	        "top":top
		}
		if(menuButtons){
			console.log(menuButtons)
			homeref.child('menuButtons').set(menuButtons);
		}

		if(imgName && text && query && logo){
			homeref.child('home').set(data);			
			/*homeref.child('paymentMethod').set($scope.checkboxModel);*/
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

function addformCtrl ($scope, $rootScope, $modal, $stateParams, $state, userDataService, dataService, $firebaseObject, $firebaseArray){
	$scope.formData = {};
	var brand = userDataService.getbrand();
	var brandref = new Firebase(firebaseUrl+"brands/"+brand);
	var brandformref = new Firebase(firebaseUrl+"brands/"+brand+"/forms");
	var name = userDataService.getName();

	$scope.submitForm = function(){
		var ctime = new Date().getTime();
		if($scope.formData.name){
			//var id = $scope.formData.id;
			var data = {
				'html':$scope.formData.html,
				'name':$scope.formData.name,
				'description':$scope.formData.description,
				'added-on': ctime,
				'created-by':name
			}
			brandformref.push(data);
			//brandformref.set(data);
			$scope.message = "Form succesfully Created";
			/*$scope.formData = {};*/
		}		
	}

	$scope.openMedal = function(){
		var modalInstance = $modal.open({
            templateUrl: 'views/importform.html',
            controller: importFormCtrl
        });
	}

	$scope.$on('formImported', function() {
		$scope.formData = dataService.getformData()
		$("#name").attr('disabled','disabled');
		$("#html").attr('disabled','disabled');
		console.log($scope.formData)

	});

}


function importFormCtrl ($scope, $modalInstance, $timeout, dataService, $firebaseObject) {
	var systemformref = new Firebase(firebaseUrl+"brands/system/forms");
	var forms = [];
	systemformref.on("child_added",function(data){
		var key = data.key();
		var dataList = data.val();
		if(dataList){
			var dataObj = {
				'key':key,
				'name':dataList.name
			}
			forms.push(dataObj)

			$timeout(function(){
			  	$scope.$apply(function() {
			  		$scope.forms = forms;
			  		$('#Daily Sales Form').attr('checked', true);			  		
			  	});
		  	},0,false);
		}
	});

	$scope.ok = function () {
		var key = $('input[type="radio"]:checked').val();
		if(key){
			var formDataRef = new Firebase(firebaseUrl+"brands/system/forms/"+key);
			var formData = $firebaseObject(formDataRef);
			dataService.setformData(formData);
			$modalInstance.close();
		}else{
			$scope.error = "Please Select any one form";
		}
		
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
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
		if($scope.formData.name){
			var data = {
				'html':$scope.formData.html,
				'name':$scope.formData.name,
				'description':$scope.formData.description,
				'added-on': ctime,
				'created-by':name
			}
			brandformref.set(data);
			//brandformref.set(data);
			$scope.message = "Data succesfully Updated";
			//$scope.formData = {};
		}		
	}

	$scope.deleteForm = function(){
		brandformref.remove();
		$state.go('forms.formlist')
	}

}

function contactlistCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	/*$scope.userlist = {};*/
	var brand = userDataService.getbrand();
	var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/users');
	$scope.userlist = $firebaseArray(branduserref);
}

function editcontactCtrl($scope, $rootScope, $stateParams, $state, userDataService, firebaseServices, $timeout, $firebaseObject, $firebaseArray){
	/*$scope.userlist = {};*/
	var brand = userDataService.getbrand();
	var contactId = $stateParams.contactId;
	var loggedinmobile = userDataService.getMobile();
	//var branduserref = new Firebase(firebaseUrl+"users/"+contactId+'/'+brand);

	console.log(loggedinmobile)
	firebaseServices.fetchContactData(contactId, brand).then(function(result){
		if (result){
			$timeout(function(){
			  	$scope.$apply(function() {
			  		console.log(result)
			  		$scope.formData = result;
			  		$scope.formData.key = $scope.formData.company; 
			  		if(!$scope.formData.pImage){
			  			$scope.formData.pImage = 'person_avatar_h9fddj'
			  		}
			  	});
		  	},0,false);
		}
	});

	$scope.deleteUser = function(){
		/*var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/users/'+contactId);
		branduserref.remove()
		/*var userref = new Firebase(firebaseUrl+'/users/'+contactId);
		userref.remove()*/
		var queueData = {
			'user':contactId,
      		'brand':brand,
			"_state": "delete_user"
      	}

      	var queueRef = new Firebase(firebaseUrl+"/queue/tasks");
      	queueRef.push(queueData);

		$state.go('contacts.List')
	}


	//$scope.formData = $firebaseObject(branduserref);

	$scope.submitForm = function() {
    	if($scope.formData.name && $scope.formData.company && $scope.formData.pImage){
    		console.log($scope.formData.key)
    		if($scope.formData.key != $scope.formData.company){
    			var companyref = new Firebase(firebaseUrl+"brands/"+brand+"/companyusers/"+encryptemail($scope.formData.key));
				companyref.remove()
    		}
		   	var name = $scope.formData.name;
		   	var email = $scope.formData.email;
		   	var company = encryptemail($scope.formData.company);
		   	var address = $scope.formData.address;
		   	var pImage = $scope.formData.pImage;
		   	var mobile = $scope.formData.mobile;

		   	var companyref = new Firebase(firebaseUrl+"brands/"+brand+"/companyusers/"+company);
			companyref.child(contactId).set(name);

			var mainuseref = new Firebase(firebaseUrl+"brands/"+brand+"/users");
			mainuseref.child(contactId).set(name);

			
		   	var userData = {
		   		'company':company,
		   		'name':name,
		   		'email':email,
		   		'address':address,
		   		'pImage':pImage
		   	}			   	

		   	var userRef = new Firebase(firebaseUrl+"users/"+contactId+'/profile');		   	
		   	//userRef.child(brand).set(userData);
		   	userRef.update(userData)

		   	var adminRef = new Firebase(firebaseUrl+"brands/"+brand+'/admins');
		   	adminRef.once('value', function(snapshot) {
			 	if (snapshot.hasChild(contactId)) {
			    	adminRef.child(contactId).set(name);
			    	console.log(loggedinmobile +'loggedinmobile')
			    	if(loggedinmobile == contactId){
			    		userDataService.setName(name);
			    	}			    	
			  	}
			});

		    $scope.formData.key = $scope.formData.company;
		    $scope.message = "Data succesfully Updated";
    	}else{
    		$scope.error = "Please insert all fields";
    	}      
    };
}

function adminlistCtrl($scope, $rootScope, $stateParams, $state, userDataService, $firebaseObject, $firebaseArray){
	/*$scope.userlist = {};*/
	var brand = userDataService.getbrand();
	var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/admins');
	$scope.userlist = $firebaseArray(branduserref);

}

function addadminCtrl($scope, $rootScope, userDataService) {
    // All data will be store in this object
    var brand = userDataService.getbrand();
    $scope.formData = {};
    $scope.formData.pImage = "person_avatar_h9fddj";
    // After login submit
    
    $scope.submitForm = function() {
    	if($scope.formData.name && $scope.formData.mobile &&  $scope.formData.email && $scope.formData.company ){
    		var userref = new Firebase(firebaseUrl+"users");
		   	var mobile = '91'+$scope.formData.mobile;
		   	var name = $scope.formData.name;
		   	var email = encryptemail($scope.formData.email);
		   	var company = $scope.formData.company;
		   	var address = $scope.formData.address;
		   	var pImage = '';
		   	if($scope.formData.pImage){
		   		pImage = $scope.formData.pImage;
		   	}
		   	var ctime = new Date().getTime();
		   	var date = moment().format('YYYY-MM-DD')

		   	var userData = {
		   		'company':company,
		   		'name':name,
		   		'email':email,
		   		'address':address,
		   		'pImage':pImage,
		   		'created': ctime,
		   		'date':date
		   	}
		   	//var userRef = new Firebase("https://educe.firebaseio.com/users");
		   	//userref.child(email).set(mobile);		
		   	var emailref = new Firebase(firebaseUrl+"userEmailMap");
			emailref.child(email).set(mobile);			   	

		    var n  = userref.child(mobile);
		   // n.child(brand).set(userData)
		   	n.child('profile').set(userData)

		   	//var i = userref.child(mobile);
		   	var ref = new Firebase(firebaseUrl+"users/"+mobile+'/brands')
		   	ref.child(brand).set('admin')
		   	ref.child('support').set('user')

		    var brandref = new Firebase(firebaseUrl+"brands/"+brand+'/admins');
		    //var adminch = brandref.child('admins');
		    brandref.child(mobile).set(name);

		    var lastupdateref = new Firebase(firebaseUrl+"brands/"+brand+'/lastUpdated');
		    lastupdateref.child('admin').set(mobile);

		    var supportRef = new Firebase(firebaseUrl+"brands/support/users");
    		supportRef.child(mobile).set(name);

		    $scope.message = "Admin succesfully added";
		   /* $scope.formData = '';*/
    	}else{
    		$scope.errors = "Please insert all fields"
    	}        
    };
}


function uploaddispatchCtrl($scope, $rootScope, userDataService, keenServices, $timeout, $q, firebaseServices) {
    // All data will be store in this object
    $scope.MyFiles=[];
    //$scope.message = "Data succesfully Inserted";
    var brand = userDataService.getbrand();
    var mobile = userDataService.getMobile();
    var name = userDataService.getName();
    /*var invoiceno = "456";*/
    var mainref = new Firebase(firebaseUrl+"cards/")
	/*mainref.on("child_added", function(snapshot) {
	  console.log(snapshot.key());
	});*/
	//$scope.dispatchList = {}
	var dispatchList = [];
	$scope.handler = function(e,files){
		dispatchList.length = 0
		$scope.dispatchList = '';
	    var reader = new FileReader();
	    reader.onload=function(e){
	        var string = e.target.result.split("\n");
	       	var invoiceArray = [];
	       	var keyArray = [];

	        $(string).each(function( index, value ) {
	        	if(value != ''){
	        		if(index !=0){
	        		var csvvalue = value.split(",");
	        		var status = true;
	        		var errors = [];
	        		var date = csvvalue[0]

	        		var u = moment(date).toDate();
	        		//var f = moment(u).format('YYYY-MM-DD');
	        		//var y =  date.getFullYear();
	        		console.log(u +'year----')
	        		if(csvvalue[0]){
	        			if(csvvalue[0] == moment(csvvalue[0]).format('YYYY-MM-DD')){
		        			status = true
		        		}else{
		        			status = false;
		        			errors.push({"error":"Date format is Wrong, Plese insert in YYYY-MM-DD format"})
		        		}	        		
	        		}else{
	        			status = false;
	        			errors.push({"error":"Date not found"})
	        		}

	        		if(!csvvalue[1]){
	        			status = false;
	        			errors.push({"error":"Transport not found"})
	        		}
	        		if(!csvvalue[2]){
	        			status = false;
	        			errors.push({"error":"LR no not found"})
	        		}
	        		if(!csvvalue[3]){
	        			status = false;
	        			errors.push({"error":"Invoice no not found"})
	        		}
	        		if(!csvvalue[4]){
	        			status = false;
	        			errors.push({"error":"Parcel no not found"})
	        		}
	        		if(!csvvalue[5]){
	        			status = false;
	        			errors.push({"error":"Company Name not found"})
	        		}else{
						var companyref = new Firebase(firebaseUrl+"brands/"+brand+'/companyusers');
						var cmp = csvvalue[5].trim()
						//console.log(cmp)
						firebaseServices.checkIfcompanyExists(cmp, brand).then(function(d){
							if (d == false){
								status = false;
	        			  		errors.push({"error":"Company data not found in current Brand"});	        			  		
							}
							var transport = csvvalue[1];
			        		var LRno = csvvalue[2];
			        		var invoiceno = csvvalue[3]; 
			        		var parcelno = csvvalue[4];
			        		var company = csvvalue[5];
			        		var item = csvvalue[6];
			        		var rate = csvvalue[7];
			        		var pieces = csvvalue[8];

							var itemdata ={
		        				'item':item,
		        				'rate':rate,
			        			'pieces':pieces
		        			}
		        			var scopedata = {
		        				'author':mobile,
			        			'authorName':name,
			        			'brand':brand,
			        			'created':new Date().getTime(),
			        			'item':item,
		        				'rate':rate,
			        			'pieces':pieces,
			        			'date':date,
			        			'transport':transport,
			        			'LRno':LRno,
			        			'invoiceno':invoiceno,
			        			'parcelno':parcelno,
			        			'company':company,
			        			'type':'Invoice',
			        			'status':status,
			        			'errors':errors
			        		}
			        		dispatchList.push(scopedata);
        			  		$timeout(function(){
							  	$scope.$apply(function() {
							  		$scope.dispatchList = dispatchList;
							  	});
						  	},0,false);
						},function(e){
							console.log(e)
						})						
	        		}
	        		if(!csvvalue[6]){
	        			status = false;
	        			errors.push({"error":"Item not found"})
	        		}
	        		if(!csvvalue[7]){
	        			status = false;
	        			errors.push({"error":"Rate not found"})
	        		}else{
	        			if(isNaN(csvvalue[7])==true){
	        				status = false;
	        				errors.push({"error":"Rate is Invalid"})
	        			}
	        		}

	        		if(!csvvalue[8]){
	        			status = false;
	        			errors.push({"error":"Pieces not found"})
	        		}else{
	        			if(isNaN(csvvalue[8])==true){
	        				errors.push({"error":"Pieces is Invalid"})
	        			}
	        		}

	        		

		        		/*if ($.inArray(invoiceno,invoiceArray) == -1){	        			
		        			var itemArry = itemdata
		        			var data = {
		        				'author':mobile,
			        			'authorName':name,
			        			'brand':brand,
			        			'created':new Date().getTime(),
			        			//'time':category,
			        			'date':date,
			        			'transport':transport,
			        			'LRno':LRno,
			        			'invoiceno':invoiceno,
			        			'parcelno':parcelno,
			        			'company':company,
			        			'type':'Invoice'
			        		}
			              	invoiceArray.push(invoiceno);
			              	var nweData = mainref.push(data);
			              	var cardkey = nweData.key();

			              	var cardref = new Firebase(firebaseUrl+"cards/"+cardkey)
			              	cardref.child('items').push(itemdata);

			              	keyArray.push(invoiceno, cardkey);

			              	addCardsToAdmins(cardkey, brand, mobile, firebaseUrl)
			              	addCardsTocompanyUsers(cardkey, brand, mobile, firebaseUrl, company)
			              	
			            }else{
			            	var index = keyArray.indexOf(invoiceno); 
			            	var key = keyArray[index+1];

			            	var cardref = new Firebase(firebaseUrl+"cards/"+key+"/items")
			              	cardref.push(itemdata);
			            }*/
		        	}


	        	}
	        	if(index == string.length-1){
        		    $timeout(function(){
					  	$scope.$apply(function() {
					  		$scope.dispatchList = dispatchList;
					  		
					  	});
				  	},0,false);
				}
			});	        
	    }
	    reader.readAsText(files[0]);
	}

	$scope.Save = function (){
		var invoiceArray = [];
	    var keyArray = [];
	    var keendata = [];

		var dispatchData = $scope.dispatchList
		var n = 0;

		dispatchData.forEach(function(items){ 
			n++;
		 	var author = items.author;
		 	var authorName = items.authorName;
		 	var brand = items.brand;
		 	var created = items.created;		 	
		 	var date = items.date; 	
			var transport = items.transport;
    		var LRno = items.LRno;
    		var invoiceno = items.invoiceno;
    		var parcelno = items.parcelno;
    		var company = items.company;
    		var item = items.item;
    		var rate = items.rate;
    		var pieces = items.pieces;

    		var keenRate = parseInt(rate)
    		var keenPieces = parseInt(pieces)

    		var keenObj = {
    			'author':author,
    			'authorName':authorName,
    			'brand':brand,
    			'created':new Date().getTime(),
    			'date':date,
    			'transport':transport,
    			'LRno':LRno,
    			'invoiceno':invoiceno,
    			'parcelno':parcelno,
    			'company':company,
    			'type':'Invoice',
    			'item':item,
    			'rate':keenRate,
    			'pieces':keenPieces
    		}

    		keendata.push(keenObj)
    		var itemdata ={
				'item':item,
				'rate':rate,
    			'pieces':pieces
			}

			if ($.inArray(invoiceno,invoiceArray) == -1){	        			
    			var itemArry = itemdata
    			var data = {
    				'author':author,
        			'authorName':authorName,
        			'brand':brand,
        			'created':new Date().getTime(),
        			'date':date,
        			'transport':transport,
        			'LRno':LRno,
        			'invoiceno':invoiceno,
        			'parcelno':parcelno,
        			'company':company,
        			'type':'Invoice'
        		}
        		
			   /* clientWrite.addEvent("dispatch", data, function(err, res){
			      if (err) {
			        console.log(err);
			      }
			      else {
			        console.log('submitted');
			      }
			    });*/

              	invoiceArray.push(invoiceno);
              	var nweData = mainref.push(data);
              	var cardkey = nweData.key();

              	var cardref = new Firebase(firebaseUrl+"cards/"+cardkey)
              	cardref.child('items').push(itemdata);

              	keyArray.push(invoiceno, cardkey);
              	/*keendata.push(data)*/
              	var queueData = {
              		'cardId':cardkey,
  					"_state": "card_created"
              	}

              	var queueRef = new Firebase(firebaseUrl+"/queue/tasks");
              	queueRef.push(queueData);
              	/*addCardsToAdmins(cardkey, brand, mobile, firebaseUrl)
              	*/   
              	addCardsTocompanyUsers(cardkey, brand, mobile, firebaseUrl, company)
            }else{
            	var index = keyArray.indexOf(invoiceno); 
            	var key = keyArray[index+1];

            	var cardref = new Firebase(firebaseUrl+"cards/"+key+"/items")
              	cardref.push(itemdata);
              
            }
            if(n == dispatchData.length){
            	//console.log(keendata.length)
            	keenServices.uploadDispatchdataToKeen(keendata)
            	$scope.message = "Data succesfully Inserted";
            }
		 })
	}

	$scope.reset = function(){
		dispatchList.length = 0
		$scope.dispatchList = '';
	}

}

function csvconverterCtrl($scope, $rootScope, userDataService) {
	var CSV = '';

   	$scope.handler = function(e,files){
	    var reader = new FileReader();
	    reader.onload=function(e){
	        var csvstring = e.target.result.split("\n");
	       // alert(csvstring.length)
	        var cmpString = csvstring[3].split(",");
	        var company = cmpString[0];
		    var invoice  = '';	
		    var row = "date, transport, LRno, invoice no, parcel no, company, item, rate, pieces";  	row.slice(0, row.length - 1);
	       	CSV += row + '\r\n';
	        $(csvstring).each(function(index, value ) {
	        	if(index > 2){
		        	if(value != ''){
		        		var csvvalue = value.split(",");
		        		var string = csvvalue[0];
		        		
		        		var item = '';
		        		if(isNaN(string)){
		        			if(string != 'NO. - WISE-SUBTOTAL' && string != 'PARTY-SUBTOTAL' && string != ' GRAND TOTAL'){
		        				item = string;
		        				var pieces = parseInt(csvvalue[1]);
		        				/*var d =  new Date(csvvalue[3])
		        				console.log(d)*/
		        				//var date = moment(d).format('YYYY-MM-DD');
		        				var date = csvvalue[3]
		        				var rate = csvvalue[4];
		        				var transport = csvvalue[5];
		        				var LRno = csvvalue[6];
		        			} 
		        			var ind = index+1;
	        				if(string == 'PARTY-SUBTOTAL'){
        						var cmpString = csvstring[ind].split(",");
        						if(cmpString[0] != ' GRAND TOTAL'){
        							company = cmpString[0];
        						}	        						        					
	        				}
	        				if(item && pieces){
	        					var row = "";
	        					row += '' + date + ',';
	        					row += '' + transport + ',';
	        					row += '' + LRno + ',';
	        					row += '' + invoice + ',';
	        					row += '' + invoice + ',';
	        					row += '' + company + ',';
	        					row += '' + item + ',';
	        					row += '' + rate + ',';
	        					row += '' + pieces + ',';

	        					row.slice(0, row.length - 1);
	        					CSV += row + '\r\n';
	        					console.log(company +'company' + invoice +'invoice'+item +'item' +pieces+' '+date+' '+rate+' '+transport+' '+LRno)
	        				}	        				
		        		}else{		        			
		        			/*var i = isNaN(ind);
		        			console.log(i)*/
		        			/*if(ind){
		        				var cmpString = csvstring[ind].split(",");
		        				company = cmpString[0];
		        			}*/
		        			/*var cmpString = value[ind].split(",");
		        			company = cmpString[0];*/
		        			invoice = string;
		        		}
 
		        		
		        	}
		        	if(index == csvstring.length-1){
		        		if (CSV == '') {        
					        alert("Invalid data");
					        return;
					    }   
					    
					    //Generate a file name
					    var fileName = "Shalini_Fashions";
					    //this will remove the blank-spaces from the title and replace it with an underscore
					    //fileName += ReportTitle.replace(/ /g,"_");   
					    
					    //Initialize file format you want csv or xls
					    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
					    
					    // Now the little tricky part.
					    // you can use either>> window.open(uri);
					    // but this will not work in some browsers
					    // or you will not get the correct file extension    
					    
					    //this trick will generate a temp <a /> tag
					    var link = document.createElement("a");    
					    link.href = uri;
					    
					    //set the visibility hidden so it will not effect on your web-layout
					    link.style = "visibility:hidden";
					    link.download = fileName + ".csv";
					    
					    //this part will append the anchor tag and remove it after automatic click
					    document.body.appendChild(link);
					    link.click();
		        	}
		        }
		        /*if(index > 2){

		        }*/
	       	});
	    }
	    reader.readAsText(files[0]);
	}
}

function chartJsCtrl($scope, $timeout, $rootScope, $stateParams, $firebaseArray, $firebaseObject, userDataService,  $q, firebaseServices) {
	var brand =  userDataService.getbrand();
    var mobile = userDataService.getMobile();

    var formRef = new Firebase(firebaseUrl+"brands/"+brand+"/forms");

    //$scope.formData = $firebaseObject(formRef);
    formRef.on("child_added", function(snapshot) {
  		var data = snapshot.val();
  		var sales = '';
  		var feedback = '';
  		var order = '';

  		if(data.name == "Daily Sales Form"){
  			sales = true;
  		}

  		if(data.name == "Feedback Form"){
  			feedback = true;
  		}

  		if(data.name == "Order Form"){
  			order = true;
  		}

  		$timeout(function(){
		  	$scope.$apply(function() {
		  		$scope.sales = sales
		  		$scope.feedback = feedback 
		  		$scope.order = order	  		
		  	});
	  	},0,false);
    });
	

	/*sales chart------------------------------------------------------------------*/
	var salesCount = new Keen.Query("count", {
        eventCollection: "forms",
        interval: "daily",
        timeframe: "this_21_days",
        filters: [
            {
              "property_name" : "formhname", //displayName
              "operator" : "eq",
              "property_value" : "Daily Sales Form" 
            },
            {
		        "property_name": "brand",
		        "operator": "eq",
		        "property_value": brand
		    }
        ]    
    });

    var salesSum = new Keen.Query("sum", {
        eventCollection: "forms",
        targetProperty: "f1",    
        interval: "daily",
        timeframe: "this_21_days",
        filters: [
            {
              "property_name" : "formhname", //displayName
              "operator" : "eq",
              "property_value" : "Daily Sales Form" 
            },
            {
		        "property_name": "brand",
		        "operator": "eq",
		        "property_value": brand
		    }
        ]    
    });

   	var salesChart = new Keen.Dataviz()
	  .el(document.getElementById("chart-sales"))
	  .chartType("linechart")
	  .title("Sales")	  
	  .height(300)
	  .chartOptions({
	    hAxis: {
	      format:'MMM d',
	      gridlines:  {count: 12}
	    },
	    chartArea: { height: "65%", bottom:"25%" },
	    legend: { position: "bottom" }
	  })
	.prepare();
	client.run([salesCount, salesSum], function(err, res){ // run the queries

	    var result1 = res[0].result  // data from first query
	    var result2 = res[1].result  // data from second query
	    var data = []  // place for combined results
	    var i=0

	    while (i < result1.length) {

	        data[i]={ // format the data so it can be charted
	            timeframe: result1[i]["timeframe"],
	            value: [
	                { category: "Form Submitted", result: result1[i]["value"] },
	                { category: "Total Sales", result: result2[i]["value"] }
	            ]
	        }
	        if (i == result1.length-1) { // chart the data
	      salesChart
	        .parseRawData({ result: data })
	        .render();
	        }
	        i++;
	    }
	});
	/*end sales chart------------------------------------------------------------------*/


	/*order chart*/
	var order = new Keen.Query("count", {
        eventCollection: "forms",    
        interval: "daily",
        timeframe: "this_21_days",
        filters: [
            {
              "property_name" : "formhname", //displayName
              "operator" : "eq",
              "property_value" : "order-form" 
            },
            {
		        "property_name": "brand",
		        "operator": "eq",
		        "property_value": brand
		    }
        ]    
    });

	client.draw(order, document.getElementById("chart-order"), {
	    chartType: "columnchart",
	    title: "Order",
	});

	/*feedback chart ------------------------------------------------*/
	var feedback = new Keen.Query("count", {
        eventCollection: "forms",    
        interval: "daily",
        timeframe: "this_21_days",
        filters: [
            {
              "property_name" : "formhname", //displayName
              "operator" : "eq",
              "property_value" : "feedback-form" 
            },
            {
		        "property_name": "brand",
		        "operator": "eq",
		        "property_value": brand
		    }
        ]    
    });

	client.draw(feedback, document.getElementById("chart-feedback"), {
	    chartType: "columnchart",
	    title: "Feedback",
	});
	/*end feedback chart -----------------------------------------------*/


	/*dispatch chart ----------------------------------------------------------*/
	var despatchChart = new Keen.Dataviz()
	  .el(document.getElementById("chart-dispatch"))
	  .chartType("columnchart")
	  .title("Despatch")
	  .height(300)
	  .chartOptions({
	    hAxis: {
	      format:'MMM d',
	      gridlines:  {count: 12}
	    },
	    chartArea: { height: "65%", bottom:"25%" },
	    legend: { position: "bottom" }
	  })
	.prepare();

	var dispatchAmount = new Keen.Query("sum", {
        eventCollection: "dispatch", 
        targetProperty: "rate",   
        interval: "daily",
        timeframe: "this_21_days",
        filters: [
            {
		        "property_name": "brand",
		        "operator": "eq",
		        "property_value": brand
		    }
        ]    
    });

    var dispatchPcs = new Keen.Query("sum", {
        eventCollection: "dispatch", 
        targetProperty: "pieces",   
        interval: "daily",
        timeframe: "this_21_days",
        filters: [
            {
		        "property_name": "brand",
		        "operator": "eq",
		        "property_value": brand
		    }
        ]    
    });

    client.run([dispatchAmount, dispatchPcs], function(err, res){ // run the queries

	    var result1 = res[0].result  // data from first query
	    var result2 = res[1].result  // data from second query
	    var data = []  // place for combined results
	    var i=0

	    while (i < result1.length) {

	        data[i]={ // format the data so it can be charted
	            timeframe: result1[i]["timeframe"],
	            value: [
	                { category: "Total Amount", result: result1[i]["value"] },
	                { category: "Total Pieces", result: result2[i]["value"] }
	            ]
	        }
	        if (i == result1.length-1) { // chart the data
	      despatchChart
	        .parseRawData({ result: data })
	        .render();
	        }
	        i++;
	    }
	});

	/*end dispatch chart ----------------------------------------------------------*/
}

function dashboardCtrl($scope, $rootScope, $stateParams, $firebaseArray, $firebaseObject, userDataService,  $q, firebaseServices) {
	var brand =  userDataService.getbrand();
    var mobile = userDataService.getMobile();

    $scope.usersCount = 0;
    $scope.productsCount = 0;
    $scope.adminsCount = '';

    $scope.lastaddedcontact = '';
    $scope.lastaddedproduct = '';
    $scope.lastaddedadmin = '';
     /*"property_name" : "formhname", //displayName
              "operator" : "eq",
              "property_value" : "Daily Sales Form" */
    /*var dailysales ={
	    "f1": 10,
	    "f2": "500",
	    "f3": "Agg",
	    "f4": "Shjj",
	    "name": "-JrgQQZdef7KDK3FHDYv",
	    "created": 1434435849535,
	    "mobile": "919586484242",
	    "text": "bhumi submitted a new shalini -JrgQQZdef7KDK3FHDYv",
	    "brand": "shalini",
	    "author": "919586484242",
	    "formhname":"Daily Sales Form"
	}
    clientWrite.addEvent("forms", dailysales, function(err, res){
      if (err) {
        console.log(err);
      }
      else {
        alert('submitted');
      }
    });*/

    /*var userRenotificationRef = new Firebase(firebaseUrl+"users/"+mobile+"/"+brand+"/notifications");
    var ctime = new Date().getTime();
    var dataU ={
    	"actor" : "919925037648",
        "pImage" : "img_1",
        "read" : false,
        "text" : "bhumi wrote a comment (Write what I want to say here...)",
        "type" : "card-comment",
        "typeid" : "card-comment_-Jp_qMLKXYxAHFjooa1W",
        "when" : ctime
    }

    userRenotificationRef.child('notifications').push(dataU);*/

    /*var client = new Keen({
      projectId: "55430ee796773d5aa89d86a4",
      writeKey: "11ad817b8e08ae848ad5a2c369fdf447db946153bb829e0b1b6c685b076a20519389f5dc36a8978bdc5e5c564cea3e14ef9b4a1ab16fe5d70f354181743881eaf816501f094bd43bee12e7eb63e29fe3183c8446f824a46eb2cb25a236aff85a4cd2213693f4d85d05dc7734e1088e06"
    });

    var ctime = new Date().getTime();
	var date = moment().format('YYYY-MM-DD');

    var dailysales ={
    	type: 'Form',
        name: 'feedback-form',
        author: 'user',
        authorName: 'DK',
        brand: 'atishae',
        created: ctime,
        date:date,
        text: 'nice collections u have'
    }
    client.addEvent("forms", dailysales, function(err, res){
      if (err) {
        console.log(err);
      }
      else {
        alert('submitted');
      }
    });*/

    var branddetailref = new Firebase(firebaseUrl+"brands/"+brand+'/lastUpdated');	
    branddetailref.child('contact').on('value', function(snap) {	
    	var contactId = snap.val();
    	var userDataRef =  new Firebase(firebaseUrl+"users/"+contactId+'/profile');
    	$scope.mobile = contactId
		$scope.lastaddedcontact = $firebaseObject(userDataRef);
    });

    branddetailref.child('admin').on('value', function(snap) {	
    	var mobile = snap.val();
    	var userDataRef =  new Firebase(firebaseUrl+"users/"+mobile+'/profile');
    	$scope.adminmobile = mobile
		$scope.lastaddedadmin = $firebaseObject(userDataRef);
    });

    branddetailref.child('product').on('value', function(snap) {	
    	var productId = snap.val();
    	var userproductRef =  new Firebase(firebaseUrl+"products/products/"+productId);
		$scope.lastaddedproduct = $firebaseObject(userproductRef);
    });

	firebaseServices.totalUsersCount(brand).then(function(result){
		if (result){
			$scope.usersCount = result;
			
		}
	});

	firebaseServices.totalProductsCount(brand).then(function(result){
		if (result){
			$scope.productsCount = result;
			
		}
	});

	firebaseServices.totalAdminsCount(brand).then(function(result){
		if (result){
			$scope.adminsCount = result;
			
		}
	})
	
	/*branduserref.child('users').on('value', function(snap) {	     
	      console.log( snap.numChildren())
	});*/
}


/*function messagesCtrl($scope, $rootScope, $state,$location ,userDataService){
	var brand = userDataService.getbrand();
    var mobile = userDataService.getMobile();
    var name = userDataService.getName();
    $scope.visible = false;
    if(brand){
    	 $scope.visible = true;
    }
}*/

function chatCtrl($scope, $rootScope, $stateParams, $firebaseArray, userDataService) {
	var brand = userDataService.getbrand();
    var mobile = userDataService.getMobile();

    $scope.$on('nameUpdated', function() {	    
	   $scope.username = userDataService.getName();     
    });

    $scope.visible = false
    if(brand){
    	 $scope.visible = true;
    }

	$scope.newMessage = {};
	var ref = new Firebase(firebaseUrl+'/chat');
	
	
	var chatuser = '';
	$scope.login = function(user){
		if(user){
			var message = {
				name: $scope.username,
				text: 'hello ! I am '+$scope.username+'. How can i help you?'
			}
			$scope.newUser = user;		
			chatuser = user
			ref.child(user).push(message);
			var chatuserref = new Firebase(firebaseUrl+'/chat/'+chatuser);
			$scope.messages = $firebaseArray(chatuserref);
		}else{
			$scope.message = "Please enter your name"
		}
	}
	//var messages = $firebaseObject(ref.child('messages')).$asArray();

	$scope.handleKeyup = function handleKeyup(e) {
		var chatuserref = new Firebase(firebaseUrl+'/chat/'+chatuser);
		if(e.keyCode == 13) {
			var text = $scope.newMessage.text;
			var message = {
				name: name,
				text: $scope.newMessage.text
			}
			chatuserref.push(message);
            $('#messageInput').val('');
		}
	}

	$scope.$on('valueupdated', function() {	    
	   $scope.visible = true;	     
    });
}

function autoforwardCtrl($scope, $rootScope, $stateParams, $timeout, $firebaseArray, userDataService) {
	var brand = userDataService.getbrand();
    var mobile = userDataService.getMobile();
    if(mobile){
    	var userDataRef =  new Firebase(firebaseUrl+"users/"+mobile+'/brands');
    	/*$scope.brandsList = $firebaseArray(userDataRef);*/
    	var brandsList = [];
    	userDataRef.on("child_added", function(snapshot) {
    		if(snapshot.val() == 'user'){
    			var brand = snapshot.key()
    			brandsList.push(brand)
    			$timeout(function(){
				  	$scope.$apply(function() {
				  		$scope.brandsList = brandsList;
				  	});
			  	},0,false);
    		}
    	});
    
    }
    $scope.selectedBrandData = [];
    $scope.main ={};
    $scope.error = {};


    $scope.selectBrand = function(brand, ind){
    	var inc = $('#'+brand+'_INC').val();
    	//var RoundUp = $('#'+brand+'_RoundUp').val();
    	var RoundUp =  $('#'+brand+'_RoundUp').find('option:selected').text();
    	/*if(!RoundUp){
    		$scope.error.Inc ='';
    		$scope.error.RoundUp = "Please select RoundUp by for "+brand;
    	}else{
    		$scope.error = '';
    	}*/
    	if(!inc){
    		$scope.error.Inc = "Please select Increase by for "+brand;
    	}else{
    		if(!RoundUp){
    			$scope.error.Inc ='';
	    		$scope.error.RoundUp = "Please select RoundUp by for "+brand;
	    	}
    	}
    	/*var brandL = {
    		'brand':brand,
    		'increase':inc,
    		'roundUp':RoundUp
    	}
    	//console.log(brandL)
    	if(brand && inc && RoundUp){
    		$scope.selectedBrandData.push(brandL);
    	}*/
    }

    $scope.save = function(){
    	var n = $( "input:checked" ).length;
    	console.log(n)
    	var i = 0;
    	$scope.selectedBrandData.length = 0;
    	$('input:checkbox[name=myCheckbox]:checked').each(function() 
		{
			i++;
		  	var brandSelect = $(this).val();
		  	if(brandSelect){
		  		var inc = $('#'+brandSelect+'_INC').val();
		    	var RoundUp =  $('#'+brandSelect+'_RoundUp').find('option:selected').text();
		    	
		    	if(!inc){
		    		$scope.error.Inc = "Please select Increase by for "+brandSelect;
		    	}else{
		    		if(!RoundUp){
		    			$scope.error.Inc ='';
			    		$scope.error.RoundUp = "Please select RoundUp by for "+brandSelect;
			    	}
		    	}
		    	
		    	if(brandSelect && inc && RoundUp){
		    		var brandL = {
			    		'brand':brandSelect,
			    		'increase':inc,
			    		'roundUp':RoundUp
			    	}
		    		$scope.selectedBrandData.push(brandL);
		    	}
		    	if(n == i){
		    		var autoforwardref = new Firebase(firebaseUrl+"brands/"+brand+'/autoForward');
		    		$scope.selectedBrandData.forEach(function(data){ 
		    			console.log(data)
		    			var brandObj = data.brand;
		    			var inc = data.increase;
		    			var roundup = data.roundUp;
		    			autoforwardref.child(brandObj).set({'price':inc, 'rounded':roundup})
		    		});
		    	}
		  	}		 	
		});    	
    }   
}

/**
 *  MainCtrl - controller
 */
function MainCtrl($location ,userDataService) {
	if(localStorage.getItem("email") && localStorage.getItem("brand")){
		userDataService.setbrand(localStorage.getItem("brand"))
		$location.url('#/dashboards/main')
	}else{
		$location.url('#/login')
	}
    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};


function encryptemail(email){
	/*var emailFn = email.replace(".", "{"); 
	return emailFn*/
	if(email){
		var newchar = '__dot__'
		email = email.split('.').join(newchar);
		return email;
	}
}

function decryptemail(email){
	/*var emailFn = email.replace("{", "."); 
	return emailFn*/
	if(email){
		var newchar = '.'
		email = email.split('__dot__').join(newchar);
		return email;
	}
	
}

function addCardsToAdmins(cardkey, brand, mobile, firebaseUrl){
	var adminref = new Firebase(firebaseUrl+"brands/"+brand+'/admins');
	var status = '';
  	adminref.on("child_added", function(snapshot) {
	  	var userMobile = snapshot.key();

	  	if(userMobile == mobile){
	  		status = "edit"
	  	}else{
	  		status = "view"
	  	}
	  	var userRef = new Firebase(firebaseUrl+"users/"+userMobile+"/"+brand+"/cards");	
  		userRef.child(cardkey).set(status);
	});
}

function addCardsTocompanyUsers(cardkey, brand, mobile, firebaseUrl, company){
	console.log(company)
	var companyref = new Firebase(firebaseUrl+"brands/"+brand+"/companyusers/"+encryptemail(company));
	var status = '';
	var prio = 0-Date.now()
	companyref.on("child_added", function(snapshot) {
	  	//console.log(snapshot.key());
	  	//console.log(mobile)
	  	var userMobile = snapshot.key();

	  	if(userMobile == mobile){
	  		status = "edit"
	  	}else{
	  		status = "view"
	  	}
	  	console.log(status)
	  	var userRef = new Firebase(firebaseUrl+"users/"+userMobile+"/"+brand+"/cards");	
  		userRef.child(cardkey).setWithPriority(status, prio);  		
	});
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

/*function checkIfcompanyExists(comp, brand) {
	return $q(function(resolve, reject){
		var company = comp;
		var brandref = new Firebase(firebaseUrl+"brands/"+brand+'/companyusers');

		brandref.child(company).once('value', function(snapshot) {
	      var exists = (snapshot.val() !== null);
	      resolve(exists);
	    });
	
	})

}*/




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
    .controller('uploadproductcategoryCtrl', uploadproductcategoryCtrl)
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
    .controller('addadminCtrl', addadminCtrl)
    .controller('uploaddispatchCtrl', uploaddispatchCtrl)
    .controller('csvconverterCtrl', csvconverterCtrl)
    .controller('chatCtrl', chatCtrl)
    .controller('dashboardCtrl', dashboardCtrl)
    .controller('chartJsCtrl', chartJsCtrl)
    .controller('paymentMethodCtrl', paymentMethodCtrl)
    .controller('autoforwardCtrl', autoforwardCtrl)
    
