import { TransformKeyMap, UpcaseMap } from '../src/generic/maps'

test('UpcaseMap with default map',() => {
    const map = new UpcaseMap<string>()
    expect(map.get('x')).toBeUndefined()
    map.set('A','alpha')
    expect(map.get('a')).toBe('alpha')
    expect(map.get('A')).toBe('alpha')
    expect(map.has('a')).toBeTruthy()
    expect(map.has('A')).toBeTruthy()

    map.set('a','beta')
    expect(map.get('a')).toBe('beta')
    expect(map.get('A')).toBe('beta')    
})

test('Upcase map with provided map', () => {
    const exMap = new Map<string,string>()
    const upMap = new UpcaseMap(exMap)
    upMap.set('a','gamma')
    expect(Array.from(exMap.keys())).toEqual(['A'])
})

test('Generic constructor with provided map', () => {
    type WithToString = { toString: () => string }
    const exMap = new Map<string,string>()
    const transform = (s: WithToString) => s.toString()
    const map = new TransformKeyMap<WithToString, string,string>(transform, exMap)
    map.set(10,'ten')
    map.set(BigInt(2000),'two thousand')
    expect(Array.from(exMap.keys())).toEqual(['10','2000'])
    expect(exMap.get('10')).toBe('ten')
    expect(exMap.get('2000')).toBe('two thousand')
})