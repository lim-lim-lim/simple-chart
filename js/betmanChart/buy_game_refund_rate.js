// 구매 경기수별 환급율
function BuyGameRefundRateChart(){
	return new LineChart() 
//	.setNoDataMessage( "조회 기간에 대한 구매 내역이 없습니다." )
	.setUnit( "%" )
	.setStyle( { paddingLeft:50, paddingRight:10, paddingTop:45, paddingBottom:40, graphMargin:15 } )
	.addSeries( new LineSeries( "refundRate" ).setStyle( { stroke:"#fd4545", lineWidth:1, itemFill:"#fd4545", itemStroke:"#fd4545", itemStrokeWidth:2, itemRadius:2 } ) )
	.setBgRenderer( new UintAxisBg( "gameCnt" )
					.setStyle( { stroke:"#efefef", lineWidth:1, textHGap:7, textVGap:0 } )
					.setDescription( "환급률")
					.setVAxisTextStyle( "vAxisText" )
					.setHAxisTextStyle( "hAxisText" )
					.setInfoTextStyle( "infoText" ))
	.setWarningStyle( "warningText" )
	.setShowDataTipFunction( showDataTipBuyGameRefundRate )
	.setHideDataTipFunction( hideDataTipBuyGameRefundRate )
	.setShowCompleteFunction( showCompleteFucntionNormal )
	.setLegendFunction( legendFunctionBuyGameRate );
}