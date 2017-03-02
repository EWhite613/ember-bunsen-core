
import {CHANGE_VALUE, VALIDATION_RESOLVED, changeValue, validate} from 'bunsen-core/actions'
import {expect} from 'chai'
import _ from 'lodash'
import {describe, it} from 'mocha'

describe('Unit: actions', function () {
  describe('changeValue action', function () {
    it(`returns a dispatcher action with type "${CHANGE_VALUE}"`, function () {
      const action = changeValue('some.path', 'value')

      expect(action).to.eql({
        type: CHANGE_VALUE,
        bunsenId: 'some.path',
        value: 'value'
      })
    })
  })

  describe('validate action', function () {
    const SCHEMA_WITH_DEFAULTS = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          default: 'Bruce'
        },
        lastName: {
          type: 'string',
          default: 'Wayne'
        },
        alias: {
          type: 'string',
          title: 'Nickname',
          default: 'Batman'
        },
        onlyChild: {
          type: 'boolean',
          default: true
        },
        age: {
          type: 'number',
          title: 'Age'
        }
      },
      required: ['lastName']
    }
    const SCHEMA_WITH_OBJECT_DEFAULTS = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          default: 'Bruce'
        },
        lastName: {
          type: 'string',
          default: 'Wayne'
        },
        alias: {
          type: 'string',
          title: 'Nickname',
          default: 'Batman'
        },
        onlyChild: {
          type: 'boolean',
          default: true
        },
        age: {
          type: 'number',
          title: 'Age'
        }
      },
      required: ['lastName'],
      default: {
        firstName: 'Clark',
        lastName: 'Kent',
        alias: 'Superman'
      }
    }
    const SCHEMA_WITH_DEEP_DEFAULTS = {
      type: 'object',
      properties: {
        someotherProp: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  default: 'Bruce'
                },
                lastName: {
                  type: 'string',
                  default: 'Wayne'
                }
              }
            }
          }
        },
        alias: {
          type: 'string',
          title: 'Nickname',
          default: 'Batman'
        }
      },
      required: ['alias']
    }

    const SCHEMA_WITH_REFS = {
      type: 'object',
      properties: {
        hero: {
          type: 'object',
          '$ref': '#/definitions/superhero'
        }
      },
      required: ['hero'],
      definitions: {
        superhero: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              default: 'Bruce'
            },
            lastName: {
              type: 'string',
              default: 'Wayne'
            },
            alias: {
              type: 'string',
              title: 'Nickname',
              default: 'Batman'
            }
          }
        }
      }
    }

    const SCHEMA_WITH_NO_DEFAULTS = {
      type: 'object',
      properties: {
        someotherProp: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string'
                },
                lastName: {
                  type: 'string'
                }
              }
            }
          }
        },
        alias: {
          type: 'string',
          title: 'Nickname'
        }
      }
    }

    const SCHEMA_WITH_ARRAY_DEFAULTS = {
      type: 'object',
      properties: {
        superheroes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                default: 'Bruce'
              },
              lastName: {
                type: 'string',
                default: 'Wayne'
              },
              alias: {
                type: 'string',
                title: 'Nickname',
                default: 'Batman'
              }
            }
          }
        }
      }
    }

    function getDefaultValue (path, initialValue, schema) {
      const thunk = validate(path, initialValue, schema, [])
      const defaultValue = {}

      thunk(function (action) {
        _.assign(defaultValue, action.value)
      }, function () { return {} })

      return defaultValue
    }
    it('fills in defaults', function () {
      const defaultValue = getDefaultValue(null, {}, SCHEMA_WITH_DEFAULTS)
      expect(defaultValue).to.eql({
        firstName: 'Bruce',
        lastName: 'Wayne',
        alias: 'Batman',
        onlyChild: true
      })
    })

    it('fills in defaults for specific values', function () {
      const defaultValue = getDefaultValue('someotherProp.name', {}, SCHEMA_WITH_DEEP_DEFAULTS)

      expect(defaultValue).to.eql({
        firstName: 'Bruce',
        lastName: 'Wayne'
      })
    })

    it('handles defaults in deep objects', function () {
      const defaultValue = getDefaultValue(null, {}, SCHEMA_WITH_DEEP_DEFAULTS)
      expect(defaultValue).to.eql({
        someotherProp: {
          name: {
            firstName: 'Bruce',
            lastName: 'Wayne'
          }
        },
        alias: 'Batman'
      })
    })

    it('handles defaults for objects', function () {
      const defaultValue = getDefaultValue(null, {}, SCHEMA_WITH_OBJECT_DEFAULTS)
      expect(defaultValue).to.eql({
        firstName: 'Clark',
        lastName: 'Kent',
        alias: 'Superman',
        onlyChild: true
      })
    })

    it('handles defaults in refs', function () {
      const defaultValue = getDefaultValue(null, {}, SCHEMA_WITH_REFS)
      expect(defaultValue).to.eql({
        hero: {
          firstName: 'Bruce',
          lastName: 'Wayne',
          alias: 'Batman'
        }
      })
    })

    it('handles a schema with no defaults', function () {
      const defaultValue = getDefaultValue(null, {}, SCHEMA_WITH_NO_DEFAULTS)
      expect(defaultValue).to.eql({})
    })

    function getState () {
      return {
        get value () {
          return {}
        }
      }
    }

    it('resolves if no validators are given', function () {
      const schema = _.cloneDeep(SCHEMA_WITH_DEFAULTS)
      delete schema.required
      let thunk = validate(null, {}, schema, [])
      thunk(function (action) {
        if (action.type === VALIDATION_RESOLVED) {
          expect(action.errors).to.eql({})
        }
      }, getState)
    })

    it('handles defaults for new array elements', function () {
      const defaultValue = getDefaultValue('superheroes.0', {}, SCHEMA_WITH_ARRAY_DEFAULTS)

      expect(defaultValue).to.eql({
        firstName: 'Bruce',
        lastName: 'Wayne',
        alias: 'Batman'
      })
    })
  })
})
