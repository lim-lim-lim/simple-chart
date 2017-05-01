function ChartUtil(){}

/*
 * 비례식 currentValue가 min2~max2까지 변할때 min~max까지의 값을 반환
 */ 
ChartUtil.getRateToChartValue = function( min/*number*/, max/*number*/, min2/*number*/, max2/*number*/, currentValue/*number*/ ){
	return ( max - min ) / ( max2 - min2 ) * ( currentValue - min2 ) + min;
}

/*
 * 함수의 scope변경 
 */
ChartUtil.delegate = function ( target/*object*/, func/*function*/ ){
	return function( data ){ return func.call( target, data ); };
}

/*
 * degree -> radian
 */
ChartUtil.getRadian = function ( value /*number*/ ){
	return value*Math.PI/180;
}

/*
 * radian -> degree
 */
ChartUtil.getDegree = function ( value /*number*/ ){
	return value*180/Math.PI;
}

/*
 * series( array )중 가장 큰 값을 반환
 */
ChartUtil.getMaxValueInSeries = function ( data/*object*/, series/*array*/ ){
	var each;
	var count = series.length;
	var subCount;
	var result=0;
	while( count ){
		each = series[ --count ];
		subCount = data.length;
		while( subCount ){
			result = Math.max( result, data[ --subCount ][ each.dataField ] );
		}
	}
	return ChartUtil.getValidataMax( result );
}

/*
 * series( array )중 가장 작은 값을 반환
 */
ChartUtil.getMinValueInSeries = function ( data, series/*array*/ ){
	var each;
	var count = series.length;
	var subCount;
	var result=0;
	while( count ){
		each = series[ --count ];
		subCount = data.length;
		while( subCount ){
			result = Math.min( result, data[ --subCount ][ each.dataField ] );
		}
	}
	return ChartUtil.getValidataMin( result );
}

/*
 * series의 아이템 중 가장 큰값을 반환
 */
ChartUtil.getMaxItemInSeries = function ( series/*array*/ ){
	var each;
	var count = series.length;
	var subCount;
	var result={value:0};
	var item;
	while( count ){
		each = series[ --count ];
		subCount = each.items.length;
		while( subCount ){
			item = each.items[ --subCount ];
			if( Number(result.value) <= Number(item.value) ){
				result = item;
			}
		}
	}
	return result;
}

/*
 * series의 아이템 중 가장 작은 값을 반환
 */
ChartUtil.getMinItemInSeries = function ( data/*object*/, series/*array*/ ){
	var each;
	var count = series.length;
	var subCount;
	var result={value:0};
	var item;
	while( count ){
		each = series[ --count ];
		subCount = each.items.length;
		while( subCount ){
			item = each.items[ --subCount ];
			if( Number(result.value) >= Number(item.value) ){
				result = item;
			}
		}
	}
	return result;
}

/*
 * 최대값 설정 ( 요구사항 문서 참고 )
 */
ChartUtil.getValidataMax = function( value/*number*/ ){
	if( value <= 100 ){
		return 100;
	}else if( 100 < value && value < 1000 ){
		return Math.ceil( value/10 )*10;
	}else if( 1000 < value < 10000 ){
		return Math.ceil( value/1000 )*1000;
	}else if( 10000 < value < 100000 ){
		return Math.ceil( value/10000 )*10000;
	}else if( 100000 < value < 1000000 ){
		return Math.ceil( value/100000 )*100000;
	}else if( 1000000 < value < 10000000 ){
		return Math.ceil( value/1000000 )*1000000;
	}else if( 10000000 < value < 100000000 ){
		return Math.ceil( value/10000000 )*10000000;
	}
}

/*
 * 최소값 설정
 */
ChartUtil.getValidataMin = function( value/*number*/ ){
	if( value >= -100 ){
		return -100;
	}else if( -100 > value && value > -1000 ){
		return Math.floor( value/10 )*10;
	}else if( -1000 > value > -10000 ){
		return Math.floor( value/1000 )*1000;
	}else if( -10000 > value > -100000 ){
		return Math.floor( value/10000 )*10000;
	}else if( -100000 > value > -1000000 ){
		return Math.floor( value/100000 )*100000;
	}else if( -1000000 > value > -10000000 ){
		return Math.floor( value/1000000 )*1000000;
	}else if( 10000000 < value > 100000000 ){
		return Math.floor( value/10000000 )*10000000;
	}
}

/*
 * 천단위 콤마 
 */
ChartUtil.getMoney = function( value/*number*/ ){
	if( typeof(value) == 'number' ) {
		value = value.toString();
	}
	
	var result = value.replace(/,/g, "");
	while((/(-?[0-9]+)([0-9]{3})/).test(result)) {
		result = result.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
	}
	return result;
}

/*
 * 타입에 따라 적절한 값을 포멧팅해서 반환  
 */
ChartUtil.getConvert2ValueType = function( type/*string*/, value/*number*/ ){
	switch( type ){
		case Chart.VALUE_TYPE_MONEY: return ChartUtil.getMoney( value );  break;
		case Chart.VALUE_TYPE_NUMBER: return value; break;
	}
}

/*
 * 금액 한글 표시( 요구사항에서 없어졌지만 혹시 몰라 남겨둠 )
 */
ChartUtil.getConvertNumber2Kr = function( value/*number*/ ){
	var won = []
	var re = /^[1-9][0-9]*$/;
	var num = value.toString().split(',').join('');
	
	if ( re.test(num) ) {
		var price_unit0 = new Array('','1','2','3','4','5','6','7','8','9');
		var price_unit1 = new Array('','십','백','천');
		var price_unit2 = new Array('','만','억','조','경','해','시','양','구','간','정');
		for(i = num.length-1; i >= 0; i--) {
			won[i] = price_unit0[num.substr(num.length-1-i,1)];
			if(i > 0 && won[i] != '') won[i] += price_unit1[i%4];
			if(i % 4 == 0) won[i] += price_unit2[(i/4)];
		}
		for(i = num.length-1; i >= 0; i--) {
			if(won[i].length == 2) won[i-i%4] += '-';
			if(won[i].length == 1 && i > 0) won[i] = '';
			if(i%4 != 0) won[i] = won[i].replace('일','');
		}
	} 
	return won.reverse().join('').replace(/-+/g,'');	
} 

/*
 * 텍스트 출력 ( 엘리먼트 이용 )
 */ 
ChartUtil.addText = function( index, canvas, message, x, y, direction, className ){
	
	if( !direction ) direction = "horizontal";
	if( !className ) className = "commonText";
	
	var $parent = $( canvas ).parent();
	var $text = $("#" + canvas.id + "_text" + index );
	if( $text.length == 0 ){
		$text = $("<span></span>");
		$text.appendTo( $parent );
		$text.addClass( className );
	}
	
	switch( direction ){
		case "vertical" :
			if( isNaN( Number(message) ) ){ // 숫자는 내려쓰기 하지 않음.
				var temp = message.split("");
				message = "";
				for( var i=0, count=temp.length ; i<count ; i+=1 ){
					message += temp[ i ] + "<br>";
				}
				x = x-parseInt( $text.css( "fontSize" )  )/2;	
			}
			break;
			
		case "horizontal" :
			if( $text.css( "vertical-align" ) == "middle" ){
				y = y-parseInt( $text.css( "fontSize" )  )/2;
			}  
			break;		
	}
	
	$text.html( message );
	$text.css( { left:x, top:y } );
	return $text;
}










