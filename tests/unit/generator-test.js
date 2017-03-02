import {generateView} from 'bunsen-core/generator'
import {expect} from 'chai'
import {beforeEach, describe, it} from 'mocha'

import arrayModel from '../fixtures/array-model'
import arrayView from '../fixtures/array-view'
import dependenciesModel from '../fixtures/dependencies-model'
import dependenciesView from '../fixtures/dependencies-view'
import simpleModel from '../fixtures/simple-model'
import simpleView from '../fixtures/simple-view'

describe('generateView()', () => {
  let result
  describe('simple schema', () => {
    beforeEach(() => {
      result = generateView(simpleModel)
    })

    it('creates proper simple layout', () => {
      expect(result).deep.equal(simpleView)
    })
  })

  describe('array schema', () => {
    beforeEach(() => {
      result = generateView(arrayModel)
    })

    it('creates proper array layout', () => {
      expect(result).deep.equal(arrayView)
    })
  })

  describe('dependencies schema', () => {
    beforeEach(() => {
      result = generateView(dependenciesModel)
    })

    it('creates proper dependencies layout', () => {
      expect(result).deep.equal(dependenciesView)
    })
  })
})
