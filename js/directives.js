

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'Atisundar | Welcome';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Atisundar | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
                // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function(scope, element, attrs) {
        element.dropzone({
            url: "/home/bhavin/Desktop/atisundarAdmin/js/upload",
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function() {
                scope.files.push({file: 'added'});
                this.on('success', function(file, json) {
                    console.log(file)
                });
                this.on('addedfile', function(file) {
                    scope.$apply(function(){ 
                    console.log(file.name)                      ;
                   
                       // scope.files.push({file: 'added'});
                        //var tmppath = URL.createObjectURL(event.target.file);
                       // console.log(tmppath)
                        /*var mockFile = {
                          name: file.name,
                          size: file.size,
                          type: 'image/jpeg',
                        };
                        console.log(mockFile)*/
                    });
                });
                this.on('drop', function(file) {
                    alert('file');
                });
            }
        });
    }
}

function fileChange($parse) {
    return{
        require:'ngModel',
        restrict:'A',
        link:function($scope,element,attrs,ngModel){
          var attrHandler=$parse(attrs['fileChange']);
          var handler=function(e){
            $scope.$apply(function(){
              attrHandler($scope,{$event:e,files:e.target.files});
            });
          };
          element[0].addEventListener('change',handler,false);
        }
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {

                // You can call a $http method here
                // Or create custom validation

                var validText = "Inspinia";

                if(scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

function getimageUrl($firebaseArray){
    return {
        link: function(scope, element, attrs){ 
        var id  =  attrs.myAttr  
        var atrStr = '';
        var allproductsRef = new Firebase("https://educe.firebaseio.com//products/products/"+id)
        var i = $firebaseArray(allproductsRef);
        i.$loaded(function (list) {            
            var image = list.$getRecord('cimages');
            element.removeAttr('my-attr');                  
            element.attr('src', 'http://res.cloudinary.com/atisundar/image/upload/g_face,w_100,h_150,c_fill/'+image); 
            element.attr('class',"img-responsive")
        });
       // element.removeAttr('my-attr');                  
       // element.attr('href', i); 
        /*var image = i.get('cimages');
        //console.log(i)
        //var image = i.get("cimages");
        console.log(image)*/
       
           /* allproductsRef.orderByValue().on("value", function(snapshot) {
                //var value = snapshot.val().products;
                //console.log();
                //var vals = snapshot.val();
                var imageName = snapshot.val().cimages
                console.log(imageName +'uoiui')
                element.removeAttr('my-attr');                  
                element.attr('href', imageName); 
            })*/                 
        }
    };
}

function dccard($firebase, $timeout, $firebaseArray){
    var directive = {};
    directive.restrict='E';
    directive.scope = {
        id: '@',
        view: '@'
    };

    directive.controller = function($scope,$state,$firebase, $firebaseArray){
        $scope.comments =[];
        $scope.liked = false
        console.log("In dc card controller...."+$scope.id)

        var userLike = new Firebase("https://educe.firebaseio.com/cards/"+$scope.id+"/likers")
        var likeEffect = 0
        userLike.once("value",function(ss){
            if (ss.val()){
                //user already likes it
                console.log("likes  "+$scope.id)
                $scope.liked = true
            }else{
                console.log("Does not like : "+$scope.id)
            }
        })

        

        $scope.addComments = function(){
            $("#comArea_"+$scope.id).removeClass( "noselected" ).addClass( "selected" );
        }

        $scope.submitComment = function(cardid, comment){
            var addCommentref = new Firebase("https://educe.firebaseio.com/cardComments/"+$scope.id)
            var ctime = new Date().getTime()
            var cardData = {
                name:'admin',
                created: ctime,
                comment:comment
            }
            addCommentref.push(cardData);
            var upvotesRef = new Firebase("http://educe.firebaseio.com/cards/"+$scope.id+"/commentCount");
            upvotesRef.transaction(function (current_value) {
                console.log(" Card "+$scope.id + " comment count " +current_value)
                $("#txt_"+$scope.id).val('');
                $("#comArea_"+$scope.id).removeClass( "selected" ).addClass( "noselected" );
                return (current_value || 0) + 1;

            });
        }

        $scope.showComments = function(){
            var userComments = new Firebase("https://educe.firebaseio.com/cardComments/"+$scope.id)
             $scope.comments = $firebaseArray(userComments);
           /* userComments.on("child_added",function(data){
                //console.log(data.val())
                removeCommentFromScope(data.key(), $scope)
                addCommentToScope(data.key(), data.val(), $scope)

            })*/
            
            
        }

        $scope.showCommentsIcon = function(){
            if ($scope.view == "detail"){
                return false
            }
            return true
        }

        $scope.showCommentCount = function(){
            if ($scope.card.commentCount && $scope.card.commentCount > 0){
                return true
            }
            return false
        }

        $scope.showLikeCount = function(){
            if ($scope.card.likes && $scope.card.likes > 0){
                return true
            }
            return false
        }

        $scope.showCard = function(){
            console.log("========> Show CARD ===> Sending to card view = "+$scope.card.type)
            /*if ($scope.card.type == "Image"){
                $state.go("main.tabs.home.product",{product:$scope.card.productid, tab:'home'})
            }

            if ($scope.card.type == "Announcement"){
                $state.go("main.tabs.home.cardDetail",{card:$scope.id})
            }

            if ($scope.card.type == "AnnouncementImage"){
                $state.go("main.tabs.home.cardDetail",{card:$scope.id})
            }

            if ($scope.card.type == "Order"){
                $state.go("main.tabs.home.cardDetail",{card:$scope.id})
            }


            if ($scope.card.type == "Form"){
                $state.go("main.tabs.home.form",{form: $scope.card.name, card:$scope.id})
            }*/
        }

        $scope.likeCard = function() {
            var userLike = new Firebase("https://educe.firebaseio.com/cards/"+$scope.id+"/likers")
            var likeEffect = 0
            userLike.once("value",function(ss) {
                if (ss.val()) {
                    console.log("LIKE CARD In directive")
                    //check if user likes card already
                    //user already likes it
                    userLike.remove()
                    likeEffect = -1
                } else {
                    userLike.set("1")
                    likeEffect = 1
                }

                var upvotesRef = new Firebase("https://educe.firebaseio.com/cards/"+$scope.id+"/likes");
                upvotesRef.transaction(function (current_value) {
                    console.log(" Card "+$scope.id + " like count "+likeEffect)
                    if (likeEffect == 1){
                        $scope.liked = true
                    }else{
                        $scope.liked = false
                    }
                    return (current_value || 0) + likeEffect;

                });
            })
        }
    }

    directive.link=function($scope, element, attrs,controller){

        $scope.getContentURL = function(){
            var u = './views/tab-home-card.html'
            //console.log("Scope card = "+$scope.card.type)
            if ($scope.card){
               if ($scope.card.type){
                   //console.log("Card Type = "+$scope.card.type)
                   u = './views/tab-home-card-'+$scope.card.type+'.html'
                   //console.log("Card Template for id = "+$scope.id + "  = "+u)
               }
            }

            $scope.height=300
            $scope.width=200

            return u
        }



        console.log("in dc card link");
        console.log("...Got id as "+$scope.id);

        var ref = new Firebase("https://educe.firebaseio.com/cards/"+$scope.id)
        ref.on("value",function(snapshot){
            console.log( "XXXXXXXXXXXXXXCard: "+ snapshot.val() + " " + snapshot.key())
            var card = snapshot.val();

            $timeout(function(){
                $scope.$apply(function() {
                    $scope.card = card

                    var relTime = moment(card.created).fromNow()
                    $scope.duration=""
                    $scope.relTime = relTime
                    if (relTime.indexOf("ago") != -1){
                        var tp = relTime.split(" ")
                        $scope.duration = tp[0]
                        tp.splice(0,1)
                        //FIX for other relative time formats like a few seconds ago, now
                        var translatable = tp.join(" ")
                    }
                    $scope.relTime = translatable
                    console.log("Card author = " + $scope.card.author)
                    //console.log(card)
                        //element.html("<pre>"+card.author+"</pre>")
                    })  },0,false);

        })
    };

    directive.template  = '<div ng-include="getContentURL()"></div>'

    return directive  
}

function onFinishRender($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
}



function ngEnter() {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
}
/*function getUrl($scope, $rootScope, $firebaseArray){
    var allproductsRef = new Firebase("https://educe.firebaseio.com//products/products")
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
}*/
/*
report.directive('resetLink', function($parse, $log ) {
  return {
    link: function(scope, element, attrs){            
      var atrStr = '';
      var companyId = scope.$eval('companyid');          
      var currentDate = scope.$eval('currentDate');         
      var nextPeriod = scope.$eval('nextPeriod'); 
      if(companyId){
        atrStr = attrs.myAttr.replace('companyid', companyId);
      }          
      if(currentDate){
        atrStr = atrStr.replace('currentDate', currentDate);
      }
      if(nextPeriod){
        atrStr = atrStr.replace('nextPeriod', nextPeriod);
      }
      element.removeAttr('my-attr');                  
      element.attr('href', atrStr);        
    }
  };
});*/

/**
 *
 * Pass all functions into module
 */
angular
    .module('atisundar')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('fileChange', fileChange)
    .directive('getimageUrl', getimageUrl)
    .directive('dccard',dccard)
    .directive('onFinishRender', onFinishRender)
   // .directive('cardcomments', cardcomments)
    .directive('ngEnter', ngEnter)
    
