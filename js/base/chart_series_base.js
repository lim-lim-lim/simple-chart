
/*
 * Series
 * 실질적으로 데이터를 표현하는 클래스 
 * 차트의 득성에 맞게 각각의 하위 클래스에서 그리기를 구현
 * 
 * [properties]
 * data : 차트에 표현되기 위한 데이터
 * dataField : series에서 출력하고자 하는 데이터의 종류를 판단하기 위한 문자열
 * style : defaultStyle보다 우선순위를 갖는 스타일 변수 setStyle을 이용해 설정함.
 * items : 1개의 데이터의 정보를 담는 배열
 * renderData : series를 그리기 위한 랜더데이터
 * index : 등록된 series의 인덱스 
 */
function Series( dataField /*string*/){
	this.data = null;
	this.dataField;
	this.colorField;
	this.style = {};
	this.items = [];
	this.renderData = null;
	this.index;
	this.textList = [];
	this.textStyle;
}

/*
 * 그리기 함수
 * 차트의 특성에 맞게 하위 클래스에서 각각 구현됨 
 */
Series.prototype.render = null; //abstract

Series.prototype.clearText = function(){
	while( this.textList.length ){
		this.textList.shift().remove()
	}
}

Series.prototype.addText = function( canvas, message, x, y, direction, className ){
	this.textList.push( ChartUtil.addText( this.textList.length, canvas, message, x, y, direction, className ) );
}

Series.prototype.setTextStyle = function( className ){
	this.textStyle = className;
	return this;	
}

/*
 * 데이터 팁을 띄우기 위한 마우스 충돌 판정 함수 
 * 차트의 특성에 맞게 하위 클래스에서 각각 구현됨 
 */
Series.prototype.hitItem = null; //abstract

/*
 * series를 그리기 위한 렌더데이터 지정 
 */
Series.prototype.setRenderData = function( value /*object*/ ){
	this.renderData = value;
	return this;
}

/*
 * 등록된 series의 인덱스 지정 
 */
Series.prototype.setIndex = function( value /*int*/ ){
	this.index = value;
	return this;
}

/*
 * 차트 데이터 지정 
 */
Series.prototype.setData = function( value /*array*/){
	this.data = value;
	return this; 
}

/*
 * style 지정
 */
Series.prototype.setStyle = function( value /*object*/ ){
	this.style = value;
	return this;
}





//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::LineSeries:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * LineSeries
 * 꺽은선 series
 * 
 * [properties]
 * datafield : 출력하고자 하는 데이터의 종류를 얻기 위한 구분자 문자열 
 */
