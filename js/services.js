var firebaseUrl = "https://educe.firebaseio.com/";

function userDataService($http, $rootScope){
	var brand = '';
	var mobile = '';
	var name = '';
	/*return function(value) {
		brand = value;
		alert(brand)
	}*/

	return {
		setbrand:function(value) {
			brand = value;
          	$rootScope.$broadcast('valueupdated');
		},
		getbrand:function() {
			return brand;
		},
		setMobile:function(value) {
			mobile = value;
			$rootScope.$broadcast('mobileUpdated');
		},
		getMobile:function() {
			return mobile;
		},
		setName : function(value){			
			name = value
			$rootScope.$broadcast('nameUpdated');
		},
		getName : function(){
			return name 
		}
	}
}

function firebaseServices($q, $firebaseArray){
	var checkIfcompanyExists = function(comp, brand) {
		return $q(function(resolve, reject){
			var company = encryptemail(comp);
			console.log(company)
			var brandref = new Firebase(firebaseUrl+"brands/"+brand+'/companyusers');

			brandref.child(company).once('value', function(snapshot) {
		      var exists = (snapshot.val() !== null);
		      console.log(exists)
		      resolve(exists);
		    });							
		})
	}

	var fetchContactData = function(contactId, brand) {
		return $q(function(resolve, reject){			
			var branduserref = new Firebase(firebaseUrl+"users/"+contactId+'/'+brand);
			branduserref.once("value",function(snapshot){
		      var address = snapshot.val().address;
		      var company = decryptemail(snapshot.val().company);
		      var image = snapshot.val().image;
		      var name = snapshot.val().name;
		      var email = snapshot.val().email;

		      var data = {
		      	'address':address,
		      	'company':company,
		      	'image':image,
		      	'name':name,
		      	'email':email
		      };
		      resolve(data);
		    });					
		})
	}

	var totalUsersCount = function(brand){
		var branduserref = new Firebase(firebaseUrl+"brands/"+brand);	
		return $q(function(resolve, reject){
			branduserref.child('users').on('value', function(snap) {	     
			      console.log( snap.numChildren())
			      var count = snap.numChildren()
			      resolve(count);
			});

		});
	}

	var totalProductsCount = function(brand){
		var branduserref = new Firebase(firebaseUrl+"brands/"+brand);	
		return $q(function(resolve, reject){
			branduserref.child('products').on('value', function(snap) {	     
			      console.log( snap.numChildren())
			      var count = snap.numChildren()
			      resolve(count);
			});

		});
	}

	var fetchUserData = function(brand, contactId){
		var userDataRef =  new Firebase(firebaseUrl+"users/"+contactId);
		return $q(function(resolve, reject){
			userDataRef.child(brand).on('value', function(Snapshot) {
			            //var data = JSON.stringify(Snapshot.val());
	            if(Snapshot.val()){
	            	var data = Snapshot.val();
	            	var userName = data.name;
	            	var addedOn = data.created;	
	            	resolve(addedOn)	            	
	            	/**/
	            }
	            
	        });
	    });
	}

	var lastAddedContactDetails = function(brand, count){
		console.log(count +'-count')
		var lastUpdated = 0;
		var id = '';
		var userName = ''
		var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/users');
		var n = 0;
		//var dataArray = $firebaseArray(branduserref);
		return $q(function(resolve, reject){
			branduserref.on("child_added",function(snap){
				n++;
			    var contactId = snap.key();
			    
			    fetchUserData(brand, contactId).then(function(addedOn){
			    	if(addedOn){
	            		if(addedOn > lastUpdated){
		            		lastUpdated = addedOn
		            		id = contactId;
		            	}	
		            	if(n == count){
		            		console.log('end --'+lastUpdated)
		            		resolve(id)
		            	}			            	
	            	}
			    });
			    /*
				*/
            	
	            //console.log(lastUpdated)
			});
		});
	}

	var fetchProductData = function(brand, productId){
		var userDataRef =  new Firebase(firebaseUrl+"products/products");
		return $q(function(resolve, reject){
			userDataRef.child(productId).on('value', function(Snapshot) {
				
	            if(Snapshot.val()){
	            	var data = Snapshot.val();	
	            	console.log(data)            	
	            	var addedOn = data.created;	
	            	resolve(addedOn)
	            }
	            
	        });
	    });
	}

	var lastAddedProductDetails = function(brand, count){
		console.log(count +'-count')
		var lastUpdated = 0;
		var id = '';
		var userName = ''
		var branduserref = new Firebase(firebaseUrl+"brands/"+brand+'/products');
		var n = 0;
		//var dataArray = $firebaseArray(branduserref);
		return $q(function(resolve, reject){
			branduserref.on("child_added",function(snap){
				n++;
			    var productId = snap.key();
			   // console.log(productId)
			    
			   //console.log(n +'---')
			    //var usersData = {}
			   // fetchUserData()
			    fetchProductData(brand, productId).then(function(addedOn){
			    	if(addedOn){
	            		if(addedOn > lastUpdated){
		            		lastUpdated = addedOn
		            		id = productId;
		            	}	
		            	if(n == count){
		            		console.log('productId --'+lastUpdated)
		            		resolve(id)
		            	}			            	
	            	}
			    });
			    /*
				*/
            	
	            console.log(lastUpdated)
			});
		});
	}
	
	return{
		checkIfcompanyExists:checkIfcompanyExists,
		fetchContactData:fetchContactData,
		totalUsersCount:totalUsersCount,
		totalProductsCount:totalProductsCount,
		lastAddedContactDetails:lastAddedContactDetails,
		lastAddedProductDetails:lastAddedProductDetails
	}

}

angular
    .module('atisundar')
    .service('userDataService', userDataService)
    .factory('firebaseServices', firebaseServices)