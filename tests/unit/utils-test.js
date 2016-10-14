import {expect} from 'chai'
import {describe, it} from 'mocha'
import utils from 'bunsen-core/utils'

describe('utils', function () {
  describe('.getModelPath()', function () {
    it('handles top-level properties', function () {
      expect(utils.getModelPath('fooBar')).to.equal('properties.fooBar')
    })

    it('handles nested properties', function () {
      expect(utils.getModelPath('foo.bar.baz')).to.equal('properties.foo.properties.bar.properties.baz')
    })

    it('handles invalid trailing dot reference', function () {
      expect(utils.getModelPath('foo.bar.')).to.equal(undefined)
    })

    it('handles invalid leading dot reference', function () {
      expect(utils.getModelPath('.foo.bar')).to.equal(undefined)
    })

    it('handles model with dependency', function () {
      const expected = 'dependencies.useEft.properties.routingNumber'
      expect(utils.getModelPath('routingNumber', 'useEft')).to.equal(expected)
    })

    it('handles model with dependency', function () {
      const expected = 'properties.paymentInfo.dependencies.useEft.properties.routingNumber'
      expect(utils.getModelPath('paymentInfo.routingNumber', 'paymentInfo.useEft')).to.equal(expected)
    })

    it('handles properties on array items', function () {
      expect(utils.getModelPath('foo.bar.0.baz')).to.equal('properties.foo.properties.bar.items.properties.baz')
    })
  })

  describe('orch filter processing', function () {
    const objToMine = {
      foo: 'bar',
      fizz: {
        foo: 'bar',
        futz: [
          {
            foo: 'bar'
          },
          {
            fizz: 'buzz',
            farz: 'barz'
          }
        ],
        fatz: 'batz'
      }
    }

    it('finds absolute paths in a value object', function () {
      const expected = 'bar'
      expect(utils.findValue(objToMine, 'fizz.futz.[0].foo')).to.equal(expected)
    })

    it('finds parent paths in the object', function () {
      const startPath = 'fizz.futz.[1].fizz'
      let valuePath = '../../fatz'
      let expected = 'batz'
      expect(utils.findValue(objToMine, valuePath, startPath)).to.equal(expected)
      valuePath = '../[0].foo'
      expected = 'bar'
      expect(utils.findValue(objToMine, valuePath, startPath)).to.equal(expected)
    })

    it('finds sibling paths in the object', function () {
      const startPath = 'fizz.futz.[1].fizz'
      const valuePath = './farz'
      const expected = 'barz'
      expect(utils.findValue(objToMine, valuePath, startPath)).to.equal(expected)
    })

    it('populates variables in orch-style query params ', function () {
      let query = {something: '${fizz.futz[0].foo}'}
      const expected = '{"something":"bar"}'
      expect(utils.parseVariables(objToMine, JSON.stringify(query))).to.equal(expected)
    })

    it('properly configures an Orchestrate query object', function () {
      let startPath = 'fizz.futz.[0].foo'
      let query = {
        resourceType: 'something.this.that',
        q: 'label:thing,someId:${../[1].fizz}',
        p: 'orchState:ac,someOtherId:${foo}'
      }
      let expected = {
        resourceType: 'something.this.that',
        q: 'label:thing,someId:buzz',
        p: 'orchState:ac,someOtherId:bar'
      }
      let actual = utils.populateQuery(objToMine, query, startPath)
      expect(JSON.stringify(actual)).to.equal(JSON.stringify(expected))
    })
  })

  describe('.parseVariables()', function () {
    it('does not throw error when queryJSON not present', function () {
      expect(() => {
        utils.parseVariables({}, undefined)
      }).not.to.throw()
    })
  })

  describe('.populateQuery()', function () {
    it('does not throw error when query not present', function () {
      expect(() => {
        utils.populateQuery({}, undefined)
      }).not.to.throw()
    })

    it('does not throw error when query dependency is not present', function () {
      expect(function () {
        utils.populateQuery({}, {node: '${./node}'})
      }).not.to.throw()
    })
  })
})
