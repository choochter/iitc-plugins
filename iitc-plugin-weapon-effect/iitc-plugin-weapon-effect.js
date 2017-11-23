// ==UserScript==
// @id           iitc-plugin-weapon-effect
// @name         IITC plugin: Weapon Effect
// @author       Choochter/russkull
// @category     Layer
// @version      0.0.0.1
// @namespace    choochter-iitc-plugin-weapon-effect
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
    window.plugin.weaponEffect = function () {

    };
    window.plugin.weaponEffect.removeEffect = function (e) {
        if (window.plugin.weaponEffect.weaponEffectLayer !== undefined) {
            window.plugin.weaponEffect.weaponEffectLayer.eachLayer(function(layer) {
                window.plugin.weaponEffect.weaponEffectLayer.removeLayer(layer);
            }, this);
        }
    };
    window.plugin.weaponEffect.weaponFire = function(latlng, ranges) {
        if (window.plugin.weaponEffect.weaponEffectTime === undefined || new Date() - window.plugin.weaponEffect.weaponEffectTime > 25) {
            window.plugin.weaponEffect.removeEffect(e);
            for (var i = ranges.length-1 ; i >= 0; i--) {
                var circle = new L.Circle(latlng,
                                          ranges[i].range,
                                          {color:ranges[i].color, opacity:0.7,fillColor:ranges[i].color,fillOpacity:0.1,weight:0.5,clickable:true, dashArray: [10,6]});
                circle.on("click", window.plugin.weaponEffect.removeEffect);
                window.plugin.weaponEffect.weaponEffectLayer.addLayer(circle);
            }
            window.plugin.weaponEffect.weaponEffectTime = new Date();
        }
    };

    var targetLat, targetLng, KEYCODE_X=88, KEYCODE_U=85;
    var xmpRanges = [{range: 42, color: 'red'},
                          {range: 48, color: 'red'},
                          {range: 58, color: 'red'},
                          {range: 72, color: 'red'},
                          {range: 90, color: 'red'},
                          {range: 112, color: 'red'},
                          {range: 138, color: 'red'},
                          {range: 168, color: 'red'}];
     var usRanges = [{range: 10, color: 'red'},
                          {range: 13, color: 'red'},
                          {range: 16, color: 'red'},
                          {range: 18, color: 'red'},
                          {range: 21, color: 'red'},
                          {range: 24, color: 'red'},
                          {range: 27, color: 'red'},
                          {range: 30, color: 'red'}];

    var setup = function () {
        window.plugin.weaponEffect.weaponEffectLayer = new L.LayerGroup();
        window.addLayerGroup('Weapon effect placement', window.plugin.weaponEffect.weaponEffectLayer, true);

        window.onkeydown = function(event) {
            if (event.keyCode === KEYCODE_X) {
                window.plugin.weaponEffect.weaponFire(new L.LatLng(targetLat,targetLng), xmpRanges);
            }
            if (event.keyCode === KEYCODE_U) {
                window.plugin.weaponEffect.weaponFire(new L.LatLng(targetLat, targetLng), usRanges);
            }
        };
        window.map.on('mousemove', function(e){
            targetLat = e.latlng.lat;
            targetLng = e.latlng.lng;
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


