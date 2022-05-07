import "bulma";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="columns">
      <div className="column"></div>
      <div className="column is-3 my-6">
        <Component {...pageProps} />
      </div>

      <div className="column"></div>
    </div>
  );
}

export default MyApp;
