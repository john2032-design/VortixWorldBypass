import Head from 'next/head'
import '../styles/globals.css'
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>VortixWorld Bypass</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/BFB1896C-9FA4-4429-881A-38074322DFCB.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
