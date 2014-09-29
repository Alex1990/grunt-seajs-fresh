define(function(require, exports, module) {
    var $ = require('jQuery');
    var alert = require('alert');

    var out = {
        alert: function(o) {
            $.alert(o);
        }
    };

    module.exports = out;
});