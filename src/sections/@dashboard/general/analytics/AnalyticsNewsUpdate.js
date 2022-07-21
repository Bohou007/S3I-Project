import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { fToNow } from '../../../../utils/formatTime';
// _mock_
import { _analyticPost, _analyticOrderTimeline } from '../../../../_mock';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

AnalyticsNewsUpdate.propTypes = {
  logs: PropTypes.object,
};

export default function AnalyticsNewsUpdate({ logs }) {
  return (
    <>
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          <NewsItem news={logs} />
        </Stack>
      </Scrollbar>

      <Divider />
    </>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    message: PropTypes.string,
    user_type: PropTypes.string,
    // image: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { message, createdAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {/* <Image alt={message} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} /> */}
      <Box sx={{ minWidth: 240 }}>
        <Link component={RouterLink} to="#" color="inherit">
          <Typography variant="subtitle2" noWrap>
            {message}
          </Typography>
        </Link>
        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {fToNow(createdAt)}
        </Typography>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography> */}
      </Box>
    </Stack>
  );
}
