/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
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
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../../../routes/paths';

import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../../components/skeleton';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableSkeleton,
  TableNoData,
  TableSelectedActions,
} from '../../../../components/table';

// ----------------------------------------------------------------------
import { UserTableToolbarReservation, UserTableRowTx } from '../../user/list';

export default function Echeances() {
  const navigate = useNavigate();

  const theme = useTheme();
  const [tableData, setTableData] = useState([]);
  const { user } = useAuth();

  const [isNotFound, setIsNotFound] = useState(false);
  const [isGet, setIsGet] = useState(false);

  const isLight = theme.palette.mode === 'light';

  useEffect(async () => {
    const deadline = await axios.get(
      `/ws-booking-payment/payment-schedule/customer/${user?.customer_reference}/limit/5`
    );

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
    setTableData(deadline.data);
  }, []);

  const handleClick = () => {
    navigate(PATH_DASHBOARD.general.deadlines);
  };

  setTimeout(() => {
    const ntF = tableData.length === 0 ? true : false;
    setIsNotFound(ntF);
  }, 4000);

  return (
    <>
      <Card>
        <CardHeader title="Vos écheances les plus proches" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Référence du logement</TableCell>
                  <TableCell>Programme immobillier</TableCell>
                  <TableCell>Montant à payer</TableCell>
                  <TableCell>Date échéance</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell> </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {isGet ? (
                  tableData.length > 0 ? (
                    tableData.map((row, index) => <UserTableRowTx key={index} tableData={tableData} row={row} />)
                  ) : (
                    isNotFound && (
                      <>
                        <TableEmptyRows height={'72'} />
                        <TableNoData isNotFound={isNotFound} />
                      </>
                    )
                  )
                ) : (
                  <TableSkeleton />
                )}
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
            Voir tout
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
