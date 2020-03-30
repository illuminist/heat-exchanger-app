import * as _ from 'lodash'
import waterSaturatedProperty from './data/waterSaturatedProperty'
import pureWaterATMProperty from './data/pureWaterATMProperty'
import correlationCoefficients from './data/correlationCoefficients'
import tubePitchParallel from './data/tubePitchParallel'
const fluidPropertyKey = [
  'temperature',
  'density',
  'specificHeat',
  'dynamicViscosity',
  'thermalConductivity',
  'prandltNumber',
]
export const fluidProperty = (type, ...temperature) => {
  switch (type) {
    case 'water':
      return _.pick(
        pureWaterATMProperty(_.sum(temperature) / _.size(temperature)),
        fluidPropertyKey,
      )
    case 'saturatedwater':
      return _.pick(
        waterSaturatedProperty(_.sum(temperature) / _.size(temperature)),
        fluidPropertyKey,
      )
    default:
      throw new Error('unsupported-fluid')
  }
}
/*******************************************
 *
 * Preliminary Analysis Equations
 *
 *******************************************/
const tubePassConstantMap = {
  1: 0.93,
  2: 0.9,
  3: 0.85,
}
/**
 * @function CL tubePassConstant
 * @param {number} param.tubePass
 */
export const tubePassConstant = param => {
  return tubePassConstantMap[param.tubePass]
}
const tubeLayoutConstantMap = {
  30: 0.87,
  60: 0.87,
  45: 1,
  90: 1,
}
/**
 * @function CLT tubeLayoutConstantMap
 * @param {number} param.tubeLayoutConstant
 */
export const tubeLayoutConstant = param => {
  return tubeLayoutConstantMap[param.tubeLayout]
}
/**
 * @function L_bb diametral clearance between shell internal diameter Ds and outer
 * tube limit diamater D_otl
 */
export const diametralClearanceShell = param => {
  const ds = eva('shellDiameter', param)
  return ds < 0.3 ? 0.009525 : ds <= 1 ? 0.0127 : 0.015875
}
/**
 * @function Q tubeHeatDuty
 * @param {number} param.tubeSideMassFlowRate
 * @param {number} param.tubeSideMassSpecificHeatCapacity
 * @param {number} param.tubeSideInTemp
 * @param {number} param.tubeSideOutTemp
 */
export const tubeHeatDuty = param => {
  return (
    (param.tubeSideMassFlowRate / 3600) *
    param.tubeSideMassSpecificHeatCapacity *
    (param.tubeSideOutTemp - param.tubeSideInTemp)
  )
}
export const shellHeatDuty = param => {
  return (
    (param.shellSideMassFlowRate / 3600) *
    param.shellSideMassSpecificHeatCapacity *
    (param.shellSideInTemp - param.shellSideOutTemp)
  )
}
/**
 * @function T_h2 shellSideOutTemp
 * @param {number} param.shellSideInTemp
 * @param {number} param.shellSideMassFlowRate
 * @param {number} param.shellSideMassSpecificHeatCapacity
 */
export const shellSideOutTemp = param => {
  return (
    param.shellSideInTemp -
    tubeHeatDuty(param) /
      ((param.shellSideMassSpecificHeatCapacity * param.shellSideMassFlowRate) /
        3600)
  )
}
/**
 * @function ∆T_lm,cf Log mean temp difference
 * @param {number} param.tubeSideInTemp
 * @param {number} param.tubeSideOutTemp
 * @param {number} param.shellSideInTemp
 * @param {number} param.shellSideOutTemp
 */
export const LMTD = param => {
  return (
    (param.shellSideInTemp -
      param.tubeSideOutTemp -
      (param.shellSideOutTemp - param.tubeSideInTemp)) /
    Math.log(
      (param.shellSideInTemp - param.tubeSideOutTemp) /
        (param.shellSideOutTemp - param.tubeSideInTemp),
    )
  )
}
/**
 * @function ∆T_m effectiveTemperatureDifference
 * @param {number} param.lmtdCorrectionFactor
 */
