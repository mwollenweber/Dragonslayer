Ext.namespace("SampleApp.WeeklyReport");
var weeklyReportGridPanel;
var weeklyReportFormPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openWeeklyReport",SampleApp.WeeklyReport.Open);
});

/**
 * Event handler
 */
SampleApp.WeeklyReport.Open = function() {
    var weeklyReportPanel = new SampleApp.WeeklyReport.Panel();
    SampleApp.Main.CenterPanelInstance.add(weeklyReportPanel);
    SampleApp.Main.CenterPanelInstance.activate(weeklyReportPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "weekly_report.js",
        message: "Weekly Report Opened",
    });
}

/**
 * 
 */
SampleApp.WeeklyReport.Panel = function() {
    weeklyReportFormPanel = new SampleApp.WeeklyReport.FormPanel();
	weeklyReportGridPanel = new SampleApp.WeeklyReport.GridPanel();
	
    SampleApp.WeeklyReport.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Weekly Report",
        id: 'container',
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 weeklyReportGridPanel,
                 weeklyReportFormPanel
        ]
    });
};

/**
 *   Daily Bad Filtered
 */
Ext.extend(SampleApp.WeeklyReport.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.WeeklyReport.GridPanel = function() {
    
	// create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'device'},
           {name: 'ip'},
           {name: 'department'},
           {name: 'date'},
           {name: 'patchlink'},
           {name: 'last_patchlink_check'},
           {name: 'notes'}
        ]
    });
	
    var myData = Ext.Ajax.request({
        url: 'controls/reports/weekly_report.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.WeeklyReport.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        columns: [
            {
                id       :'weekly_report_device',
                header   : 'Device Name', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'device'
            },
            {
                header   : 'IP', 
                width    : 200, 
                sortable : true, 
                dataIndex: 'ip'
            },
            {
                header   : 'School/Department', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'department'
            },
            {
                header   : 'Date/Time', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'date'
            },
            {
                header   : 'Patchlink', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'patchlink'
            },
            {
                header   : 'Last Patchlink Checkin', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'last_patchlink_check'
            },
            {
                header   : 'Notes', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'notes'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'weekly_report_device'
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.WeeklyReport.GridPanel, Ext.grid.GridPanel, {
});


/**
 *  Address Book Form Panel
 */
SampleApp.WeeklyReport.FormPanel = function(){
    SampleApp.WeeklyReport.FormPanel.superclass.constructor.call(this,{
        frame:false,
        title: 'Weekly Report Graph',
        bodyStyle:'padding:5px 5px 0',
        region: "south",
        height: 300,
        width: 800,
        items: new Ext.TabPanel({
            activeTab: 0,
            items: [
                    new Ext.ux.HighchartPanel({
                        title: 'Chart',
                        layout:'fit',
                        redrawOnResize: true, // Option (If using large datasets set this to false)
                        chartConfig: {
                            chart: {
                                defaultSeriesType: 'area'
                            },
                            title: {
                                text: 'US and USSR nuclear stockpiles'
                            },
                            subtitle: {
                                text: 'Source: http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf'
                            },
                            xAxis: {
                            },
                            yAxis: {
                                title: {
                                    text: 'Nuclear weapon states'
                                },
                                labels: {
                                    formatter: function() {
                                        return this.value / 1000 +'k';
                                    }
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    return this.series.name +' produced <b>'+
                                        Highcharts.numberFormat(this.y, 0, null, ' ') +'</b><br/>warheads in '+ this.x;
                                }
                            },
                            plotOptions: {
                                area: {
                                    pointStart: 1940,
                                    marker: {
                                        enabled: false,
                                        symbol: 'circle',
                                        radius: 2
                                    }
                                }
                            },
                            series: [{
                                    name: 'USA',
                                    data: [null, null, null, null, null, 6 , 11, 32, 110, 235, 369, 640,
                                        1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                                        27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                                        26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                                        24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                                        22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                                        10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104 ]
                                }, {
                                    name: 'USSR/Russia',
                                    data: [null, null, null, null, null, null, null , null , null ,null,
                                        5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                                        4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                                        15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                                        33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                                        35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                                        21000, 20000, 19000, 18000, 18000, 17000, 16000]
                                }]
                        }
                })]
            }),
    })
}

/**
 * 
 */
Ext.extend(SampleApp.WeeklyReport.FormPanel, Ext.FormPanel, {
});

