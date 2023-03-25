"use strict";
exports.__esModule = true;
exports.escape = void 0;
function escape(value) {
    return value.replace(/[^a-zA-Z0-9_]/g, function (x) {
        return "\\" + x;
    });
}
exports.escape = escape;