export const effectiveTemperatureDifference = param => {
  return (param.lmtdCorrectionFactor || 0.95) * LMTD(param)
}
/**
 * @function A_f A_c requireSurface
 */
export const requireSurface = param => {
  return (
    tubeHeatDuty(param) /
    (overallHeatTransferCoeff(param) * effectiveTemperatureDifference(param))
  )
}
// Rw() Resistance of tube along tube wall
// export const tubeWallResistance = (param: {tubeLength: number, tubeMaterial:}) => {
//   return ln(do/di) / (2 * Math.PI * L * k)
// }
/**
 * @function Uo Uc Uf overallHeatTransferCoeff
 * @param {number} param.tubeInnerDiameter
 * @param {number} param.tubeOuterDiameter
 * @param {number} param.shellSideFoulingResistance
 * @param {number} param.tubeSideFoulingResistance
 * @param {number} param.shellSideHeatTransferCoeff
 * @param {number} param.tubeSideHeatTransferCoeff
 * @param {number} param.tubeMaterialK
 */
export const overallHeatTransferCoeff = (
  param,
  // tubeInsideFinEfficiency?: number;
  // tubeOutsideFinEfficienctly?: number;
  // & ParamOf<typeof tubeOuterArea> &
  //   ParamOf<typeof tubeInnerArea>
) => {
  const dobydi = param.tubeOuterDiameter / param.tubeInnerDiameter
  // console.log(param)
  // console.log(
  //   "1 /",
  //   param.shellSideHeatTransferCoeff, // 1 / hi
  //   "dobydi",
  //   "1 /",
  //   param.tubeSideHeatTransferCoeff, // do/di * 1/hi
  //   "dobydi",
  //   param.tubeSideFoulingResistance || 0,
  //   param.shellSideFoulingResistance || 0,
  //   param.tubeOuterDiameter,
  //   "/ 2",
  //   "Math.log(dobydi)",
  //   param.tubeMaterialK
  // );
  return (
    1 /
    (1 / param.shellSideHeatTransferCoeff + // 1 / hi
    dobydi * (1 / param.tubeSideHeatTransferCoeff) + // do/di * 1/hi
      dobydi * (param.tubeSideFoulingResistance || 0) +
      (param.shellSideFoulingResistance || 0) +
      (param.tubeOuterDiameter / 2) * (Math.log(dobydi) / param.tubeMaterialK))
  )
  // return (
  //   1 /
  //   ((tubeOuterArea(param) / tubeInnerArea(param)) *
  //     (1 / ((param.tubeInsideFinEfficiency || 1) * hi())) +
  //     (tubeInnerArea(param) * param.tubeSideFoulingResistance) / ((param.tubeInsideFinEfficiency || 1) * tubeOuterArea(param)) +
  //     tubeInnerArea(param) * Rw() +
  //     param.shellSideFoulingResistance / (param.tubeOutsideFinEfficienctly || 1) +
  //     (1 / (param.tubeOutsideFinEfficienctly || 1)) * ho())
  // );
}
/**
 * @function PR pith ratio
 * @param {number} param.pitchLength
 * @param {number} param.tubeOuterDiameter
 */
export const pitchRatio = param => {
  return param.pitchLength / param.tubeOuterDiameter
}
/**
 * @function D_s shellDiameter
 * @param {number} param.tubeOuterDiameter
 * @param {number} param.tubeLength
 */
export const shellDiameter = param => {
  // console.log(param.pitchRatio);
  // console.log("pt", param.pitchLength);
  // console.log(
  //   'DS',
  //   tubePassConstant(param),
  //   eva("requireSurface", param),
  //   eva("pitchRatio", param),
  //   param.tubeOuterDiameter,
  //   param.tubeLength
  // );
  return (
    0.637 *
    Math.sqrt(tubeLayoutConstant(param) / tubePassConstant(param)) *
    Math.pow(
      (eva('requireSurface', param) *
        Math.pow(eva('pitchRatio', param), 2) *
        param.tubeOuterDiameter) /
        param.tubeLength,
      0.5,
    )
  )
}
/**
 * @function N_t number of tube
 * @param {number} param.tubeOuterDiameter
 */
