new Ext.ux.HighchartPanel({
    layout:'fit',
    applyTo: 'weekly_report_chart_container',
    title: 'Highchartspanel: pie',
    width: 800,
    height: 400,
    chartConfig: {
        chart: {
                margin: [50, 200, 60, 170]
        },
        title: {
                text: 'Browser market shares at a specific website, 2008'
        },
        plotArea: {
                shadow: null,
                borderWidth: null,
                backgroundColor: null
        },
        tooltip: {
                formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                }
        },
        plotOptions: {
                pie: {
                        allowPointSelect: true,
                        dataLabels: {
                                enabled: true,
                                formatter: function() {
                                        if (this.y > 5) return this.point.name;
                                },
                                color: 'white',
                                style: {
                                        font: '13px Trebuchet MS, Verdana, sans-serif'
                                }
                        }
                }
        },
        legend: {
                layout: 'vertical',
                style: {
                        left: 'auto',
                        bottom: 'auto',
                        right: '50px',
                        top: '100px'
                }
        },
        series: [{
                type: 'pie',
                name: 'Browser share',
                data: [{
                                name: 'Firefox',
                                y: 44.2,
                                sliced: false
                        },
                        ['IE7', 26.6],
                        {
                                name: 'IE6',
                                y: 20,
                                sliced: false
                        },
                        ['Chrome', 3.1],
                        {
                                name: 'Safari',
                                y: 2.7,
                                sliced: false
                        },
                        ['Opera', 2.3],
                        ['Mozilla', 0.4]
                ]
                //data: [3.40, 1.05, 2.90, 1.65, 1.35, 2.59, 1.39, 3.07, 2.82]
        }]
    }
});