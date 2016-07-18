import {expect} from 'chai'
import {describe, it} from 'mocha'
import int16 from 'bunsen-core/validator/custom-formats/int16'

describe('Unit: validator/custom-formats/int16', () => {
  it('returns false when value is undefined', () => {
    expect(int16(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(int16(null)).to.be.false
  })

  it('returns false when value is a non-numeric string', () => {
    expect(int16('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(int16({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(int16([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(int16(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(int16(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(int16(Infinity)).to.be.false
  })

  it('returns false when value < -32768', () => {
    expect(int16(-32769)).to.be.false
    expect(int16('-32769')).to.be.false
  })

  it('returns true when -32768 <= value <= 32767', () => {
    expect(int16(-32768)).to.be.true
    expect(int16('-32768')).to.be.true
    expect(int16(32767)).to.be.true
    expect(int16('32767')).to.be.true
  })

  it('returns false when value > 32767', () => {
    expect(int16(32768)).to.be.false
    expect(int16('32768')).to.be.false
  })
})
