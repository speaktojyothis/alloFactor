/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require.config({

    baseUrl: 'js/lib',

    paths: {
        //-------------------------------------------
        jquery      :   'jquery/jquery-2.0.3.min',
        underscore  :   'underscore/underscore-min',
        bootstrap   :   'bootstrap/bootstrap.min',
        validator   :   'bootstrap/bootstrapValidator.min',
        backbone    :   'backbone/backbone-min',
        //--------------------------------------------
        app         :   '../appMain',
        tpl         :   '../../templates'
    },
    shim: {
        'underscore': {
            deps: [ 'jquery'],
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'backbone': {
            deps: [ 'jquery','underscore'],
            exports: 'Backbone'
        },
        'validator': {
          deps: ['bootstrap','underscore','jquery'],
          exports: 'validator'
        }
    }
});
var rootUrl = 'http://ec2-54-226-164-48.compute-1.amazonaws.com:8080/aF_Root/webresources/restservices';
//var rootUrl = 'http://192.168.10.17:8080/alloFactorV3/webresources/restservices';

require(['jquery','app/views/loginview', 'app/utils/pageslider'], function ($,LoginView,Slider) {
    var _login = new LoginView();
    var slider = new Slider($('body'));
    slider.slidePage(_login.$el);
    $('body').addClass('login-layout');
});