LineSeries.prototype = new Series("");
function LineSeries( dataField ){
	
	this.dataField = dataField;
	this.defaultStyle = { stroke:"#FF0000", lineWidth:"1", itemFill:"#FFFFFF", itemStroke:"#FF0000", itemStrokeWidth:"3", itemRadius:"2" }
	LineSeries.prototype.render = render;
	LineSeries.prototype.hitItem = hitItem;
	
	var PI2 = Math.PI*2;
	
	function render( delta ){
		var data = this.data;
		var dataField = this.dataField;
		var renderData = this.renderData;
		var context = renderData.context;
		var maxHeight = context.measureHeight+context.paddingTop;
		var minHeight = context.paddingTop;
		var minValue = renderData.minValue;
		var maxValue = renderData.maxValue;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var currentX, currentY, nextX, nextY, i, count;
		var item;
		this.items = [];
		
		context.save();
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		context.lineWidth = style.lineWidth || defaultStyle.lineWidth;	
			
		for( i=0, count=data.length-1 ; i<count ; i+=1 ){
			currentX = renderData.step * i + context.paddingLeft + context.graphMargin;
			currentY = ChartUtil.getRateToChartValue( maxHeight, minHeight, minValue, maxValue, data[i][dataField] );
			nextX = renderData.step * (i+1) + context.paddingLeft + context.graphMargin;
			nextY = ChartUtil.getRateToChartValue( maxHeight, minHeight, minValue, maxValue, data[i+1][dataField] );
			context.beginPath();
			context.moveTo( currentX, ChartUtil.getRateToChartValue( context.measureHeight, currentY, 0, 1, delta ));
			context.lineTo( nextX, ChartUtil.getRateToChartValue( context.measureHeight, nextY, 0, 1, delta ));
			context.closePath();
			context.stroke();
		}
		context.restore();
		
		context.save();
		context.lineWidth = style.itemStrokeWidth || defaultStyle.itemStrokeWidth;
		context.strokeStyle = style.itemStroke || defaultStyle.itemStroke;
		context.fillStyle = style.itemFill || defaultStyle.itemFill;
		var radius = style.itemRadius || defaultStyle.itemRadius;
		for( i=0, count=data.length ; i<count ; i+=1 ){
			currentX = renderData.step * i + context.paddingLeft + context.graphMargin;
			currentY = ChartUtil.getRateToChartValue( maxHeight, minHeight, minValue, maxValue, data[i][dataField] );
			context.beginPath();
			context.arc( currentX, ChartUtil.getRateToChartValue( context.measureHeight, currentY, 0, 1, delta ), radius, PI2, false );
			context.closePath();
			context.stroke();
			context.fill();
			item = { x:currentX, y:currentY, radius:radius, value:data[i][dataField], index:i };
			this.items[i] = item;
		}
		context.restore();
	}
	
	function hitItem( event ){
		if( this.items == null || this.items.length == 0 ) return;
		var mouseX = event.offsetX || event.layerX;
		var mouseY = event.offsetY || event.layerY;
		var context = this.renderData.context;
		var items = this.items;
		var isHit = false;
		var itemX, itemY, radius, width;
		var item;
		
		for( var i=0, count=items.length ; i<count ; i+=1 ){
			item = items[i];
			itemX = item.x;
			itemY = item.y;
			radius = item.radius+3;
		
			if( itemX+radius > mouseX  && itemX-radius < mouseX && 
				itemY+radius > mouseY  && itemY-radius < mouseY ){
				return item;
			}
		}
		return null;
	}
}





//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::UintBar Series:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * UintBarSeries
 * 막대 series ( 양수형 )
 * 
 * [properties]
 * datafield : 출력하고자 하는 데이터의 종류를 얻기 위한 구분자 문자열 
 */
