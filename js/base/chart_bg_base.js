
/*
 * ChartBg
 * 모든 Bg들의 보무 클래스
 * 각 타입에 맞게 차트의 backgroud를 그린다.
 *   
 * [properties]
 * data : 차트에 표현되기 위한 데이터
 * style : defaultStyle보다 우선순위를 갖는 스타일 변수 setStyle을 이용해 설정함.
 * defaultStyle : 기본적으로 지정된 스타일 setStyle함수를 이용해 지장된 스타일이 없다면 defaultStyle의 속성을 사용함.차트의 여백을 설정함.
 * noDataMessage : 데이터가 없을때 표시되는 문자열
 * guideMessage : 그래프 하단에 추가적인 설명을 덧붙여 출력하기 위한 문자열.
 * cutValue : 데이터의 길이가 너무 거칠경우( 백만이싱 ) 절삭하고 단위를 변경하기 위한 기준값.
 * cutUnit : 차트의 데이터가 cutValue로 지정된 값보다 클경우 단위를 cutValue를 기준으로 변경됨.
 * unit : 데이터의 단위
 * description : 차트가 나타내고자 하는 값 ( 환급률, 적중지수 등..)
 */
function ChartBg(){
	this.style = {};
	this.data = null;
	this.renderData = null;
	this.noDataMessage = "No Data."
	this.guideMessage;
	this.cutValue = 1000000;
	this.cutUnit = "백만원";
	this.unit;
	this.description="";
	this.textList = [];
	this.vAxisTextStyle;
	this.hAxisTextStyle;
	this.infoTextStyle;
	this.isLeague = false;
}

/*
 * Bg그리기 함수 각각의 차트 타입에 맞게 하위 클래스에서 구현됨 .
 */
ChartBg.prototype.render = null;//abstract	

ChartBg.prototype.setIsLeague = function( value ){
	this.isLeague = value;
	return this;
}

ChartBg.prototype.clearText = function(){
	while( this.textList.length ){
		this.textList.shift().remove()
	}
}

ChartBg.prototype.addText = function( canvas, message, x, y, direction, className ){
	this.textList.push( ChartUtil.addText( this.textList.length, canvas, message, x, y, direction, className ) );
}

ChartBg.prototype.setVAxisTextStyle = function( className ){
	this.vAxisTextStyle = className;
	return this;
}

ChartBg.prototype.setHAxisTextStyle = function( className ){
	this.hAxisTextStyle = className;
	return this;
}

ChartBg.prototype.setInfoTextStyle = function( className ){
	this.infoTextStyle = className;
	return this;
}


/*
 * Bg데이터의 단위를 지정함
 * 
 * [param]
 * value( string )
 */
ChartBg.prototype.setUnit = function( value/*string*/){
	this.unit = value;
	return this;
}

/*
 * 차트가 나타내고자 하는 값 ( 환급률, 적중지수 등..)을 지정함
 * 
 * [param]
 * value( string )
 */
ChartBg.prototype.setDescription = function( value/*string*/){
	this.description = value;
	return this;
}

/*
 * Bg데이터의 단위를 지정함
 * 
 * [param]
 * value( string )
 */
ChartBg.prototype.setCutValue = function( value/*number*/, unit ){
	this.cutValue = value;
	this.cutUnit = unit;
	return this;
}

/*
 * 데이터가 없을때 출력될 문자열 지정.
 * 
 * [param]
 * value( string )
 */
ChartBg.prototype.setNoDataMessage = function( value/*string*/){
	this.noDataMessage = value;
	return this;
}

/*
 * 그래프 하단에 추가적인 설명을 덧붙여 출력하기 위한 문자열을 지정함
 * 
 * [param]
 * value( string )
 */
ChartBg.prototype.setGuideMessage = function( value/*string*/){
	this.guideMessage = value;
	return this;
}

/*
 * 차트의 데이터.
 * 이 데이터를 기반으로 Bg를 구성함.
 * 
 * [param]
 * value( object ) : json
 */
ChartBg.prototype.setData = function( value /*object*/ ){
	this.data = value;
	return this;
}

