// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from '../components/Image';

import waitMoney from './images/waitMoney.png';

// ----------------------------------------------------------------------

export default function CheckOutIllustration({ ...other }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;
  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
      <Image disabledEffect src={waitMoney} sx={{ width: '100%', height: '100%' }} />
    </Box>
  );
}
