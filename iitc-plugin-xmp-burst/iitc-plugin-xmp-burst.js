// ==UserScript==
// @id           iitc-plugin-xmp-burst
// @name         IITC plugin:XMP Burst
// @author       Choochter/russkull
// @category     Layer
// @version      0.0.0.1
// @namespace    choochter-iitc-plugin-xmp-burst
// @description  [iitc-2017-05-04]  Adds an XMP burst to the map on context-click
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
function wrapper(plugin_info) {
  // Ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {
  };
// PLUGIN START ////////////////////////////////////////////////////////
// use own namespace for plugin
window.plugin.xmpBurst = function () {
};
window.plugin.xmpBurst.removeBurst = function (e) {
   if (window.plugin.xmpBurst.xmpBurstLayer !== undefined) {
      window.plugin.xmpBurst.xmpBurstLayer.eachLayer(function(layer) {
			window.plugin.xmpBurst.xmpBurstLayer.removeLayer(layer);
		}, this);
   }
};

var setup = function () {
    window.plugin.xmpBurst.xmpBurstLayer = new L.LayerGroup();
    window.addLayerGroup('XMP Burst placement', window.plugin.xmpBurst.xmpBurstLayer, true);
    window.map.on('contextmenu',     function (e) {
         if (window.plugin.xmpBurst.xmpBurstTime === undefined || new Date() - window.plugin.xmpBurst.xmpBurstTime > 25) {
          window.plugin.xmpBurst.removeBurst(e);
         // var coo = e.latlng;
          var latlng = new L.LatLng(e.latlng.lat,e.latlng.lng);
          var ranges = [{range: 42, color: 'red'}, {range: 48, color: 'red'}, {range: 58, color: 'red'}, {range: 72, color: 'red'},
                        {range: 90, color: 'red'}, {range: 112, color: 'red'}, {range: 138, color: 'red'}, {range: 168, color: 'red'}];
          for (var i = ranges.length-1 ; i >= 0; i--) {
            var circle = new L.Circle(latlng,
                                      ranges[i].range,
                                      {color:ranges[i].color, opacity:0.7,fillColor:ranges[i].color,fillOpacity:0.1,weight:0.5,clickable:true, dashArray: [10,6]});
            circle.on("click", window.plugin.xmpBurst.removeBurst);
            window.plugin.xmpBurst.xmpBurstLayer.addLayer(circle);
          }
          window.plugin.xmpBurst.xmpBurstTime = new Date();
    }
      });

};
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


