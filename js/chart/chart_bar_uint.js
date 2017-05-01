/*
 * UintBarChart
 * 양수  막대형 차트 
 * 
 * getSeriesRenderData, getBgRenderData룰 override 구현 
 */
UintBarChart.prototype = new Chart();

function UintBarChart(){
	UintBarChart.prototype.getSeriesRenderData = getSeriesRenderData;
	UintBarChart.prototype.getBgRenderData = getBgRenderData;
	
	function getSeriesRenderData(){
		var minValue, maxValue, step, series;  
		var count = this.series.length;
		var totalWidth = 0;
		
		count = this.series.length;
		
		while( count ){
 			totalWidth += this.series[ --count ].style.width;
		}
		
		minValue = (this.fixedLimit) ? this.fixedMin : 0;
		maxValue = (this.fixedLimit) ? this.fixedMax : ChartUtil.getMaxValueInSeries( this.data, this.series );
		step = ( this.bgContext.measureWidth-this.bgContext.graphMargin*2 ) / (this.data.length-1);
		return { context:this.seriesContext, totalWidth:totalWidth, minHeight:0, maxHeight:this.seriesContext.height, 
				 minValue:minValue, maxValue:maxValue, step:step };
	}
	
	function getBgRenderData(){
		var paddingLeft, minValue, maxValue, hStep, vStep, vlaueStep;
		var hAxisCount = 10;
		
		hStep = ( this.bgContext.measureWidth-this.bgContext.graphMargin*2 ) / (this.data.length-1);
		vStep = this.bgContext.measureHeight / hAxisCount;
		minValue = (this.fixedLimit) ? this.fixedMin : 0;
		maxValue = (this.fixedLimit) ? this.fixedMax : ChartUtil.getMaxValueInSeries( this.data, this.series );
		valueStep = (maxValue-minValue) / hAxisCount;
		return { context:this.bgContext, hStep:hStep, vStep:vStep, hAxisCount:hAxisCount, minValue:minValue, maxValue:maxValue, valueStep:valueStep };
	}
}









