/* eslint-disable no-nested-ternary */
/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
/* eslint-disable react-hooks/exhaustive-deps */
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import moment from 'moment';
moment.locale('fr');

// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Grid,
  Stack,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// _mock_
import { _deadlineList } from '../../../_mock';
// import { program } from '../../../_mock/program';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';
import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../components/skeleton';
// sections
import { UserTableToolbarReservation, UserTableRowReservation } from '../../../sections/@dashboard/user/list';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { AppFeatured, AppWelcome, AppWidget } from '../../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tous les echeances', 'Echances passées', 'Echanches à venir'];

const TABLE_HEAD = [
  { id: 'programmeImobillier', label: 'Programme immobillier', align: 'left' },
  { id: 'lot', label: 'Lot', align: 'left' },
  { id: 'sousLot', label: 'Sous-lot', align: 'left' },
  { id: 'montantReservation', label: 'Montant total', align: 'left' },
  { id: 'montantReservation', label: 'Montant versé', align: 'left' },
  { id: 'date_fin', label: 'fin de paiement', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function Reservation() {
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
  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [program, setProgram] = useState([]);
  const [isGet, setIsGet] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterProgramme, setFilterProgramme] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);

  const [totalReservationAmount, setTotalReservationAmount] = useState(0);
  const [totalAmountPay, setTotalAmountPay] = useState(0);

  const PROGRAMME_OPTIONS = program;

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/booking/customer/${user?.customer_reference}`);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${user?.customer_reference}`
    );

    const totalAmountPayData = await axios.get(
      `/ws-booking-payment/booking/customer/${user?.customer_reference}/total_amount_paid`
    );
    const totalReservationAmountData = await axios.get(
      `/ws-booking-payment/booking/customer/${user?.customer_reference}/total_house_amount`
    );
    setTotalReservationAmount(totalReservationAmountData.data);
    setTotalAmountPay(totalAmountPayData.data);
    setTableData(response.data);
    setProgram(programData.data);

    if (response.status === 200 && programData.status === 200) {
      setIsGet(true);
    }

    setTimeout(() => {
      setIsGet(false);
    }, 3000);
  }, []);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterDate = async (event) => {
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${user?.customer_reference}`
    );
    setFilterDate(event);

    if (programData.status === 200) {
      setIsGet(true);
    }

    setTimeout(() => {
      setIsGet(false);
    }, 2000);
  };

  const handleFilterProgramme = async (event) => {
    console.log('event.target.value', event.target.value);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${user?.customer_reference}`
    );
    setFilterProgramme(event.target.value);
    // setProgram(programData.data);

    if (programData.status === 200) {
      setIsGet(true);
    }

    setTimeout(() => {
      setIsGet(false);
    }, 2000);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const statisticsAmount = (total, partial) => {
    // Calculate the percentage
    const percent = (partial / total) * 100;
    // arrondi sans nombre aores la virgule
    const percentRounded = Math.round(percent);
    console.log(percent);
    return percentRounded;
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterProgramme,
    // filterStatus,
    filterDate,
  });
  const denseHeight = dense ? 52 : 72;
  setTimeout(() => {
    setIsNotFound(
      (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterProgramme) ||
        (!dataFiltered.length && !!filterStatus)
    );
  }, 4000);

  return (
    <Page title="Consulter mes logements">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Consulter mes logements"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD.root }, { name: 'Mes logements' }]}
        />
        <Card sx={{ padding: 5, marginBottom: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AppWidget
                title="Montant verser"
                total={totalAmountPay}
                icon={'eva:credit-card-ffill'}
                color="warning"
                chartData={statisticsAmount(totalReservationAmount, totalAmountPay)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppWidget
                title="Montant restant "
                total={totalReservationAmount - totalAmountPay}
                icon={'eva:person-ffill'}
                chartData={statisticsAmount(totalReservationAmount, totalReservationAmount - totalAmountPay)}
              />
            </Grid>
          </Grid>
        </Card>

        <Card>
          {/* <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs> */}

          {/* <Divider /> */}

          <UserTableToolbarReservation
            filterName={filterName}
            filterProgramme={filterProgramme}
            filterDate={filterDate}
            onFilterName={handleFilterName}
            onFilterProgramme={handleFilterProgramme}
            onFilterDate={handleFilterDate}
            optionsProgrmme={PROGRAMME_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {isGet ? (
                    <>
                      <SkeletonConversationItem />
                      <SkeletonConversationItem />
                      <SkeletonConversationItem />
                    </>
                  ) : dataFiltered.length > 0 ? (
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <UserTableRowReservation
                          key={index}
                          tableData={tableData}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                        />
                      ))
                  ) : (
                    isNotFound && (
                      <>
                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                        />
                        <TableNoData isNotFound={isNotFound} />
                      </>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

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

            {/* <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            /> */}
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

function applySortFilter({ tableData, comparator, filterName, filterProgramme, filterDate }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  // if (filterStatus !== 'all') {
  //   tableData = tableData.filter((item) => item.status === filterStatus);
  // }

  if (filterProgramme !== 'all') {
    tableData = tableData.filter((item) => item.real_estate_programe_reference === filterProgramme);
  }

  if (filterDate) {
    tableData = tableData.filter(
      (item) => moment(item.payment_schedule_end_date).format('DD/MM/YYYY') === moment(filterDate).format('DD/MM/YYYY')
    );
  }

  return tableData;
}
