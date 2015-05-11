var DataListRef = new Firebase('https://educe.firebaseio.com//brands//atisundar');

/**
 *  loginCtrl - controller
 */

 function loginCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.formData = {};
    // After login submit
    $scope.loginForm = function() {
    	if($scope.formData.email && $scope.formData.password){
    		alert('msg')
    		var ref = new Firebase("https://educe.firebaseio.com/");
    		var authClient = new FirebaseAuthClient(ref, function(error, user) {
			  if (error) {
			    alert(error);
			    return;
			  }
			  if (user) {
			    // User is already logged in.
			    doLogin(user);
			  } else {
			  	alert('not')
			  }
			});
    	}        
    };

}

/*addcontactCtrl*/
function addcontactCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.formData = {};
    // After login submit
    
    $scope.submitForm = function() {
    	if($scope.formData.name && $scope.formData.lastName){
    		alert('msg')
    		
    	}        
    };

}


/*uploadcontactsCtrl*/
function uploadcontactsCtrl($scope, $rootScope) {
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

/*productCtrl*/
function productCtrl($scope, $rootScope, $firebaseArray) {

	var brandref = new Firebase("https://educe.firebaseio.com//brands/atisundar/products")
	$scope.productList = $firebaseArray(brandref);
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
function productdetailCtrl($scope, $rootScope, $stateParams) {
	$scope.productId = $stateParams.productId;
}


/**
 *  MainCtrl - controller
 */
function MainCtrl() {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};


angular
    .module('atisundar')
    .controller('MainCtrl', MainCtrl)
    .controller('loginCtrl', loginCtrl)
    .controller('addcontactCtrl', addcontactCtrl)
    .controller('uploadcontactsCtrl', uploadcontactsCtrl)
    .controller('productCtrl', productCtrl)
    .controller('productdetailCtrl', productdetailCtrl)