export const numberOfTubes = param => {
  return (
    (0.785 *
      (tubePassConstant(param) / tubeLayoutConstant(param)) *
      Math.pow(eva('shellDiameter', param), 2)) /
    (Math.pow(eva('pitchRatio', param), 2) *
      Math.pow(param.tubeOuterDiameter, 2))
  )
}
/*******************************************
 *
 * Rating Analysis Equations
 *
 *******************************************/
/**
 * @function Fluid property lookup
 * @param {number} temperature
 */
export const fluidPropertyLookUp = temperature => {
  return {
    density: 0,
    specificHeatCapacity: 0,
    dynamicViscosity: 0,
    thermalConductivity: 0,
    prandtlNumber: 0,
  }
}
/**
 * @function C tubeOuterDistance
 * @param {number} param.tubeOuterDiameter
 * @param {number} param.pitchRatio
 * or
 * @param {number} param.pitchLength
 */
export const tubeOuterDistance = param => {
  if ('pitchRatio' in param)
    return (eva('pitchRatio', param) - 1) * param.tubeOuterDiameter
  return param.pitchLength - param.tubeOuterDiameter
}
/**
 * @function A_s bundleCrossflowArea
 * @param {number} param.pitchLength
 * @param {number} param.baffleSpacing
 */
export const bundleCrossflowArea = param => {
  console.log(
    eva('shellDiameter', param),
    (0.303 * tubeOuterDistance(param) * param.baffleSpacing) /
      param.pitchLength,
  )
  return (
    (eva('shellDiameter', param) *
      tubeOuterDistance(param) *
      param.baffleSpacing) /
    param.pitchLength
  )
}
/**
 * @function G_t u_m tubeSideMassVelocity
 * @param {number} param.tubeSideMassFlowRate
 */
export const tubeSideMassVelocity = param => {
  return (
    param.tubeSideMassFlowRate /
    3600 /
    (param.tubeSideFluidProperty.density * tubeInnerArea(param))
  )
}
/**
 * @function G_s u_s shellMassVelocity
 * @param {number} param.shellSideMassFlowRate
 */
export const shellMassVelocity = param => {
  return param.shellSideMassFlowRate / 3600 / bundleCrossflowArea(param)
}
/**
 * @function D_e equivalentDiameter
 * @param {number} param.tubeLayout
 * @param {number} param.tubeOuterDiameter
 * @param {number} param.pitchLength
 */
export const equivalentDiameter = param => {
  if (param.tubeLayout === 30 || param.tubeLayout === 60) {
    return (
      (4 *
        ((Math.pow(param.pitchLength, 2) * Math.pow(3, 1 / 2)) / 4 -
          (Math.PI * Math.pow(param.tubeOuterDiameter, 2)) / 8)) /
      ((Math.PI * param.tubeOuterDiameter) / 2)
    )
  }
  if (param.tubeLayout === 45 || param.tubeLayout === 90) {
    return (
      (4 *
        (Math.pow(param.pitchLength, 2) -
          (Math.PI * Math.pow(param.tubeOuterDiameter, 2)) / 4)) /
      (Math.PI * param.tubeOuterDiameter)
    )
  }
  throw new Error()
}
/**
 * @function Re_s shellReynold
 * @param {number} param.shellMassViscosity
 */
export const shellReynold = param => {
  return (
    (shellMassVelocity(param) * equivalentDiameter(param)) /
    param.shellSideFluidProperty.dynamicViscosity
  )
}
/**
 * @function h_o shell heat transfer coefficient ss ht
 * @param {number} param.shellMassViscosity
 */
export const shellSideHeatTransferCoeff = param => {
  const h_oD_ek =
    0.36 *
    Math.pow(
      (equivalentDiameter(param) * shellMassVelocity(param)) /
        param.shellSideFluidProperty.dynamicViscosity,
      0.55,
    ) *
    Math.pow(
      (param.shellSideFluidProperty.specificHeat *
        param.shellSideFluidProperty.dynamicViscosity) /
        param.shellSideFluidProperty.thermalConductivity,
      1 / 3,
    ) *
    Math.pow(param.shellSideFluidProperty.dynamicViscosity / 6.04e-4, 0.14)
  return (
    (h_oD_ek * param.shellSideFluidProperty.thermalConductivity) /
    equivalentDiameter(param)
  )
}
/**
 * @function A_tp total tube inner area, Area of TS HT
 */
