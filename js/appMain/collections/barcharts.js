/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(function(require){
   
    var $               =   require('jquery'),
        Backbone        =   require('backbone'),
        BarchartsData   =   Backbone.Collection.extend({
           initialize: function(apndUrl){
                this.url = directory.rootUrl + "/" + apndUrl;
            }
        });
    return  {
        BarchartsData: BarchartsData
    };
});


