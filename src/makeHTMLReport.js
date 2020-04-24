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

const tranformSymbol = (symbol) =>
  symbol.replace(/_(.+)$/, (m, p1) => `<sub>${p1}</sub>`)

const row = (name, value) => {
  const fieldDef = fieldDefs[name]
  const { unit, label = name, symbol, displayTransform } = fieldDef || {}

  return `<tr class="row">
    <td class="parameterNameColumn">${
      label +
      (symbol ? ` <span class="symbol">(${tranformSymbol(symbol)})</span>` : '')
    }</td>
    <td class="numberCell parameterValueColumn">${
      displayTransform
        ? displayTransform(value)
        : typeof value === 'number'
        ? formatNumber(unit === '&' ? value * 100 : value)
        : value
    }</td>
    <td class="parameterUnitColumn">${unit || ''}</td>
  </tr>`
}

const table = (title, fields, param) => {
  return `
  <h2 class="tableTitle">${title}</h2>
  <table class="table" cellpadding="10">
  ${headRow()}
  ${fields.map((name) => row(name, param[name])).join('')}
  </table>`
}

const displayFields = {
  preliminary: [
    {
      title: 'Shell side',
      fields: [
        'shellSideFluidType',
        'shellSideMassFlowRate',
        'shellSideInTemp',
        'shellSideFoulingResistance',
        'shellSideMassSpecificHeatCapacity',
      ],
    },
    {
      title: 'Tube side',
      fields: [
        'tubeSideFluidType',
        'tubeSideMassFlowRate',
        'tubeSideInTemp',
        'tubeSideOutTemp',
        'tubeSideMassSpecificHeatCapacity',
        'tubeSideHeatTransferCoeff',
      ],
    },
    {
      title: 'Physical dimension',
      fields: [
        'pitchRatio',
        'tubeLength',
        'maxTubeLength',
        'tubeLayout',
        'tubePass',
        'tubeMaterialK',
        'tubeInnerDiameter',
        'tubeOuterDiameter',
      ],
    },
    {
      title: 'Preliminary analysis result',
      fields: [
        'shellSideOutTemp',
        'overallHeatTransferCoeff',
        'tubeLength',
        'shellDiameter',
        'numberOfTubes',
      ],
    },
  ],
  rating: [
    {
      title: 'Shell side',
      fields: [
        'shellSideFluidType',
        'shellSideMassFlowRate',
        'shellSideInTemp',
        'shellSideFoulingResistance',
        'shellSideMassSpecificHeatCapacity',
      ],
    },
    {
      title: 'Tube side',
      fields: [
        'tubeSideFluidType',
        'tubeSideMassFlowRate',
        'tubeSideInTemp',
        'tubeSideOutTemp',
        'tubeSideMassSpecificHeatCapacity',
        'tubeSideHeatTransferCoeff',
      ],
    },
    {
      title: 'Physical dimension',
      fields: [
        'pitchRatio',
        'tubeLength',
        'maxTubeLength',
        'tubeLayout',
        'tubePass',
        'tubeMaterialK',
        'tubeInnerDiameter',
        'tubeOuterDiameter',
      ],
    },
    {
      title: 'Rating analysis result',
      fields: [
        'recalculation',
        'surfaceOverDesign',
        'overallHeatTransferCoeff',
        'shellSideHeatTransferArea',
        'tubeLength',
        'shellDiameter',
        'numberOfTubeRowCrossingBaffleTip',
        'pressureDropForIdealTubeBank',
        'pressureDropInInteriorCrossflowSection',
        'bypassChannelDiametralGap',
        'numberOfTubeRowCrossingWindowArea',
        'grossWindowFlowArea',
        'areaOccupiedByNtwTubes',
        'pressureDropInWindow',
        'pressureDropInEntranceAndExit',
        'shellSidePressureDropTotal',
      ],
    },
  ],
  sizing: [
    {
      title: 'Shell side',
      fields: [
        'shellSideFluidType',
        'shellSideMassFlowRate',
        'shellSideInTemp',
        'shellSideFoulingResistance',
        'shellSideMassSpecificHeatCapacity',
      ],
    },
    {
      title: 'Tube side',
      fields: [
        'tubeSideFluidType',
        'tubeSideMassFlowRate',
        'tubeSideInTemp',
        'tubeSideOutTemp',
        'tubeSideMassSpecificHeatCapacity',
        'tubeSideHeatTransferCoeff',
      ],
    },
    {
      title: 'Physical dimension',
      fields: [
        'pitchRatio',
        'tubeLength',
        'maxTubeLength',
        'tubeLayout',
        'tubePass',
        'tubeMaterialK',
        'tubeInnerDiameter',
        'tubeOuterDiameter',
      ],
    },
    {
      title: 'Flow-induced vibration',
      fields: [
        'mechanicalDesign',
        'tubeUnsupportedLength',
        'tubeYoungModulus',
        'longitudinalStress',
        'addedMassCoefficient',
        'tubeMassPerLength',
      ],
    },
    {
      title: 'Sizing analysis result',
      fields: [
        'shellSidePressureDropTotal',
        'tubeUnsupportedLength',
        'tubeMassPerLength',
        'longitudinalStress',
        'momentOfInertia',
        'clipplingLoad',
        'tubeMetalCrossSectionalArea',
        'axialTubeStressMultiplier',
        'tubeFluidMassPerUnitLength',
        'tubeFluidMassDisplacedPerUnitLength',
        'hydroDynamicMassPerUnitLength',
        'effectiveTubeMass',
        'naturalFrequency',
        'dampingConstant',
        'fluidElasticParameter',
        'criticalFlowVelocityFactor',
        'criticalFlowVelocity',
      ],
    },
  ],
}

const styles = `<style>
.table {
  width: 100%;
}
.tableTitle: {
  color: red;
  margin-top: 100px;
}
.numberCell {
  text-align: right;
}
.symbol {
  color: #555;
  font-size: 0.9em;
}
.row:nth-of-type(even) {
  background-color: #eee;
}
.parameterNameColumn {
  width: 60%;
}
.parameterValueColumn {
  width: 20%;
}
.parameterUnitColumn {
  width: 20%;
}
</style>`

export const generateHTML = (name, step, param, results) => {
  const tableDef = displayFields[step]
  const html = `<div>${styles}<h1>Report ${step}</h1>${tableDef
    .map(({ title, fields }) => table(title, fields, param))
    .join('\n')}</div>`
  return html
}

export default generateHTML