UintBarSeries.prototype = new Series("");
function UintBarSeries( dataField ){
	this.dataField = dataField;
	this.defaultStyle = { fill:["#FF9900"], stroke:"#FF0000", width:"15" };
	
	UintBarSeries.prototype.render = render;
	UintBarSeries.prototype.hitItem = hitItem;
	
	function render( delta ){
		var limitMinHeght = 4;
		var data = this.data;
		var dataField = this.dataField;
		var renderData = this.renderData;
		var context = renderData.context;
		var maxHeight = context.measureHeight+context.paddingTop;
		var minHeight = context.paddingTop;
		var minValue = renderData.minValue;
		var maxValue = renderData.maxValue;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var width = style.width || defaultStyle.width;
		var fillList = style.fill || defaultStyle.fill;
		var halfTotalWidth = renderData.totalWidth/2;
		var index = this.index;
		var item;
		var x, y, height, i, j, count, subCount;
		var gradient;
		this.items = [];
		
		context.save();
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		
		var _tx, _ty, _theight;
		for( i=0, count=data.length ; i<count ; i+=1 ){
			x = (renderData.step*i+context.paddingLeft+context.graphMargin) + ( width*index-halfTotalWidth);
			y = ChartUtil.getRateToChartValue( maxHeight, minHeight, minValue, maxValue, data[i][dataField] );
			
			if( context.measureHeight+context.paddingTop-y < limitMinHeght  && data[i][dataField] > 0 ){
				y=context.measureHeight+context.paddingTop-limitMinHeght;
			}
			
			height = context.measureHeight + context.paddingTop - y;
			
			if( height != 0 ){
				if( fillList.length == 1 ){
				context.fillStyle = fillList[0]; 
				}else{
					gradient = context.createLinearGradient( x, y, x+width, y+height );
					for( j=0, subCount=fillList.length ; j<subCount ; j+=1  ){
						gradient.addColorStop( j / (subCount-1), fillList[ j ] );
					}	
					context.fillStyle = gradient;	
				}
				
	//			context.fillRect( x, ChartUtil.getRateToChartValue( context.measureHeight+context.paddingTop, y, 0, 1, delta ), width, height*delta );
	//			context.strokeRect( x, ChartUtil.getRateToChartValue( context.measureHeight+context.paddingTop, y, 0, 1, delta ), width, height*delta );
	//			item = { x:x, y:y, width:width, height:height, value:data[i][dataField], index:i };
				
				_tx = parseInt( x ) + 0.5;
				_ty = parseInt( ChartUtil.getRateToChartValue( context.measureHeight+context.paddingTop, y, 0, 1, delta ) ) + 0.5;
				_theight = parseInt( height*delta ) + 0.5;
				
				context.fillRect( _tx, _ty, width, _theight );
				context.strokeRect( _tx,_ty, width, _theight );
			}
			
			item = { x:_tx, y:_ty, width:width, height:_theight, value:data[i][dataField], index:i };
			
			this.items[i] = item;
		}
		context.restore();
	}
	
	function hitItem( event ){
		if( this.items == null || this.items.length == 0 ) return;
		var mouseX = event.offsetX || event.layerX;
		var mouseY = event.offsetY || event.layerY;
		var context = this.renderData.context;
		var items = this.items;
		var isHit = false;
		var itemX, itemY, itemWidth, itemHeight;
		var item;
		
		for( var i=0, count=items.length ; i<count ; i+=1 ){
			item = items[i];
			itemX = item.x;
			itemY = item.y;
			itemWidth = item.width;
			itemHeight = item.height;
		
			if( itemX < mouseX  && itemX+itemWidth > mouseX && 
				itemY+itemHeight > mouseY  && itemY < mouseY ){
				return item;
			}
		}
		return null;
	}
}





//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::IntBar Series::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * IntBarSeries
 * 막대 series ( 음수 포함 )
 * 
 * [properties]
 * datafield : 출력하고자 하는 데이터의 종류를 얻기 위한 구분자 문자열 
 */
