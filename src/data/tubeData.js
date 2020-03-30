const fieldName = [
  'outerDiameter',
  'bwg',
  'thickness',
  'internalFlowArea',
  'externalSurfaceAreaPerFt',
  'internalSurfaceAreaPerFt',
  'weightPerFtSteel',
  'innerDiameter',
  'diameterRatio',
]
const raw = `
1/4 22 0.028 0.0295 0.0655 0.0508 0.066 0.194 1.289
1/4 24 0.022 0.0333 0.0655 0.0539 0.054 0.206 1.214
1/4 26 0.018 0.0360 0.0655 0.0560 0.045 0.214 1.168
3/8 18 0.049 0.0603 0.0982 0.0725 0.171 0.277 1.354
3/8 20 0.035 0.0731 0.0982 0.0798 0.127 0.305 1.233
3/8 22 0.028 0.0799 0.0982 0.0835 0.104 0.319 1.176
3/8 24 0.022 0.0860 0.0982 0.0867 0.083 0.331 1.133
1/2 16 0.065 0.1075 0.1309 0.0969 0.302 0.370 1.351
1/2 18 0.049 0.1269 0.1309 0.1052 0.236 0.402 1.244
1/2 20 0.035 0.1452 0.1309 0.1126 0.174 0.430 1.163
1/2 22 0.028 0.1548 0.1309 0.1162 0.141 0.444 1.126
5/8 12 0.109 0.1301 0.1636 0.1066 0.602 0.407 1.536
5/8 13 0.095 0.1486 0.1636 0.1139 0.537 0.435 1.437
5/8 14 0.083 0.1655 0.1636 0.1202 0.479 0.459 1.362
5/8 15 0.072 0.1817 0.1636 0.1259 0.425 0.481 1.299
5/8 16 0.065 0.1924 0.1636 0.1296 0.388 0.49s 1.263
5/8 17 0.058 0.2035 0.1636 0.1333 0.350 0.509 1.228
5/8 18 0.049 0.2181 0.1636 0.1380 0.303 0.527 1.186
5/8 19 0.042 0.2298 0.1636 0.1416 0.262 0.541 1.155
5/8 20 0.035 0.2419 0.1636 0.1453 0.221 0.555 1.136
3/4 10 0.134 0.1825 0.1963 0.1262 0.884 0.482 1.556
3/4 11 0.120 0.2043 0.1963 0.1335 0.809 0.510 1.471
3/4 12 0.109 0.2223 0.1963 0.1393 0.748 0.532 1.410
3/4 13 0.095 0.2463 0.1963 0.1466 0.666 0.560 1.339
3/4 14 0.083 0.2679 0.1963 0.1529 0.592 0.584 1.284
3/4 15 0.072 0.2884 0.1963 0.1587 0.520 0.606 1.238
3/4 16 0.065 0.3019 0.1963 0.1623 0.476 0.620 1.210
3/4 17 0.058 0.3157 0.1963 0.1660 0.428 0.634 1.183
3/4 18 0.049 0.3339 0.1963 0.1707 0.367 0.652 1.150
3/4 20 0.035 0.3632 0.1963 0.1780 0.269 0.680 1.103
7/8 10 0.134 0.2892 0.2291 0.1589 1.061 0.607 1.441
7/8 11 0.120 0.3166 0.2291 0.1662 0.969 0.635 1.378
7/8 12 0.109 0.3390 0.2291 0.1720 0.891 0.657 1.332
7/8 13 0.095 0.3685 0.2291 0.1793 0.792 0.685 1.277
7/8 14 0.083 0.3948 0.2291 0.1856 0.704 0.709 1.234
7/8 16 0.065 0.4359 0.2291 0.1950 0.561 0.745 1.174
7/8 18 0.049 0.4742 0.2291 0.2034 0.432 0.777 1.126
7/8 20 0.035 0.5090 0.2291 0.2107 0.313 0.805 1.087
1 8 0.165 0.3526 0.2618 0.1754 1.462 0.670 1.493
1 10 0.134 0.4208 0.2618 0.1916 1.237 0.732 1.366
1 11 0.120 0.4536 0.2618 0.1990 1.129 0.760 1.316
1 12 0.109 0.4803 0.2618 0.2047 1.037 0.782 1.279
1 13 0.095 0.5153 0.2618 0.2121 0.918 0.810 1.235
1 14 0.083 0.5463 0.2618 0.2183 0.813 0.834 1.199
1 15 0.072 0.5755 0.2618 0.2241 0.714 0.856 1.167
1 16 0.065 0.5945 0.2618 0.2278 0.649 0.870 1.119
1 18 0.049 0.6390 0.2618 0.2361 0.496 0.902 1.109
1 20 0.035 0.6793 0.2618 0.2435 0.360 0.930 1.075
1-1/4 7 0.180 0.6221 0.3272 0.2330 2.057 0.890 1.404
1-1/4 8 0.165 0.6648 0.3272 0.2409 1.921 0.920 1.359
1-1/4 10 0.134 0.7574 0.3272 0.2571 1.598 0.982 1.273
1-1/4 11 0.120 0.8012 0.3272 0.2644 1.448 1.010 1.238
1-1/4 12 0.109 0.8365 0.3272 0.2702 1.329 1.032 1.211
1-1/4 12 0.095 0.8825 0.3272 0.2773 1.173 1.060 1.179
1-1/4 14 0.083 0.9229 0.3272 0.2838 1.033 1.084 1.153
1-1/4 16 0.065 0.9852 0.3272 0.2932 0.823 1.120 1.116
1-1/4 18 0.049 1.042 0.3272 0.3016 0.629 1.152 1.085
1-1/4 20 0.035 1.094 0.3272 0.3089 0.456 1.180 1.059
1-1/2 10 0.134 1.192 0.3927 0.3225 1.955 1.232 1.218
1-1/2 12 0.109 1.291 0.3927 0.3356 1.618 1.282 1.170
1-1/2 14 0.083 1.398 0.3927 0.3492 1.258 1.334 1.124
1-1/2 16 0.065 1.474 0.3927 0.3587 0.996 1.370 1.095
2 11 0.120 2.433 0.5236 0.4608 2.410 1.760 1.136
2 13 0.095 2.573 0.5236 0.4739 1.934 1.810 1.105
2-1/2 9 0.148 3.815 0.6540 0.5770 3.719 2.204 1.134
`

const availableOuterDiameter = new Set([0.75, 1])

export const data = raw
  .replace(/-?(\d)\/(\d)/g, (m, p1, p2) =>
    ('' + Number(p1) / Number(p2)).substring(1),
  )
  .split('\n')
  .filter(Boolean)
  .map(rawrow =>
    rawrow
      .split(' ')
      .map(Number)
      .reduce((acc, n, i) => {
        acc[fieldName[i]] = n
        return acc
      }, {}),
  )
  .filter(o => availableOuterDiameter.has(o.outerDiameter))
