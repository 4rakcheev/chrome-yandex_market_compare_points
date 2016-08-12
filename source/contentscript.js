// Create main script tag at the page
var s = document.createElement('script');
s.src = chrome.extension.getURL('market-points-main.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};
