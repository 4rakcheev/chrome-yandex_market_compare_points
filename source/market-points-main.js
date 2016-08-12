var CYMarketPoints = CYMarketPoints || {
        productList: [],
        paramList: []
};

// Main object for calculate points of comparise product
var CompareProduct = function (hash) {
    this.id = hash;
    this.plusTagList = [];
    this.minusTagList = [];

    this.getSumOfPoints = function () {
        return this.plusTagList.length - this.minusTagList.length;
    };

    this.addPlusTag = function (tag) {
        this.plusTagList.push(tag);
    };

    this.isPlusTagExists = function (tag) {
        for (var i = this.plusTagList.length - 1; i >= 0; i--) {
            if (this.plusTagList[i] === tag) {
                return true;
            }
        }
        return false;
    };

    this.isMinusTagExists = function (tag) {
        for (var i = this.minusTagList.length - 1; i >= 0; i--) {
            if (this.minusTagList[i] === tag) {
                return true;
            }
        }
        return false;
    };

    this.removePlusTag = function (tag) {
        for (var i = this.plusTagList.length - 1; i >= 0; i--) {
            if (this.plusTagList[i] === tag) {
                this.plusTagList.splice(i, 1);
            }
        }
    };

    this.addMinusTag = function (tag) {
        this.minusTagList.push(tag);
    };

    this.removeMinusTag = function (tag) {
        for (var i = this.minusTagList.length - 1; i >= 0; i--) {
            if (this.minusTagList[i] === tag) {
                this.minusTagList.splice(i, 1);
            }
        }
    };
};

// Generate hash code of String
String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

CYMarketPoints.initProducts = function() {
    var productSnipetList = document.getElementById("thead_main").getElementsByTagName("tr")[0].getElementsByClassName("l-compare__model");
    var productCompareParamList = document.getElementsByClassName("l-compare l-compare__type_static")[0].getElementsByClassName("l-compare__body")[0].getElementsByTagName("tr");

    for (var i = 0; i < productSnipetList.length; i++) {
        var productUri = productSnipetList[i].getElementsByClassName("compare-snippet__text")[0].getElementsByTagName("a")[0].href;
        var productHash = productUri.hashCode();
        var compareProduct = new CompareProduct(productHash);
        this.productList.push(compareProduct);

        productSnipetList[i].innerHTML = productSnipetList[i].innerHTML + this.getProductPoints(productHash);

        for (var p = 0; p < productCompareParamList.length; p++) {
            var paramName = productCompareParamList[p].getAttribute("id");
            this.paramList.push(paramName);
            var paramProductList = productCompareParamList[p].getElementsByClassName("l-compare__model");

            paramProductList[i].getElementsByClassName("l-compare__model__i")[0].innerHTML = paramProductList[i].getElementsByClassName("l-compare__model__i")[0].innerHTML
                + this.getPointPanel(productHash, paramName);
        }
    }

};

CYMarketPoints.initClickers = function() {
    for (var i = 0; i < this.productList.length; i++) {
        for (var j = 0; j < this.paramList.length; j++) {
            var productHash = this.productList[i].id;
            var paramName = this.paramList[j].toString();
            var idPlus = 'chrome-compare-point_param-product-plus-' + productHash + '-' + paramName;
            var plusLink = document.getElementById(idPlus);
            plusLink.addEventListener('click', pushPlusPointOnClick, false);

            var idMinus = 'chrome-compare-point_param-product-minus-' + productHash + '-' + paramName;
            var minusLink = document.getElementById(idMinus);
            minusLink.addEventListener('click', pushMinusPointOnClick, false);
        }
    }
};

function pushPlusPointOnClick() {
    var productHash = this.getAttribute("pid");
    var paramName = this.getAttribute("compareParam");
    product = CYMarketPoints.getProduct(productHash);
    var minusLink = document.getElementById("chrome-compare-point_param-product-minus-" + productHash + "-" + paramName);

    // Reset to zero state
    if (product.isMinusTagExists(paramName)) {
        product.removeMinusTag(paramName);
        this.className = "";
        minusLink.className = "";
    }
    else {
        product.addPlusTag(paramName);
    }

    CYMarketPoints.refreshProductPoints(productHash);
    if (product.isPlusTagExists(paramName)) {
        this.className += " chrome-compare-point-selected";
    }
    else {
        this.className = "";
    }

    return false;

}

function pushMinusPointOnClick() {
    var productHash = this.getAttribute("pid");
    var paramName = this.getAttribute("compareParam");
    product = CYMarketPoints.getProduct(productHash);
    var plusLink = document.getElementById("chrome-compare-point_param-product-plus-" + productHash + "-" + paramName);

    // Reset to zero
    if (product.isPlusTagExists(paramName)) {
        product.removePlusTag(paramName);
        this.className = "";
        plusLink.className = "";
    }
    else {
        product.addMinusTag(paramName);
    }

    CYMarketPoints.refreshProductPoints(productHash);
    if (product.isMinusTagExists(paramName)) {
        this.className += " chrome-compare-point-selected";
    }
    else {
        this.className = "";
    }

    return false;
}

CYMarketPoints.getPointPanel = function(productHash, paramName) {
    return '<span><a href="javascript:void(0);" id="chrome-compare-point_param-product-plus-' + productHash + '-' + paramName + '" pid="' + productHash + '" compareParam="' + paramName + '">+</a> <a href="javascript:void(0);" id="chrome-compare-point_param-product-minus-' + productHash + '-' + paramName + '" pid="' + productHash + '" compareParam="' + paramName + '">-</a></span>';
};

CYMarketPoints.getProductPoints = function(productHash) {
    product = this.getProduct(productHash);
    return '<span>Score: <span id="chrome-compare-point_product-points-id=' + productHash + '">' + product.getSumOfPoints() + '</span></span>';
};

CYMarketPoints.refreshProductPoints = function(productHash) {
    product = this.getProduct(productHash);
    var pointsProduct = document.getElementById('chrome-compare-point_product-points-id=' + productHash);
    if (pointsProduct) {
        pointsProduct.innerHTML = product.getSumOfPoints();
    }
    return false;
};

CYMarketPoints.getProduct = function(hash) {
    for (var i = 0; i < this.productList.length; i++) {
        if (this.productList[i].id == hash) {
            return this.productList[i];
        }
    }
    return null;
};

window.onload = function () {
    CYMarketPoints.initProducts();
    CYMarketPoints.initClickers();
};
