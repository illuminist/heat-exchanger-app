import * as React from 'react'
import _ from 'lodash'
import { View } from 'react-native'
import { Button, Content, Text } from 'native-base'
import TextNumberInput from '../../components/TextNumberInput'
import SaveButton from '../../components/SaveButton'
import InputForm from './InputForm'
import ResultDisplay from './ResultDisplay'
import { Formik, useFormikContext } from 'formik'

const defaultValues = _.mapValues(
  {
    shellSideFluidType: 'saturatedwater',
    shellSideMassFlowRate: 50000,
    shellSidePressure: 0.2,
    shellSideInTemp: 67,
    shellSideFoulingResistance: 0.0176,
    shellSideMassSpecificHeatCapacity: 4184,

    shellSideHeatTransferCoeff: 5000,

    tubeSideFluidType: 'water',
    tubeSideMassFlowRate: 30000,
    tubeSideInTemp: 17,
    tubeSideOutTemp: 40,
    tubeSideMassSpecificHeatCapacity: 4179,

    tubeSideHeatTransferCoeff: 4000,

    pitchRatio: 1.25,
    tubeLength: 3,
    maxTubeLength: 5,
    tubeLayout: 90,
    tubePass: 1,
    tubeMaterialK: 60,
    tubeInnerDiameter: 0.016,
    tubeOuterDiameter: 0.019,

    baffleCutPercent: 25,
    buffleSpacing: 0.2,

    correctionFactor: 0.9,
  },
  String,
)

export const PreliminaryLanding = ({
  savedName = '',
  route,
  initialValues = defaultValues,
}) => {
  if (route && route.params && route.params.loadedData) {
    initialValues = route.params.loadedData
    savedName = route.params.savedName
  }

  const cleanValues = React.useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues],
  )

  return (
    <Formik initialValues={cleanValues}>
      <Content>
        <View>
          <Text>preliminary analysis welcome</Text>
          <InputForm />

          <Text>Result</Text>
          <ResultDisplay />
          <SaveButton step="preliminary" initialName={savedName} />
        </View>
      </Content>
    </Formik>
  )
}

export default PreliminaryLanding
