require.config({

    baseUrl: 'js/lib',

    paths: {
        //-------------------------------------------
        jquery      :   'jquery/jquery-2.0.3.min',
        underscore  :   'underscore/underscore-min',
        bootstrap   :   'bootstrap/bootstrap.min',
        backbone    :   'backbone/backbone-min',
        hCharts     :   'highcharts/highcharts',
        hChartsMore :   'highcharts/highcharts-more',
        exportChart :   'highcharts/exporting',
        gauge       :   'highcharts/solid-gauge.src',
        ace         :   'ace/ace.min',
        ace_elem    :   'ace/ace-elements.min',
        spin        :   'others/spin.min',
        //--------------------------------------------
        app         :   '../appMain',
        tpl         :   '../../templates',
        cssFldr     :   '../../styles/css'
    },
    waitSeconds: 30,
    shim: {
        'underscore': {
            deps: [ 'jquery'],
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'hCharts': {
            deps: ['jquery'],
            exports: 'HighCharts'
        },
        'ace': {
            deps: ['bootstrap','jquery'],
            exports: 'ace'
        },
        'spin': {
            deps: ['ace','jquery']
        },
        'ace_elem': {
            deps: ['ace','bootstrap','jquery']
        },
        'backbone': {
            deps: [ 'jquery','underscore'],
            exports: 'Backbone'
        },
        'hChartsMore': {
            deps: ['hCharts','jquery'],
            exports: 'ChartsMore'
        },
        'gauge': {
            deps: ['hCharts','hChartsMore','jquery'],
            exports: 'Gauge'
        },
        'exportChart': {
            deps: ['gauge','jquery'],
            exports: 'ExportThumb'
        }
    }
});

var directory = {
    views: {},
    models: {},
    collections: {},
    //rootUrl:'http://192.168.10.17:8080/alloFactorV3/webresources/restservices'
    rootUrl : 'http://ec2-54-226-164-48.compute-1.amazonaws.com:8080/aF_Root/webresources/restservices'
};

require(['plugins/domReady'],function(domReady){
    domReady(function(){
        require(['jquery', 'backbone', 'app/utils/router'], function ($,Backbone,Router) {
            directory.Router = new Router();
            Backbone.history.start();
        });
    });
});
