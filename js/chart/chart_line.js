/*
 * LineChart
 * 꺾은선  차트 
 * 
 * getSeriesRenderData, getBgRenderData룰 override 구현 
 */
LineChart.prototype = new Chart();

function LineChart(){
	LineChart.prototype.getSeriesRenderData = getSeriesRenderData;
	LineChart.prototype.getBgRenderData = getBgRenderData;
	
	function getSeriesRenderData(){
		var minValue, maxValue, step;
		minValue = (this.fixedLimit) ? this.fixedMin : 0;
		maxValue = (this.fixedLimit) ? this.fixedMax : ChartUtil.getMaxValueInSeries( this.data, this.series );
		step = ( this.bgContext.measureWidth-this.bgContext.graphMargin*2 ) / (this.data.length-1);
		return { context:this.seriesContext, minHeight:0, maxHeight:this.seriesContext.height, minValue:minValue, maxValue:maxValue, step:step };
	}
	
	function getBgRenderData(){
		var paddingLeft, minValue, maxValue, hStep, vStep, vlaueStep;
		var hAxisCount = 10;
		hStep = ( this.bgContext.measureWidth-this.bgContext.graphMargin*2 ) / (this.data.length-1);
		vStep = this.bgContext.measureHeight / hAxisCount;
		minValue = (this.fixedLimit) ? this.fixedMin : 0;
		maxValue = (this.fixedLimit) ? this.fixedMax : ChartUtil.getMaxValueInSeries( this.data, this.series );
		valueStep = (maxValue - minValue) / hAxisCount;
		return { context:this.bgContext, hStep:hStep, vStep:vStep, hAxisCount:hAxisCount, minValue:minValue, maxValue:maxValue, valueStep:valueStep };
	}
}









