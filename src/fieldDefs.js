export const fieldNames = [
  'shellSideFluidType',
  'shellSideFluidProperty',
  'shellSideMassFlowRate',
  'shellDiameter',
  'shellSideInTemp',
  'shellSideOutTemp',
  'shellSideFoulingResistance',
  'tubeSideFluidType',
  'tubeSideMassFlowRate',
  'tubeSideInTemp',
  'tubeSideOutTemp',
  'tubeSideFoulingResistance',
  'numberOfTubes',
  'tubeLength',
  'maxTubeLength',
  'tubeOuterDiameter',
  'tubeInnerDiameter',
  'pitchLength',
  'tubePass',
  'tubeLayout',
  'baffleSpacing',
  'baffleCutPercent',
  'bundleCrossflowArea',
  'areaOfBaffleWindow',
  'tubeMaterialK',
  'overallHeatTransferCoeff',
  'requiredNumberOfTubes',
  'shellSidePressureDrop',
  'tubeSidePressureDrop',
]
export const fluidTypeDisplayTransform = (type) => {
  switch (type) {
    case 'water':
      return 'Water'
    case 'saturatedwater':
      return 'Saturated Water'
    default:
      return type
  }
}
const units = { squereMeter: 'm²' }
export const mechanicalDesignLabel = {
  bothEndSupported: 'Both end supported',
  oneFixedOneSupported: 'One end fixed and one end supported',
  bothEndFixed: 'Both end fixed',
}

export const materialDefs = {
  carbonSteel: {
    label: 'Carbon steel',
    conductivity: 60,
  },
}

