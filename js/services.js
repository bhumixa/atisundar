var firebaseUrl = "https://ccbeta.firebaseio.com/";

var clientWrite = new Keen({
  projectId: "55430ee796773d5aa89d86a4",
  writeKey: "11ad817b8e08ae848ad5a2c369fdf447db946153bb829e0b1b6c685b076a20519389f5dc36a8978bdc5e5c564cea3e14ef9b4a1ab16fe5d70f354181743881eaf816501f094bd43bee12e7eb63e29fe3183c8446f824a46eb2cb25a236aff85a4cd2213693f4d85d05dc7734e1088e06"
});

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

function keenServices(){
	var uploadDispatchdataToKeen = function(data){
		/*clientWrite.addEvent("dispatch", data, function(err, res){
	      if (err) {
	        console.log(err);
	      }
	      else {
	        console.log('submitted');
	      }
	    });*/
		data.forEach(function(items){ 			
			clientWrite.addEvent("dispatch", items, function(err, res){
		      if (err) {
		        console.log(err);
		      }
		      else {
		        console.log('submitted');
		      }
		    });
		});
		
	}

	return {
		uploadDispatchdataToKeen:uploadDispatchdataToKeen
	}
}

function firebaseServices($q, $firebaseArray){
	var checkIfcompanyExists = function(comp, brand) {
		return $q(function(resolve, reject){
			var company = encryptemail(comp);
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
		      console.log(data)
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
    .factory('keenServices', keenServices)