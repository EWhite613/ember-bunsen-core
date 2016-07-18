import {expect} from 'chai'
import {describe, it} from 'mocha'
import uint16 from 'bunsen-core/validator/custom-formats/uint16'

describe('Unit: validator/custom-formats/uint16', () => {
  it('returns false when value is undefined', () => {
    expect(uint16(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(uint16(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(uint16('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(uint16({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(uint16([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(uint16(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(uint16(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(uint16(Infinity)).to.be.false
  })

  it('returns false when value = -1', () => {
    expect(uint16(-1)).to.be.false
    expect(uint16('-1')).to.be.false
  })

  it('returns true when 0 <= value <= 65535', () => {
    expect(uint16(0)).to.be.true
    expect(uint16('0')).to.be.true
    expect(uint16(65535)).to.be.true
    expect(uint16('65535')).to.be.true
  })

  it('returns false when value = 65536', () => {
    expect(uint16(65536)).to.be.false
    expect(uint16('65536')).to.be.false
  })
})
