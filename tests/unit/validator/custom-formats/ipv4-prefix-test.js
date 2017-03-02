import ipv4Prefix from 'bunsen-core/validator/custom-formats/ipv4-prefix'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('Unit: validator/custom-formats/ipv4-prefix', function () {
  it('returns false when value is undefined', function () {
    expect(ipv4Prefix(undefined)).to.equal(false)
  })

  it('returns false when value is null', function () {
    expect(ipv4Prefix(null)).to.equal(false)
  })

  it('returns false when value is an object', function () {
    expect(ipv4Prefix({})).to.equal(false)
  })

  it('returns false when value is an array', function () {
    expect(ipv4Prefix([])).to.equal(false)
  })

  it('returns false when value is an integer', function () {
    expect(ipv4Prefix(1)).to.equal(false)
  })

  it('returns false when value is a float', function () {
    expect(ipv4Prefix(0.5)).to.equal(false)
  })

  it('returns false when value is NaN', function () {
    expect(ipv4Prefix(NaN)).to.equal(false)
  })

  it('returns false when value is Infinity', function () {
    expect(ipv4Prefix(Infinity)).to.equal(false)
  })

  it('returns false when network mask is missing', function () {
    expect(ipv4Prefix('100.101.102.103')).to.equal(false)
  })

  it('returns false when ip address does not consist of four octets', function () {
    expect(ipv4Prefix('100.101.102/0')).to.equal(false)
  })

  it('returns false when octets contain non-numeric characters', function () {
    expect(ipv4Prefix('100a.101.102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101a.102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101.102a.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101.102.103a/0')).to.equal(false)
  })

  it('returns false when octets contain negative numbers', function () {
    expect(ipv4Prefix('-100.101.102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.-101.102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101.-102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101.102.-103/0')).to.equal(false)
  })

  it('returns false when octets contain numbers > 255', function () {
    expect(ipv4Prefix('256.101.102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.256.102.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101.256.103/0')).to.equal(false)
    expect(ipv4Prefix('100.101.102.256/0')).to.equal(false)
  })

  it('returns false when first octet contains numbers > 253', function () {
    expect(ipv4Prefix('254.0.0.0/0')).to.equal(false)
    expect(ipv4Prefix('255.0.0.0/0')).to.equal(false)
  })

  it('returns false when invalid IPv4 prefix', function () {
    expect(ipv4Prefix('192.168.128.0/16')).to.equal(false)
  })

  it('returns true when valid IPv4 prefix', function () {
    expect(ipv4Prefix('192.168.0.0/16')).to.equal(true)
  })
})
