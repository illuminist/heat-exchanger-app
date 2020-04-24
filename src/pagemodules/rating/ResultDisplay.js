import _ from 'lodash'
import React from 'react'
import { Button, Card, Icon } from '@ui-kitten/components'
import { useFormikContext } from 'formik'
import LabeledText from '../../components/LabeledText'
import * as eq from '../../equations'
import meq from '../../memoeq'
import fieldDefs, { materialDefs } from '../../fieldDefs'
import makePDF from '../../makePDF'
import makeHTMLReport from '../../makeHTMLReport'
import { formatNumber, flow, prepareInput, outputTransform } from '../../utils'
import theme from '../../theme'
import { StyleSheet, View } from 'react-native'
import { printPDF, sharePDF } from '../../makePDF'

const flowForSurfaceOverDesign = flow(
  ['tubeMaterialK', (p) => materialDefs[p.tubeMaterial].conductivity],
  ['tubeLength', (p) => Math.ceil(p.maxTubeLength / 2)],
  ['pitchLength', (p) => p.pitchRatio * p.tubeOuterDiameter],
  ['shellSideOutTemp', eq.shellSideOutTemp],
  ['shellDiameter', eq.shellDiameter],
  ['numberOfTubes', (p) => Math.ceil(eq.numberOfTubes(p))],
  (p) => ({
    ...p,
    ..._.pick(
      eq.tubeShellLayoutCount(p),
      'shellDiameter',
      'numberOfTubes',
      'pitchLength',
    ),
  }),
  ['overallHeatTransferCoeff', eq.overallHeatTransferCoeff],
  (p) => ({
    ...p,
    ..._.pick(
      eq.tubeShellLayoutCount(p),
      'shellDiameter',
      'numberOfTubes',
      'pitchLength',
    ),
  }),
  [
    'shellSideFluidProperty',
    (p) =>
      eq.fluidProperty(
        p.shellSideFluidType,
        p.shellSideInTemp,
        p.shellSideOutTemp,
      ),
  ],
  [
    'tubeSideFluidProperty',
    (p) =>
      eq.fluidProperty(
        p.tubeSideFluidType,
        p.tubeSideInTemp,
        p.tubeSideOutTemp,
      ),
  ],
  ['tubeShellLayoutCount', eq.tubeShellLayoutCount],
  ['surfaceOverDesign', meq.surfaceOverDesign],
)

const flowForResult = flow(
  [
    'overallHeatTransferCoeff',
    (p) => p.overallHeatTransferCoeff || meq.overallHeatTransferCoeff(p),
  ],
  [
    'shellSideHeatTransferArea',
    (p) => p.shellSideHeatTransferArea || meq.shellSideHeatTransferAreaFoul(p),
  ],
  ['pitchLength', (p) => p.pitchRatio * p.tubeOuterDiameter],
  ['shellSideOutTemp', meq.shellSideOutTemp],
  ['shellDiameter', meq.shellDiameter],
  [
    ['pressureDropForIdealTubeBank', meq.pressureDropForIdealTubeBank],
    [
      'pressureDropInInteriorCrossflowSection',
      meq.pressureDropInInteriorCrossflowSection,
    ],
    ['bypassChannelDiametralGap', meq.bypassChannelDiametralGap],
    ['numberOfTubeRowCrossingBaffleTip', meq.numberOfTubeRowCrossingBaffleTip],
    [
      'numberOfTubeRowCrossingWindowArea',
      meq.numberOfTubeRowCrossingWindowArea,
    ],
    ['grossWindowFlowArea', meq.grossWindowFlowArea],
    ['areaOccupiedByNtwTubes', meq.areaOccupiedByNtwTubes],
    ['pressureDropInWindow', meq.pressureDropInWindow],
    ['pressureDropInEntranceAndExit', meq.pressureDropInEntranceAndExit],
    ['shellSidePressureDropTotal', meq.shellSidePressureDropTotal],
  ],
)

export const ResultDisplay = () => {
  const formik = useFormikContext()

  const parsedData = React.useMemo(() => {
    const input = { ...prepareInput(formik.values), recalculation: 0 }

    let result = flowForSurfaceOverDesign(input)
    // if (result.surfaceOverDesign > 1.3) {
    //   result = {
    //     ...result,
    //     ...meq.surfaceOverDesignRecalculate(result),
    //     recalculation: result.recalculation + 1,
    //   }
    // }

    return outputTransform(flowForResult(result))
  }, [formik.values])

  console.log(parsedData)

  const makeProps = (name) => {
    const data = parsedData[name]
    const fieldDef = fieldDefs[name]
    return {
      label: fieldDef
        ? (fieldDef.label || name) +
          (fieldDef.unit ? ` (${fieldDef.unit})` : '')
        : name,
      children:
        typeof parsedData[name] === 'undefined'
          ? 'None'
          : typeof parsedData[name] === 'number' && fieldDef && fieldDef.unit
          ? formatNumber(data)
          : data,
    }
  }

  const handlePrintPDF = async () => {
    const html = makeHTMLReport('test', 'rating', parsedData)
    await printPDF(html)
  }

  const handleSharePDF = async () => {
    const html = makeHTMLReport('test', 'rating', parsedData)
    await sharePDF(html)
  }

  return (
    <Card
      style={[theme.cardShadow, theme.marginVertical]}
      footer={() => (
        <View style={styles.resultCardFooter}>
          <Button
            onPress={handlePrintPDF}
            icon={(s) => <Icon name="printer" {...s} />}>
            Print
          </Button>
          <Button
            onPress={handleSharePDF}
            icon={(s) => <Icon name="share" {...s} />}>
            Share
          </Button>
        </View>
      )}>
      <LabeledText {...makeProps('surfaceOverDesign')} />

      <LabeledText {...makeProps('overallHeatTransferCoeff')} />

      <LabeledText {...makeProps('shellSideHeatTransferArea')} />

      <LabeledText {...makeProps('tubeLength')} />

      <LabeledText {...makeProps('shellDiameter')} />

      <LabeledText {...makeProps('numberOfTubeRowCrossingBaffleTip')} />

      <LabeledText {...makeProps('pressureDropForIdealTubeBank')} />
      <LabeledText {...makeProps('pressureDropInInteriorCrossflowSection')} />
      <LabeledText {...makeProps('bypassChannelDiametralGap')} />
      <LabeledText {...makeProps('numberOfTubeRowCrossingWindowArea')} />
      <LabeledText {...makeProps('grossWindowFlowArea')} />
      <LabeledText {...makeProps('areaOccupiedByNtwTubes')} />
      <LabeledText {...makeProps('pressureDropInWindow')} />
      <LabeledText {...makeProps('pressureDropInEntranceAndExit')} />
      <LabeledText {...makeProps('shellSidePressureDropTotal')} />
    </Card>
  )
}

const styles = StyleSheet.create({
  resultCardFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
})

export default ResultDisplay