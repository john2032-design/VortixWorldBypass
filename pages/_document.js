import Document, { Html, Head, Main, NextScript } from 'next/document'
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#2e26b8" />
          <link rel="icon" href="/BFB1896C-9FA4-4429-881A-38074322DFCB.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
