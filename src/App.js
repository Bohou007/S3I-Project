/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/self-closing-comp */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prefer-stateless-function */
import React, { useRef } from 'react';
import { HashRouter, Route } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import IdleTimerContainer from './components/idle-timer/IdleTimerContainer';
import IdleTimer from './components/idle-timer/IdleTimer';
import IdleTimerAdmin from './components/idle-timer/IdleTimerAdmin';
import useAuth from './hooks/useAuth';

// ----------------------------------------------------------------------
export default function App() {
  const { user, logout } = useAuth();

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <MotionLazyContainer>
                <ProgressBarStyle />
                <ChartStyle />
                <ScrollToTop />
                <Router />
                {user !== null ? user.role.toUpperCase() === 'CUSTOMER' ? <IdleTimer /> : <IdleTimerAdmin /> : ''}
              </MotionLazyContainer>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
