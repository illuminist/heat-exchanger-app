import React from 'react'
import { View } from 'react-native'
import { Text } from '@ui-kitten/components'
import { Field, useFormikContext } from 'formik'
import TextNumberInput from '../../components/TextNumberInput'
import ExpansionPanel from '../../components/ExpansionPanel'
import { data as tubeData } from '../../data/tubeSize'
import fieldDefs, { mechanicalDesignLabel, materialDefs } from '../../fieldDefs'

const fluidTypeItems = [
  { value: 'water', text: 'Water at atmospheric pressure' },
  { value: 'saturatedwater', text: 'Saturated Water' },
]

const outerDiameterSet = new Set()
const fractionReplaceMap = {
  '.25': '¼',
  '.5': '½',
  '.75': '¾',
}
const outerTubeDiameterItems = tubeData
  .filter((o) => {
    if (!outerDiameterSet.has(o.outerDiameterInch)) {
      outerDiameterSet.add(o.outerDiameterInch)
      return true
    }
  })
  .map((o) => ({
    text: String(o.outerDiameterInch).replace(
      /(\.(25|5|75))$/,
      (m, p) => fractionReplaceMap[p],
    ),
    value: String(o.outerDiameter),
  }))

const tubeMaterialItems = Object.keys(materialDefs).map((t) => ({
  text: fieldDefs.tubeMaterial.displayTransform(t),
  value: t,
}))

export const InputForm = () => {
  const formik = useFormikContext()

  const innerTubeDiameterItems = React.useMemo(() => {
    return tubeData
      .filter((o) => '' + o.outerDiameter === formik.values.tubeOuterDiameter)
      .map((o) => ({
        text: String(o.innerDiameterInch).replace(
          /(\.(25|5|75))$/,
          (m, p) => fractionReplaceMap[p],
        ),
        value: String(o.innerDiameter),
      }))
  }, [formik.values.tubeOuterDiameter])

  const makeProps = (name) => {
    const fieldDef = fieldDefs[name]
    return {
      label: fieldDef
        ? (fieldDef.label || name) +
          (fieldDef.unit ? ` (${fieldDef.unit})` : '')
        : name,
      name,
    }
  }

  return (
    <View>
      <ExpansionPanel head={<Text>Shell-side</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideFluidType')}
          select={fluidTypeItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideMassFlowRate')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideInTemp')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideFoulingResistance')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('shellSideFluidPressure')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('maxPressureDrop')}
        />
      </ExpansionPanel>
      <ExpansionPanel head={<Text>Tube-side</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideFluidType')}
          select={fluidTypeItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideMassFlowRate')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideInTemp')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeSideOutTemp')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeMaterial')}
          select={tubeMaterialItems}
        />
      </ExpansionPanel>
      <ExpansionPanel head={<Text>Physical dimension</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('pitchRatio')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeLayout')}
          select={[
            { text: '30°', value: '30' },
            { text: '45°', value: '45' },
            { text: '90°', value: '90' },
          ]}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('maxTubeLength')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          optional
          {...makeProps('maxPressureDrop')}
        />

        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubePass')}
          select={[
            { text: '1', value: '1' },
            { text: '2', value: '2' },
            { text: '4', value: '4' },
            { text: '6', value: '6' },
            { text: '8', value: '8' },
          ]}
        />

        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeOuterDiameter')}
          label={makeProps('tubeOuterDiameterInch').label}
          select={outerTubeDiameterItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeInnerDiameter')}
          label={makeProps('tubeInnerDiameterInch').label}
          select={innerTubeDiameterItems}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('baffleSpacing')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('baffleCutPercent')}
        />
      </ExpansionPanel>
      <ExpansionPanel head={<Text>Flow-induced vibration</Text>}>
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('mechanicalDesign')}
          select={[
            {
              value: 'bothEndSupported',
              text: mechanicalDesignLabel['bothEndSupported'],
            },
            {
              value: 'oneFixedOneSupported',
              text: mechanicalDesignLabel['oneFixedOneSupported'],
            },

            {
              value: 'bothEndFixed',
              text: mechanicalDesignLabel['bothEndFixed'],
            },
          ]}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('tubeYoungModulus')}
        />
        <Field
          component={TextNumberInput}
          margin="dense"
          {...makeProps('addedMassCoefficient')}
        />
      </ExpansionPanel>
    </View>
  )
}

export default InputForm
