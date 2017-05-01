// 게임별 구매율
function GameBuyRateChart(){
	return new PieChart()
//	.setNoDataMessage( "조회 기간에 대한 구매 내역이 없습니다." ) 
	.setUnit( "%" )
	.addSeries( new PieSeries( "buyRate", "ctColor" )
				.setStyle( { stroke:"#FF9900", startX:120, startY:115, radius:85 } )
				.setTextStyle( "pieDataText") )
	.setBgRenderer( new PieBg( "sportsItemNm", "ctColor" )
			.setStyle({ startX:230, startY:30, textHGap:5, textVGap:0, rectWidth:9, rectHeight:9 } )
			.setPieTextStyle( "pieText" )
			.setInfoTextStyle( "infoText" ))
	.setWarningStyle( "warningText" )
	.setShowDataTipFunction( showDataTipFunctionGameBuyRate )
	.setHideDataTipFunction( hideDataTipFunctionGameBuyRate );
}