export const tubeInnerArea = param => {
  return (
    (((Math.PI * Math.pow(param.tubeInnerDiameter, 2)) / 4) *
      eva('numberOfTubes', param)) /
    2
  )
}
/**
 * @function Re_t tubeReynold
 * @param {number} param.tubeMassViscosity
 */
export const tubeReynold = param => {
  return (
    (param.tubeSideFluidProperty.density *
      tubeSideMassVelocity(param) *
      param.tubeInnerDiameter) /
    param.tubeSideFluidProperty.dynamicViscosity
  )
}
/**
 * @function f_s shell friction factor
 * @param {number} param.tubeMassViscosity
 */
export const shellFrictionFactor = param => {
  return Math.pow(Math.E, 0.576 - 0.19 * Math.log(shellReynold(param)))
}
/**
 * @function f_t tube friction factor
 * @param {number} param.tubeMassViscosity
 */
export const tubeFrictionFactor = param => {
  return Math.pow(1.58 * Math.log(tubeReynold(param)) - 3.28, -2)
}
// Nub() Gnielinski’s correlation
export const tubeSideGnielinski = param =>
  ((tubeFrictionFactor(param) / 2) *
    (tubeReynold(param) - 1000) *
    param.prandtlNumber) /
  ((1 + 1.27 * (tubeFrictionFactor(param) / 2)) ^
    ((1 / 2) * (pitchRatio(param) ^ (2 / 3 - 1))))
// hi
export const tubeHeatTransferCoefficient = param => {
  return (
    (tubeSideGnielinski(param) * param.thermalConductivity) /
    param.tubeInnerDiameter
  )
}
/**
 * @function Tw wall temperature
 *
 */
export const wallTemperature = param => {
  return (
    (param.shellSideInTemp +
      param.shellSideOutTemp +
      param.tubeSideInTemp +
      param.tubeSideOutTemp) /
    4
  )
}
/**
 * @function μ_ws dynamic viscosity at wall shell
 *
 */
export const shellWallDynamicViscosity = param => {
  return fluidProperty(param.shellSideFluidType, wallTemperature(param))
    .dynamicViscosity
}
// Ao
export const tubeOuterArea = param => {
  return (
    Math.PI *
    param.tubeOuterDiameter *
    eva('numberOfTubes', param) *
    param.tubeLength
  )
}
/**
 * @function A_tp
 * @param param
 */
export const tubeInnerClossArea = param => {
  return (
    ((Math.PI * param.tubeInnerDiameter) / 4) *
    (eva('numberOfTubes', param) / 2)
  )
}
/**
 * @function N_u Nusselt number The Petukhov–Kirillov  correlation
 */
export const nusseltNumber = param => {
  return (
    ((tubeFrictionFactor(param) / 2) *
      (tubeReynold(param) - 1000) *
      param.tubeSideFluidProperty.prandltNumber) /
    (1 +
      12.7 *
        Math.pow(tubeFrictionFactor(param) / 2, 1 / 2) *
        (Math.pow(param.tubeSideFluidProperty.prandltNumber, 2 / 3) - 1))
  )
}
/**
 * @function hi Tube side heat transfer coeff TS HT Coeff
 */
export const tubeSideHeatTransferCoeff = param => {
  return (
    (nusseltNumber(param) * param.tubeSideFluidProperty.thermalConductivity) /
    param.tubeInnerDiameter
  )
}
/**
 * @function ∆Ps shell side pressure drop
 */
