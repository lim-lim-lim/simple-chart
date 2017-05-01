// 게임별 구매/적중금액
function GameBuyRateHitAmountChart(){
	return new UintBarChart()
//	.setNoDataMessage( "조회 기간에 대한 구매 내역이 없습니다." ) 
	.setUnit( "원" )
	.setStyle( { paddingLeft:50, paddingRight:10, paddingTop:40, paddingBottom:40, graphMargin:15 } )
	.addSeries( new UintBarSeries( "buyAmt" ).setStyle( { fill:["#fef301"], stroke:"#e7d80d", width:6 } ) )
	.addSeries( new UintBarSeries( "winAmt" ).setStyle( { fill:["#ffaed7"], stroke:"#d693b2", width:6 } ) )
	.setBgRenderer( new UintAxisBg( "sportsItemNm" )
			.setStyle( { stroke:"#efefef", lineWidth:1, textHGap:7, textVGap:0 } )
			.setDescription( "금액") 
			.setVAxisTextStyle( "vAxisText" )
			.setHAxisTextStyle( "hAxisText" )
			.setInfoTextStyle( "infoText" ))
	.setWarningStyle( "warningText" )
	.setShowDataTipFunction( showDataTipFunctionGameBuyHitAmount )
	.setHideDataTipFunction( hideDataTipFunctionGameBuyHitAmount )
	.setShowCompleteFunction( showCompleteFucntionNormal )
	.setLegendFunction( legendFunctionBuyAndRightRate );
}