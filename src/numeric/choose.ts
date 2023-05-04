/*
* Basic code to compute binomial coefficients. 
*
* Caches in a Pascal Triangle of size 52 by default
*/

type PascalRow = Array<bigint | undefined>

export class ChooseCache {
    private rows: Array<PascalRow>;

    constructor(size: number) {
        this.rows = Array.from({ length: size + 1 }, (v, index) => this.blankRow(index))
    }

    get size(): number {
        return this.rows.length - 1
    }

    private blankRow(rowNum: number): PascalRow {
        // We only need half the row
        const columns = Math.floor(rowNum / 2) + 1
        const row = new Array<bigint | undefined>(columns)
        row[0] = BigInt(1)
        return row
    }

    private addRow(): void {
        this.rows.push(this.blankRow(this.size + 1))
    }

    private row(n: number): PascalRow {
        while (this.size < n) {
            this.addRow()
        }
        // this.rows[n] = this.rows[n] || this.blankRow(n)
        return this.rows[n]
    }

    private smallK(n: number, k: number): number {
        if (2 * k > n) {
            return n - k
        }
        return k
    }
    choose(n: number, k: number): bigint {
        k = this.smallK(n, k)
        if (k < 0) { return BigInt(0) }
        const row = this.row(n)
        row[k] = row[k] || (this.choose(n - 1, k - 1) + this.choose(n - 1, k))
        return row[k] as bigint
    }
}

const DefaultCache: ChooseCache = new ChooseCache(52);
for (let k = 0; k <= 26; k++) {
    DefaultCache.choose(52, k)
}

export const choose = (n: number, k: number): bigint => DefaultCache.choose(n, k);

export const multinomial = (parts: number[]): bigint => {
    let sum = 0
    let product = BigInt(1)
    parts.forEach((k: number): void => {
        sum += k
        product *= choose(sum, k)
    })
    return product
}
