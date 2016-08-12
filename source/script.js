
var CompareProduct = function (id) {
  this.id=id;
  this.plusPoints=[];
  this.minusPoints=[];
  this.getSumOfPoints = function() {
	return this.plusPoints.length-this.minusPoints.length;
  };

  this.addPlusPoint = function(tag) {
	this.plusPoints.push(tag);
  };

  this.isPlusPointExists = function(tag) {
	for (var i=this.plusPoints.length-1; i>=0; i--) {
		if (this.plusPoints[i] === tag) {
			return true;
		}
	}
	return false;
  };

  this.isMinusPointExists = function(tag) {
	for (var i=this.minusPoints.length-1; i>=0; i--) {
		if (this.minusPoints[i] === tag) {
			return true;
		}
	}
	return false;
  };
  
  this.removePlusPoint = function(tag) {
	for (var i=this.plusPoints.length-1; i>=0; i--) {
		if (this.plusPoints[i] === tag) {
			this.plusPoints.splice(i, 1);
		}
	}
  };
  
  this.addMinusPoint = function(tag) {
	this.minusPoints.push(tag);
  };

  this.removeMinusPoint = function(tag) {
	for (var i=this.minusPoints.length-1; i>=0; i--) {
		if (this.minusPoints[i] === tag) {
			this.minusPoints.splice(i, 1);
		}
	}
  };
};

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function initClickers() {
	for (var i=0; i<productList.length; i++) {
		for (var j=0; j<paramList.length; j++) {
			var productHash=productList[i].id;
			var paramName=paramList[j].toString();
			var idPlus='chrome-compare-point_param-product-plus-'+productHash+'-'+paramName;
		    var plusLink = document.getElementById(idPlus);
			plusLink.addEventListener('click', pushPlusPointOnClick, false);

			var idMinus='chrome-compare-point_param-product-minus-'+productHash+'-'+paramName;
		    var minusLink = document.getElementById(idMinus);
			minusLink.addEventListener('click', pushMinusPointOnClick, false);
		}
	}
}

var productList=[];
var paramList=[];
function initProducts() {
	var productSnipetList=document.getElementById("thead_main").getElementsByTagName("tr")[0].getElementsByClassName("l-compare__model");
	var productCompareParamList=document.getElementsByClassName("l-compare l-compare__type_static")[0].getElementsByClassName("l-compare__body")[0].getElementsByTagName("tr");

	for (var i=0; i<productSnipetList.length; i++) {
    	var productUri=productSnipetList[i].getElementsByClassName("compare-snippet__text")[0].getElementsByTagName("a")[0].href;
		var productHash=productUri.hashCode();
		var compareProduct=new CompareProduct(productHash);
		productList.push(compareProduct);

		productSnipetList[i].innerHTML=productSnipetList[i].innerHTML + getProductPoints(productHash);

		for (var p=0; p<productCompareParamList.length; p++) {
			var paramName=productCompareParamList[p].getAttribute("id");
			paramList.push(paramName);
			var paramProductList=productCompareParamList[p].getElementsByClassName("l-compare__model");

			paramProductList[i].getElementsByClassName("l-compare__model__i")[0].innerHTML=paramProductList[i].getElementsByClassName("l-compare__model__i")[0].innerHTML
				+getPointPanel(productHash, paramName);
		}
	}

}

function pushPlusPointOnClick() {
	var productHash=this.getAttribute("pid");
	var paramName=this.getAttribute("compareParam");
	product=getProduct(productHash);
	var minusLink=document.getElementById("chrome-compare-point_param-product-minus-"+productHash+"-"+paramName);

	// Reset to zero state
	if (product.isMinusPointExists(paramName)) {
		product.removeMinusPoint(paramName);
		this.className="";
		minusLink.className="";
	}
	else {
		product.addPlusPoint(paramName);
	}

	refreshProductPoints(productHash);
	if (product.isPlusPointExists(paramName)) {
		this.className += " chrome-compare-point-selected";
	}
	else {
		this.className="";
	}
	
	return false;

}

function pushMinusPointOnClick() {
	var productHash=this.getAttribute("pid");
	var paramName=this.getAttribute("compareParam");
	product=getProduct(productHash);
	var plusLink=document.getElementById("chrome-compare-point_param-product-plus-"+productHash+"-"+paramName);


	// Reset to zero
	if (product.isPlusPointExists(paramName)) {
		product.removePlusPoint(paramName);
		this.className="";
		plusLink.className="";
	}
	else {
		product.addMinusPoint(paramName);
	}

	refreshProductPoints(productHash);
	if (product.isMinusPointExists(paramName)) {
		this.className += " chrome-compare-point-selected";
	}
	else {
		this.className="";
	}

	return false;
}

function getPointPanel(productHash, paramName) {
	return '<span><a href="javascript:void(0);" id="chrome-compare-point_param-product-plus-'+productHash+'-'+paramName+'" pid="'+productHash+'" compareParam="'+paramName+'">+</a> <a href="javascript:void(0);" id="chrome-compare-point_param-product-minus-'+productHash+'-'+paramName+'" pid="'+productHash+'" compareParam="'+paramName+'">-</a></span>';
}

function getProductPoints(productHash) {
	product=getProduct(productHash);
	return '<span>Score: <span id="chrome-compare-point_product-points-id=' + productHash + '">'+product.getSumOfPoints()+'</span></span>';
}

function refreshProductPoints(productHash) {
	product=getProduct(productHash);
	var pointsProduct=document.getElementById('chrome-compare-point_product-points-id=' + productHash);
	if (pointsProduct) {
		pointsProduct.innerHTML=product.getSumOfPoints();
	}
	return false;
}

function getProduct(hash) {
	for (var i=0; i<productList.length; i++) {
		if (productList[i].id == hash) {
			return productList[i];
		} 
	}
	return null;
}

window.onload = function() {
	initProducts();
	initClickers();
}
