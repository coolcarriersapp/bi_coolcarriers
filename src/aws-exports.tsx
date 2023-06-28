const config = {
  env: import.meta.env.VITE_APP_ENV,
  s3: {
    REGION: import.meta.env.VITE_APP_S3_REGION,
    BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
  },
  cognito: {
    REGION: import.meta.env.VITE_APP_COGNITO_REGION,
    USER_POOL_ID: import.meta.env.VITE_APP_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_APP_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID,
  },
  apolloName: import.meta.env.VITE_APP_APOLLO_NAME,
  apolloEndpoint: import.meta.env.VITE_APP_APOLLO_ENDPOINT,
  graphqlEndpoint: import.meta.env.VITE_APP_GRAPHQL_ENDPOINT,
  graphqlRegion: import.meta.env.VITE_APP_GRAPHQL_REGION,
  graphqlAuthenticationType: import.meta.env
    .VITE_APP_GRAPHQL_AUTHENTICATION_TYPE,
  graphqlApiKey: import.meta.env.VITE_APP_GRAPHQL_API_KEY,
};

export default config;