export const shellSidePressureDrop = param => {
  console.log(shellMassVelocity(param))
  return (
    (shellFrictionFactor(param) *
      Math.pow(shellMassVelocity(param), 2) *
      (param.maxTubeLength / param.baffleSpacing) *
      eva('shellDiameter', param)) /
    (2 *
      param.shellSideFluidProperty.density *
      equivalentDiameter(param) *
      Math.pow(
        param.shellSideFluidProperty.dynamicViscosity /
          shellWallDynamicViscosity(param),
        0.14,
      ))
  )
}
const ab = (reynold, ab3, ab4) => {
  return ab3 / (1 + 0.14 * Math.pow(reynold, ab4))
}
/**
 * @function f_i colburnJFactor
 */
export const colburnJFactor = param => {
  const reynold = shellReynoldTubeOuterDiameter(param)
  const row = correlationCoefficients(param.tubeLayout, reynold)
  const a = ab(reynold, row.a3, row.a4)
  return (
    row.a1 *
    Math.pow(1.33 / (param.pitchLength / param.tubeOuterDiameter), a) *
    Math.pow(reynold, row.a2)
  )
}
/**
 * @function j_i
 */
export const j_i = param => {
  return 0.37 * Math.pow(shellReynoldTubeOuterDiameter(param), -0.395)
}
export const shellSideHeatTransferCoeffBD = param => {
  const correctionFactor = 0.6
  const hid =
    colburnJFactor(param) *
    param.shellSideFluidProperty.specificHeat *
    (param.shellSideMassFlowRate / 3600 / bundleCrossflowArea(param)) *
    Math.pow(
      param.shellSideFluidProperty.thermalConductivity /
        (param.shellSideFluidProperty.specificHeat *
          param.shellSideFluidProperty.dynamicViscosity),
      2 / 3,
    ) *
    Math.pow(
      param.shellSideFluidProperty.dynamicViscosity /
        shellWallDynamicViscosity(param),
      0.14,
    )
  return hid * correctionFactor
}
export const shellSideHeatTransferCoeffKernBD = param => {
  const ho1 = shellSideHeatTransferCoeff(param)
  const ho2 = shellSideHeatTransferCoeffBD(param)
  return Math.abs(ho1 - ho2) > 1000 ? ho2 : (ho1 + ho2) / 2
}
/**
 * @function L_c baffle cut length
 */
export const baffleCutLength = param => {
  return param.baffleCutPercent * eva('shellDiameter', param)
}
/**
 * @function N_c The number of tube rows crossed in one crossflow section
 */
export const numberOfTubeRowsInCrossflow = param => {
  const D_s = eva('shellDiameter', param)
  return Math.ceil(
    (D_s * (1 - (2 * baffleCutLength(param)) / D_s)) /
      tubePitchParallel(param).Pp,
  )
}
/**
 * @function Re_s shell raynold number based on outer tube diameter for BD Fanning
 */
export const shellReynoldTubeOuterDiameter = param => {
  return (
    (param.shellSideMassFlowRate / 3600 / bundleCrossflowArea(param)) *
    (param.tubeOuterDiameter / param.shellSideFluidProperty.dynamicViscosity)
  )
}
/**
 * @function f_i Fanning friction coeffifient
 */
export const fanningFrictionCoefficient = param => {
  const res = shellReynoldTubeOuterDiameter(param)
  const cpp = correlationCoefficients(param.tubeLayout, res)
  const b = ab(res, cpp.b3, cpp.b4)
  return (
    cpp.b1 *
    Math.pow(1.33 / (param.pitchLength / param.tubeOuterDiameter), b) *
    Math.pow(res, cpp.b2)
  )
}
/**
 * @function N_b number of baffles
 */
export const numberOfBaffles = param => {
  return Math.ceil(param.tubeLength / param.baffleSpacing - 1)
}
/**
 * @function N_tec number of tube crossing baffle tip
 */
export const numberOfTubeRowCrossingBaffleTip = param => {
  return Math.ceil(
    (eva('shellDiameter', param) / tubePitchParallel(param).Pp) *
      (1 - 2 * param.baffleCutPercent),
  )
}
/**
 * @function N_cw
 */
