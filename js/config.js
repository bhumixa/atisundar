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
            data: { pageTitle: 'Add Form'}
        }) //
        .state('forms.editform', {
            url:"/editform/:formId",
            templateUrl: "views/editform.html",
            data: { pageTitle: 'Edit Form'}
        })
        .state('settings', {
            abstract: true,
            url: "/settings",
            templateUrl:  "views/common/content.html",
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