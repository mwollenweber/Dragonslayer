/**
 * Ext.ux.HighchartPanel
 *
 * See http://www.extjs.com/forum/showthread.php?p=444842
 *
 */
Ext.ns('Ext.ux');

Ext.ux.HighchartPanel = Ext.extend(Ext.Panel, {

    //width should be greater then height, 2x works well
    width: this.width || 600,
    height: this.height || 300,

    /**
     * redraw on resize
     * When using large data sets, it is better to set this to false.
     * If true the Chart will be recreated.
     */
    redrawOnResize: true,

    initComponent: function() {
        this.on('afterlayout', this.renderChart, this);
        Ext.ux.HighchartPanel.superclass.initComponent.call(this);
    },

    /**
     * Create a new chart
     */
    renderChart: function(){
        Ext.apply(this.chartConfig.chart, {
            renderTo: this.body.dom
        });

        var parent = this.ownerCt,

        currConfig = this.chartConfig;

        /**
         * Check if the chart is created within a different component.
         * If it is within a window, then it will wait for the onResize call
         * after the layout is finished. This is because the window will resize
         * the inner component.
         */
        if (!parent)
            this.chart = new Highcharts.Chart(currConfig);

        // The chart is with a different component, so we need to take care
        else {
            this.on('resize', function(c, w, h){
                if (typeof this.chart == 'object'){
                    /*
                     * -- Update the container and layers and redraw.
                     *
                     * chart.container.width = w;
                     * chart.container.height = h;
                     */
                    if (this.redrawOnResize)
                        this.redrawChart();
                    //this.chart.updatePosition();
                } else {
                    // Create the chart.
                    this.chart = new Highcharts.Chart(currConfig)

                    var getWindow = function(parent){
                        if (parent.ownerCt)
                            return getWindow(parent.ownerCt)
                        else
                            return parent;
                    }
                    // In case of a window
                    getWindow(parent).on('move', function(){
                        this.chart.updatePosition();
                    }, this);
                }
            }, this);
        }
        // Remove this call.
        this.un('afterlayout', this.renderChart, this);
    },

    redrawChart: function(){
        var backupSeries = [];
        for (var i = 0, len = this.chart.series.length; i < len; i++) {
            var data = [], s = this.chart.series[i];
            for (var c = 0, dlen = s.data.length; c < dlen; c++) {
                data.push([s.data[c].x,s.data[c].y]);
            }
            var opt = {
                id:'',
                name:s.name,
                data:data
            };
            if (typeof s.options != undefined && typeof s.options.id != undefined) opt.id = s.options.id;
            if (typeof s.options  != undefined) Ext.apply(opt.options,s.options);
            if (typeof s.color    != undefined) opt.color = s.color;
            if (typeof s.selected != undefined) opt.selected = (s.selected) ? true:false;
            if (typeof s.type     != undefined) opt.type  = s.type;
            if (typeof s.visible  != undefined) opt.visible = (s.visible) ? true:false;
            if (typeof s.xAxis    != undefined) Ext.apply(opt.xAxis, s.xAxis);
            if (typeof s.yAxis    != undefined) Ext.apply(opt.yAxis,s.yAxis);
            backupSeries.push(opt);
        }
        // Clear previous chart.
        this.chart.remove();
        delete this.chart;

        // Clear the old series
        delete this.chartConfig.series

        // Set the new series.
        this.chartConfig.series = backupSeries;

        // Recreate chart
        this.chart = new Highcharts.Chart(this.chartConfig);

    },
    
    destroy: function() {
        if(this.chart) {
            this.chart.destroy();
            delete this.chart;
        }

        Ext.ux.HighchartPanel.superclass.destroy.call(this);
    }
});


Highcharts.Chart.prototype.remove = function () {


    if (this.garbageBin===undefined) this.garbageBin = document.createElement("div");
    var bin = this.garbageBin;
    
    function discardElement(element) {

            // move the node and empty bin
            if (element) bin.appendChild(element);
            bin.innerHTML = '';
    }

    /**
     * Clear certain attributes from the element
     * @param {Object} d
     */
    function purge(d) {
        if (d==null)return;
        var a = d.attributes, i, l, n;
        if (a) {
            l = a.length;
            for (i = l - 1; i >= 0; i -= 1) {
                n = a[i].name;

                try {
                    //if (typeof d[n] != 'object' && !/^(width|height)$/.test(n)) {
                    if (typeof d[n] == 'function') {
                        d[n] = null;
                    }
                } catch (e) {
                // IE/excanvas produces errors on some of the properties
                }

            }
        }

        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = l - 1; i >= 0; i--) {
                var node = d.childNodes[i];
                purge(node);

                if (!node.childNodes.length) discardElement(node);
            }
        }

    }



    // get the container element
    var container = this.imagemap.parentNode;

    // purge potential leaking attributes
    purge(container);

    // remove the HTML
    container.innerHTML = '';
};