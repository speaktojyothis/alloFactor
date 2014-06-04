define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        PageSlider  = require('app/utils/pageslider'),
        DashView    = require('app/views/dashboard'),
        ErrorView   = require('app/views/error'),
        slider      = new PageSlider($('body')),
        error       = new ErrorView(),
        dashview    = new DashView();

    return Backbone.Router.extend({
 
        routes: {
            ""                  :       "DefaultAction",
            "dashboard/:id"     :       "LoadDashboard",
            "error"             :       "Error",
            "logout"            :       "Logout"
        },
        
        DefaultAction: function(){
          this.LoadDashboard();
        },
        
        LoadDashboard: function (id) {
            if( id === sessionStorage.getItem("ClinicId")){
                dashview.delegateEvents();
                slider.slidePage(dashview.$el);
            }
            else {
                directory.Router.navigate("logout",{trigger: true});
            }
        },
        
        Error: function(){
            slider.slidePage(error.$el);
        },
        
        Logout: function(){
            sessionStorage.removeItem("ClinicId");
            Backbone.history.stop();
            window.location="Login.html";
        }
     
    });

});