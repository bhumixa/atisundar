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
        .state('dashboards', {
           // abstract: true,
            url: "/dashboards",
            templateUrl: "views/common/content.html",
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
        //productdetail
}
angular
    .module('atisundar')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });