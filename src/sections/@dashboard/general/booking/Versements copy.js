/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  Link,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// _mock_
import { _bookings } from '../../../../_mock';
//
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import MenuPopover from '../../../../components/MenuPopover';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function Versements() {
  const theme = useTheme();
  const [tableData, setTableData] = useState([]);
  const { user } = useAuth();

  const isLight = theme.palette.mode === 'light';

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/payment/customer/${user?.customer_reference}`);
    setTableData(response.data);
  }, []);

  return (
    <>
      <Card>
        <CardHeader title="Vos derniers versements" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 240 }}>Programme immobillier</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Montant versé</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Reference</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Mode de paiement</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Banque</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Date de paiement</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={row.name} src={row.avatar} />
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{format(new Date(row.checkIn), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{format(new Date(row.checkOut), 'dd MMM yyyy')}</TableCell>

                    <TableCell>
                      <Label
                        variant={isLight ? 'ghost' : 'filled'}
                        color={
                          (row.status === 'paid' && 'success') || (row.status === 'pending' && 'warning') || 'error'
                        }
                      >
                        {sentenceCase(row.status)}
                      </Label>
                    </TableCell>

                    <TableCell>{row.phoneNumber}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{row.roomType}</TableCell>

                    <TableCell align="right">
                      <MoreMenuButton />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" on endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            {/* <Link variant="subtitle2" component={RouterLink} to={PATH_DASHBOARD.payment}> */}
            Voir tout
            {/* </Link> */}
          </Button>
        </Box>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:download-fill'} sx={{ ...ICON }} />
          Download
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:printer-fill'} sx={{ ...ICON }} />
          Print
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:share-fill'} sx={{ ...ICON }} />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
