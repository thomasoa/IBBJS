/*
 * Basic code to compute binomial coefficients. 
 *
 * Caches in a Pascal Triangle of size 52 by default
 */

type PascalRow = Array<bigint|undefined>
type OptPascalRow = PascalRow | undefined 

export class ChooseCache {
    size: number;
    rows: Array<PascalRow>;

    constructor(size:number) {
        this.size = size
        this.rows = Array<PascalRow>(size) 
    }

    choose(n:number,k:number):bigint {
       if (2*k>n) { k = n-k }
       if (k<0) { return BigInt(0) }
       const lazy = (c:ChooseCache):bigint => c.choose(n-1,k-1) + c.choose(n-1,k)

       if (n>this.size) {
        return lazy(this)
       }
       if (this.rows[n]== undefined) {
        this.rows[n] = Array<bigint|undefined>(n+1)
        this.rows[n][0] = BigInt(1)
       }
       const row: PascalRow = this.rows[n]
       if (row[k] == undefined) {
        row[k] = lazy(this)
       }
       return row[k] as bigint
    }
}

var DefaultCache:ChooseCache = new ChooseCache(52);

export var choose = (n:number, k:number):bigint => DefaultCache.choose(n,k);
