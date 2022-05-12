import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession, decodeToken } from '../utils/jwt';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          const infoToken = decodeToken(accessToken);
          const response = await axios.get(`/ws-booking-payment/customer/${infoToken.data.customer_reference}`);
          console.log('response customer_reference', response);
          setSession(accessToken);
          const user = {
            id: response.data.id,
            customer_reference: response.data.customer_reference,
            email: response.data.email,
            lastName: response.data.lastname,
            firstName: response.data.firstname,
            password: response.data.password,
            role: 'customer',
            phoneNumber: response.data.phone_number,
            sexe: response.data.sexe,
            maritalStatus: response.data.marital_status,
          };

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (loginId, password) => {
    const body = { login_id: loginId, password };
    const response = await axios.post('/ws-booking-payment/customer/login', body);

    const { token, customer } = response.data;
    const user = {
      id: customer.id,
      customer_reference: customer.customer_reference,
      email: customer.email,
      lastName: customer.lastname,
      firstName: customer.firstname,
      password: customer.password,
      role: 'customer',
      phoneNumber: customer.phone_number,
      sexe: customer.sexe,
      maritalStatus: customer.marital_status,
    };

    // console.log('first user', user);
    setSession(token);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
    return response;
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    window.localStorage.clear();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
