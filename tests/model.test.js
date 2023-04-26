import {Model} from "../dest/model.js"

test("Model has editions 'Andrews' and 'Pavlicek'",()=>{
    var model =  new Model()
    var editions = model.editionNames()
    expect(editions).toContain('Andrews')
    expect(editions).toContain('Pavlicek')
    expect(editions.length).toBe(2)
})