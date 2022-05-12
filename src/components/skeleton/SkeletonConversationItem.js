// @mui
import { Stack, Skeleton, TableRow, TableCell } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonConversationItem() {
  return (
    // <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 3, py: 1.5 }}>
    //   <Stack spacing={0.4} sx={{ flexGrow: 1 }}>
    //     <Skeleton variant="rectangular" sx={{ width: '100%', height: 50 }} />
    //     <Skeleton variant="rectangular" sx={{ width: 800, height: 50 }} />
    //     <Skeleton variant="rectangular" sx={{ width: 500, height: 50 }} />
    //   </Stack>
    // </Stack>

    <TableRow hover>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 140, height: 20 }} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 140, height: 20 }} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 80, height: 20 }} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 80, height: 20 }} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 140, height: 20 }} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 140, height: 20 }} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" sx={{ width: 140, height: 30 }} />
      </TableCell>
    </TableRow>
  );
}
