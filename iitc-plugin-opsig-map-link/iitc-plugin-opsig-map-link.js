// ==UserScript==
// @id           iitc-plugin-os-signal-map-link
// @name         IITC plugin: UK Mobile Open Signal Link
// @author       Choochter/russkull
// @category     Layer
// @version      0.0.0.1
// @namespace    choochter-iitc-plugin-opsigmap
// @description  [iitc-2018-02-28]  Display a link to the OpenSignal coverage map around a portal
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
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.opsigMap = function() {};

window.plugin.opsigMap.addLink = function(event) {
    var DEFAULT_ZOOM = 13;
    var OFFSET = 1.0;
    var regExp = /<([-\.0-9]*),([-\.0-9]*)>/;
    var matches = regExp.exec(event.target.innerText);
    if (matches !== null) {
        var lat = parseFloat(matches[1]);
        var lng = parseFloat(matches[2]);
        var opsig = '<a href="https://opensignal.com/?z='+DEFAULT_ZOOM+'&minLat='+(lat-OFFSET)+'&maxLat='+(lat+OFFSET)+'&minLng='+(lng-OFFSET)+'&maxLng='+(lng+OFFSET)+'&s=all&t=2-3-4">OpenSignal</a>; ';
        //var os = '<a href= https://osmaps.ordnancesurvey.co.uk/'+matches[1]+','+matches[2]+','+DEFAULT_ZOOM+'>OS Maps</a>; ';
        console.log("Inserting additional OpenSignal Map link to dialog: " + opsig);
        $("#qrcode").after(opsig);
    }
};

var setup = function () {
    $(window ).on( "dialogopen", function( event, ui ) {
        console.log("id: " + event.target.id);
        if (event.target.id=="dialog-poslinks"){
          window.plugin.opsigMap.addLink(event);
        }
    } );
};


// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
}; // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);




