/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(function(require){
    "use strict";
    var $           =   require('jquery'),
        _           =   require('underscore'),
        Backbone    =   require('backbone'),
        tpl         =   require('text!tpl/ErrorView.html'),
        template    =   _.template(tpl);
        
    return Backbone.View.extend({
       initialize: function(){
           this.render();
       },
       render: function(){
           this.$el.html(template());
       }
    });
});
