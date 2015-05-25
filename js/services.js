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

angular
    .module('atisundar')
    .factory('userDataService', userDataService)