import {Application} from "../dest/application.js"

test("Model has editions 'Andrews' and 'Pavlicek'",()=>{
    var model =  new Application()
    var editions = model.editionNames
    expect(editions).toContain('Andrews')
    expect(editions).toContain('Pavlicek')
    expect(editions.length).toBe(2)
})