/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
 //global Config variables for the project
var _Circle = function(){
    version = "1.0.0.20150707"
    mode = 'dev'
    fbDevURL="https://ccbeta.firebaseio.com/"
    fbProdURL="https://mobicircles.firebaseio.com/"
}

_Circle.prototype  = {
    getVersion: function(){
        return this.version
    },

    getFBURL: function(){
        console.log("Mode = "+this.mode)
        if (mode == "production"){
            console.log("Returning fbProdURL!")
            return fbProdURL
        }
        console.log("Returning Dev URL...")
        return fbDevURL
    },

    setProdMode: function(){
        this.mode = "production"
    },

    setDevMode: function(){
        this.mode = "dev"
    }
}

var Circle = new _Circle()

function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("dashboards");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('login', {
           // abstract: true,
            url: "/login",
            templateUrl: "views/login.html",
        }) //
        .state('register', {
           // abstract: true,
            url: "/register",
            templateUrl: "views/register.html",
        })
        .state('dashboards', {
           // abstract: true,
            url: "/dashboards",
            templateUrl: "views/common/content.html",
        })
        .state('dashboards.main', {
           // abstract: true,
            url: "/main",
            templateUrl: "views/dashboard.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {

                            serie: true,
                            name: 'angular-flot',
                            files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js', 'js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angular-peity',
                            files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                        }
                    ]);
                }
            }
        })
        .state('timeline', {
            abstract: true,
            url: "/timeline",
            templateUrl: "views/common/content.html",
        })
        .state('timeline.view', {
            url: "/view",
            templateUrl: "views/timeline.html",
            data: { pageTitle: 'Timeline' }
        })
        .state('timeline.post', {
            url: "/post",
            templateUrl: "views/timelinepost.html",
            data: { pageTitle: 'Timeline' }
        })
        /*.state('schedule', {
            abstract: true,
            url: "/schedule",
            templateUrl: "views/common/content.html",
        }) //schedule.message
        .state('schedule.message', {
            url: "/message",
            templateUrl: "views/schedulemessage.html",
            data: { pageTitle: 'Schedule Message' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([                       
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                        }
                    ]);
                }
            }
        })*/
        .state('contacts', {
            abstract: true,
            url: "/contacts",
            templateUrl: "views/common/content.html",
        })
        .state('contacts.List', {
            url: "/list",
            templateUrl: "views/contacts.html",
            data: { pageTitle: 'Contacts' }
        })
        .state('contacts.addcontact', {
            url: "/addcontact",
            templateUrl: "views/addcontact.html",
            data: { pageTitle: 'Add new Contact' }
        }) 
        .state('contacts.editcontact', {
            url: "/editcontact/:contactId",
            templateUrl: "views/editcontact.html",
            data: { pageTitle: 'Add new Contact' }
        }) 
        .state('contacts.uploadcontacts', {
            url:"/uploadcontacts",
            templateUrl: "views/uploadcontacts.html",
            data: { pageTitle: 'upload Contacts' },
            /*resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css','css/plugins/dropzone/dropzone.css','js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            }*/
        })
        .state('products', {
            abstract: true,
            url: "/products",
            templateUrl:  "views/common/content.html",
        })
        .state('products.List', {
            url: "/list",
            templateUrl: "views/products.html",
            data: { pageTitle: 'Products' }
        })
        .state('products.productdetail', {
            url: "/productdetail/:productId",
            templateUrl: "views/productdetail.html",
            data: { pageTitle: 'Products' }
        })
        .state('products.addproduct', {
            url: "/addproduct",
            templateUrl: "views/addproduct.html",
            data: { pageTitle: 'Add new Product' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css','css/plugins/dropzone/dropzone.css','js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            }
        })
        .state('products.uploadproducts', {
            url:"/uploadproducts",
            templateUrl: "views/uploadproducts.html",
            data: { pageTitle: 'upload Products'}
        })
        .state('products.category', {
            url: "/category/:categoryId",
            templateUrl: "views/category.html",
            data: { pageTitle: 'Products' }
        })
        .state('feeds', {
            abstract: true,
            url: "/feeds",
            templateUrl:  "views/common/content.html",
        })
        .state('feeds.feedslist', {
            url:"/feedslist",
            templateUrl: "views/feedslist.html",
            data: { pageTitle: 'Feed List'}
        })
        .state('feeds.addfeed', {
            url:"/addfeed",
            templateUrl: "views/addfeed.html",
            data: { pageTitle: 'Add Feed'}
        })
        .state('feeds.editfeed', {
            url:"/editfeed/:feedId",
            templateUrl: "views/editfeed.html",
            data: { pageTitle: 'Edit Feed'}
        })
        .state('forms', {
            abstract: true,
            url: "/forms",
            templateUrl:  "views/common/content.html",
        })
        .state('forms.formlist', {
            url:"/formlist",
            templateUrl: "views/formlist.html",
            data: { pageTitle: 'Form List'}
        })
        .state('forms.addform', {
            url:"/addform",
            templateUrl: "views/addform.html",
            data: { pageTitle: 'Add Form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                        },
                        {     
                            name: 'datePicker',                       
                            files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                        }
                    ]);
                }
            }
        }) //
        .state('forms.editform', {
            url:"/editform/:formId",
            templateUrl: "views/editform.html",
            data: { pageTitle: 'Edit Form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([                        
                        {     
                            name: 'datePicker',                       
                            files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                        }
                    ]);
                }
            }
        })
        .state('uploads', {
            abstract: true,
            url: "/uploads",
            templateUrl:  "views/common/content.html",
        })
        .state('uploads.dispatch', {
            url:"/dispatch",
            templateUrl: "views/uploaddispatch.html",
            data: { pageTitle: 'Upload Dispatch'}
        }) //
        .state('converter', {
            abstract: true,
            url: "/converters",
            templateUrl:  "views/common/content.html",
        })
        .state('converter.csv', {
            url:"/csv",
            templateUrl: "views/csv.html",
            data: { pageTitle: 'Upload CSV '}
        })
        .state('settings', {
            abstract: true,
            url: "/settings",
            templateUrl:  "views/common/content.html",
        })
        .state('settings.paymentmethods', {
            url:"/paymentmethods",
            templateUrl: "views/paymentmethods.html",
            data: { pageTitle: 'Payment Methods'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        })  //  
        .state('settings.autoforward', {
            url:"/autoforward",
            templateUrl: "views/autoforward.html",
            data: { pageTitle: 'Auto forward'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        })     
        .state('settings.homepage', {
            url:"/homepage",
            templateUrl: "views/homepage.html",
            data: { pageTitle: 'Home Page'}
        })
        .state('settings.backgroundimage', {
            url:"/background",
            templateUrl: "views/backgroundimage.html",
            data: { pageTitle: 'Background'}
        }) 
        .state('settings.adminlist', {
            url:"/adminlist",
            templateUrl: "views/adminlist.html",
            data: { pageTitle: 'Admin List'}
        })
        .state('settings.addadmin', {
            url:"/addadmin",
            templateUrl: "views/addadmin.html",
            data: { pageTitle: 'Add Admin'}
        })
}
angular
    .module('atisundar')
    .config(config)
    /*.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])*/
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });