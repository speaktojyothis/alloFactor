/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function loadproductvityclaimsdata(id,name,test,minvalue,maxvalue,belowavgclaims,aboveavgclaims, plotPoint){
    var dataarray=[];
     $(id).addClass('graphloading').html('<p>Loading ....</p>');
    dataarray.push(plotPoint);
	
	   productvityclaimsdatagraph(id,name,test,dataarray,minvalue,maxvalue,belowavgclaims,aboveavgclaims);
}

function productvityclaimsdatagraph(id,name,test,dataarray,minvalue,maxvalue,belowavgclaims,aboveavgclaims){
//alert(minvalue);
    $(id).highcharts({	
	    chart: {
	        type: 'gauge',
	        plotBackgroundColor: null,
	        plotBackgroundImage: null,
	        plotBorderWidth: 0,
	        plotShadow: true
	    },
	    credits: {
            enabled: false
           },
	    title: {
	        text:'<b>'+ name+'</b>'
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
	            borderWidth: 15,
	            outerRadius: '50%'
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
	            backgroundColor: '#FFF',
	            borderWidth: 2,
	            outerRadius: '105%',
	            innerRadius: '103%'
	        }]
	    },
   		
			plotOptions: {
			gauge: {
				dial: {
					radius: '90%',
					backgroundColor: 'silver',
					borderColor: 'black',
					borderWidth: 2,
					baseWidth: 7,
					topWidth: 1,
					baseLength: '50%', // of radius
					rearLength: '10%'
				},
					pivot: {
					radius: 5,
					borderWidth: 2,
					borderColor: 'black',
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
						stops: [
							[0, 'white'],
							[1, 'gray']
						]
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
	        minorTickLength: 10,
	        minorTickPosition: 'inside',
	        minorTickColor: '#666',	
	        tickPixelInterval: 30,
	        tickWidth: 2,
	        tickPosition: 'inside',
	        tickLength: 15,
	        tickColor: '#666',
	        labels: {
	            step: 4,
	            rotation: 'auto'
	        },
	        title: {
	             text: test,
                    y:200
	        },
	        plotBands: [{
	            from: minvalue,
	            to: belowavgclaims,
	            color: 'red' // red
	        },
                {
	            from: belowavgclaims,
	            to: aboveavgclaims,
	            color: 'yellow' // yellow
	        },
                {
	            from: aboveavgclaims,
	            to: maxvalue,
	            color: '#55BF3B' // green
	        }]       
	    },            
	    series: [{
	        name: name,
	        data: dataarray,
                dataLabels: {
                   formatter: function () {
				   
					                return '<span  id="hello" style="color:green;padding-right:20px;"> '+ this.y + '</span><br/>' ;
	            }
                },
	        tooltip: {
	            valueSuffix:''
	        }
	    }]
	
	});
}

function showgraph(id,name,text,seriesarray,dataarray){
    $(id).highcharts({
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
                    text: '$',rotation:1
                },
				  labels: {
	            step: 1
	            
	           },
			  
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
					//color:"#fdb"
                },
				series: {
                allowPointSelect: true,
				 borderColor: 'black'  ,
				 borderRadius: 5 ,
                  borderWidth: 2
              				 
             }
            },
            series: [{
                name:name,
                data: dataarray
    
            }]
        });
}
$('#TrenrLineCollection1').highcharts({
        chart: {
            type: 'column',
            margin: 75,
            options3d: {
				enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50
            }
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });