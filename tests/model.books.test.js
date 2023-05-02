import {BookSet} from "../dest/model/books.js"
import { bridgeSignature } from "../dest/numeric/index.js"

test('Ensure books exist for all names',()=>{
    var bookSet = new BookSet()
    expect(bookSet.book('Andrews',false)).toBeDefined()
    expect(bookSet.book('Andrews',true)).toBeDefined()
    expect(bookSet.book('Pavlicek',false)).toBeDefined()
    expect(bookSet.book('Pavlicek',true)).toBeDefined()
})