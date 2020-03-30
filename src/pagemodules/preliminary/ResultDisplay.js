import _ from 'lodash'
import React from 'react'
import { View } from 'react-native'
import { Button, Form, Text } from 'native-base'
import { useFormikContext } from 'formik'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import TextNumberInput from '../../components/TextNumberInput'
import LabeledText from '../../components/LabeledText'
import * as eq from '../../equations'
import fieldDefs from '../../fieldDefs'
// import makePDF from '../../makePDF'
import makeHTMLReport from '../../makeHTMLReport'
import { formatNumber } from '../../utils'

const stringFields = new Set(['shellSideFluidType', 'tubeSideFluidType'])
const inchToMeterFields = new Set(['tubeOuterDiameter', 'tubeInnerDiameter'])
const percentFields = new Set([
  'baffleCutPercent',
  'shellSideFoulingResistance',
  'tubeSideFoulingResistance',
])

export const ResultDisplay = () => {
  const formik = useFormikContext()

  const [pdfFile, setPDFFile] = React.useState()

  const parsedData = React.useMemo(() => {
    const o1 = _.mapValues(formik.values, (v, k) => {
      if (stringFields.has(k)) return v
      const num = Number(v)
      if (inchToMeterFields.has(k)) return num * 0.0254
      if (percentFields.has(k)) return num / 100
      return num
    })
    const o2 = {
      ...o1,
      pitchLength: o1.pitchRatio * o1.tubeOuterDiameter,
      shellSideOutTemp: eq.shellSideOutTemp(o1),
    }
    const o25 = {
      ...o2,
      shellDiameter: eq.shellDiameter(o1),
    }
    o25.shellDiameter = Math.ceil(o25.shellDiameter * 10) / 10
    console.log(o25)
    const o3 = {
      ...o25,
      numberOfTubes: Math.ceil(eq.numberOfTubes(o25)),
      overallHeatTransferCoeff: eq.overallHeatTransferCoeff(o25),
    }
    return o3
  }, [formik.values])

  const makeProps = name => {
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

  const createPdf = async () => {
    const html = makeHTMLReport('test', 'preliminary', parsedData)
    const printOptions = {
      html,
    }
    // Print.printAsync(printOptions)
    const pdf = await Print.printToFileAsync(printOptions)
    await Sharing.shareAsync(pdf.uri, {
      mimeType: 'application/pdf',
      uti: 'com.adobe.pdf',
    })

    // const pdfFile = await makePDF('testname.pdf', html)
    // setPDFFile(pdfFile)
  }

  console.log(pdfFile)

  return (
    <Form>
      <LabeledText {...makeProps('shellSideOutTemp')} />

      <LabeledText {...makeProps('overallHeatTransferCoeff')} />

      <LabeledText {...makeProps('tubeLength')} />

      <LabeledText {...makeProps('pitchLength')} />

      <LabeledText {...makeProps('shellDiameter')} />

      <LabeledText {...makeProps('numberOfTubes')} />

      <Button onPress={createPdf}>
        <Text>Generate report</Text>
      </Button>

      <Text>{JSON.stringify(parsedData, null, 2)}</Text>
    </Form>
  )
}

export default ResultDisplay
