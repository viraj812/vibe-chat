import { useReducer, createContext } from "react";

const AppReducer = (state, action) => {
    if (action.type == 'ADD_MSG') {
        state.msgList.push(action.payload);
        return { ...state }
    }
    else {
        return state;
    }
}

const initialState = {
    msgList: [
        {
            type: 'sent',
            value: 'Hey Bro'
        }
    ]
}

export const AppContext = createContext();

const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    return (
        <AppContext.Provider
            value={{
                msgList: state.msgList,
                dispatch
            }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppProvider;