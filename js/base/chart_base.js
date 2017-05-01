/*
 * Chart
 * 모든 Chart들의 보무 클래스 
 * Series와 BgRender를 관리함.
 * MouseEvent( move, leave )를 핸들하며
 * 핸들러 안에서 DataTip 활성과 비활성을 컨트롤 함.
 * 모든 Chart의 부모클래스이며 하위 클래스는 js.chart내에 각각의 js파일로 구분되어 구현됨. 
 * 
 * [properties]
 * data : 차트에 표현되기 위한 데이터
 * unit : 데이터의 단위
 * seriesContext : series들이 그려지기 위한 Context
 * bgContext : back ground가 그려지기 위한 context
 * currentDataTip : 현재 표시 되고있는 DataTip의 data(object)
 * bgRenderer : 실제로 Bg를 그리기 위한 작업을 위임함
 * series : 등록된 series목록 array
 * defaultStyle : 기본적으로 지정된 스타일 setStyle함수를 이용해 지장된 스타일이 없다면 defaultStyle의 속성을 사용함.차트의 여백을 설정함.
 * 				  (paddingLeft:10, paddingRight:10, paddingTop:30, paddingBottom:40, graphMargin:10)
 * style : defaultStyle보다 우선순위를 갖는 스타일 변수 setStyle을 이용해 설정함.
 * tweenObject : 차트의 애니메이션을 표한히기 위해 사용되는 임시변수
 * fixedLimit : 차트의 최대 최소값을 고정하는지 확인하는 flag
 * fixedMin : 고정하고자 하는 최소값
 * fixedMax : 고정하고자 하는 최대값
 * noDataMessage : 데이터가 없을때 표시되는 문자열
 * overflowMessage : 조회기간이 초과하였을 때 표시되는 문자열
 * showDataTipFunction : DataTip을 출력하기 위한 콜백함수 
 * hideDataTipFunction : DataTip을 숨기기 위한 콜백 함수
 * showCompleteFunction : 최초 차트 등장 애니메이션이 완료 됐을때 실행되는 콜백 함수
 * legendFunction : 범례를 표시하기 위한 콜백 함수
 */
function Chart(){
	this.data = null;
	this.unit = "%";
	this.seriesContext = null; 
	this.bgContext = null;
	this.currentDataTip = null;
	this.bgRenderer = null;
	this.series = null;
	this.defaultStyle = { paddingLeft:10, paddingRight:10, paddingTop:30, paddingBottom:40, graphMargin:10 };
	this.style  = {};
	this.tweenObject = null;
	this.fixedLimit = false;
	this.fixedMin; 
	this.fixedMax;
	this.noDataMessage = "조회 기간에 대한 구매 내역이 없습니다."; //"No Data";
	this.overflowMessage = "현황 분석은 최근 1년 기준으로만 데이터가 제공됩니다";
	this.showDataTipFunction;
	this.hideDataTipFunction;
	this.showCompleteFunction;
	this.legendFunction;
	this.warningTextStyle;
	this.textList = [];
}

Chart.prototype.clearText = function(){
	while( this.textList.length ){
		this.textList.shift().remove()
	}
}

Chart.prototype.addText = function( canvas, message, x, y, direction, className ){
	this.textList.push( ChartUtil.addText( this.textList.length, canvas, message, x, y, direction, className ) );
}

/*
*2012.06.25 
*데이터가 없는경우에도 툴팁이 뜨는 등 마우스 동작 
*distroy함수 추가 load가 호출될때 초기화 목적
*이벤트와 series데이터 삭제 
*/
Chart.prototype.distory = function(){
	if( this.seriesContext.canvas[ "removeEventListener" ] ){
		this.seriesContext.canvas.removeEventListener( "mousemove", this.delegateMouseoutHandler );
		this.seriesContext.canvas.removeEventListener( "mouseout", this.delegateMouseleaveHandler );
	}else if( this.seriesContext.canvas[ "detachEvent" ] ){
		this.seriesContext.canvas.detachEvent( "onmousemove", this, this.delegateMouseoutHandler );
		this.seriesContext.canvas.detachEvent( "onmouseout", this, this.delegateMouseleaveHandler );
	}else{
		this.seriesContext.canvas.onmousemove = null;
		this.seriesContext.canvas.onmouseout = null;
	}
	
	this.clearText();
	
	if( this.series && this.series.length > 0 ){
		for( var i=0, count=this.series.length ; i < count ; i+=1 ){
			this.series[ i ].items = [];
			this.series[ i ].clearText();
		}	
	}
	
	this.bgRenderer.clearText();
}

Chart.prototype.setWarningStyle = function( className ){
	this.warningTextStyle = className;
	return this;
}

