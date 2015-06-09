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
			      //console.log( snap.numChildren())
			      var count = snap.numChildren()
			      resolve(count);
			});

		});
	}

	var totalProductsCount = function(brand){
		var branduserref = new Firebase(firebaseUrl+"brands/"+brand);	
		return $q(function(resolve, reject){
			branduserref.child('products').on('value', function(snap) {	     
		      	//console.log( snap.numChildren())
		      	var count = snap.numChildren()
		      	resolve(count);
			});
		});
	}

	var totalAdminsCount = function(brand){
		var branduserref = new Firebase(firebaseUrl+"brands/"+brand);	
		return $q(function(resolve, reject){
			branduserref.child('admins').on('value', function(snap) {	     
		      	//console.log( snap.numChildren())
		      	var count = snap.numChildren()
		      	resolve(count);
			});
		});
	}

	/*var fetchUserData = function(brand, contactId){
		var userDataRef =  new Firebase(firebaseUrl+"users/"+contactId);
		return $q(function(resolve, reject){
			userDataRef.child(brand).on('value', function(Snapshot) {
	            if(Snapshot.val()){
	            	var data = Snapshot.val();
	            	var userName = data.name;
	            	var addedOn = data.created;	
	            	resolve(addedOn)
	            }	            
	        });
	    });
	}*/

	

	
	return{
		checkIfcompanyExists:checkIfcompanyExists,
		fetchContactData:fetchContactData,
		totalUsersCount:totalUsersCount,
		totalProductsCount:totalProductsCount,
		totalAdminsCount:totalAdminsCount,
		/*lastAddedContactDetails:lastAddedContactDetails,
		lastAddedProductDetails:lastAddedProductDetails,
		lastAddedAdminsDetails:lastAddedAdminsDetails		*/
	}
}

angular
    .module('atisundar')
    .service('userDataService', userDataService)
    .factory('firebaseServices', firebaseServices)