IntBarSeries.prototype = new Series("");
function IntBarSeries( dataField ){
	this.dataField = dataField;
	this.defaultStyle = { heighFill:["#FF9900"], rowFill:["#4499FF"], heighStroke:"#FF0000", rowStroke:"#4499FF", width:"15" };
	
	IntBarSeries.prototype.render = render;
	IntBarSeries.prototype.hitItem = hitItem;
	
	function render( delta ){
		var limitMinHeght = 4;
		var data = this.data;
		var dataField = this.dataField;
		var renderData = this.renderData;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var index = this.index;
		var context = renderData.context;
		var minValue = renderData.minValue;
		var maxValue = renderData.maxValue;
		var width = style.width || defaultStyle.width;
		var heighFillList = style.heighFill || defaultStyle.heighFill;
		var rowFillList = style.rowFill || defaultStyle.rowFill;
		var heighStroke = style.heighStroke || defaultStyle.heighStroke;
		var rowStroke = style.rowStroke || defaultStyle.rowStroke;
		var fillList;
		var stroke;
		var halfTotalWidth = renderData.totalWidth/2;
		var baseY = renderData.baseY;
		var paddingTop = context.paddingTop;
		var paddingLeft = context.paddingLeft;
		var graphMargin = context.graphMargin;
		var measureHeight = context.measureHeight;
		var step = renderData.step;
		var item;
		var x, y, height, i, j, count, subCount;
		var value;
		var gradient;
		this.items = [];
		
		context.save();
		
		var _tx, _ty, _theight;
		for( i=0, count=data.length ; i<count ; i+=1 ){
			x = ( step*i+paddingLeft+graphMargin) + ( width*index-halfTotalWidth);
			value = data[i][dataField];
			if( value > 0 ){
				y = ChartUtil.getRateToChartValue( baseY, paddingTop , 0, maxValue, value );
				if( baseY-y < limitMinHeght  && data[i][dataField] > 0 ){
					y=baseY-limitMinHeght;
				}
				height = baseY-y;
				fillList = heighFillList;
				stroke = heighStroke;
			}else{
				y = baseY;
				height = ChartUtil.getRateToChartValue( 0, paddingTop+measureHeight-baseY , 0, minValue, value );
				if( height < limitMinHeght  && data[i][dataField] < 0 ){
					height=limitMinHeght;
				}
				fillList = rowFillList;
				stroke = rowStroke;
			}
			
			
			
			if( height != 0 ){
				if( fillList.length == 1 ){
					context.fillStyle = fillList[0]; 
				}else{
					gradient = context.createLinearGradient( x, y, x+width, y+height );
					for( j=0, subCount=fillList.length ; j<subCount ; j+=1  ){
						gradient.addColorStop( j / (subCount-1), fillList[ j ] );
					}	
					context.fillStyle = gradient;	
				}
				context.strokeStyle = stroke;
				
	//			context.fillRect( x, ChartUtil.getRateToChartValue( baseY, y, 0, 1, delta ), width, height*delta );
	//			context.strokeRect( x, ChartUtil.getRateToChartValue( baseY, y, 0, 1, delta ), width, height*delta );
	//			item = { x:x, y:y, width:width, height:height, value:value, index:i };
				
				_tx = parseInt( x ) + 0.5;
				_ty = parseInt( ChartUtil.getRateToChartValue( baseY, y, 0, 1, delta ) ) + 0.5;
				_theight = parseInt( height*delta ) + 0.5;
				
				context.fillRect( _tx, _ty, width, _theight );
				context.strokeRect( _tx, _ty, width, _theight );
			}
			
			item = { x:_tx, y:_ty, width:width, height:_theight, value:value, index:i };
			this.items[i] = item;
		}
		
		context.restore();
	}
	
	
	function hitItem( event ){
		if( this.items == null || this.items.length == 0 ) return;
		var mouseX = event.offsetX || event.layerX;
		var mouseY = event.offsetY || event.layerY;
		var context = this.renderData.context;
		var items = this.items;
		var isHit = false;
		var itemX, itemY, itemWidth, itemHeight;
		var item;
		
		for( var i=0, count=items.length ; i<count ; i+=1 ){
			item = items[i];
			itemX = item.x;
			itemY = item.y;
			itemWidth = item.width;
			itemHeight = item.height;
		
			if( itemX < mouseX  && itemX+itemWidth > mouseX && 
				itemY+itemHeight > mouseY  && itemY < mouseY ){
				return item;
			}
		}
		return null;
	}
}





//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::Pie Series:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/*
 * PieSeries
 * 부채꼴형
 * 
 * [properties]
 * datafield : 출력하고자 하는 데이터의 종류를 얻기 위한 구분자 문자열 
 */
