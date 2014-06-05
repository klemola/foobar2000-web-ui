var FBUIFilters = angular.module('FBUIFilters', []);

FBUIFilters.filter('parseTime', function() {
    return function(ms) {
        var remaining;
        var seconds;
        var minutes;
        var hours;
        var timeUnits = [];

        if (isNaN(ms)) return '00:00';

        remaining = ms / 1000;
        seconds = Math.floor(remaining % 60);
        remaining /= 60;
        minutes = Math.floor(remaining % 60);
        remaining /= 60;
        hours = Math.floor(remaining % 24);

        [hours, minutes, seconds].forEach(function(item, iter) {
            if (item || iter > 0) {
                timeUnits.push(pad(item));
            }
        });

        return timeUnits.join(':');
    };
});

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}
