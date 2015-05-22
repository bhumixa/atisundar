/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
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
        .state('branddetails', {
            abstract: true,
            url: "/branddetails",
            templateUrl: "views/common/content.html",
        })
        .state('branddetails.timeline', {
            url: "/timeline",
            templateUrl: "views/timeline.html",
            data: { pageTitle: 'Timeline' }
        })

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
        });
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