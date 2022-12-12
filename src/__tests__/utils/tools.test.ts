import { expect } from 'chai'
import { describe } from 'mocha'

import { keyOf, entries } from '../../utils'

const testObj = {
  a: 'a',
  b: 'b',
  c: 'c',
}

describe('utils/tools', () => {
  it('keyOf', () => {
    const ans = keyOf(testObj)
    const trueAns = Object.keys(testObj)
    for (let i = 0; i < ans.length; i++) expect(ans[i]).eq(trueAns[i])
  })
  it('entries', () => {
    const ans = entries(testObj)
    const trueAns = Object.entries(testObj)
    for (let i = 0; i < ans.length; i++)
      expect(ans[i].toString()).eq(trueAns[i].toString())
  })
})
