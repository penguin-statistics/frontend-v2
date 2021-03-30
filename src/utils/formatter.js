import commaNumber from 'comma-number'

export default {
  thousandSeparator (value) {
    if (value === null || value === undefined) return value
    return commaNumber(value)
  }
}
