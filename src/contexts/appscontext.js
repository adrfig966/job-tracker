import { createContext, useContext, useReducer } from 'react';
import { query as q } from 'faunadb';

const AppsContext = createContext();

const initialState = {
    apps: [],
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'GETAPPS':
            return {
                ...state,
                apps: action.payload,
            };
        case 'ADDAPP':
            return {
                ...state,
                apps: [...state.apps, action.payload],
            };
        case 'DELETEAPP':
            return {
                ...state,
                apps: state.apps.filter(app => app.ref.value.id !== action.payload.ref.value.id),
            };
        case 'UPDATEAPP':
            return {
                ...state,
                apps: state.apps.map(app => app.ref.value.id === action.payload.ref.value.id ? action.payload : app),
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

const AppsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const getApps = async (userclient) => {
        try {
            const res = await userclient.query(
                q.Map(
                    q.Paginate(q.Match(q.Index('all_applications'))),
                    q.Lambda('X', q.Get(q.Var('X')))
                )
            );
            
            dispatch({
                type: 'GETAPPS',
                payload: res.data,
            });
        } catch (error) {
            dispatch({
                type: 'ERROR',
                payload: error,
            });
        }
    }

    const addApp = async (userclient, app) => {
        try {
            const res = await userclient.query(
                q.Call("addjobapplication", app)
            );

            dispatch({
                type: 'ADDAPP',
                payload: res,
            });
        } catch (error) {
            dispatch({
                type: 'ERROR',
                payload: error,
            });
        }
    }

    const deleteApp = async (userclient, appref) => {
        try {
            const res = await userclient.query(
                q.Call("deletejobapplication", appref.value.id)
            );

            dispatch({
                type: 'DELETEAPP',
                payload: res,
            });
        }
        catch (error) {
            dispatch({
                type: 'ERROR',
                payload: error,
            });
        }
    }

    const updateApp = async (userclient, appref, app) => {
        try {
            const res = await userclient.query(
                q.Update(
                    q.Ref(q.Collection('applications'), appref.value.id),
                    { data: app }
                )
            );
            console.log("Update res", res);
            dispatch({
                type: 'UPDATEAPP',
                payload: res,
            });
        }
        catch (error) {
            console.log(error);
            dispatch({
                type: 'ERROR',
                payload: error,
            });
        }
    }



    return (
        <AppsContext.Provider
            value={{
                apps: state.apps,
                error: state.error,
                getApps,
                addApp,
                deleteApp,
                updateApp,
            }}
        >
            {children}
        </AppsContext.Provider>
    );
}

const useAppsContext = () => useContext(AppsContext);

export { AppsProvider, useAppsContext };
