define(function(require){
    
    "use strict";
    
    var $                   = require('jquery'),
        _                   = require('underscore'),
        boot                = require('bootstrap'),
        validat             = require('validator'),
        Backbone            = require('backbone'),
        LoginService        = require('app/models/loginmodel'),
        tpl                 = require('text!tpl/LoginView.html'),
        template            = _.template(tpl),
        
        $self;

    
    return Backbone.View.extend({
        
        initialize: function(){
            $self=this;
            this.loginmodel = new LoginService.Authentication({id:'userlogin'});
            this.render();
            this.Validation();
        },
        
        render: function(){
            this.$el.html(template());
            return this;
        },
    
        events: {
          "submit"  : "DoLogin"
        },

        Validation: function(){
            $('#frmLogin',this.el).bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'icon-ok-sign',
                    invalid: 'icon-remove-sign',
                    validating: 'icon-ok-sign'
                },
                fields: {
                    UserName: {
                        message: '<b>The username is not valid',
                        validators: {
                            notEmpty: {
                                message: '<b>The username is required and cannot be empty'
                            },
//                            stringLength: {
//                                min: 2,
//                                max: 6,
//                                message: '<b>The username must be more than 2 and less than 6 characters long'
//                            },
                            regexp: {
                                regexp: /^[a-zA-Z0-9_]+$/,
                                message: '<b>The username can only consist of alphabetical, number and underscore'
                            }
                        }
                    },
                    Password: {
                        message: '<b>The password is not valid',
                        validators: {
                            notEmpty: {
                                message: '<b>The password is required and cannot be empty'
                            }
                        }
                    }
                },
                success: {

                },
                submitHandler : this.LoginService
            });			
        },

        DoLogin: function(e){
            e.preventDefault();
        },
        
        LoginService: function(){
            var input={
                        sUserName: $("#txtUName").val(), 
                        sPassword: $("#txtPwd").val(),
                        iClinicId:0,
                        sLoginTime:'',
                        btSoftwareType:2,
                        sIphoneVersion:0
                    };
            $self.loginmodel.fetch({
                data: JSON.stringify(input),
                type:"POST",
                contentType: 'application/json',
                dataType:"json",
                cache: false,
                success: function (data) {
                    $self.NavigateHomePage({model: data});
                },
                error: function(jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        alert('Not connect.\n Verify Network.');
                    } else if (jqXHR.status === 404) {
                        alert('Requested page not found. [404]');
                    } else if (jqXHR.status === 500) {
                        alert('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        alert('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        alert('Time out error.');
                    } else if (exception === 'abort') {
                        alert('Ajax request aborted.');
                    } else {
                        if ($('#tempalert').length===0){
                            $( ".logfrm" ).append( "<div id='tempalert' class='alert alert-danger'>Network error !</div>" );
                        }
                        else {
                            $('#tempalert').remove();
                            $( ".logfrm" ).append( "<div id='tempalert' class='alert alert-danger'>Network error !</div>" );
                        }
                    }
                }
            });
        },

        NavigateHomePage: function(modelData){
            var data = modelData.model;
            if(data !== ''){
                data=data.get("0");
                if(data.iserror==='true'){
                    if ($('#tempalert').length===0){
                        $( ".logfrm" ).append( "<div id='tempalert' class='alert alert-danger'>Invalid Credentials</div>" );
                    }
                    else {
                        $('#tempalert').remove();
                        $( ".logfrm" ).append( "<div id='tempalert' class='alert alert-danger'>Invalid Credentials</div>" );
                    }
                }
                else{
                    if(data.clinicid !== "0"){
                        sessionStorage.setItem("SessionId",data.sessionid);
                        sessionStorage.setItem("ClinicId",data.clinicid);
                        sessionStorage.setItem("ClinicName",data.clinicname);
                        window.location="index.html#dashboard/"+data.clinicid;
                    }
                    else{
                        $("#error").html("You are provided a wrong username or password !");
                    }
                }
                
            }
        }
        
    });
});
