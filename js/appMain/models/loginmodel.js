define(function(require){
    
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
   
        Authentication = Backbone.Model.extend({
            urlRoot: rootUrl
        });
        
    return {
        Authentication: Authentication
    };
});