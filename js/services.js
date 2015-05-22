function userDataService(){
	var brand = '';
	var mobile = '';
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
	}
}

angular
    .module('atisundar')
    .factory('userDataService', userDataService)