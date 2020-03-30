import RNHTMLtoPDF from 'react-native-html-to-pdf'

const makePDF = async (fileName, html) => {
  const options = { html, fileName, directory: 'cache' }
  const file = await RNHTMLtoPDF.convert(options)
  return file
}

export default makePDF
