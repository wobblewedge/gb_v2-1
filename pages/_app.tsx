import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Maggots-R-Us</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <style>{`
      html, body, #__next{
        height: 100%;
      }
      body {
        margin: 0;
        cursor: default;
        overscroll-behavior: none;

        font-family: Untitled Sans, -apple-system, system-ui, Segoe UI, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: hsl(206, 10%, 5%);
        line-height: 1;
      }

      #__next {
        position: relative;
        z-index: 0;
      }
      `}</style>
      </Head>
      <SafeHydrate>
        <Component {...pageProps} />
      </SafeHydrate>
    </>
  );
}
function SafeHydrate({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

export default MyApp;
