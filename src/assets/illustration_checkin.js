// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from '../components/Image';

// ----------------------------------------------------------------------
import moneyIcon from './images/moneyIcon.png';

export default function CheckInIllustration({ ...other }) {
  const theme = useTheme();
  const PRIMARY_LIGHTER = theme.palette.primary.lighter;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;
  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
      <Image disabledEffect src={moneyIcon} sx={{ width: '100%', height: '100%' }} />
    </Box>
  );
}
