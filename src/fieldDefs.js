export const fieldNames = [
    "shellSideFluidType",
    "shellSideFluidProperty",
    "shellSideMassFlowRate",
    "shellDiameter",
    "shellSideInTemp",
    "shellSideOutTemp",
    "shellSideFoulingResistance",
    "tubeSideFluidType",
    "tubeSideMassFlowRate",
    "tubeSideInTemp",
    "tubeSideOutTemp",
    "tubeSideFoulingResistance",
    "numberOfTubes",
    "tubeLength",
    "maxTubeLength",
    "tubeOuterDiameter",
    "tubeInnerDiameter",
    "pitchLength",
    "tubePass",
    "tubeLayout",
    "baffleSpacing",
    "baffleCutPercent",
    "bundleCrossflowArea",
    "areaOfBaffleWindow",
    "tubeMaterialK",
    "overallHeatTransferCoeff",
    "requiredNumberOfTubes",
    "shellSidePressureDrop",
    "tubeSidePressureDrop"
];
export const fluidTypeDisplayTransform = (type) => {
    switch (type) {
        case "water":
            return "Water";
        case "saturatedwater":
            return "Saturated Water";
        default:
            return type;
    }
};
export const fieldDefs = {
    shellSideFluidType: {
        label: "Shell side fluid type",
        displayTransfrom: fluidTypeDisplayTransform
    },
    shellSideMassFlowRate: {
        label: "Shell side mass flow rate",
        unit: "Kg/hr"
    },
    shellDiameter: {
        label: "Shell inner diameter",
        unit: "m"
    },
    shellSideInTemp: {
        label: "Shell side inlet temperature",
        unit: "°c"
    },
    shellSideOutTemp: {
        label: "Shell side outlet temperature",
        unit: "°c"
    },
    shellSideFoulingResistance: {
        label: "Shell side fouling resistance",
        unit: "%"
    },
    tubeSideFluidType: {
        label: "Tube side fluid type",
        displayTransfrom: fluidTypeDisplayTransform
    },
    tubeSideMassFlowRate: {
        label: "Tube side mass flow rate",
        unit: "Kg/hr"
    },
    tubeSideInTemp: {
        label: "Tube side inlet temperature",
        unit: "°c"
    },
    tubeSideOutTemp: {
        label: "Tube side outlet temperature",
        unit: "°c"
    },
    tubeSideFoulingResistance: {
        label: "Tube side fouling resistance",
        unit: "%"
    },
    numberOfTubes: {
        label: "Number of tubes"
    },
    tubeLength: {
        label: "Tube length",
        unit: "m"
    },
    maxTubeLength: {
        label: "maximumTubeLength",
        unit: "m"
    },
    tubeOuterDiameter: {
        label: "Tube outer diameter",
        unit: "inches"
    },
    tubeInnerDiameter: {
        label: "Tube inner diameter",
        unit: "inches"
    },
    pitchLength: {
        label: "Pitch length",
        unit: "m"
    },
    tubePass: {
        label: "Tube passes"
    },
    tubeLayout: {
        label: "Tube layout",
        displayTransfrom: (v) => v + "°"
    },
    baffleSpacing: {
        label: "Baffle spacing",
        unit: "m"
    },
    baffleCutPercent: {
        label: "Baffle cut percent",
        unit: "%"
    },
    bundleCrossflowArea: {
        label: "Bundle cross flow area",
        unit: "m²"
    },
    areaOfBaffleWindow: {
        label: "Area of baffle window",
        unit: "m²"
    },
    tubeMaterialK: {
        label: "Tube thermal conductivity",
        unit: "W/m⋅K"
    },
    overallHeatTransferCoeff: {
        label: "Overall heat transfer coefficient",
        unit: "W/m²⋅K"
    },
    shellSidePressureDrop: {
        label: "Shell side pressure drop",
        unit: "psi"
    },
    tubeSidePressureDrop: {
        label: "Tube side pressure drop",
        unit: "psi"
    }
};
export default fieldDefs;