/* eslint-env jest */

import { validateKeyValue } from '../libs/validate-lib';


describe('validateKeyValue.js', () => {

  const validKey = "alpheios-feature-options__2__preferredLanguage"
  const validValue = JSON.stringify("grc")

  beforeAll(() => {
    process.env = Object.assign(process.env, { VALID_DOMAINS : ['alpheios-feature-options'] })
  })

  it('accepts valid key and value', () => {
    expect(validateKeyValue(validKey,validValue).toBeTruthy)
  })

  it('fails invalid key', () => {
    expect(validateKeyValue('fookey',validValue).toBeFalsey)
  })

  it('fails invalid value', () => {
    expect(validateKeyValue(validKey,{}).toBeFalsey)
  })

})