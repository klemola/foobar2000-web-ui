var FBUI = angular.module('FBUI', [
    'ngAnimate',
    'btford.socket-io',
    'FBUIControllers',
    'FBUIServices',
    'FBUIFilters'
]);

angular.element(document.getElementById('playpause'))
    .removeClass('glyphicon-play')
    .addClass('{{(foobarStatus.playBackStatus === "playing") && "glyphicon-pause" || "glyphicon-play"}}');
