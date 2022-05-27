// @mui
// @mui
import { Box, Skeleton, Grid, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonStat() {
  return (
    <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 3, py: 1 }}>
      <Skeleton variant="circular" width={70} height={70} sx={{ backgroundColor: '#fff', opacity: '0.1' }} />
      <Stack>
        <Stack>
          <Skeleton variant="text" sx={{ width: 300, height: 25, backgroundColor: '#fff', opacity: '0.1' }} />
          <Skeleton variant="text" sx={{ width: 200, height: 20, backgroundColor: '#fff', opacity: '0.1' }} />
        </Stack>
      </Stack>
    </Stack>
  );
}
