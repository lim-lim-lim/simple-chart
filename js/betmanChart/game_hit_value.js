// 게임별 적중지수
function GameHitValueChart(){
	return new UintBarChart()
//	.setNoDataMessage( "조회 기간에 대한 구매 내역이 없습니다." )
	.setUnit( "%" )
	.setStyle( { paddingLeft:50, paddingRight:10, paddingTop:45, paddingBottom:40, graphMargin:15 } )
	.addSeries( new UintBarSeries( "hitRate" ).setStyle( { fill:["#ff8e84"], stroke:"#df7567", width:10 } ) )
	.setBgRenderer( new UintAxisBg( "sportsItemNm" )
					.setStyle( { stroke:"#efefef", lineWidth:1, textHGap:7, textVGap:0 } )
					.setDescription( "적중지수") 
					.setVAxisTextStyle( "vAxisText" )
					.setHAxisTextStyle( "hAxisText" )
					.setInfoTextStyle( "infoText" ) )
	.setWarningStyle( "warningText" )
	.setShowDataTipFunction( showDataTipFunctionGameHitValue )
	.setHideDataTipFunction( hideDataTipFunctionGameHitValue )
	.setShowCompleteFunction( showCompleteFucntionNormal );
}