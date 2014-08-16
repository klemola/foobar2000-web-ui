/* exported FBUI */
'use strict';

var FBUI = angular.module('FBUI', [
    'ngAnimate',
    'btford.socket-io',
    'FBUIControllers',
    'FBUIServices',
    'FBUIFilters'
]);

FBUI.constant('serverInfo', {
    address: SERVER_ADDRESS,
    port: SERVER_PORT
})

angular.element(document.getElementById('playpause'))
    .removeClass('glyphicon-play')
    .addClass('{{(playBackStatus.status.state === "playing") && "glyphicon-pause" || "glyphicon-play"}}');
