import { AsyncStorage } from "react-native";

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (token, userId, expirationTime) => {
    return dispatch => {
        dispatch({ type: AUTHENTICATE, token: token, userId: userId});
        dispatch(setLogoutTimer(expirationTime))
    };
};

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAjmDlLW615UyxTdeskZNnEjV1a987BcRs',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            let message = 'Something Went Wrong!!!';
            const errorData = await response.json();
            const errId = errorData.error.message;
            if (errId === 'EMAIL_EXISTS') {
                message = 'User already exists, Try Login';
            }
            else if (errId.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
                message = 'Too many invalid attemps!! try again later';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));

        saveTostorage(resData.idToken, resData.localId, resData.expiresIn);
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAjmDlLW615UyxTdeskZNnEjV1a987BcRs',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            let message = 'Something Went Wrong!!!';
            const errorData = await response.json();
            const errId = errorData.error.message;

            if (errId === 'EMAIL_NOT_FOUND' || errId === 'INVALID_PASSWORD') {
                message = 'invalid Email Or Password';
            }
            else if (errId.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
                message = 'Too many invalid attemps!! try again later';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(authenticate(
            resData.idToken,
            resData.localId,
            parseInt(resData.expiresIn) * 1000
        ));

        saveTostorage(resData.idToken, resData.localId, resData.expiresIn);
    };

};

export const logout = () => {
    return dispatch => {
        if (timer) {
            clearTimeout(timer);
        }
        AsyncStorage.removeItem('userCredentials');
        dispatch({ type: LOGOUT });
    };
};

const setLogoutTimer = (expirationTime) => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime/100);
    };
};

const saveTostorage = (token, userId, expiresIn) => {
    const expirationDate = new Date(new Date().getTime() + parseInt(expiresIn) * 1000);
    console.log(`in savetoStorage : ${expirationDate},  , ${expiresIn}`);

    AsyncStorage.setItem('userCredentials',
        JSON.stringify({
            token,
            userId,
            expirationDate: expirationDate.toISOString()
        }));
};