/*
 * 차트가 그려지기 위한 캔버스를 지정하고 각각의 canvas에서 context를 생성함
 * 이벤트 등록 mousemove, mouseleave
 * 
 * [param]
 * seriesCanvas( canvas ) : 데이터를 그래프로 표현하기 위한 canvas
 * bgCanvas( canvas ) : 차트의 background를 표현하기 위한 canvas
 */
Chart.prototype.setCanvas = function( seriesCanvas /*canvas*/, bgCanvas /*canvas*/ ){
	this.seriesContext = seriesCanvas.getContext( "2d" );
	this.seriesContext.canvas = seriesCanvas;
	this.seriesContext.width = seriesCanvas.width;
	this.seriesContext.height = seriesCanvas.height;
	
	this.bgContext = bgCanvas.getContext( "2d" );
	this.bgContext.canvas = bgCanvas;
	this.bgContext.width = bgCanvas.width;
	this.bgContext.height = bgCanvas.height;
	
	return this;
}

/*
 * 차트의 스타일을 지정
 * 
 * [param]
 * value( object ) : paddingLeft, paddingRight, paddingTop, paddingBottom, graphMargin의 속성을 갖는 object 
 */
Chart.prototype.setStyle = function( value /*object*/ ){
	this.style = value;
	return this;
}

/*
 * 차트의 최대 최소값을 고정함.
 * 
 * [param]
 * min( number ) : 고정하고자 하는 최소값
 * max( number ) : 고정하고자 하는 최대값 
 */
Chart.prototype.setLimit = function( min /*number*/, max /*number*/ ){
	this.fixedLimit = true;
	this.fixedMin = min;
	this.fixedMax = max;	
	return this;
}

/*
 * 데이터 단위 지정
 * 
 * [param]
 * value( string ) : 문자형태의 단위 변수 ( %, 원 등..)
 */
Chart.prototype.setUnit = function( value /*string*/ ){
	this.unit = value;
	return this;
}

/*
 * series등록
 * 
 * [param]
 * value( Series ) : Series 상속받은 하위 객체  
 */
Chart.prototype.addSeries = function( value /*SeriesBase*/){
	if( this.series == null ){
		this.series = [];
	}
	value.setIndex( this.series.length );
	this.series.push( value );
	return this;
}

/*
 * bgRenderer 등록
 * 
 * [param]
 * value( ChartBg ) : ChartBg를 상속받은 하위 객체.
 */
Chart.prototype.setBgRenderer = function( value /*ChartBg*/ ){
	this.bgRenderer = value;
	return this;
}

/*
 * dataTip을 출력하기 위한 callback함수를 지정함.
 * 
 * [param]
 * callback( function )
 */
Chart.prototype.setShowDataTipFunction = function( callback /*call back function*/ ){
	this.showDataTipFunction = callback;
	return this;
}

/*
 * dataTip을 숨기기 위한 callback함수를 지정함.
 * 
 * [param]
 * callback( function )
 */
Chart.prototype.setHideDataTipFunction = function( value /*call back function*/ ){
	this.hideDataTipFunction = value;
	return this;
}

/*
 * 데이터 출력 에니메이션이 완료된 후 호출되는 callback함수 지정함.
 * 
 * [param]
 * callback( function )
 */
Chart.prototype.setShowCompleteFunction = function( value /*call back function*/ ){
	this.showCompleteFunction = value;
	return this;
}

/*
 * 범례를 표현하기 위한 callback함수를 지정함.
 * 
 * [param]
 * callback( function )
 */
Chart.prototype.setLegendFunction = function( value /*call back function*/ ){
	this.legendFunction = value;
	return this;
}

/*
 * 데이터가 없을때 출력되는 문자열을 지정함.
 * 
 * [param]
 * value( string ) : 출력할 문자열.
 */
Chart.prototype.setNoDataMessage = function( value /*string*/){
	this.noDataMessage = value;
	return this;
}

/*
 * 조회 기간이 초과되었을 경우에 출력되는 문자열을 지정함.
 * 
 * [param]
 * value( string ) : 출력할 문자열.
 */
Chart.prototype.setOverflowMessage = function( value /*string*/){
	this.overflowMessage = value;
	return this;
}


/*
 * 데이터 로드 함수
 * 
 * [param]
 * url( string ) : 읽고자 하는 데이터의 url
 */
