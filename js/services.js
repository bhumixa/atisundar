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
			var company = comp;
			var brandref = new Firebase(firebaseUrl+"brands/"+brand+'/companyusers');

			brandref.child(company).once('value', function(snapshot) {
		      var exists = (snapshot.val() !== null);
		      resolve(exists);
		    });							
		})
	}
	
	return{
		checkIfcompanyExists:checkIfcompanyExists
	}

}

angular
    .module('atisundar')
    .factory('userDataService', userDataService)
    .factory('firebaseServices', firebaseServices)