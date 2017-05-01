// 게임별 수익률
function GameProfitValueChart(){
	return new IntBarChart()
//	.setNoDataMessage( "조회 기간에 대한 구매 내역이 없습니다." ) 
	.setUnit( "%" )
	.setStyle( { paddingLeft:50, paddingRight:10, paddingTop:45, paddingBottom:40, graphMargin:15 } )
	.addSeries( new IntBarSeries( "profitRate" ).setStyle( { heighFill:["#84b0ff"], rowFill:["#ffaed7"], heighStroke:"#678ddf", rowStroke:"#d693b2", width:9 } ) )
	.setBgRenderer( new IntAxisBg( "sportsItemNm" )
					.setStyle( { stroke:"#efefef", lineWidth:1, textHGap:7, textVGap:0 } )
					.setDescription( "수익률") 
					.setVAxisTextStyle( "vAxisText" )
					.setHAxisTextStyle( "hAxisText" )
					.setInfoTextStyle( "infoText" ))
	.setWarningStyle( "warningText" )
	.setShowDataTipFunction( showDataTipFunctionGameProfitValue )
	.setHideDataTipFunction( hideDataTipFunctionGameProfitValue )
	.setShowCompleteFunction( showCompleteFucntionNormal );
}