Chart.prototype.load = function( url /*string*/ ){
	
	this.distory();
	
	var bgContext = this.bgContext;
	var seriesContext = this.seriesContext;
	var noDataMessage = this.noDataMessage;
	var textWidth;
	if( bgContext == null ||  seriesContext == null ) {
		console.log( "bgContext or seriesContext is null" );
		return;
	}
	
	bgContext.clearRect( 0, 0, bgContext.width, bgContext.height );
	seriesContext.clearRect( 0, 0, seriesContext.width, seriesContext.height );
	
//	textWidth = bgContext.measureText( noDataMessage ).width;
//	bgContext.save();
//	bgContext.fillStyle = "#000000";
//	bgContext.font = this.bgRenderer.style.font || this.bgRenderer.defaultStyle.font; 
//	bgContext.textBaseline = "middle"
//	bgContext.fillText( noDataMessage, (bgContext.width - textWidth)/2, bgContext.height/2);
//	bgContext.restore();
	
	$.getJSON( url, ChartUtil.delegate( this, this.loadCompleteHandler ), "json" );
	if( this.hideDataTipFunction ) this.hideDataTipFunction( null );
	return this;
}

/*
 * 차트 그래프 출력
 */
Chart.prototype.render = function(){
	this.renderBg();
	this.renderNow();
}

/*
 * 차트 애니메이션 없이 바로 출력
 */
Chart.prototype.renderNow = function(){
	this.renderSeries(1);
}

/*
 * 차트 series 출력
 * 
 * [param]
 * delta( number ) : 0~1사이의 값. 애니메이션을 구현하기 위한 보간 변수.
 */
Chart.prototype.renderSeries = function( delta /*number 0~1*/){
	var seriesContext = this.seriesContext; 
	seriesContext.clearRect( 0, 0, seriesContext.width, seriesContext.height );
	var series = this.series;
	if( series == null || series.length == 0 ) return;
	for( var i=0, count=series.length ; i<count ; i+=1 ){
		series[i].render( delta );
	}
}

/*
 * 차트 backgroud 출력
 */
Chart.prototype.renderBg = function(){
	if( this.bgRenderer == null ) {
		this.bgContext.clearRect( 0, 0, this.bgContext.width, this.bgContext.height );
		return;
	}
	this.bgRenderer.render();
}

/*
 * 데이터 로드가 완료됐을때 호출되는 함수
 * 
 * [param]
 * data( json ) : 정상적으로 로드가 완료된 json
 */
Chart.prototype.loadCompleteHandler = function( data ){
	
	this.data = data;
	
	var flag = false;
	var msg = "";
	
	if( data == null || data.length == 0 ) {
		// 데이터가 없을 경우
		flag = true;
		msg = this.noDataMessage;
	}
	else if( data[0]["overflow"] ) {
		// 데이터가 조회 기간을 초과한 경우
		flag = true;
		msg = this.overflowMessage;
	}
	else{
		this.delegateMouseoutHandler = ChartUtil.delegate( this, this.mouseoutHandler );
		this.delegateMouseleaveHandler = ChartUtil.delegate( this, this.mouseleaveHandler );
		if( this.seriesContext.canvas[ "addEventListener" ] ){
			this.seriesContext.canvas.addEventListener( "mousemove", this.delegateMouseoutHandler, false );
			this.seriesContext.canvas.addEventListener( "mouseout", this.delegateMouseleaveHandler, false );
		}else if( this.seriesContext.canvas[ "attachEvent" ] ){
			this.seriesContext.canvas.attachEvent( "onmousemove", this.delegateMouseoutHandler, false );
			this.seriesContext.canvas.attachEvent( "onmouseout", this.delegateMouseleaveHandler, false );
		}else{
			this.seriesContext.canvas.onmousemove = this.delegateMouseoutHandler;
			this.seriesContext.canvas.onmouseout = this.delegateMouseleaveHandler;
		}
	}
	
	if( flag == true ) {
		var seriesContext = this.seriesContext;
		if( seriesContext != null ) {
			seriesContext.clearRect( 0, 0, seriesContext.width, seriesContext.height );
		}
		
		var bgContext = this.bgContext;
		if( bgContext == null ) {
			console.log( "loadCompleteHandler() - bgContext is null" );
			return;
		}
		bgContext.clearRect( 0, 0, bgContext.width, bgContext.height );
		
		var textWidth = bgContext.measureText( msg ).width;
		this.addText( bgContext.canvas, msg, (bgContext.width - textWidth)/2, bgContext.height/2, "horizontal", this.warningTextStyle );
		return;
	}
	
	var paddingLeft = this.style.paddingLeft || this.defaultStyle.paddingLeft;
	var paddingRight = this.style.paddingRight || this.defaultStyle.paddingRight;
	var paddingTop = this.style.paddingTop || this.defaultStyle.paddingTop;
	var paddingBottom = this.style.paddingBottom || this.defaultStyle.paddingBottom;
	var graphMargin = this.style.graphMargin || this.defaultStyle.graphMargin;
	var series = this.series;
	
	this.seriesContext.paddingLeft = this.bgContext.paddingLeft = paddingLeft;
	this.seriesContext.paddingRight = this.bgContext.paddingRight = paddingRight;
	this.seriesContext.paddingTop = this.bgContext.paddingTop = paddingTop;
	this.seriesContext.paddingBottom = this.bgContext.paddingBottom = paddingBottom;
	this.seriesContext.graphMargin = this.bgContext.graphMargin = graphMargin;
	this.seriesContext.measureWidth = this.bgContext.measureWidth = this.bgContext.width-paddingLeft-paddingRight;
	this.seriesContext.measureHeight = this.bgContext.measureHeight = this.bgContext.height-paddingTop-paddingBottom;
	
	var seriesRenderData = this.getSeriesRenderData(); 
	var bgRenderData = this.getBgRenderData();
	
	for( var i=0, count=series.length ; i<count ; i+=1 ){
		series[i].setData( data );
		series[i].setRenderData( seriesRenderData );
	}
	
	if( this.bgRenderer ){
		this.bgRenderer.setUnit( this.unit );
		this.bgRenderer.setData( data );
		this.bgRenderer.setRenderData( bgRenderData );
	}
	
	this.show();
	if( this.legendFunction == null ) return;
	this.legendFunction.call( this );
}

