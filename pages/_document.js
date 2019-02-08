import Document, { Head, Main, NextScript } from 'next/document'

const basename = process.env.BASENAME || ''
const isProd = process.env.PRODUCTION

class StagingDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="https://www.ipp.eu/wp-content/themes/ipp/assets/css/global.min.css" />
          <link rel="stylesheet" href={`${basename}/_next/static/style.css`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

class ProdDocument extends Document {
  render() {
    return <Main />
  }
}

const MyDocument = isProd ? ProdDocument : StagingDocument

export default MyDocument
