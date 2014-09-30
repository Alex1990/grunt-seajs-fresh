define(require, exports, module) {
    var Calendar = require('calendar-engine');

    $.fn.calendar = function(){
        var calendar = new Calendar();
    };
});