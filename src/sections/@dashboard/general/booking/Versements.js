/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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

import { UserTableToolbarReservation, UserTableRowPaimentTx } from '../../user/list';

// ----------------------------------------------------------------------

export default function Versements() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const { user } = useAuth();

  const isLight = theme.palette.mode === 'light';

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/payment/customer/${user?.customer_reference}`);
    setTableData(response.data);
  }, []);

  const handleClick = () => {
    navigate(PATH_DASHBOARD.general.payment);
  };

  return (
    <>
      <Card>
        <CardHeader title="Vos derniers versements" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Programme immobillier</TableCell>
                  <TableCell>Montant versé</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Mode de paiement</TableCell>
                  <TableCell>Banque</TableCell>
                  <TableCell>Date de paiement</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <UserTableRowPaimentTx
                    key={index}
                    tableData={tableData}
                    row={row}
                    // selected={selected.includes(row.id)}
                    // onSelectRow={() => onSelectRow(row.id)}
                    // onDeleteRow={() => handleDeleteRow(row.id)}
                    // onEditRow={() => handleEditRow(row.name)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            onClick={handleClick}
            endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          >
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
