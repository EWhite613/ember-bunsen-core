import {expect} from 'chai'
import {describe, it} from 'mocha'
import netmask from 'bunsen-core/validator/custom-formats/netmask'

describe('Unit: validator/custom-formats/ipv4-address', function () {
  it('returns false when value is undefined', function () {
    expect(netmask(undefined)).to.equal(false)
  })

  it('returns false when value is null', function () {
    expect(netmask(null)).to.equal(false)
  })

  it('returns false when value is an object', function () {
    expect(netmask({})).to.equal(false)
  })

  it('returns false when value is an array', function () {
    expect(netmask([])).to.equal(false)
  })

  it('returns false when value is an integer', function () {
    expect(netmask(1)).to.equal(false)
  })

  it('returns false when value is a float', function () {
    expect(netmask(0.5)).to.equal(false)
  })

  it('returns false when value is NaN', function () {
    expect(netmask(NaN)).to.equal(false)
  })

  it('returns false when value is Infinity', function () {
    expect(netmask(Infinity)).to.equal(false)
  })

  it('returns false when value does not consist of four octets', function () {
    expect(netmask('100.101.102')).to.equal(false)
  })

  it('returns false when octets contain non-numeric characters', function () {
    expect(netmask('100a.101.102.103')).to.equal(false)
    expect(netmask('100.101a.102.103')).to.equal(false)
    expect(netmask('100.101.102a.103')).to.equal(false)
    expect(netmask('100.101.102.103a')).to.equal(false)
  })

  it('returns false when octets contain negative numbers', function () {
    expect(netmask('-100.101.102.103')).to.equal(false)
    expect(netmask('100.-101.102.103')).to.equal(false)
    expect(netmask('100.101.-102.103')).to.equal(false)
    expect(netmask('100.101.102.-103')).to.equal(false)
  })

  it('returns false when octets contain numbers > 255', function () {
    expect(netmask('256.101.102.103')).to.equal(false)
    expect(netmask('100.256.102.103')).to.equal(false)
    expect(netmask('100.101.256.103')).to.equal(false)
    expect(netmask('100.101.102.256')).to.equal(false)
  })

  it('returns false when invalid netmask', function () {
    expect(netmask('127.0.0.1')).to.equal(false)
    expect(netmask('255.255.255.144')).to.equal(false)
  })

  it('returns true when valid netmask', function () {
    expect(netmask('0.0.0.0')).to.equal(true)
    expect(netmask('255.255.255.0')).to.equal(true)
    expect(netmask('255.255.255.128')).to.equal(true)
    expect(netmask('255.255.255.255')).to.equal(true)
  })
})
