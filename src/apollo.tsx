import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  NextLink,
  Operation,
  FetchResult,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Auth } from "aws-amplify";
import { Observable } from "@apollo/client/utilities";
import config from "./aws-exports";

const httpLink = new HttpLink({
  uri: config.apolloEndpoint,
});

// Function to log out the user when the authentication token has expired
const handleLogout = () => {
  // Here you can implement the logic to log out the user
  console.log("Token expired. Logging out the user...");
  // Example: Clear the authentication token stored in localStorage
  localStorage.removeItem("authToken");
  // Redirect the user to the login page, for example
  window.location.href = "/login";
};

// Middleware to check if the token has expired
const authMiddleware = new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<FetchResult> => {
    return new Observable<FetchResult>((observer) => {
      let isSubscribed = true;

      getAccessToken()
        .then((authToken) => {
          // Valid token, attach the authorization header to the request
          operation.setContext({
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          forward(operation).subscribe({
            next: (result) => {
              if (isSubscribed) {
                observer.next(result);
              }
            },
            error: (error) => {
              if (isSubscribed) {
                observer.error(error);
              }
            },
            complete: () => {
              if (isSubscribed) {
                observer.complete();
              }
            },
          });
        })
        .catch((error) => {
          // Token expired or not available, log out the user
          handleLogout();
          observer.error(error);
        });

      return () => {
        isSubscribed = false;
      };
    });
  }
);

// Function to obtain the access token from AWS Cognito
const getAccessToken = async (): Promise<string> => {
  let data = await Auth.currentAuthenticatedUser();
  data = data.signInUserSession.idToken.jwtToken;
  return data;
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // Handle GraphQL errors according to your needs
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Locations: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    // Handle network errors according to your needs
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authMiddleware.concat(httpLink)),
  cache: new InMemoryCache(),
});

export default client;
