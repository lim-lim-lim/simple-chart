// 리그별 환급률
function GameRefundRateChart(){
	return new UintBarChart()
//	.setNoDataMessage( "조회 기간에 대한 구매 내역이 없습니다." )
	.setUnit( "%" )
	.setStyle( { paddingLeft:50, paddingRight:10, paddingTop:45, paddingBottom:40, graphMargin:15 } )
	.addSeries( new UintBarSeries( "refundRate" ).setStyle( { fill:["#84b0ff"], stroke:"#678ddf", width:9 } ) )
	.setBgRenderer( new UintAxisBg( "sportsItemNm" )
					.setStyle( { stroke:"#efefef", lineWidth:1, textHGap:7, textVGap:0  } )
					.setDescription( "환급률")
					.setVAxisTextStyle( "vAxisText" )
					.setHAxisTextStyle( "hAxisText" )
					.setInfoTextStyle( "infoText" ) )
	.setWarningStyle( "warningText" )
	.setShowDataTipFunction( showDataTipFunctionGameRefundRate )
	.setHideDataTipFunction( hideDataTipFunctionGameRefundRate )
	.setShowCompleteFunction( showCompleteFucntionNormal );
}