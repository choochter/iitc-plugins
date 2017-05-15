// ==UserScript==
// @id           iitc-plugin-highlight-ap
// @name         IITC plugin: AP Portal Highlighter
// @category     Highlighter
// @version      0.0.0.1
// @namespace    choochter-iitc-plugin-highlight-ap
// @description  [iitc-2017-05-04] Use the portal fill color to denote how many APs a portal will yield. Black: above 30k, Green:above 20k, Yellow: above 10k. Orange: above 5k. Red: above 15%. Magenta: below 15%.
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
window.plugin.portalHighlighterAPGain = function () {
};
  window.DEPLOY_MOD = 125;
  window.plugin.portalHighlighterAPGain.setPortalStyle = function(portal, apGain){
  if (apGain !== undefined && apGain > 2600) {
    if (apGain > 20000) {
      portal.setStyle({ fillColor: 'black', fillOpacity: 0.8});
    } else if (apGain > 15000) {
      portal.setStyle({ fillColor: '#e0e0e0', fillOpacity: 0.8});
    } else if (apGain > 10000) {
      portal.setStyle({ fillColor: '#D9D919', fillOpacity: 0.8});
    } else if (apGain > 6000) {
      portal.setStyle({ fillColor: 'silver', fillOpacity: 0.8});
    } else {
      portal.setStyle({ fillColor: '#B5A642', fillOpacity: 0.8});
    }
  } else {
    if (portal.options.team == TEAM_ENL){
      portal.setStyle({ fillColor: COLORS[TEAM_ENL], fillOpacity: 0.25});
    } else if (portal.options.team == TEAM_RES){
      portal.setStyle({ fillColor: COLORS[TEAM_RES], fillOpacity: 0.25});
    } else {
      portal.setStyle({ fillColor: COLORS[TEAM_NONE], fillOpacity: 0.25});
    }
  }
};
window.plugin.portalHighlighterAPGain.refreshHighlights = function() {
  var displayBounds = map.getBounds();
  $.each(window.portals, function(ind, portal) {
    if(displayBounds.contains(portal.getLatLng())){ // only calculate if on screen!
      var apgain=window.plugin.portalHighlighterAPGain.calculatePortalAPGain(portal);
      window.plugin.portalHighlighterAPGain.setPortalStyle(portal, apgain);
    }
    return true;
  });
};
window.plugin.portalHighlighterAPGain.calculatePortalAPGain = function(portal){
    var apgain = 0;
    var linkInfo = getPortalLinks(portal.options.guid);
    var linkCount = linkInfo.in.length + linkInfo.out.length;
    var fieldCount = getPortalFieldsCount(portal.options.guid);
    var player = window.PLAYER;
    var apgains = window.portalApGainMaths(portal.options.data.resCount, linkCount, fieldCount);
    if (window.PLAYER.team.charAt(0) != portal.options.data.team) {
      apgain += apgains.enemyAp;
      // inbuilt IITC function portalApGainMaths ignores mods - but on a recapture 2 can always be deployed
      apgain += 2 * DEPLOY_MOD;
    } else { // Already owned by team so can only deploy what's left (or upgrade/mod to gain AP but that data isn't available)
      apgain += apgains.friendlyAp;
    }
    return apgain;
};
window.plugin.portalHighlighterAPGain.highlight = function (data) {
   //   var apgain=window.plugin.portalHighlitherAPGain.calculatePortalAPGain(data.portal);
   // window.plugin.portalHighlighterAPGain.setPortalStyle(data.portal, apgain);
};
var setup = function () {
  window.addPortalHighlighter('AP Gain', window.plugin.portalHighlighterAPGain.highlight);
  window.addHook('mapDataRefreshEnd', window.plugin.portalHighlighterAPGain.refreshHighlights);
  window.addHook('portalDetailsUpdated', window.plugin.portalHighlighterAPGain.refreshHighlights);
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