export const ncw = param => {
  return (0.8 * baffleCutLength(param)) / tubePitchParallel(param).Pp
}
export const Dctl = param => {
  const Ds = eva('shellDiameter', param)
  const Dotl = Ds - diametralClearanceShell(param)
  console.log(Ds, Dotl, diametralClearanceShell(param), param.tubeOuterDiameter)
  return Dotl - param.tubeOuterDiameter
}
/**
 * @function N_tcw number of tube rows croessd in the window area
 */
export const numberOfTubeRowCrossingWindowArea = param => {
  const Ds = eva('shellDiameter', param)
  console.log(
    'ds',
    0.8,
    tubePitchParallel(param).Pp,
    Ds,
    param.baffleCutPercent,
    Ds,
    Dctl(param),
    2,
  )
  return (
    (0.8 / tubePitchParallel(param).Pp) *
    (Ds * param.baffleCutPercent - (Ds - Dctl(param)) / 2)
  )
}
/**
 * @function Δp_bi  pressure drops in the nozzles
 */
export const pressureDropInNozzles = param => {
  return (
    2 *
    fanningFrictionCoefficient(param) *
    numberOfTubeRowCrossingBaffleTip(param) *
    (Math.pow(shellMassVelocity(param), 2) /
      param.shellSideFluidProperty.density) *
    Math.pow(
      param.shellSideFluidProperty.dynamicViscosity /
        shellWallDynamicViscosity(param),
      0.14,
    )
  )
}
/**
 * @function ∆p_c The pressure drop in the interior crossflow section baffle tip)
 */
export const pressureDropInInteriorCrossflowSection = param => {
  const Rl = 0.4
  const Rb = 0.6
  return (
    pressureDropInNozzles(param) * (eva('numberOfBaffles', param) - 1) * Rl * Rb
  )
}
/**
 * @function ∆p_wi Pressure drop in an equivalent ideal tube bank in the window section
 */
export const pressureDropInEquivalentIdealTubeBack = param => {
  return (
    (Math.pow(param.shellSideMassFlowRate, 2) * (2 + 0.6 * ncw(param))) /
    (2 *
      param.shellSideFluidProperty.density *
      bundleCrossflowArea(param) *
      param.areaOfBaffleWindow)
  )
}
/**
 * @function ∆p_w The pressure drop in the window
 */
export const pressureDropInWindow = param => {
  const Rl = 0.4
  console.log(
    eva('numberOfBaffles', param),
    2,
    0.6,
    numberOfTubeRowCrossingWindowArea(param),
    param.shellSideMassFlowRate / 3600,
    param.shellSideFluidProperty.density,
    bundleCrossflowArea(param),
    netFlowAreaInWindow(param),
    Rl,
    param.shellSideFluidProperty.dynamicViscosity,
    shellWallDynamicViscosity(param),
  )
  return (
    eva('numberOfBaffles', param) *
    (2 + 0.6 * numberOfTubeRowCrossingWindowArea(param)) *
    (Math.pow(param.shellSideMassFlowRate / 3600, 2) /
      (2 *
        param.shellSideFluidProperty.density *
        bundleCrossflowArea(param) *
        netFlowAreaInWindow(param))) *
    Rl *
    Math.pow(
      param.shellSideFluidProperty.dynamicViscosity /
        shellWallDynamicViscosity(param),
      0.14,
    )
  )
}
/**
 * @function ∆p_e The pressure drop in the entrance and exit sections is affected by bypass but not by leakage.
 */
export const pressureDropInEntranceAndExit = param => {
  const Rb = 0.6
  const Rs = 1
  return (
    pressureDropInNozzles(param) *
    (1 +
      numberOfTubeRowCrossingWindowArea(param) /
        numberOfTubeRowCrossingBaffleTip(param)) *
    Rb *
    Rs
  )
}
/**
 * @function ∆p_s The total pressure drop over the shell side of the heat exchanger
 */
export const shellSidePressureDropTotal = param => {
  console.log(param)
  console.log(
    pressureDropInInteriorCrossflowSection(param),
    pressureDropInWindow(param),
    pressureDropInEntranceAndExit(param),
  )
  return (
    pressureDropInInteriorCrossflowSection(param) +
    pressureDropInWindow(param) +
    pressureDropInEntranceAndExit(param)
  )
}
/**
 * @function L true tube length
 */
