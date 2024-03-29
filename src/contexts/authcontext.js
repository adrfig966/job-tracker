import { createContext, useContext, useReducer } from "react";
import faundadb, { query as q } from "faunadb";

const client = new faundadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY,
  endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
  domain: process.env.REACT_APP_FAUNA_DOMAIN,
});

const AuthContext = createContext();

const initialState = {
  user: null,
  error: null,
  userclient: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        userclient: action.userclient,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        userclient: null,
        error: null,
      };
    case "UPDATEPASSWORD":
      return {
        ...state,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const res = await client.query(q.Call("userlogin", email, password));

      dispatch({
        type: "LOGIN",
        payload: res,
        userclient: new faundadb.Client({
          secret: res.secret,
          endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
          domain: process.env.REACT_APP_FAUNA_DOMAIN,
        }),
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  const logout = async () => {
    try {
      await state.userclient.query(q.Logout(true));

      dispatch({
        type: "LOGOUT",
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  const signup = async (email, password, confirmpassword) => {
    try {
      await client.query(
        q.Call("usersignup", email, password, confirmpassword)
      );
      const res = await client.query(q.Call("userlogin", email, password));
      console.log("res", res);

      dispatch({
        type: "LOGIN",
        payload: res,
        userclient: new faundadb.Client({
          secret: res.secret,
          endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
          domain: process.env.REACT_APP_FAUNA_DOMAIN,
        }),
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  const updatepassword = async (password, confirmpassword) => {
    try {
      await state.userclient.query(
        q.Call("updatepassword", password, confirmpassword)
      );

      dispatch({
        type: "UPDATEPASSWORD",
      });
    } catch (error) {
      console.log("ERROR", error.message);
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, logout, signup, updatepassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
