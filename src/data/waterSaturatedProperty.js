import { interpolate, parseData } from './utils'
const fieldName = [
  'temperature',
  'pressure',
  'surfaceTension',
  'density',
  'specificHeat',
  'thermalConductivity',
  'dynamicViscosity',
  'prandltNumber',
  'volumnMatricExpansionCoeff',
  'specificVolumnVapor',
  'specificHeatVapor',
  'thermalConductivityVapor',
  'dynamicViscosityVapor',
  'prandltNumberVapor',
  'volumnMatricExpansionCoeffVapor',
  'isetropicExpansionCoeff',
]
const raw = `
0.01,0.00612,75.64,1000,4.23,547.5,1792,13.84,NaN,206.0,1.87,17.07,9.216,1.008,3.672,1.33
10,0.0123,74.22,999.7,4.19,567.4,1307,9.645,0.0872,106.3,1.87,17.62,9.461,1.006,3.548,1.33
20,0.0234,72.73,998.2,4.18,586,1002,7.154,0.209,57.78,1.88,18.22,9.727,1.004,3.435,1.33
30,0.0425,71.19,995.6,4.18,602.9,797.7,5.535,0.305,32.9,1.89,18.88,10.01,1.003,3.332,1.33
40,0.0738,69.59,992.2,4.18,617.8,653.3,4.423,0.386,19.53,1.90,19.59,10.31,1.002,3.239,1.33
50,0.1234,67.94,988,4.18,630.4,547.1,3.629,0.457,12.04,1.92,20.36,10.62,1.001,3.156,1.33
60,0.1993,66.24,983.2,4.18,640.9,466.6,3.045,0.522,7.674,1.94,21.18,10.93,1,3.082,1.33
70,0.3118,64.48,977.7,4.19,649.5,404,2.605,0.583,5.045,1.96,22.06,11.26,0.9995,3.017,1.33
80,0.4737,62.67,971.8,4.19,656.2,354.5,2.266,0.64,3.409,1.98,23,11.59,0.9993,2.962,1.33
90,0.7012,60.81,965.3,4.20,661.3,314.5,2,0.696,2.362,2.01,24,11.93,0.9994,2.917,1.34
100,1.013,58.91,958.4,4.22,665.1,281.9,1.787,0.75,1.674,2.04,25.08,12.27,1,2.882,1.34
110,1.432,56.96,951,4.23,667.6,254.8,1.615,0.804,1.211,2.08,26.22,12.61,1.001,2.857,1.34
120,1.985,54.96,943.2,4.25,669.1,232.1,1.474,0.858,0.892,2.12,27.44,12.96,1.004,2.843,1.35
130,2.7,52.93,934.9,4.27,669.7,213,1.357,0.912,0.669,2.17,28.73,13.3,1.007,2.84,1.36
140,3.612,50.85,926.2,4.29,669.4,196.6,1.259,0.968,0.509,2.23,30.09,13.65,1.012,2.849,1.36
150,4.757,48.74,917.1,4.31,668.3,182.5,1.178,1.026,0.393,2.30,31.54,13.99,1.02,2.872,1.37
160,6.177,46.59,907.5,4.34,666.4,170.3,1.109,1.087,0.3071,2.37,33.06,14.34,1.029,2.908,1.39
170,7.915,44.4,897.5,4.37,663.7,159.6,1.051,1.152,0.243,2.46,34.66,14.68,1.042,2.959,1.40
180,10.02,42.19,887.1,4.40,660.2,150.2,1.002,1.221,0.194,2.56,36.34,15.03,1.057,3.027,1.42
190,12.54,39.94,876.1,4.44,655.9,141.8,0.9607,1.296,0.156,2.67,38.09,15.37,1.077,3.114,1.44
200,15.54,37.67,864.7,4.49,650.7,134.4,0.9269,1.377,0.127,2.80,39.93,15.71,1.1,3.221,1.46
210,19.06,35.38,852.8,4.54,644.7,127.7,0.8994,1.467,0.104,2.94,41.85,16.06,1.129,3.351,1.48
220,23.18,33.06,840.3,4.60,637.6,121.6,0.8777,1.567,0.086,3.11,43.86,16.41,1.162,3.508,1.52
230,27.95,30.73,827.3,4.67,629.5,116,0.8615,1.679,0.071,3.30,45.96,16.76,1.203,3.697,1.55
240,33.45,28.39,813.5,4.76,620.3,110.9,0.8508,1.807,0.06,3.51,48.15,17.12,1.25,3.923,1.59
250,39.74,26.04,799.1,4.86,609.8,106.2,0.8455,1.954,0.050,3.77,50.46,17.49,1.306,4.195,1.64
260,46.89,23.68,783.8,4.97,598,101.7,0.846,2.126,0.042,4.06,52.9,17.88,1.373,4.523,1.70
270,55,21.33,767.7,5.11,584.5,97.55,0.853,2.33,0.036,4.41,55.49,18.28,1.453,4.923,1.77
280,64.13,18.99,750.5,5.28,569.4,93.56,0.8673,2.576,0.031,4.83,58.28,18.7,1.549,5.415,1.86
290,74.38,16.66,732.2,5.48,552.3,89.71,0.8908,2.88,0.026,5.33,61.31,19.15,1.666,6.032,1.97
300,85.84,14.35,712.4,5.74,533.1,85.95,0.9262,3.266,0.022,5.97,64.67,19.65,1.813,6.822,2.11
310,98.61,12.08,691,6.08,511.3,82.22,0.9782,3.773,0.018,6.78,68.45,20.21,2.001,7.861,2.29
320,112.8,9.858,667.4,6.54,486.8,78.46,1.054,4.47,0.015,7.87,72.84,20.84,2.251,9.278,2.54
330,128.5,7.697,641,7.2,458.8,74.57,1.17,5.489,0.013,9.41,78.1,21.6,2.603,11.31,2.91
340,145.9,5.62,610.8,8.24,426.9,70.45,1.359,7.116,0.011,11.8,84.68,22.55,3.137,14.43,3.47
350,165.2,3.66,574.7,10.1,389.7,65.88,1.711,10.1,0.0088,15.9,93.48,23.81,4.058,19.77,4.47
360,186.6,1.872,528.1,14.7,344.4,60.39,2.574,17.11,0.007,25.2,106.6,25.71,6.085,30.79,6.74
370,210.3,0.3846,453.1,41.7,280.7,52.25,7.765,45.88,0.0050,70.4,132.6,29.57,15.7,64.53,18.0
373.9,220.4,0.0004,349.4,NaN,210.8,41.95,277.1,87.51,0.0034,340.1,180,37,69.91,104.5,84.5
`
const parsedData = parseData(raw, fieldName).map(row => {
  // convert dynamicViscosity, specificHeat to non exponent unit
  const newRow = Object.assign(Object.assign({}, row), {
    dynamicViscosity: row.dynamicViscosity * 1e-6,
    specificHeat: row.specificHeat * 1e3,
    thermalConductivity: row.thermalConductivity * 1e-3,
  })
  return newRow
})
const nanData = fieldName.reduce((a, v) => ((a[v] = NaN), a), {})
const getData = temperature => {
  const index = parsedData.findIndex(o => o.temperature >= temperature)
  const r1 = parsedData[index - 1]
  const r2 = parsedData[index]
  if (!r1) return nanData
  const diff =
    (temperature - r1.temperature) / (r2.temperature - r1.temperature)
  if (diff > 1) return r1
  return interpolate(r1, r2, diff)
}
export default getData
