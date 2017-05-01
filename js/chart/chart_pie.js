/*
 * PieChart
 * 부채꼴  차트 
 * 
 * getSeriesRenderData, getBgRenderData룰 override 구현 
 */
PieChart.prototype = new Chart();

function PieChart(){
	PieChart.prototype.getSeriesRenderData = getSeriesRenderData;
	PieChart.prototype.getBgRenderData = getBgRenderData;
	
	function getSeriesRenderData(){
		var totalValue=0;
		var i, j, count, subCount; 
		for( i=0, count=this.series.length ; i<count ; i+=1 ){
			for( j=0, subCount=this.data.length ; j<subCount ; j+=1 ){
				totalValue += Number( this.data[j][ this.series[i].dataField ] );
			}
		}
		return { context:this.seriesContext, totalValue:totalValue };
	}
	
	function getBgRenderData(){
		return { context:this.bgContext, series:this.series };
	}
}









