//It does the job of useContext() to pass the React context data throughout the app
import { useContext } from "react";

import jwtDecode from "jwt-decode";

import authStorage from "../auth/storage";
import AuthContext from "../auth/context";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const login = (authToken) => {
    const user = jwtDecode(authToken);
    authStorage.storeToken(authToken);
    setUser(user);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return { user, setUser, logOut, login };
};
