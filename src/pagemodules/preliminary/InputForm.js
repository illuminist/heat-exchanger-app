import React from 'react'
import { View } from 'react-native'
import { Form } from 'native-base'
import { Field, useFormikContext } from 'formik'
import TextNumberInput from '../../components/TextNumberInput'
import { data as tubeData } from '../../data/tubeData'
import fieldDefs from '../../fieldDefs'



const fluidTypeItems = [
  <TextNumberInput.Item
    key="water"
    value="water"
    label="Water at atmospheric pressure"
  />,
  <TextNumberInput.Item
    key="saturatedwater"
    value="saturatedwater"
    label="Saturated Water"
  />,
]

const outerDiameterSet = new Set()
const fractionReplaceMap = {
  '.25': '¼',
  '.5': '½',
  '.75': '¾',
}
const outerTubeDiameterItems = tubeData
  .filter(o => {
    if (!outerDiameterSet.has(o.outerDiameter)) {
      outerDiameterSet.add(o.outerDiameter)
      return true
    }
  })
  .map(o => {
    return (
      <TextNumberInput.Item
        key={String(o.outerDiameter)}
        label={String(o.outerDiameter).replace(
          /(\.(25|5|75))$/,
          (m, p) => fractionReplaceMap[p],
        )}
        value={String(o.outerDiameter)}
      />
    )
  })

export const InputForm = () => {
  const formik = useFormikContext()

  const innerTubeDiameterItems = React.useMemo(() => {
    return tubeData
      .filter(o => '' + o.outerDiameter === formik.values.tubeOuterDiameter)
      .map(o => (
        <TextNumberInput.Item
          key={String(o.innerDiameter)}
          label={String(o.innerDiameter).replace(
            /(\.(25|5|75))$/,
            (m, p) => fractionReplaceMap[p],
          )}
          value={String(o.innerDiameter)}
        />
      ))
  }, [formik.values.tubeOuterDiameter])

  const makeProps = name => {
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
      <Form>
        <Field
          component={TextNumberInput}
          {...makeProps('shellSideFluidType')}
          select>
          {fluidTypeItems}
        </Field>
        <Field
          component={TextNumberInput}
          {...makeProps('shellSideMassFlowRate')}
        />
        <Field component={TextNumberInput} {...makeProps('shellSideInTemp')} />
        <Field
          component={TextNumberInput}
          {...makeProps('shellSideFoulingResistance')}
        />
        <Field
          component={TextNumberInput}
          {...makeProps('tubeSideFluidType')}
          select>
          {fluidTypeItems}
        </Field>
        <Field
          component={TextNumberInput}
          {...makeProps('tubeSideMassFlowRate')}
        />
        <Field component={TextNumberInput} {...makeProps('tubeSideInTemp')} />

        <Field component={TextNumberInput} {...makeProps('pitchRatio')} />
        <Field component={TextNumberInput} {...makeProps('maxTubeLength')} />
        <Field component={TextNumberInput} {...makeProps('tubeLayout')} select>
          <TextNumberInput label="30°" value="30" />
          <TextNumberInput label="45°" value="45" />
          <TextNumberInput label="90°" value="90" />
        </Field>
        <Field component={TextNumberInput} {...makeProps('tubePass')} select>
          <TextNumberInput label="1" value="1" />
          <TextNumberInput label="2" value="2" />
          <TextNumberInput label="4" value="4" />
          <TextNumberInput label="6" value="6" />
          <TextNumberInput label="8" value="8" />
        </Field>
        <Field component={TextNumberInput} {...makeProps('tubeMaterialK')} />
        <Field
          component={TextNumberInput}
          {...makeProps('tubeOuterDiameter')}
          select>
          {outerTubeDiameterItems}
        </Field>
        <Field
          component={TextNumberInput}
          {...makeProps('tubeInnerDiameter')}
          select>
          {innerTubeDiameterItems}
        </Field>
        <Field component={TextNumberInput} {...makeProps('baffleSpacing')} />
        <Field component={TextNumberInput} {...makeProps('baffleCutPercent')} />
      </Form>
    </View>
  )
}

export default InputForm
