import React from "react";
import { useMutation } from "urql";
import { useSessionStorage } from "react-use";
import SplashScreen from "./SplashScreen";

export const TOKEN_STORAGE_KEY = "token";

// Auth states
export const INITIALIZING = "initializing";
export const LOGGED_OUT = "loggedOut";
export const PENDING = "pending";
export const REFUSED = "refused";
export const LOGGED_IN = "loggedIn";

const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    loginChouettos(input: {
      email: $email
      password: $password
    }) {
      token
    }
  }
`;

const getToken = () =>
  window &&
  window.sessionStorage &&
  window.sessionStorage.getItem(TOKEN_STORAGE_KEY);

const AuthContext = React.createContext();

const AuthProvider = props => {
  const [token, setToken] = useSessionStorage(TOKEN_STORAGE_KEY, "", true);
  const [authState, setAuthState] = React.useState(INITIALIZING);
  const [response, executeLoginMutation] = useMutation(LOGIN);

  React.useEffect(
    () => {
      setAuthState(state => {
        if (state !== LOGGED_IN && token) {
          return LOGGED_IN;
        }
        if ((state === LOGGED_IN || state === INITIALIZING) && !token) {
          return LOGGED_OUT;
        }
        return state;
      });
    },
    [token]
  );

  React.useEffect(
    () => {
      if (!response.fetching && authState !== PENDING) {
        return;
      }

      if (response.fetching) {
        setAuthState(PENDING);
      } else if (response.data && response.data.loginChouettos.token) {
        setToken(response.data.loginChouettos.token);
      } else {
        setAuthState(REFUSED);
      }
    },
    [response, authState, setToken]
  );

  if (authState === INITIALIZING) {
    return <SplashScreen />;
  }

  const login = ({ email, password }) => {
    executeLoginMutation({
      email,
      password
    });
  };

  const logout = () => setToken("");

  return (
    <AuthContext.Provider
      value={{ authState, token, login, logout }}
      {...props}
    />
  );
};

const useAuth = () => React.useContext(AuthContext);

export default useAuth;
export { AuthProvider, getToken };
