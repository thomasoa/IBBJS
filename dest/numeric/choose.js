/*
 * Basic code to compute binomial coefficients.
 *
 * Caches in a Pascal Triangle of size 52 by default
 */
var ChooseCache = /** @class */ (function () {
    function ChooseCache(size) {
        this.size = size;
        this.rows = Array(size);
    }
    ChooseCache.prototype.choose = function (n, k) {
        if (2 * k > n) {
            k = n - k;
        }
        if (k < 0) {
            return BigInt(0);
        }
        var lazy = function (c) { return c.choose(n - 1, k - 1) + c.choose(n - 1, k); };
        if (n > this.size) {
            return lazy(this);
        }
        if (this.rows[n] == undefined) {
            this.rows[n] = Array(n + 1);
            this.rows[n][0] = BigInt(1);
        }
        var row = this.rows[n];
        if (row[k] == undefined) {
            row[k] = lazy(this);
        }
        return row[k];
    };
    return ChooseCache;
}());
export { ChooseCache };
var DefaultCache = new ChooseCache(52);
for (var k = 0; k <= 26; k++) {
    DefaultCache.choose(52, k);
}
export var choose = function (n, k) { return DefaultCache.choose(n, k); };
