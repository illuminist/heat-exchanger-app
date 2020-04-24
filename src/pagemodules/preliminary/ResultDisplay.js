import _ from 'lodash'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Text, Card, Icon } from '@ui-kitten/components'
import { useFormikContext } from 'formik'
import LabeledText from '../../components/LabeledText'
import * as eq from '../../equations'
import fieldDefs, { materialDefs } from '../../fieldDefs'
import makeHTMLReport from '../../makeHTMLReport'
import { formatNumber, flow, prepareInput } from '../../utils'
import theme from '../../theme'
import { printPDF, sharePDF } from '../../makePDF'


const flowResult = flow(
  ['tubeMaterialK', (p) => materialDefs[p.tubeMaterial].conductivity],
  ['tubeLength', (p) => Math.ceil(p.maxTubeLength / 2)],
  ['pitchLength', (p) => p.pitchRatio * p.tubeOuterDiameter],
  ['shellSideOutTemp', eq.shellSideOutTemp],
  ['shellDiameter', eq.shellDiameter],
  ['shellDiameter', (p) => Math.ceil(p.shellDiameter * 10) / 10],
  ['numberOfTubes', (p) => Math.ceil(eq.numberOfTubes(p))],
  (p) => (
    console.log(eq.tubeShellLayoutCount(p)),
    {
      ...p,
      ..._.pick(
        eq.tubeShellLayoutCount(p),
        'shellDiameter',
        'numberOfTubes',
        'pitchLength',
      ),
    }
  ),
  ['overallHeatTransferCoeff', eq.overallHeatTransferCoeff],
)

export const ResultDisplay = () => {
  const formik = useFormikContext()

  const parsedData = React.useMemo(() => {
    const input = prepareInput(formik.values)

    return flowResult(input)
  }, [formik.values])

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
    const html = makeHTMLReport('test', 'preliminary', parsedData)
    await printPDF(html)
  }

  const handleSharePDF = async () => {
    const html = makeHTMLReport('test', 'preliminary', parsedData)
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
      <LabeledText {...makeProps('shellSideOutTemp')} />

      <LabeledText {...makeProps('overallHeatTransferCoeff')} />

      <LabeledText {...makeProps('tubeLength')} />

      <LabeledText {...makeProps('pitchLength')} />

      <LabeledText {...makeProps('shellDiameter')} />

      <LabeledText {...makeProps('numberOfTubes')} />
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
