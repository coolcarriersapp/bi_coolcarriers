import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Amplify } from "@aws-amplify/core";
import config from "./aws-exports.tsx";
// === Styles ===
import "./index.css";
//core
import "primereact/resources/primereact.min.css";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { BrowserRouter } from "react-router-dom";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  aws_appsync_graphqlEndpoint: config.graphqlEndpoint,
  aws_appsync_region: config.graphqlRegion,
  aws_appsync_authenticationType: config.graphqlAuthenticationType,
  Storage: {
    AWSS3: {
      bucket: config.s3.BUCKET,
      region: config.s3.REGION,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
