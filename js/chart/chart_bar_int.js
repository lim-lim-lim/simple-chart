/*
 * IntBarChart
 * 음수 양수가 가능한 막대형 차트 
 * 
 * getSeriesRenderData, getBgRenderData룰 override 구현 
 */
IntBarChart.prototype = new Chart();
function IntBarChart(){
	IntBarChart.prototype.getSeriesRenderData = getSeriesRenderData;
	IntBarChart.prototype.getBgRenderData = getBgRenderData;
	
	function getSeriesRenderData(){
		var context = this.seriesContext; 
		var count = this.series.length;
		var totalWidth = 0;
		var minValue, maxValue, absMaxValue, step, baseY; 
		
		count = this.series.length;
		
		while( count ){
 			totalWidth += this.series[ --count ].style.width;
		}
		
		absMaxValue = Math.max( Math.abs(ChartUtil.getMaxValueInSeries( this.data, this.series )), Math.abs(ChartUtil.getMinValueInSeries( this.data, this.series ) ) );
		minValue = (this.fixedLimit) ? this.fixedMin : -absMaxValue;
		maxValue = (this.fixedLimit) ? this.fixedMax : absMaxValue;
		step = ( this.bgContext.measureWidth-this.bgContext.graphMargin*2 ) / (this.data.length-1);
		baseY = ChartUtil.getRateToChartValue( context.measureHeight, 0, maxValue, minValue, 0  ) + context.paddingTop;
		return { context:context, totalWidth:totalWidth, minValue:minValue, maxValue:maxValue, step:step, baseY:baseY };
	}
	
	function getBgRenderData(){
		var paddingLeft, minValue, maxValue, absMaxValue, hStep, vStep, vlaueStep;
		var hAxisCount = 10;
		
		hStep = ( this.bgContext.measureWidth-this.bgContext.graphMargin*2 ) / (this.data.length-1);
		vStep = this.bgContext.measureHeight / hAxisCount;
		absMaxValue = Math.max( Math.abs(ChartUtil.getMaxValueInSeries( this.data, this.series )), Math.abs(ChartUtil.getMinValueInSeries( this.data, this.series ) ) );
		minValue = (this.fixedLimit) ? this.fixedMin : -absMaxValue;
		maxValue = (this.fixedLimit) ? this.fixedMax : absMaxValue;
		valueStep = (absMaxValue-0) / (hAxisCount/2);
		return { context:this.bgContext, hStep:hStep, vStep:vStep, hAxisCount:hAxisCount, minValue:minValue, maxValue:maxValue, valueStep:valueStep };
	}
}









