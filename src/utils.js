export const formatNumber = x => {
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
