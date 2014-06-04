define(
        ['jquery',
        'underscore',
        'backbone',
        'app/models/dashboardmodel',
        'text!tpl/DashboardView.html',
        'ace',
        'bootstrap',
        'hCharts',
        'gauge',
        'exportChart',
        'spin',
        'ace_elem'
        ],
    function($, _, Backbone, models, tpl,ace){
   
    "use strict";
    
    var template      = _.template(tpl),
        $self;    
        
    return Backbone.View.extend({
                      
        initialize: function () {
            $self=this;
            this.render();
        },

        render: function () {
            this.$el.html(template());
            this.BindingClassesAndFunctions();
            //this.listView = new EmployeeListView({collection: this.employeeList, el: $(".scroller", this.el)});
            this.LoadCharts();
            return this;
        },
        
        events: {
            //"click #btn-scroll-up": "Action"
        },
        
        BindingClassesAndFunctions: function(){
            this.$('.graphContainer').addClass('graphLoading').html('<i class="ace-icon fa fa-spinner fa-spin orange bigger-180"></i>Loading.....');
            this.$('#clinicName').attr('title',sessionStorage.getItem("ClinicName"));
            this.$('[data-rel=tooltip]').tooltip();
            this.Scrollup();
        },
        
        Scrollup: function(){
            var t = this.$(".btn-scroll-up");
            if (t.length > 0) {
                var s = !1;
                $(window).on("scroll.scroll_btn", function () {
                    ace.helper.scrollTop() > parseInt(ace.helper.winHeight() / 4) ? s || (t.addClass("display"), s = !0) : s && (t.removeClass("display"), s = !1);
                }).triggerHandler("scroll.scroll_btn"), t.on(ace.click_event, function () {
                    var a = Math.min(500, Math.max(100, parseInt(ace.helper.scrollTop() / 3)));
                    return $("html,body").animate({
                        scrollTop: 0
                    }, a), !1;
                });
            }
        },
            
        LoadCharts: function(){
            this.loadGauage('getProductvityClaims','#claimsContainer','Claims','No of Claims','1','#');
            this.loadGauage('getProductvityBilled','#billedContainer','Billed $','Billed Amount','2','$');
            this.loadGauage('getProductvityCollection','#collectionContainer','Collection $','Collection Amount','3','$');
            this.loadTrendLine1('getTrendLineBilled','#billedTrend','TrendLine','Billed Amount','$');
            this.loadTrendLine1('getTrendLineCollection','#collectionTrend','TrendLine','Collection','$');
            this.loadTrendLine2('getTrendLineCollectionForeCast','#collectionForcastTrend','TrendLine','Forecast','$','1');
            this.loadTrendLine2('getNotFieldClaims','#notFiledTrend','TrendLine','Not Filed Claims','Nos','2');
            this.loadTrendLine3('getARGross','#ARgrossTrend','Receivable - Gross','A/R - Gross','$');
            this.loadTrendLine3('getARNet','#ARnetTrend','Receivable - Net','A/R - Net','$');
        },
            
        loadGauage: function(restServiceName,element,text,title,gaugeNum,unit){
            this.productivityclaim = new models.DashboardData({id:restServiceName});
            this.productivityclaim.fetch({data:{sSessionId: sessionStorage.getItem("SessionId"),iClinicId: sessionStorage.getItem("ClinicId")},type:"POST",cache: false,
                success: function (data) {
                    var dataarray;
                    var minValue, maxValue, belowAvg, aboveAvg;
                    if(data.get('errors') === null){
                        $self.$(element).removeClass('graphLoading');
                        if(gaugeNum==='1'){
                            if(data.get('productvityClaims') !== null){
                                dataarray = [data.get('productvityClaims').iNoOfClaims];
                                minValue = data.get('productvityClaims').iMinValue;
                                maxValue = data.get('productvityClaims').iMaxValue;
                                belowAvg = data.get('productvityClaims').iBelowAvgClaims;
                                aboveAvg = data.get('productvityClaims').iAboveAvgClaims;
                                $self.drawGaugeGragh(element,dataarray,minValue,maxValue,belowAvg,aboveAvg,text,title,unit);
                            }
                            else{
                                $self.$el.append('<h6 class="red smaller">No data Found</h6> '); 
                            }
                        }
                        else if(gaugeNum==='2'){
                            if(data.get('productvityBilled') !== null){
                                dataarray = [data.get('productvityBilled').lBlledAmount];
                                minValue = data.get('productvityBilled').lMinValue;
                                maxValue = data.get('productvityBilled').lMaxValue;
                                belowAvg = data.get('productvityBilled').lBelowAvgBilled;
                                aboveAvg = data.get('productvityBilled').lAboveAvgBilled;
                                $self.drawGaugeGragh(element,dataarray,minValue,maxValue,belowAvg,aboveAvg,text,title,unit);
                            }
                            else{
                                $self.$(element).append('<h6 class="red smaller">No data Found</h6> '); 
                            }
                        }
                        else if(gaugeNum==='3'){
                            if(data.get('productvityCollection') !== null){
                                dataarray = [data.get('productvityCollection').lCollectionAmount];
                                minValue = data.get('productvityCollection').lMinValue;
                                maxValue = data.get('productvityCollection').lMaxValue;
                                belowAvg = data.get('productvityCollection').lBelowAvgCollection;
                                aboveAvg = data.get('productvityCollection').lAboveAvgCollection;
                                $self.drawGaugeGragh(element,dataarray,minValue,maxValue,belowAvg,aboveAvg,text,title,unit);
                           }
                            else{
                                $self.$(element).append('<h6 class="red smaller">No data Found</h6> '); 
                            }
                        }
                    }
                    else{
                        if(data.get('errors')!== null){
                            var Errors = data.get('errors');
                            if(Errors[0].iErrorCode === 8){
//                                    sessionStorage.removeItem('SessionId');
//                                    window.location.replace(loginUrl);
                            }
                            else{
                                $self.$el.append('<div><h6 class="red smaller">No Clinic data Found</h6> </div>'); 
                            }
                        }
                    }
                },
                error: function(e){
                   //alert(JSON.stringify(e)); 
                   this.$el.append('<div><h5 class="blue smaller">Error During Load</h5> </div>'); 
                }
            });
        },
            
        loadTrendLine1: function(restServiceName,element,text,sName,unit){
            this.trend1 = new models.DashboardData({id:restServiceName});
            this.trend1.fetch({data:{sSessionId: sessionStorage.getItem("SessionId"),iClinicId: sessionStorage.getItem("ClinicId")},type:"POST",cache:false,
                success: function(data){
                    var dataarray=[];
                    var seriesarray=[];
                    if(data.get('errors') === null){
                        $self.$(element).removeClass('graphLoading');
                        if(data.get('trendCollection') !== null){
                            var trendCollection=[];
                            trendCollection= data.get('trendCollection');
                            trendCollection.forEach(function(trendline) {
                                dataarray.push(trendline.lBilledAmount);
                                seriesarray.push(trendline.getsMonth);
                            });
                            $self.trendLinegraph1(element,seriesarray,dataarray,text,sName,unit);
                        }
                        else{
                            $self.$el.append('<h6 class="red smaller">No data Found</h6> '); 
                        }
                    }
                    else{
                        if(data.get('errors')!== null){
                            var Errors = data.get('errors');
                            if(Errors[0].iErrorCode === 8){
//                                    localStorage.removeItem('sessionid');
//                                    window.location.replace(loginUrl);
                            }
                            else{
                                $self.$el.append('<div><h6 class="red smaller">No Clinic data Found</h6> </div>'); 
                            }
                        }
                    }
                },
                error: function(e){
                    //alert(JSON.stringify(e)); 
                    $self.$el.append('<div><h5 class="blue smaller">Error During Load</h5> </div>'); 
                }
            });

        },  

        loadTrendLine2: function(restServiceName,element,text,sName,unit,gaugeNum){
            this.trend2 = new models.DashboardData({id:restServiceName});
            this.trend2.fetch({data:{sSessionId: sessionStorage.getItem("SessionId"),iClinicId: sessionStorage.getItem("ClinicId")},type:"POST",cache:false,
                success: function(data){
                    var dataarray=[];
                    if(data.get('errors') === null){
                        $self.$(element).removeClass('graphLoading');
                        if(gaugeNum==='1'){    
                            if(data.get('collectionForeCast') !== null){
                                  dataarray.push(data.get('collectionForeCast').dWK1Collection);
                                  dataarray.push(data.get('collectionForeCast').dWK2Collection);
                                  dataarray.push(data.get('collectionForeCast').dWK3Collection);
                                  dataarray.push(data.get('collectionForeCast').dWK4Collection);
                                  dataarray.push(data.get('collectionForeCast').dWK5Collection);
                                  dataarray.push(data.get('collectionForeCast').dWK6Collection);
                                  dataarray.push(data.get('collectionForeCast').dAboveWK6Collection);
                                  $self.trendLinegraph2(element,dataarray,text,sName,unit);
                            }
                            else{
                                $self.$el.append('<h6 class="red smaller">No data Found</h6> '); 
                            }

                        }
                        else if(gaugeNum==='2'){
                            if(data.get('notFiledClaims') !== null){
                                  dataarray.push(data.get('notFiledClaims').iWK1Count);
                                  dataarray.push(data.get('notFiledClaims').iWK2Count);
                                  dataarray.push(data.get('notFiledClaims').iWK3Count);
                                  dataarray.push(data.get('notFiledClaims').iWK4Count);
                                  dataarray.push(data.get('notFiledClaims').iWK5Count);
                                  dataarray.push(data.get('notFiledClaims').iWK6Count);
                                  dataarray.push(data.get('notFiledClaims').iAboveWK6Count);
                                  $self.trendLinegraph2(element,dataarray,text,sName,unit);
                            }
                            else{
                                $self.$el.append('<h6 class="red smaller">No data Found</h6> '); 
                            }
                        }

                    }
                    else{
                        if(data.get('errors')!== null){
                            var Errors = data.get('errors');
                            if(Errors[0].iErrorCode === 8){
//                                    localStorage.removeItem('sessionid');
//                                    window.location.replace(loginUrl);
                            }
                            else{
                                $self.$el.append('<div><h6 class="red smaller">No Clinic data Found</h6> </div>'); 
                            }
                        }
                    }
                },
                error: function(e){
                    //alert(JSON.stringify(e)); 
                    this.$el.append('<div><h5 class="blue smaller">Error During Load</h5> </div>'); 
                }
            });

        },

        loadTrendLine3: function(restServiceName,element,text,sName,unit){
            this.trend3 = new models.DashboardData({id:restServiceName});
            this.trend3.fetch({data:{sSessionId: sessionStorage.getItem("SessionId"),iClinicId: sessionStorage.getItem("ClinicId")},type:"POST",cache:false,
                success: function(data){
                    var dataarray=[];
                    if(data.get('errors') === null){
                        $self.$(element).removeClass('graphLoading');
                        if(data.get('accountsReceivable') !== null){

                              dataarray.push(data.get('accountsReceivable').dAR0_30);
                              dataarray.push(data.get('accountsReceivable').dAR31_60);
                              dataarray.push(data.get('accountsReceivable').dAR61_90);
                              dataarray.push(data.get('accountsReceivable').dAR91_120);
                              dataarray.push(data.get('accountsReceivable').dARAbove120);
                              $self.trendLinegraph3(element,dataarray,text,sName,unit);
                              //$self.trendLinegraph4(element,dataarray,text,sName,unit);
                        }
                        else{
                            $self.$(element).append('<h6 class="red smaller">No data Found</h6> '); 
                        }
                    }
                    else{
                        if(data.get('errors')!== null){
                            var Errors = data.get('errors');
                            if(Errors[0].iErrorCode === 8){
//                                    localStorage.removeItem('sessionid');
//                                    window.location.replace(loginUrl);
                            }
                            else{
                                $self.$el.append('<div><h6 class="red smaller">No Clinic data Found</h6> </div>'); 
                            }
                        }
                    }
                },
                error: function(e){
                    //alert(JSON.stringify(e)); 
                    $self.$el.append('<div><h5 class="blue smaller">Error During Load</h5> </div>'); 
                }
            });
        },

        drawGaugeGragh: function(element,dataarray,minvalue,maxvalue,belowavgbilled,aboveavgbilled,text,title,unit){
            $(element).highcharts({	
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },

                credits:{
                    enabled: false
                },

                title: {
                    text: text,
                    y: 40
                },

                subtitle: {
                    //text: text,
                    floating: false,
                    align: 'center',
                    //x: -10,
                    verticalAlign: 'bottom',
                    y: 2
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },
                
                plotOptions: {
                    gauge: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                visibility: 'visible'
                            }
                        }
                    }
                },

                // the value axis
                yAxis: {
                    min: minvalue,
                    max: maxvalue,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 7,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 15,
                    tickColor: '#666',
                    labels: {
                        step: 3,
                        rotation: 'auto'
                    },
                    title: {
                        text: title,
                        y:220
                    },
                    plotBands: [{
                        from: minvalue,
                        to: belowavgbilled,
                        color: 'red'
                    }, {
                        from: belowavgbilled,
                        to: aboveavgbilled,
                        color: 'yellow'
                    }, {
                        from: aboveavgbilled,
                        to: maxvalue,
                        color: 'green'
                    }]        
                },

                series: [{
                    name: text,
                    data: [dataarray],
                    dataLabels: {
                       formatter: function () {
                                    return '<span style="color:green;padding-right:20px;"> '+unit + ' ' + this.y + '</span><br/>' ;
                            }
                    },
                    tooltip: {
                        //valueSuffix: unit
                    }
                }]

            });
        },

        trendLinegraph1: function(element,seriesarray,dataarray,text,sName,unit) {
            $(element).highcharts({
                chart: {
                    type: 'column'
                },
                            credits: {
                                    enabled: false
                },
                title: {
                    text: text
                },

                xAxis: {
                    categories: seriesarray,
                    labels: {
                        rotation: -45,
                        align: 'right'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: unit,rotation:1
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.x}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                               useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: sName,
                                    color: '#8f8f8f',
                    borderWidth: 0.5,
                    borderColor: 'black',
                                    data: dataarray

                }]
            });
        },

        trendLinegraph2: function(element,dataarray,text,sName,unit) {
            $(element).highcharts({
                chart: {
                    type: 'column'
                },
                        credits: {
                                enabled: false
                },
                title: {
                    text: text
                },

                xAxis: {
                    categories: [
                        '1W',
                        '2W',
                        '3W',
                        '4W',
                        '5W',
                        '6W',
                        '6W+'
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: unit,rotation:1
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.x}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                               useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: sName,
                                color: '#8f8f8f',
                    borderWidth: 0.5,
                    borderColor: 'black',
                                data: dataarray

                }]
            });
        },

        trendLinegraph3: function(element,dataarray,text,sName,unit){
            $(element).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: text
                },
                subtitle: {
                    text: ''
                },
                credits: {
                        enabled:false
                },
                xAxis: {
                    categories: [
                                 '30',
                                 '60',
                                 '90',
                                 '120',
                                 '120+'
                             ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: unit,
                        rotation:1
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>$ {point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    //shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: sName,
                    data: dataarray,
                    color: '#8f8f8f',
                    borderWidth: 0.5,
                    borderColor: 'black'
                }]
            });
        },
        
        trendLinegraph4: function(element,dataarray,text,sName,unit){
            $(element).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: text
                },
                subtitle: {
                    text: ''
                },
                credits: {
                        enabled:false
                },
                xAxis: {
                    categories: [
                                 '30',
                                 '60',
                                 '90',
                                 '120',
                                 '120+'
                             ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: unit
                        //rotation: 1
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.x +'</b><br/>'+
                            this.series.name +': '+ this.y +'<br/>'+
                            'Total: '+ this.point.stackTotal;
                    }
                },
                legend: {
                    align: 'right',
                    x: -70,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            }
                        }
                    }
                },
                series: [
                    {
                        name: 'Patient',
                        data: [5, 3, 4, 7, 2]
                    }, {
                        name: 'Insurance',
                        data: [3, 4, 4, 2, 5]
                    }
                ]
            });
        }
        
    });

});
