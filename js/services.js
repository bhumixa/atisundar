var firebaseUrl = "https://educe.firebaseio.com/";

function userDataService(){
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
		},
		getbrand:function() {
			return brand;
		},
		setMobile:function(value) {
			mobile = value;
		},
		getMobile:function() {
			return mobile;
		},
		setName : function(value){
			name = value
		},
		getName : function(){
			return name 
		}
	}
}

function firebaseServices($q){
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
				//console.log(snapshot.val())
		      var address = snapshot.val().address;
		      var company = decryptemail(snapshot.val().company);
		     // console.log(company)
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
		      //console.log(email)
		      //console.log(address)
		    });					
		})
	}
	
	return{
		checkIfcompanyExists:checkIfcompanyExists,
		fetchContactData:fetchContactData
	}

}

angular
    .module('atisundar')
    .factory('userDataService', userDataService)
    .factory('firebaseServices', firebaseServices)