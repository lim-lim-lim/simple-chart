//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::legend functions::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function legendFunctionBuyAndRightRate(){
	var context = this.bgContext;
	var series = this.series;
	var textColor = this.bgRenderer.style.textColor || this.bgRenderer.defaultStyle.textColor;
	var font = this.bgRenderer.style.font || this.bgRenderer.defaultStyle.font; 
	var seriesEach;
	var startX=200;
	var startY=5;
	var gap = 60;
	var x;
	var size = 9;
	var label = [ "구매금액", "적중금액" ];
	
	for( var i=0, count=series.length ; i<count ; i+=1 ){
		x = i*gap+startX;
		seriesEach = series[i];
		context.save();
		context.fillStyle = seriesEach.style.fill[0];
		context.strokeStyle = seriesEach.style.stroke;
		context.fillRect( x, startY, size, size );
		context.strokeRect( x, startY, size, size );
		context.restore();
		
		context.save();
		context.fillStyle = textColor;
		context.font = font;
		context.textBaseline = "top";
		this.bgRenderer.addText( context.canvas, label[i], x+size+3, startY - 2, "horizontal", "legendText" );
		context.restore();
	}
}

function legendFunctionBuyGameRate(){
	var context = this.bgContext;
	var series = this.series;
	var textColor = this.bgRenderer.style.textColor || this.bgRenderer.defaultStyle.textColor;
	var font = this.bgRenderer.style.font || this.bgRenderer.defaultStyle.font; 
	var seriesEach;
	var startX=250;
	var startY=10;
	var gap = 60;
	var x;
	var size = 4;
	var label = [ "환급률" ]; // [ "구매금액", "적중금액" ];
	
	for( var i=0, count=series.length ; i<count ; i+=1 ){
		x = i*gap+startX;
		seriesEach = series[i];
		context.save();
		context.fillStyle = seriesEach.style.stroke || seriesEach.defaultStyle.stroke;
		context.strokeStyle = seriesEach.style.stroke;
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo( x, startY);
		context.lineTo( x+20, startY);
		context.closePath();
		context.stroke();
		context.beginPath();
		context.arc( x+10, startY, 3, Math.PI*2, false );
		context.closePath();
		context.fill();
		context.restore();
		
		context.save();
		context.fillStyle = textColor;
		context.font = font;
		context.textBaseline = "middle";
		this.bgRenderer.addText( context.canvas, label[i], x+20+5, startY - 7, "horizontal", "legendText" );
		context.restore();
	}
}


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::data tip functions::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function showDataTipBuyGameRefundRate( item ){
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	
	var $tip = $("#tip0")
	if( $tip.length == 0 ){
		$tip = $("<span id='tip0'></span>");
		$tip.appendTo( "#chart0" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( value );
	$tip.html( "<span class='value'>"+value+"</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipBuyGameRefundRate( item ){
	var $tip = $("#tip0");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}

function showDataTipFunctionGameRefundRate( item ){
	var label = this.data[item.index][this.bgRenderer.labelField];
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip1") 
	if( $tip.length == 0 ){
		$tip = $("<span id='tip1'></span>");
		$tip.appendTo( "#chart1" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value );
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionGameRefundRate( item ){
	var $tip = $("#tip1");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}

function showDataTipFunctionGameBuyHitAmount( item ){
	var label = this.data[item.index][this.bgRenderer.labelField];
	var valueType = this.valueType;
	var value = ChartUtil.getConvert2ValueType( valueType, item.value )+this.unit;
	var valueKr = ChartUtil.getConvertNumber2Kr( item.value )+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip2")
	if( $tip.length == 0 ){
		$tip = $("<span id='tip2'></span>");
		$tip.appendTo( "#chart2" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value );
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionGameBuyHitAmount( item ){
	var $tip = $("#tip2");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}

function showDataTipFunctionGameProfitValue( item ){
	var label = this.data[item.index][this.bgRenderer.labelField];
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip3")
	if( $tip.length == 0 ){
		$tip = $("<span id='tip3'></span>");
		$tip.appendTo( "#chart3" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value);
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionGameProfitValue( item ){
	var $tip = $("#tip3");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}

/*
 * 게임별 적중지수 
 */
function showDataTipFunctionGameHitValue( item ){
	var label = this.data[item.index][this.bgRenderer.labelField];
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip5") 
	if( $tip.length == 0 ){
		$tip = $("<span id='tip5'></span>");
		$tip.appendTo( "#chart5" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value );
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionGameHitValue( item ){
	var $tip = $("#tip5");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}


function showDataTipFunctionGameBuyRate( item ){
	var label = this.data[item.index]["sportsItemNm"];
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip4")
	if( $tip.length == 0 ){
		$tip = $("<span id='tip4'></span>");
		$tip.appendTo( "#chart4" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value );
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionGameBuyRate(item){
	var $tip = $("#tip4");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}


/*
 * 리그별 환급률 데이터팁 
 */
function showDataTipFunctionLeagueRefundRate( item ){
	var label = this.data[item.index][this.bgRenderer.labelField];
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip6") 
	if( $tip.length == 0 ){
		$tip = $("<span id='tip6'></span>");
		$tip.appendTo( "#chart6" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value );
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionLeagueRefundRate( item ){
	var $tip = $("#tip6");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}

/*
 * 리그별 적중지수 데이터 팁 
 */
function showDataTipFunctionLeagueHitValue( item ){
	var label = this.data[item.index][this.bgRenderer.labelField];
	var value = item.value+this.unit;
	var context = this.seriesContext;
	var x = item.mouseX;
	var y = item.mouseY;
	var $tip = $("#tip7") 
	if( $tip.length == 0 ){
		$tip = $("<span id='tip7'></span>");
		$tip.appendTo( "#chart7" );
		$tip.addClass( "tip" );
	}
	
//	$tip.html( "<b>"+label+"</b> "+value );
	$tip.html( "<span class='label'>" + label + "</span> <span class='value'>" + value + "</span>" );
	
	var limitX, limitY;
	limitX = x+$tip.outerWidth();
	limitY = y-$tip.outerHeight()-5;
	x = ( limitX > context.width ) ? context.width-$tip.outerWidth() : x;
	y = ( limitY < 0 ) ? 0 : limitY;
	$tip.css( { left:x, top:y } );
}

function hideDataTipFunctionLeagueHitValue( item ){
	var $tip = $("#tip7");
	if( $tip.length != 0 ){
		 $tip.remove();
	}
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::show complete functions:::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function showCompleteFucntionNormal(){;
	if( this.showDataTipFunction == null ) return;
	var item = ChartUtil.getMaxItemInSeries( this.series );
	item.mouseX = item.x;
	item.mouseY = item.y;
	this.showDataTipFunction( item );
}
