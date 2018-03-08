// ==UserScript==
// @id           iitc-plugin-show-coords
// @name         IITC plugin: Show Coordinates
// @category     Layer
// @version      0.0.0.1
// @namespace    choochter-iitc-plugin-coords
// @description  [iitc-2018-01-23]  Display the coordinates of the mouse pointer and/or map center.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==

/* Portions of the code taken and/or adapted from https://github.com/FCOO & http://mrmufflon.github.io/Leaflet.Coordinates */

function wrapper(plugin_info) {
  // Ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {
  };
// PLUGIN START ////////////////////////////////////////////////////////
// use own namespace for plugin
window.plugin.displayCenter = function () {
};

var setup = function () {
$('<style>').prop('type', 'text/css').html('.leaflet-center {\nposition: relative !important;\nleft	: 0;\nright	: 0;\nalign-items : center;\ndisplay : flex;\nflex-direction : column;\njustify-content: center;\n.leaflet-control {\nbottom: 0;}\n}\n').appendTo('head');
$('<style>').prop('type', 'text/css').html('.leaflet-control-container .leaflet-control-bottomcenter {\nposition: absolute;\nbottom : 0;\nleft : 0;\nright : 0;\n}\n').appendTo('head');
$('<style>').prop('type', 'text/css').html('.leaflet-control-coordinates {\nbackground-color:#D8D8D8;\nbackground-color:rgba(255, 255, 255, 0.8);\ncursor:pointer;\nwebkit-border-radius:5px;\n-moz-border-radius:5px;\nborder-radius:5px;\n}\n.leaflet-control-coordinates .uiElement {\nmargin:4px;\n}\n.leaflet-control-coordinates .uiElement .coordspan {\nmargin-right:4px;\n}\n.leaflet-control-coordinates .uiElement.label {\ncolor:inherit;\nfont-weight: inherit;\nfont-size: inherit;\npadding: 0;\ndisplay: inherit;}').appendTo('head');
/* Uncomment for mouse coordinates */
window.map.addControl(new L.Control.Coordinates({position:"bottomcenter", track:"mouse" }));
/* Uncomment for map center coordinates */
// window.map.addControl(new L.Control.Coordinates({position:"bottomcenter", track:"center" }));

};

(function (L /*, window, document, undefined*/) {
    "use strict";
    //Extend Map._initControlPos to also create a topcenter and bottomcenter containers
    L.Map.prototype._initControlPos = function ( _initControlPos ) {
        return function () {
            //Original function/method
            _initControlPos.apply(this, arguments);
            //Adding new control-containers
            //topcenter is the same as the rest of control-containers
            this._controlCorners['topcenter'] = L.DomUtil.create('div', 'leaflet-top leaflet-center', this._controlContainer);
            //bottomcenter need an extra container to be placed at the bottom
            this._controlCorners['bottomcenter'] =
                L.DomUtil.create('div','leaflet-bottom leaflet-center',L.DomUtil.create('div', 'leaflet-control-bottomcenter',this._controlContainer));
        };
    } (L.Map.prototype._initControlPos);
}(L, this, document));

L.Control.Coordinates = L.Control.extend({
	options: { position: 'bottomcenter', track: 'mouse'   /* track the 'mouse'  or the 'center' of the map */, decdigits: 4
    },
	onAdd: function(map) {
        this._map = map;
		var className = 'leaflet-control-coordinates',
            container = this._container = L.DomUtil.create('div', className),
            options = this.options;
		//label containers
		this._labelcontainer = L.DomUtil.create("div", "uiElement label", container);
		this._label = L.DomUtil.create("span", "coordspan", this._labelcontainer);
		//connect to mouseevents or dragging
		map.on("mousemove", this._update, this);
        map.on("drag", this._update, this);
        map.on("dragend", this._update, this);
		map.whenReady(this._update, this);
		return container;
	},
	onRemove: function(map) {
        map.off("mousemove", this._update, this);
        map.off("drag", this._update, this);
        map.off("dragend", this._update, this);
	},
	_update: function(evt) {
		var pos = evt.latlng;
		if (pos && this.options.track === 'mouse') {
			this._currentPos = pos;
		} else if (this.options.track === 'center') {
            pos = map.getCenter();
        }
        if (pos){
            pos = pos.wrap();
            this._label.innerHTML = pos.lat.toFixed(this.options.decdigits) + " " + pos.lng.toFixed(this.options.decdigits);
        }
	}
});
//map init hook
L.Map.mergeOptions({
	coordinateControl: false
});

L.Map.addInitHook(function() {
	if (this.options.coordinateControl) {
		this.coordinateControl = new L.Control.Coordinates();
		this.addControl(this.coordinateControl);
	}
});

//PLUGIN END //////////////////////////////////////////////////////////

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


