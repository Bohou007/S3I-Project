/* eslint-disable camelcase */
import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// utils
import axios from '../utils/axios';
import { isValidToken, setSession, decodeToken } from '../utils/jwt';

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
  LOGINADMIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
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
  loginAdmin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const { user } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const role = window.localStorage.getItem('role');
        const infoToken = decodeToken(accessToken);
        if (accessToken && isValidToken(accessToken)) {
          if (role !== 'customer') {
            const response = await axios.get(`/ws-booking-payment/agent-back-office/${infoToken.data.uuid}`);
            console.log('response admin_reference', response);
            setSession(accessToken);
            const user = {
              id: response.data.id,
              uuid: response.data.uuid,
              email: response.data.email,
              lastName: response.data.lastname,
              firstName: response.data.firstname,
              password: response.data.password,
              role: response.data.role,
            };
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user,
              },
            });
          } else {
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
          }
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

  const loginAdmin = async (email, password) => {
    const body = { email, password };
    const response = await axios.post('/ws-booking-payment/agent-back-office/login', body);
    const { token, back_office_agent } = response.data;
    const user = {
      id: back_office_agent.id,
      uuid: back_office_agent.uuid,
      email: back_office_agent.email,
      lastName: back_office_agent.lastname,
      firstName: back_office_agent.firstname,
      password: back_office_agent.password,
      role: back_office_agent.role,
      phoneNumber: back_office_agent.phone_number,
    };

    await setSession(token);
    await dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });

    localStorage.setItem('isLoggin', true);
    localStorage.setItem('role', 'admin');

    return response;
  };

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
    window.localStorage.setItem('role', 'customer');
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
    // window.localStorage.removeItem('accessToken');
    // window.localStorage.removeItem('isLoggin');

    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        loginAdmin,
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
