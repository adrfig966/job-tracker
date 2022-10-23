import { createContext, useContext, useReducer } from 'react';
import faundadb, { query as q } from 'faunadb';

const client = new faundadb.Client({
    secret: process.env.REACT_APP_FAUNA_KEY_SUPER,
    endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
    domain: process.env.REACT_APP_FAUNA_DOMAIN,
});

const AuthContext = createContext();

const initialState = {
    user: null,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
            };
        case 'ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async (email, password) => {
        try {
            const res = await client.query(q.Login(q.Match(q.Index('accounts_by_email'), email), { password }));
            dispatch({
                type: 'LOGIN',
                payload: res,
            });
        } catch (error) {
            dispatch({
                type: 'ERROR',
                payload: error.message,
            });
        }
    };

    const logout = async () => {
        try {
            await client.query(q.Logout(true));
            dispatch({
                type: 'LOGOUT',
            });
        } catch (error) {
            dispatch({
                type: 'ERROR',
                payload: error.message,
            });
        }
    };

    const signup = async (email, password) => {
        try {
            const res = await client.query(q.Call('usersignup', email, password));
            dispatch({
                type: 'LOGIN',
                payload: res,
            });
        } catch (error) {
            dispatch({
                type: 'ERROR',
                payload: error.message,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ state, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

