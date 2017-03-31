'use strict';

/**
 * @ngdoc overview
 * @name jsClientApp
 * @description
 * # jsClientApp
 *
 * Main module of the application.
 */
angular
  .module('jsClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload'
  ])
  .constant('CONFIG', {
    'SERVICE_BASE': 'http://localhost:8080/rs/',
    'FORMAT_DATE_YYYY_MM_DD_HH_MM_SS': 'yyyy-MM-dd HH:mm:ss'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/configure.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
