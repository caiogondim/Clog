const rules = require('./rules/browser')
const getNextMatch = require('./get-next-match')

function parse(text) {
  const styles = []
  let match = getNextMatch(text, rules)

  while (match) {
    styles.push(match.rule.style)
    styles.push('') // Empty string resets style.

    text = text.replace(match.rule.regexp, match.rule.replacer)
    match = getNextMatch(text, rules)
  }

  return {
    text: text,
    styles: styles,
  }
}

//
// API
//

module.exports = {
  parse: parse,
}
