"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseCache = void 0;
var ChooseCache = /** @class */ (function () {
    function ChooseCache(size) {
        var _this = this;
        this.choose = function (n, k) {
            if (2 * k > n) {
                k = n - k;
            }
            if (k < 0) {
                return BigInt(0);
            }
            var lazy = function (c) { return c.choose(n - 1, k - 1) + c.choose(n - 1, k); };
            if (n > _this.size) {
                return lazy(_this);
            }
            if (_this.rows[n] == undefined) {
                _this.rows[n] = Array(n + 1);
                _this.rows[n][0] = BigInt(1);
            }
            var row = _this.rows[n];
            if (row[k] == undefined) {
                row[k] = lazy(_this);
            }
            return row[k];
        };
        this.size = size;
        this.rows = Array(size);
    }
    return ChooseCache;
}());
exports.ChooseCache = ChooseCache;