PieSeries.prototype = new Series("");
function PieSeries( dataField, colorField ){
	this.dataField = dataField;
	this.colorField = colorField;
	this.defaultStyle = { fill:[ "#FF9900", "#44AAFF", "#DD33DD", "#FFAAFF", "#44AAAA", "#990044", "#88EEFF"], stroke:"#FF9900", startX:100, startY:100, radius:100 };
	
	PieSeries.prototype.render = render;
	PieSeries.prototype.hitItem = hitItem;
	
	function render( delta ){
		var data = this.data;
		var dataField = this.dataField;
		var colorField = this.colorField;
		var renderData = this.renderData;
		var style = this.style;
		var defaultStyle = this.defaultStyle;
		var index = this.index;
		var context = renderData.context;
		var totalValue = renderData.totalValue;
		var startX = style.startX || defaultStyle.startX;
		var startY = style.startY || defaultStyle.startY;
		var fillList = style.fill || defaultStyle.fill;
		var radius = style.radius || defaultStyle.radius;
		var font = style.font || this.defaultStyle.font;
		var startAngle, endAngle, tempAngle, textX, textY, textWidth;
		var item;
		var i, j, count;
		var value;
		this.items = [];
		startAngle = endAngle = 0 
		tempAngle = -Math.PI/2;
		
		context.save();
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 3 ;
		context.shadowBlur = 1;
		context.shadowColor = "silver"
		context.strokeStyle = style.stroke || defaultStyle.stroke;
		context.beginPath();
		context.fillStyle = "white"
		context.arc( startX, startY, radius, 0, 2*Math.PI, false );
		context.closePath();
		context.fill();
		context.restore();
		
		context.save();
		var rate;
		var color;
		for( i=0, count=data.length ; i<count ; i+=1 ){
			value = data[i][dataField];
			rate = value / totalValue * 100;
			startAngle = tempAngle;
			endAngle = ( 2 * Math.PI * ( rate / 100 ) ) + startAngle;
			tempAngle = endAngle;
			
//			context.fillStyle = fillList[i];
			color = data[i][colorField];
			context.fillStyle = ( color.charAt(0) == '#') ? color : '#' + color;
			
			context.beginPath();
			context.moveTo( startX, startY );
			context.arc( startX, startY, radius, startAngle*delta, endAngle*delta, false );
			context.closePath();
			context.fill();
			item = { startX:startX, startY:startY, radius:radius, startAngle:startAngle, endAngle:endAngle, value:value, rate:rate, index:i };
			this.items[i] = item;
		}
		
		if( delta == 1 ){
			for( var i = 0, count = this.items.length ; i < count ; i+=1 ){
				item = this.items[i];
				value = item.value;
				startAngle = item.startAngle;
				endAngle = item.endAngle;
				rate = item.value + "%";
				textX = startX + ( radius * ( Math.cos( ( endAngle + startAngle) /2 ) ) ) / 1.3;
				textY = startY + ( radius * ( Math.sin( ( endAngle + startAngle) /2 ) ) ) / 1.3;
				
				if( endAngle - startAngle > 0.2 ){
					textWidth = context.measureText( rate ).width;
					this.addText( context.canvas, rate, textX - textWidth/2, textY, "horizontal", this.textStyle )
				}
			}
		}
		context.restore();
	}
	
	
	function hitItem( event ){
		if( this.items == null || this.items.length == 0 ) return;
		var mouseX = event.offsetX || event.layerX;
		var mouseY = event.offsetY || event.layerY;
		var context = this.renderData.context;
		var items = this.items;
		var isHit = false;
		var itemStartX, itemStartY, itemStartAngle, itemEndAngle, itemRadius, distanceX, distanceX, t;
		var item;
		for( var i=0, count=items.length ; i<count ; i+=1 ){
			item = items[i];
			itemStartX = item.startX;
			itemStartY = item.startY;
			itemStartAngle = item.startAngle;
			itemEndAngle = item.endAngle;
			itemRadius = item.radius;
			distanceX = mouseX-itemStartX;
			distanceY = mouseY-itemStartY;
			t = Math.atan2( distanceY, distanceX );
			
			if( t < -Math.PI/2){ // -Math.PI/2만큼 전에서 그리기 시작하시 때문에
				t +=  Math.PI*2;
			}
			
			if( itemStartAngle < t  && itemEndAngle > t &&
				Math.abs( distanceX ) < Math.abs( itemRadius*Math.cos( t ) ) && Math.abs( distanceY ) < Math.abs( itemRadius*Math.sin( t ) ) ){
				
				return item;
			}
		}
		return null;
	}
}











