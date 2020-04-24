import _ from 'lodash'

export const defaultInput = _.mapValues(
  {
    shellSideFluidType: 'saturatedwater',
    shellSideMassFlowRate: 50000,
    shellSideInTemp: 67,
    shellSideFoulingResistance: 0.000176,
    shellSideMassSpecificHeatCapacity: 4179,

    shellSideHeatTransferCoeff: 5000,

    tubeSideFluidType: 'water',
    tubeSideMassFlowRate: 30000,
    tubeSideInTemp: 17,
    tubeSideOutTemp: 40,
    tubeSideMassSpecificHeatCapacity: 4179,
    tubeMaterial: 'carbonSteel',
    tubeSideHeatTransferCoeff: 4000,

    pitchRatio: 1.25,
    tubeLength: 3,
    maxPressureDrop: 15000,
    maxTubeLength: 5,
    tubeLayout: 90,
    tubePass: 1,
    tubeMaterialK: 60,
    tubeInnerDiameter: 0.0161,
    tubeOuterDiameter: 0.01905,

    baffleCutPercent: 25,
    baffleSpacing: 0.2,

    lmtdCorrectionFactor: 0.9,

    mechanicalDesign: 'bothEndSupported',
    tubeYoungModulus: '200e9',
    addedMassCoefficient: 1.425,
  },
  String,
)