/*
 * Bg를 그리기 위한 렌더 관련 데이터를 지정함.
 * 
 * [param]
 * value( object )
 */
ChartBg.prototype.setRenderData = function( value /*object*/ ){
	this.renderData = value;
	return this;
}

/*
 * Bg의 스타일을 지정함.
 * defaultStyle보다 우선순위가 높음
 * 
 * [param]
 * value( object ) : stroke, lineWidth,  textHGap, textVGap 등의 속성을 가진 object
 * 					 차트 특성에 따라 object변수 구성이 다름.
 */
ChartBg.prototype.setStyle = function( value /*object*/){
	this.style = value;
	return this;
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::UintAxisBg:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * UintAxisBg
 * 양의 정수만 표시하는 x,y축의 bg
 * 
 * [properties]
 * 
 * labelField( string ) : 데이터의 label을 찾기 위한 문자열. labelField를 기준으로 json에서 label을 찾음.
 * 							
 */
UintAxisBg.prototype = new ChartBg();
function UintAxisBg( labelField ){
	this.labelField = labelField;
	this.defaultStyle = { stroke:"#999999",  lineWidth:1,  textHGap:7, textVGap:0 };
	
	UintAxisBg.prototype.render = render;
	
	function render(){
		var context = this.renderData.context;
		var data = this.data;
		context.clearRect( 0, 0, context.width, context.height );
		drawAxisY.call( this );
		drawAxisX.call( this );
		
		if( this.guideMessage ){
			this.addText( context.canvas, this.guideMessage, context.paddingLeft, context.height-6, "horizontal", this.hAxisTextStyle );
		}
	}
	
	//y출 그리기
	function drawAxisY(){
		var data = this.data;
		var renderData = this.renderData;
		var context = renderData.context;
		var vStep = renderData.vStep;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var x = context.paddingLeft;
		var y = context.paddingTop;
		var textGap = style.textHGap || defaultStyle.textHGap;
		var cutLength = 0;
		var cutUnit = "";
		var isCut = false;
		var unitInfoText="";
		var value;
		
		context.save();
		context.beginPath();
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		context.lineWidth = style.lineWidth || defaultStyle.lineWidth;
		
//		context.moveTo( x, y );
//		context.lineTo( x, y+context.measureHeight  );

		var _tx = parseInt( x ) + 0.5;
		context.moveTo( _tx, y );
		context.lineTo( _tx, y+context.measureHeight  );
		
		context.closePath();
		context.stroke();
		
		if( renderData.maxValue > this.cutValue ){
			cutLength = this.cutValue.toString().length - (this.cutValue.toString().length-1);
			cutUnit = this.cutUnit;
			isCut = true;
		}else{
			isCut = false;
			cutUnit = this.unit;
		}
		
		unitInfoText = this.description+"(단위:" + cutUnit + ")";
		this.addText( context.canvas, unitInfoText, 0, 0, "horizontal", this.infoTextStyle );

		var _ty;
		for( var i=0, count=renderData.hAxisCount ; i<=count ; i+=1 ){
			if( isCut ){
				value = Number( ( renderData.maxValue - (i*renderData.valueStep) ) / this.cutValue ).toFixed( 1 );	
			}else{
				value = ( renderData.maxValue - (i*renderData.valueStep) );
			}
			
			if( value == 0 ) value = 0; // 0.0일경우 -> 0 
			
			context.save();
			context.beginPath();
			context.lineWidth = style.lineWidth || defaultStyle.lineWidth;
			
//			context.moveTo( x-2, y+(i*vStep) );
//			context.lineTo( x+context.measureWidth, y+(i*vStep) );
			
			_ty = parseInt( y + (i*vStep) ) + 0.5;
			context.moveTo( x, _ty );
			context.lineTo( x+context.measureWidth, _ty );
			
			if( i == count ) context.strokeStyle = "#a6a6a6";
			context.closePath();
			context.stroke();
			context.fill();
			this.addText( context.canvas, value.toString(), x-( context.measureText( value ).width+textGap ), y+(i*vStep), "horizontal", this.hAxisTextStyle );
		}
		context.restore();		
	}
	
	//x출 그리기
	function drawAxisX(){
		var data = this.data;
		var renderData = this.renderData;
		var labelField = this.labelField;
		var context = renderData.context;
		var vStep = renderData.vStep;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var textGap = style.textVGap || defaultStyle.textVGap;
		var x, y;
		var value;
		var direction = this.isLeague ?  "vertical" : "horizontal";
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		context.lineWidth = style.lineWidth || defaultStyle.lineWidth;
		
		for( var i=0, count=data.length ; i<count ; i+=1 ){
			value = data[i][labelField].substr( 0, 3 );
			x = i * renderData.hStep + context.paddingLeft + context.graphMargin;
			if( direction == "horizontal" ){
				x -= context.measureText( value ).width/2;
			}
			
			y = context.paddingTop + context.measureHeight;
			this.addText( context.canvas, value.toString(), x, y+textGap, direction, this.vAxisTextStyle );
		}
	}
}


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::IntAxisBg::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * IntAxisBg
 * 음의 정수도 포함하는 표시하는 x,y축의 bg
 * 
 * [properties]
 * 
 * labelField( string ) : 데이터의 label을 찾기 위한 문자열. labelField를 기준으로 json에서 label을 찾음.
 * 							
 */
IntAxisBg.prototype = new ChartBg();
function IntAxisBg( labelField ){
	this.labelField = labelField;
	this.defaultStyle = { stroke:"#999999", lineWidth:1,  textHGap:7, textVGap:0 };
							
	IntAxisBg.prototype.render = render;
	
	function render(){
		var renderData = this.renderData;
		var context = renderData.context;
		var data = this.data;
		context.clearRect( 0, 0, context.width, context.height );
		drawAxisY.call( this );
		drawAxisX.call( this );
		
		if( this.guideMessage ){
			this.addText( context.canvas, this.guideMessage, context.paddingLeft, context.height-6, "horizontal", this.hAxisTextStyle );
		}
	}
	
	//y출 그리기
	function drawAxisY(){
		var data = this.data;
		var renderData = this.renderData;
		var context = renderData.context;
		var vStep = renderData.vStep;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var x = context.paddingLeft;
		var y = context.paddingTop;
		var textGap = style.textHGap || defaultStyle.textHGap;
		var cutLength = 0;
		var cutUnit = "";
		var isCut = false;
		var unitInfoText = "";
		var value;
		
		context.save();
		context.beginPath();
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		context.lineWidth = style.lineWidth || defaultStyle.lineWidth;
		
//		context.moveTo( x, y );
//		context.lineTo( x, y+context.measureHeight  );

		var _tx = parseInt( x ) + 0.5;
		context.moveTo( _tx, y );
		context.lineTo( _tx, y+context.measureHeight  );
		
		context.closePath();
		context.stroke();
		
		if( renderData.maxValue > this.cutValue ){
			cutLength = this.cutValue.toString().length - (this.cutValue.toString().length-1);
			cutUnit = this.cutUnit;
			isCut = true;
		}else{
			isCut = false;
			cutUnit = this.unit;
		}
		
		unitInfoText = this.description+"(단위:" + cutUnit + ")";
		this.addText( context.canvas, unitInfoText, 0, 0, "horizontal", this.infoTextStyle );
		
		var _ty;
		for( var i=0, count=renderData.hAxisCount ; i<=count ; i+=1 ){
			if( isCut ){
				value = Number( ( renderData.maxValue - (i*renderData.valueStep) )/this.cutValue ).toFixed( 1 );	
			}else{
				value = ( renderData.maxValue - (i*renderData.valueStep) );
			}
			
			if( value == 0 ) value = 0; // 0.0일경우 -> 0 
			
			context.save();
			context.beginPath();
			context.lineWidth = style.lineWidth || defaultStyle.lineWidth;
			
//			context.moveTo( x-2, y + (i*vStep) );
//			context.lineTo( x+context.measureWidth, y+(i*vStep) );
			
			_ty = parseInt( y + (i*vStep) ) + 0.5;
			context.moveTo( x, _ty );
			context.lineTo( x+context.measureWidth, _ty );
			
			context.textBaseline = "middle";
			if( value == 0 ){
				context.strokeStyle = "#a6a6a6";
			}else{
				context.strokeStyle =  style.stroke || defaultStyle.stroke;
			}
			context.closePath();
			context.stroke();
			this.addText( context.canvas, value.toString(), x-( context.measureText( value ).width+textGap ), y+(i*vStep), "horizontal", this.hAxisTextStyle );
		}
		context.restore();		
	}
	
	//x출 그리기
	function drawAxisX(){
		var data = this.data;
		var renderData = this.renderData;
		var labelField = this.labelField;
		var context = renderData.context;
		var vStep = renderData.vStep;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var textGap = style.textVGap || defaultStyle.textVGap;
		var x, y;
		var value;
		var direction = this.isLeague ?  "vertical" : "horizontal";
		
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		context.lineWidth = style.lineWidth || defaultStyle.lineWidth;
		
		for( var i=0, count=data.length ; i<count ; i+=1 ){
			value = data[i][labelField].substr( 0, 3 );
			x = i * renderData.hStep + context.paddingLeft + context.graphMargin;
			if( direction == "horizontal" ){
				x -= context.measureText( value ).width/2;
			}
			
			y = context.paddingTop + context.measureHeight;
			this.addText( context.canvas, value.toString(), x, y+textGap, direction, this.vAxisTextStyle );
		}
		
	}
}


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::Pie Bg:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * PieBg
 * 파이차트 형태의 bg를 표현함
 * 
 * [properties]
 * 
 * labelField( string ) : 데이터의 label을 찾기 위한 문자열. labelField를 기준으로 json에서 label을 찾음.
 * 							
 */
PieBg.prototype = new ChartBg();
function PieBg( labelField, colorField ){
	this.labelField = labelField;
	this.colorField = colorField;
	this.defaultStyle = { startX:230, startY:40, textHGap:5, textVGap:17, rectWidth:9, rectHeight:9 };
	this.textStyle;
	
	PieBg.prototype.render = render;
	PieBg.prototype.setPieTextStyle = function( className ){
		this.textStyle = className;
		return this;
	}
	
	//파이 차트는 축이 없으므로 범례를 그림.
	function render(){
		var renderData = this.renderData;
		var context = renderData.context;
		var series = renderData.series[0];
		var defaultStyle = this.defaultStyle;
		var style = this.style;
		var fillList = series.style.fill || series.defaultStyle.fill;
		var startX = style.startX || defaultStyle.startX;
		var startY = style.startY || defaultStyle.startY;
		var vgap = style.textVGap || defaultStyle.textVGap;
		var hgap = style.textHGap || defaultStyle.textHGap;
		var rectWidth = style.rectWidth || defaultStyle.rectWidth;
		var rectHeight = style.rectHeight || defaultStyle.rectHeight;
		var data = this.data;
		var label;
		var y;
		
		context.clearRect( 0, 0, context.width, context.height );
		var color;
		
		for( var i=0, count=data.length ; i<count ; i+=1 ){
			y = startY + i*vgap;
			label = data[i][this.labelField];
			
			color = data[i][this.colorField];
			context.fillStyle = ( color.charAt(0) == '#') ? color : '#' + color;;
			
			context.fillRect( startX, y, 10, 10 );
			this.addText( context.canvas, label, startX + hgap + rectWidth, y, "horizontal", this.textStyle );
		}
		
		context.textBaseline = "middle";
		var unitInfoText = "(단위:" + this.unit + ")";
		if( this.description ) {
			unitInfoText = this.description + unitInfoText;
		}

		this.addText( context.canvas, unitInfoText, 0, 0, "horizontal", this.infoTextStyle  );
		
		if( this.guideMessage ){
			this.addText( context.canvas, this.guideMessage, context.paddingLeft, context.height-6, "horizontal" );
		}
	}
}








