import _ from 'lodash'

export const formatNumber = (x) => {
  const exp = Math.floor(Math.log10(Math.abs(x)))

  const round = Math.round(x * Math.pow(10, -exp + 5)) * Math.pow(10, exp - 5)
  if (exp >= 6 || exp <= -4)
    return (round * Math.pow(10, -exp)).toFixed(4) + 'e' + exp

  const [integer, decimal] = ('' + round).split('.')
  const avialableFloat = 6 - integer.length

  return (
    integer +
    (decimal
      ? '.' +
        decimal
          .substring(0, 10)
          .substring(0, avialableFloat)
          .replace(/0+$/, '0')
      : '')
  )
}

const stringFields = new Set([
  'shellSideFluidType',
  'tubeSideFluidType',
  'mechanicalDesign',
  'tubeMaterial',
])
const inchToMeterFields = new Set([])
const percentFields = new Set([
  'baffleCutPercent',
  'shellSideFoulingResistance',
  'tubeSideFoulingResistance',
  'foulingResistance',
  'surfaceOverDesign',
])

export const prepareInput = (keyvalues) =>
  _.mapValues(keyvalues, (v, k) => {
    if (stringFields.has(k)) return v
    const num = Number(v)
    if (inchToMeterFields.has(k)) return num * 0.0254
    if (percentFields.has(k)) return num / 100
    return num
  })

export const outputTransform = (keyvalues) =>
  _.mapValues(keyvalues, (v, k) => {
    if (percentFields.has(k)) return v * 100
    return v
  })

export const flow = (...flowlist) => (param) => {
  return flowlist.reduce(
    (acc, vv) => {
      if (!vv) {
        throw new Error(`flow error ${vv}`)
      }
      if (typeof vv === 'function') {
        return vv(acc)
      }

      if (typeof vv[0] === 'string') {
        const [key, fn] = vv
        if (!fn) throw new Error('fn-undefined:' + key)
        return { ...acc, [key]: fn(acc) }
      }

      return {
        ...acc,
        ...vv.reduce(
          (accc, vvv) => {
            if (typeof vvv === 'function') {
              return vvv(accc)
            }
            const [k, fn] = vvv
            accc[k] = fn(acc)
            return accc
          },
          { ...acc },
        ),
      }
    },
    { ...param },
  )
}
