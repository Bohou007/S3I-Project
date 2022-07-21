/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
/* eslint-disable import/named */
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import moment from 'moment';
moment.locale('fr');
// @mui
import { Container, Tab, Box, Tabs, Stack, TextField, Card, TablePagination } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

// routes
import { PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../../_mock';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword,
} from '../../../sections/@dashboard/user/account';
import { AnalyticsOrderTimeline, AnalyticsNewsUpdate } from '../../../sections/@dashboard/general/analytics';
import axios from '../../../utils/axios';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';

// ----------------------------------------------------------------------

export default function LogActivity() {
  const { themeStretch } = useSettings();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { userId } = useParams();

  useEffect(() => {
    handleGetCustomerLogActivity();
  }, []);

  const onFilterStartDate = async (event) => {
    setFilterStartDate(event);
  };

  const onFilterEndDate = async (event) => {
    setFilterEndDate(event);
  };

  const handleGetCustomerLogActivity = async () => {
    const response = await axios.get(`/ws-booking-payment/log/CUSTOMER/${userId}`);
    setTableData(response.data);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterStartDate,
    filterEndDate,
  });
  const INPUT_WIDTH = 500;

  return (
    <Page title="Historique d'activitée">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Historique d'activitée"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root },
            {
              name: 'Listes des clients',
              href: PATH_DASHBOARD_ADMIN.general.userLists,
            },
            { name: "Historique d'activitée" },
          ]}
        />
        <Card>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <DatePicker
              label="Date de début"
              value={filterStartDate}
              onChange={(newValue) => {
                onFilterStartDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    maxWidth: { md: INPUT_WIDTH },
                  }}
                />
              )}
            />

            <DatePicker
              label="Date de fin"
              value={filterEndDate}
              onChange={(newValue) => {
                onFilterEndDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    maxWidth: { md: INPUT_WIDTH },
                  }}
                />
              )}
            />
          </Stack>
        </Card>
        <Box sx={{ mb: 5 }} />
        <Card>
          <Box sx={{ pt: 5, pl: 5, pr: 5 }}>
            {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <AnalyticsOrderTimeline key={index} logs={row} />
            ))}
          </Box>
          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

function applySortFilter({ tableData, comparator, filterStartDate, filterEndDate }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        moment(item.createdAt).format('DD/MM/YYYY') >= moment(filterStartDate).format('DD/MM/YYYY') &&
        moment(item.createdAt).format('DD/MM/YYYY') <= moment(filterEndDate).format('DD/MM/YYYY')
    );
  }

  return tableData;
}