/*
 * 애니메이션을 적용해 데이터 출력
 */
Chart.prototype.show = function(){
	this.tweenObject = { delta:0 };
	this.renderBg();
	TweenLite.to( this.tweenObject, 1, { delta:1, time:0, ease:Cubic.easeInOut, onUpdate:ChartUtil.delegate( this, this.tweenUpdate ) } );
}

/*
 * 애니메이션 실행 함수. 
 * 등록된 showCompleteFunction함수를 호출
 */
Chart.prototype.tweenUpdate = function(){
	this.renderSeries( this.tweenObject.delta );
	if( this.showCompleteFunction && this.tweenObject.delta == 1 ){
		this.showCompleteFunction.call( this );
	}
}

/*
 * mouseout 이벤트 핸들러
 * 
 * [param]
 * event( mouseEvent )
 */
Chart.prototype.mouseoutHandler = function( event /*mouse event*/ ){
	if( !this.tweenObject || this.tweenObject.delta != 1 ) return;
	var series;
	var hitItem = null;
	var i,count;

	for( i=0, count=this.series.length ; i<count ; i+=1 ){
		series = this.series[i];
		hitItem = series.hitItem( event );
		if( hitItem != null ){
			this.currentDataTip = hitItem;
			hitItem.mouseX = event.offsetX || event.layerX;
			hitItem.mouseY = event.offsetY || event.layerY;
			this.showDataTip( hitItem );
			break;
		} 
	}
	
	if( hitItem == null && this.currentDataTip != null ){
		this.currentDataTip = null;
		this.hideDataTip( hitItem );
	}
}

/*
 * mouseleave 이벤트 핸들러
 * 
 * [param]
 * event( mouseEvent )
 */
Chart.prototype.mouseleaveHandler = function( event /*mouse event*/){
	
	if( !this.tweenObject || this.tweenObject.delta != 1 ) return;
	if( this.showCompleteFunction ) this.showCompleteFunction();
}

/*
 * dataTip을 띄우기 위한 함수
 * 등룍된 showDataTipFunction을 호출함 
 * 
 * [param]
 * item( object ) : 마우스의 위치, 표시하고자 하는 데이터 등 DataTip에 표시될 값을 가진 object
 * 
 */
Chart.prototype.showDataTip = function( item /*hit item object*/){
	if( this.showDataTipFunction == null ) return;
	this.showDataTipFunction.call( this, item );
}

/*
 * dataTip을 숨기기 위한 함수
 * 등룍된 hideDataTipFunction 호출함 
 * 
 * [param]
 * item( object ) : 마우스의 위치, 표시하고자 하는 데이터 등 DataTip에 표시될 값을 가진 object
 * 
 */
Chart.prototype.hideDataTip = function( item /*hit item object*/){
	if( this.hideDataTipFunction == null ) return;
	this.hideDataTipFunction.call( this, item );
}

/*
 * 차트종류별로 특성에 맞게 각각의 차트 클래스에서 따로 구현됨.
 * Series를 그리기 위한 정보 저공
 */
Chart.prototype.getSeriesRenderData = null; //abstract

/*
 * 차트종류별로 특성에 맞게 각각의 차트 클래스에서 따로 구현됨.
 * Bg를 그리기 위한 정보 저공
 */
Chart.prototype.getBgRenderData = null //abstract




