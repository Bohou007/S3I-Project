/* eslint-disable prefer-template */
/* eslint-disable react/self-closing-comp */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// @mui
import { Card, Typography, CardHeader, CardContent, Stack } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import useAuth from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';

// _mock_
import { _analyticOrderTimeline } from '../../../../_mock';
import Iconify from '../../../../components/Iconify';
import EmptyContent from '../../../../components/EmptyContent';

// ----------------------------------------------------------------------

AnalyticsOrderTimeline.propTypes = {
  logs: PropTypes.object,
  key: PropTypes.number,
};

export default function AnalyticsOrderTimeline({ logs, key }) {
  const user = JSON.parse(localStorage.getItem('customer'));
  console.log('===============logs=====================');
  console.log(logs);
  console.log('====================================');
  return (
    <Stack
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none',
        },
      }}
    >
      {logs ? (
        <Timeline>
          <OrderItem user={user?.lastname + ' ' + user?.firstname + ' '} item={logs} isLast={key === logs.length - 1} />
        </Timeline>
      ) : (
        <EmptyContent title={"Pas d'historique"} description={"Cet utilisateur n'a pas d'historique d'activitée."} />
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  user: PropTypes.string,
  item: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    message: PropTypes.string,
    user_type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast, user }) {
  const { user_type, message, createdAt } = item;

  const textArray = message.split(user);
  const result = textArray.pop();
  const last = result.split(' ');
  const lastM = last.pop();
  const fmtlastM = ' ' + lastM;
  const test = result.split(fmtlastM);
  const reference = test.shift();

  console.log('================lastM lastM====================');
  console.log(reference);
  console.log('====================================');
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (result === "s'est connecté." && 'info') ||
            (result === 'a consulté son tableau de bord' && 'success') ||
            (result === "s'est déconnecté." && 'error') ||
            (result === 'a consulté ces logements' && 'primary') ||
            (reference === 'a consulté les details de son logement ayant pour référence' && 'primary') ||
            (result === 'a consulté ces échéances' && 'secondary') ||
            (result === 'a consulté son profile' && 'warning') ||
            (reference === "a consulté son état d'avancement pour la reservation de référence" && 'info') ||
            (reference === "a consulté les details d'une de ces échéances pour la reservation de référence" &&
              'secondary') ||
            (result === 'a consulté ces versements' && 'primary') ||
            (reference === "a consulté la facture d'un de ces versements ayant pour reference" && 'primary') ||
            (reference === "a téléchargée la facture d'un de ces versements ayant pour reference" && 'secondary') ||
            (reference === "a imprimée la facture d'un de ces versements ayant pour reference" && 'secondary') ||
            'info'
          }
        >
          {' '}
          <Iconify
            icon={
              (result === "s'est connecté." && 'eva:log-in-outline') ||
              (result === 'a consulté son tableau de bord' && 'eva:pie-chart-outline') ||
              (result === "s'est deconnecté." && 'eva:log-out-outline') ||
              (result === 'a consulté ces logements' && 'eva:home-outline') ||
              (reference === 'a consulté les details de son logement ayant pour référence' && 'eva:home-outline') ||
              (result === 'a consulté ces échéances' && 'eva:calendar-outline') ||
              (result === 'a consulté son profile' && 'eva:person-outline') ||
              (reference === "a consulté son état d'avancement pour la reservation de référence" &&
                'ic:round-perm-media') ||
              (reference === "a consulté les details d'une de ces échéances pour la reservation de référence" &&
                'eva:calendar-outline') ||
              (result === 'a consulté ces versements' && 'eva:credit-card-outline') ||
              (reference === "a consulté la facture d'un de ces versements ayant pour reference" &&
                'eva:credit-card-outline') ||
              (reference === "a téléchargée la facture d'un de ces versements ayant pour reference" &&
                'eva:download-outline') ||
              (reference === "a imprimée la facture d'un de ces versements ayant pour reference" &&
                'eva:printer-outline') ||
              'eva:alert-circle-outline'
            }
            width={20}
            height={20}
          />
        </TimelineDot>
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{message}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(createdAt)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
