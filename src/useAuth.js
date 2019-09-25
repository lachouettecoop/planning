import React from "react";
import SplashScreen from "./SplashScreen";

const AuthContext = React.createContext();

const AuthProvider = props => {
  const [user, setUser] = React.useState();

  React.useEffect(() => setTimeout(() => setUser({}), 1000), []);
  // code for pre-loading the user's information if we have their token in

  // localStorage goes here

  // 🚨 this is the important bit.

  // Normally your provider components render the context provider with a value.

  // But we post-pone rendering any of the children until after we've determined

  // whether or not we have a user token and if we do, then we render a spinner

  // while we go retrieve that user's information.

  if (!user) {
    return <SplashScreen />;
  }

  const login = ({ email, password }) => {
    setTimeout(() => setUser({ email, name: "toto" }), 1200);
  }; // make a login request

  const register = () => {}; // register the user

  const logout = () => {}; // clear the token in localStorage and the user data

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register }}
      {...props}
    />
  );
};

const useAuth = () => React.useContext(AuthContext);

export default useAuth;
export { AuthProvider };