export const tubeLength = param => {
  return (
    eva('shellSideHeatTransferAreaFoul', param) /
    (Math.PI * param.tubeOuterDiameter * eva('numberOfTubes', param))
  )
}
/**
 * @function ∆p_t tube side pressure drop
 */
export const tubeSidePressureDrop = param => {
  const trueL = tubeLength(param)
  return (
    (4 *
      tubeFrictionFactor(param) *
      ((trueL * param.tubePass) / param.tubeInnerDiameter) +
      4 * param.tubePass) *
    ((param.tubeSideFluidProperty.density *
      Math.pow(tubeSideMassVelocity(param), 2)) /
      2)
  )
}
/**
 * @function A_c shell side heat transfer area clean
 */
export const shellSideHeatTransferAreaClean = param => {
  param = Object.assign(Object.assign({}, param), {
    shellSideFoulingResistance: 0,
    tubeSideFoulingResistance: 0,
  })
  console.log('Uc', overallHeatTransferCoeff(param))
  return (
    shellHeatDuty(param) /
    (overallHeatTransferCoeff(param) * effectiveTemperatureDifference(param))
  )
}
/**
 * @function A_f shell side heat transfer area foul
 */
export const shellSideHeatTransferAreaFoul = param => {
  return (
    shellHeatDuty(param) /
    (overallHeatTransferCoeff(param) * effectiveTemperatureDifference(param))
  )
}
/**
 * @function A_w net flow area in the window
 */
export const netFlowAreaInWindow = param => {
  const Ds = eva('shellDiameter', param)
  const dctl = Dctl(param)
  const thetaDs = 2 * Math.acos(1 - 2 * param.baffleCutPercent)
  /** Gross window flow area w/o tubes */
  const Awg =
    ((Math.PI * Math.pow(Ds, 2)) / 4) *
    (thetaDs / (2 * Math.PI) - Math.sin(thetaDs) / (2 * Math.PI))
  const Ntt =
    (0.7854 * Math.pow(dctl, 2)) /
    (tubeLayoutConstant(param) * Math.pow(param.pitchLength, 2))
  const thetaCtl = 2 * Math.acos((Ds / dctl) * (1 - 2 * param.baffleCutPercent))
  const Fw = thetaCtl / (2 * Math.PI) - Math.sin(thetaCtl) / (2 * Math.PI)
  const Ntw = Ntt * Fw
  /** Area occupies by Ntw tubed in the window */
  const Awt = Ntw * (Math.PI / 4) * Math.pow(param.tubeOuterDiameter, 2)
  return Awg - Awt
}
/**
 * @function OD surface overall design
 */
export const surfaceOverallDesign = param => {
  return (
    shellSideHeatTransferAreaFoul(param) / shellSideHeatTransferAreaClean(param)
  )
}
/**
 * @function OD recalculation
 */
export const surfaceOverallDesignRecalculate = param => {
  const od = 1.2
  const uc = overallHeatTransferCoeff(
    _.omit(param, 'tubeSideFoulingResistance', 'shellSideFoulingResistance'),
  )
  const uf = uc / od
  const rft = 1 / uf - 1 / uc
  const ac = shellSideHeatTransferAreaClean(param)
  const af = od * ac
  const l = tubeLength(
    Object.assign(Object.assign({}, param), {
      shellSideHeatTransferAreaFoul: af,
    }),
  )
  const ds = shellDiameter(
    Object.assign(Object.assign({}, param), {
      tubeLength: l,
      requireSurface: af,
    }),
  )
  return {
    shellDiameter: ds,
    tubeLength: l,
    tubeSideFoulingResistance: rft,
    shellSideHeatTransferArea: af,
    overallHeatTransferCoeff: uf,
  }
}
const evalable = {
  shellSideHeatTransferAreaFoul,
  pitchRatio,
  shellDiameter,
  numberOfTubes,
  requireSurface,
  numberOfBaffles,
}
const eva = (name, param) => {
  return name in param && typeof param[name] !== 'undefined'
    ? param[name]
    : evalable[name](param)
}
