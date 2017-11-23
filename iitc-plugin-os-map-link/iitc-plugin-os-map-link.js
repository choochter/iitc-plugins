// ==UserScript==
// @id           iitc-plugin-os-map-link
// @name         IITC plugin: UK Ordinance Survey Link
// @author       Choochter/russkull
// @category     Layer
// @version      0.0.0.1
// @namespace    choochter-iitc-plugin-osmap
// @description  [iitc-2017-11-22]  Display a link to the UK Ordinance Survey map around a portal
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
window.plugin.osMap = function() {};

window.plugin.osMap.addLink = function(event) {
    var DEFAULT_ZOOM = 16;
    var regExp = /<([-\.0-9]*),([-\.0-9]*)>/;
    var matches = regExp.exec(event.target.innerText);
    if (matches !== null) {
        var os = '<a href= https://osmaps.ordnancesurvey.co.uk/'+matches[1]+','+matches[2]+','+DEFAULT_ZOOM+'>OS Maps</a>; ';
        console.log("Inserting additional OS Map link to dialog: " + os);
        $("#qrcode").after(os);
    }
};

var setup = function () {
  //addHook('portalDetailsUpdated', window.plugin.osMap.addLink);
    $(window ).on( "dialogopen", function( event, ui ) {
        console.log("id: " + event.target.id);
        if (event.target.id=="dialog-poslinks"){
          window.plugin.osMap.addLink(event);
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



