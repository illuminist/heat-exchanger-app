import fieldDefs from './fieldDefs'
import numeral from 'numeral'
import { formatNumber } from './utils'

const headRow = () => {
  return `<tr>
  <th>Parameters</th>
  <th>Value</th>
  <th>Unit</th>
</tr>`
}

const row = (label, value, unit) => {
  return `<tr class="row">
    <td>${label}</td>
    <td class="numberCell">${
      typeof value === 'number'
        ? formatNumber(unit === '&' ? value * 100 : value)
        : value
    }</td>
    <td>${typeof unit === 'undefined' ? '' : unit}</td>
  </tr>`
}

const preliminaryInputFieldList = [
  'shellSideFluidType',
  'shellSideMassFlowRate',
  'shellSidePressure',
  'shellSideInTemp',
  'shellSideFoulingResistance',
  'shellSideMassSpecificHeatCapacity',

  'shellSideHeatTransferCoeff',

  'tubeSideFluidType',
  'tubeSideMassFlowRate',
  'tubeSideInTemp',
  'tubeSideOutTemp',
  'tubeSideMassSpecificHeatCapacity',

  'tubeSideHeatTransferCoeff',

  'pitchRatio',
  'tubeLength',
  'maxTubeLength',
  'tubeLayout',
  'tubePass',
  'tubeMaterialK',
  'tubeInnerDiameter',
  'tubeOuterDiameter',
]
const preliminaryResultFieldList = [
  'shellSideOutTemp',
  'overallHeatTransferCoeff',
  'tubeLength',
  'shellDiameter',
  'numberOfTubes',
]

const preliminaryTable = param => {
  return `<table cellpadding="10">
    ${headRow()}
    ${preliminaryInputFieldList
      .map(name => {
        const fieldDef = fieldDefs[name]

        return row(
          (fieldDef && fieldDef.label) || name,
          param[name],
          fieldDef && fieldDef.unit,
        )
      })
      .join('')}
  </table>
  <h2>Analysis result</h2>
  <table cellpadding="10">
    ${headRow()}
    ${preliminaryResultFieldList
      .map(name => {
        const fieldDef = fieldDefs[name]

        return row(
          (fieldDef && fieldDef.label) || name,
          param[name],
          fieldDef && fieldDef.unit,
        )
      })
      .join('')}
  </table>`
}

const ratingInputFieldList = ['']
const ratingTable = param => {
  return `<table cellpadding="10">
  </table>`
}

const styles = `<style>
.numberCell {
  text-align: right;
}
.row:nth-of-type(odd) {
  background-color: #eee;
}
</style>`

export const generateHTML = (name, step, param, results) => {
  const html = `<div>${styles}<h1>Report ${step}</h1>${
    step === 'preliminary' ? preliminaryTable(param) : 'rating'
  }</div>`
  return html
}

export default generateHTML
