import Document, { Head, Main, NextScript } from 'next/document'

const basename = process.env.BASENAME || ''

export default class MyDocument extends Document {
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
