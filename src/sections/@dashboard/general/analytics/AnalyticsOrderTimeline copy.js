/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// @mui
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import useAuth from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';

// _mock_
import { _analyticOrderTimeline } from '../../../../_mock';

// ----------------------------------------------------------------------

AnalyticsOrderTimeline.propTypes = {
  roles: PropTypes.object,
};

export default function AnalyticsOrderTimeline({ roles }) {
  const { user, logout } = useAuth();

  const [logs, setLogs] = useState([]);

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/log/${roles}/${user?.id}`);
    setLogs(response.data);
  }, []);

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none',
        },
      }}
    >
      {/* <CardHeader title="Order Timeline" /> */}
      <CardContent>
        <Timeline>
          {logs.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === logs.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    message: PropTypes.string,
    user_type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { user_type, message, createdAt } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (user_type === 'CUSTOMER' && 'primary') ||
            (user_type === 'order2' && 'success') ||
            (user_type === 'order3' && 'info') ||
            (user_type === 'order4' && 'warning') ||
            'error'
          }
        />
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