export const fieldDefs = {
  shellSideFluidType: {
    label: 'Shell side fluid type',
    displayTransform: fluidTypeDisplayTransform,
  },
  shellSideMassFlowRate: {
    label: 'Shell side mass flow rate',
    unit: 'Kg/hr',
  },
  shellDiameter: {
    symbol: 'D_s',
    label: 'Shell inner diameter',
    unit: 'm',
  },
  shellSideInTemp: {
    label: 'Shell side inlet temperature',
    unit: '°c',
  },
  shellSideOutTemp: {
    label: 'Shell side outlet temperature',
    unit: '°c',
  },
  shellSideFoulingResistance: {
    label: 'Shell side fouling resistance',
    unit: '%',
  },
  tubeSideFluidType: {
    label: 'Tube side fluid type',
    displayTransform: fluidTypeDisplayTransform,
  },
  tubeSideMassFlowRate: {
    label: 'Tube side mass flow rate',
    unit: 'Kg/hr',
  },
  tubeSideInTemp: {
    label: 'Tube side inlet temperature',
    unit: '°c',
  },
  tubeSideOutTemp: {
    label: 'Tube side outlet temperature',
    unit: '°c',
  },
  tubeSideFoulingResistance: {
    label: 'Tube side fouling resistance',
    unit: '%',
  },
  numberOfTubes: {
    symbol: 'N_t',
    label: 'Number of tubes',
  },
  numberOfTubeRowCrossingBaffleTip: {
    symbol: 'N_tec',
    label: 'Number of tube rows crossing baffle tip',
  },
  numberOfTubeRowCrossingWindowArea: {
    symbol: 'N_tcw',
    label: 'Number of tube rows crossing in the window area',
  },
  tubeLength: {
    symbol: 'L',
    label: 'Tube length',
    unit: 'm',
  },
  surfaceOverDesign: {
    symbol: 'OD',
    label: 'Surface over design',
    unit: '%',
  },
  maxTubeLength: {
    symbol: 'L_m',
    label: 'Maximum tube length',
    unit: 'm',
  },
  tubeOuterDiameterInch: {
    symbol: 'd_o',
    label: 'Tube outer diameter',
    unit: 'inches',
  },
  tubeOuterDiameter: {
    symbol: 'd_o',
    label: 'Tube outer diameter',
    unit: 'm',
  },
  tubeInnerDiameterInch: {
    symbol: 'd_i',
    label: 'Tube inner diameter',
    unit: 'inches',
  },
  tubeInnerDiameter: {
    symbol: 'd_i',
    label: 'Tube inner diameter',
    unit: 'm',
  },
  pitchLength: {
    symbol: 'P_t',
    label: 'Pitch length',
    unit: 'm',
  },
  pitchRatio: {
    symbol: 'P_R',
    label: 'Pitch ratio',
  },
  tubePass: {
    label: 'Tube passes',
  },
  tubeLayout: {
    label: 'Tube layout',
    displayTransform: (v) => v + '°',
  },
  baffleSpacing: {
    label: 'Baffle spacing',
    unit: 'm',
  },
  baffleCutPercent: {
    label: 'Baffle cut percent',
    unit: '%',
  },
  bundleCrossflowArea: {
    symbol: 'A_s',
    label: 'Bundle cross flow area',
    unit: units.squereMeter,
  },
  areaOfBaffleWindow: {
    label: 'Area of baffle window',
    unit: units.squereMeter,
  },
  tubeMaterialK: {
    label: 'Tube thermal conductivity',
    unit: 'W/m⋅K',
  },
  tubeMaterial: {
    label: 'Tube material',
    displayTransform: (t) =>
      `${materialDefs[t].label} K=${materialDefs[t].conductivity}`,
  },
  overallHeatTransferCoeff: {
    symbol: 'U_f',
    label: 'Overall heat transfer coefficient',
    unit: 'W/m²⋅K',
  },
  shellSidePressureDrop: {
    symbol: 'P_s',
    label: 'Shell side pressure drop',
    unit: 'psi',
  },
  foulingResistance: {
    symbol: 'R_ft',
    label: 'Fouling resistance',
    unit: '%',
  },
  shellSideHeatTransferArea: {
    symbol: 'A_f',
    label: 'Heat transfer area',
    unit: units.squereMeter,
  },
  tubeSidePressureDrop: {
    symbol: '∆P_t',
    label: 'Tube side pressure drop',
    unit: 'psi',
  },
  pressureDropInNozzles: {
    symbol: '∆P_i',
    label: 'Pressure drop in the nozzles',
    unit: 'Pa',
  },
  pressureDropForIdealTubeBank: {
    symbol: '∆P_bi',
    label: 'Ideal tube bank pressure drop',
    unit: 'Pa',
  },
  pressureDropInInteriorCrossflowSection: {
    symbol: '∆P_c',
    label: 'Pressure drop in the interior crossflow section',
    unit: 'Pa',
  },
  pressureDropInEntranceAndExit: {
    symbol: '∆P_e',
    label: 'Pressure drop in the entrance and exit section',
    unit: 'Pa',
  },
  pressureDropInWindow: {
    symbol: '∆P_w',
    label: 'Window pressure drop',
    unit: 'Pa',
  },
  maxPressureDrop: {
    label: 'Maximum Allowable Total Pressure Drop',
    unit: 'Pa',
  },
  grossWindowFlowArea: {
    symbol: 'A_wg',
    label: 'Gross window flow area w/o tubes',
    unit: units.squereMeter,
  },
  shellSidePressureDropTotal: {
    symbol: '∆P_total',
    label: 'Total pressure drop',
    unit: 'Pa',
  },
  bypassChannelDiametralGap: {
    symbol: 'L_bb',
    label: 'Bypass channel diametral gap',
    unit: 'm',
  },
  areaOccupiedByNtwTubes: {
    symbol: 'A_wt',
    label: 'Area occupied by N_tw tubes in the window',
    unit: units.squereMeter,
  },
  tubeUnsupportedLength: {
    label: 'Tube unsupported length',
    unit: 'm',
  },
  tubeYoungModulus: {
    label: "Tube Young's modulus",
    unit: 'N/m²',
  },
  longitudinalStress: {
    label: 'Tube longitudinal stress',
    unit: 'MPa',
  },
  addedMassCoefficient: {
    label: 'Added mass coefficient',
  },
  metalMassPerUnitLength: {
    label: 'Metal mass per unit length',
    unit: 'kg/m',
  },
  momentOfInertia: { label: 'Moment of inertia', unit: 'm⁴', symbol: 'I' },
  clipplingLoad: { label: 'Crippling load', unit: 'N', symbol: 'F_CR' },
  tubeMetalCrossSectionalArea: {
    label: 'Tube metal cross-sectional area',
    unit: units.squereMeter,
    symbol: 'A_t',
  },
  axialTubeStressMultiplier: {
    label: 'Tube axial stress multiplier(Dimentionless)',
    symbol: 'S',
  },
  tubeFluidMassPerUnitLength: {
    label: 'Tube fluid mass per unit length',
    unit: 'kg/m',
    symbol: 'm_fi',
  },
  tubeFluidMassDisplacedPerUnitLength: {
    label: 'Tube fluid mass displaced per unit length',
    unit: 'kg/m',
    symbol: 'm_fo',
  },
  hydroDynamicMassPerUnitLength: {
    label: 'Hydrodynamic mass per unit length',
    unit: 'kg/m',
    symbol: 'H_m',
  },
  effectiveTubeMass: {
    label: 'Effective tube mass per unit length',
    unit: 'kg/m',
    symbol: 'm_o',
  },
  naturalFrequency: {
    label: 'Natural frequency of heat exchanger',
    unit: 'Hz',
    symbol: 'f_n',
  },
  dampingConstant: { label: 'Damping constant', symbol: 'δ_t' },
  fluidElasticParameter: { label: 'Fluid elastic parameter', symbol: 'x' },
  criticalFlowVelocityFactor: {
    label: 'Critical flow velocity factor',
    symbol: 'D',
  },
  criticalFlowVelocity: {
    label: 'Critical flow velocity',
    unit: 'm/s',
    symbol: 'V_c',
  },
  mechanicalDesign: {
    label: 'Mechanical Design',
    displayTransform: (type) => mechanicalDesignLabel[type],
  },
}

export default fieldDefs
