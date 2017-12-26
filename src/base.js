const toArray = require('./util/to-array')

module.exports = function() {
  function Logdown(prefix, opts) {
    if (!(this instanceof Logdown)) {
      return new Logdown(prefix, opts)
    }

    if (Logdown._isPrefixAlreadyInUse(prefix)) {
      return Logdown._getInstanceByPrefix(prefix)
    }

    this.opts = Logdown._normalizeOpts(prefix, opts)
    this.state = Logdown._getInitialState(this.opts)

    Logdown._decorateLoggerMethods(this)
    Logdown._instances.push(this)

    return this
  }

  //
  // Static
  //

  Logdown.transports = []
  Logdown._instances = []
  Logdown._prefixRegExps = []

  Logdown._prepareRegExpForPrefixSearch = function(str) {
    return new RegExp('^' + str.replace(/\*/g, '.*?') + '$')
  }

  Logdown._isPrefixAlreadyInUse = function(prefix) {
    return Logdown._instances.some(instance => {
      return instance.opts.prefix === prefix
    })
  }

  Logdown._getInstanceByPrefix = function(prefix) {
    return Logdown._instances.filter(instanceCur => {
      return instanceCur.opts.prefix === prefix
    })[0]
  }

  Logdown._normalizeOpts = function(prefix, opts) {
    if (typeof prefix !== 'string') {
      throw new TypeError('prefix must be a string')
    }

    opts = opts || {}

    const markdown = opts.markdown === undefined ? true : Boolean(opts.markdown)
    const prefixColor = opts.prefixColor || Logdown._getNextPrefixColor()
    const logger = opts.logger || console

    return {
      logger: logger,
      markdown: markdown,
      prefix: prefix,
      prefixColor: prefixColor,
    }
  }

  Logdown._getInitialState = function(opts) {
    return {
      isEnabled: Logdown._getEnableState(opts),
    }
  }

  Logdown._getEnableState = function(opts) {
    let isEnabled = false

    Logdown._prefixRegExps.forEach(filter => {
      if (filter.type === 'enable' && filter.regExp.test(opts.prefix)) {
        isEnabled = true
      } else if (filter.type === 'disable' && filter.regExp.test(opts.prefix)) {
        isEnabled = false
      }
    })

    return isEnabled
  }

  Logdown._decorateLoggerMethods = function(instance) {
    const logger = instance.opts.logger

    let loggerMethods = Object.keys(logger).filter(method => {
      return typeof logger[method] === 'function'
    })

    // In old Safari and Chrome browsers, `console` methods are not iterable.
    // In that case, we provide a minimum API.
    if (loggerMethods.length === 0) {
      loggerMethods = ['log', 'warn', 'error']
    }

    loggerMethods.forEach(method => {
      instance[method] = function() {
        const args = toArray(arguments)
        const instance = this.opts.prefix

        if (Logdown.transports.length) {
          const msg =
            '[' +
            instance +
            '] ' +
            args
              .filter(arg => {
                return typeof arg !== 'object'
              })
              .join(' ')

          Logdown.transports.forEach(transport => {
            transport({
              state: this.state,
              instance: instance,
              level: method,
              args: args,
              msg: msg,
            })
          })
        }

        if (this.state.isEnabled) {
          const preparedOutput = this._prepareOutput(args, method)
          logger[method].apply(logger, preparedOutput)
        }
      }
    })
  }

  return Logdown
}
