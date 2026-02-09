import {add} from './add'
import {obj} from './add'

describe('add function', ()=>{
  // happy path
  test('should correctly add two positive number', ()=> {
    const result = add(1, 1)

    expect(result).toBe(2)
  })

  // negative
  test('should return negative when adding two negative', ()=> {
    const result = add(-1, -1)

    expect(result).toBe(-2)
  })

  // edge case
  test('what if adding zero', ()=> {
    const result = add(7, 0)

    expect(result).toBe(7)
  })

})

// minimal untuk comprehensive testing melakukan positive, negative, edge case 

describe('obj function', ()=> {
  test('should correctly return object value', ()=> {
    expect({ num1: 1, num2: 2}).toEqual({ num1: 1, num2: 2})
  })

  test('should correctly defined value', ()=> {
    expect({ num1: 1, num2: 2}).toBeDefined() // toBeDefined itu adalah yang penting absen
  })

  test('should correctly undefined value', ()=> {
    const value = undefined;
    expect(value).toBeUndefined()
  })

  test('should correctly truthy value', ()=> {
    const value = 1;
    expect(value).toBeTruthy()
  })

  test('should correctly false value', ()=> {
    const value = 0;
    expect(value).toBeFalsy()
  })

  test('should correctly contain value', ()=> {
    const value = 'revou';
    expect(value).toContain('vou')
  })
})