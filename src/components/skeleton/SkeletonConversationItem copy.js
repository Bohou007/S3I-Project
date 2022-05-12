// @mui
import { Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonConversationItem() {
  return (
    <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 3, py: 1.5 }}>
      <Stack sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" sx={{ width: 900, height: 50 }} />
        <Skeleton variant="text" sx={{ width: 800, height: 50 }} />
        <Skeleton variant="text" sx={{ width: 500, height: 50 }} />
      </Stack>
    </Stack>
  );
}
