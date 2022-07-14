/* eslint-disable no-nested-ternary */
/* eslint-disable import/first */
/* eslint-disable no-unused-vars */
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// _mock_
import { _deadlineList } from '../../../_mock';
import { program } from '../../../_mock/program';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableSkeleton,
  TableNoData,
  TableSelectedActions,
} from '../../../components/table';
// sections
import { UserTableToolbarTx, UserTableRowTx } from '../../../sections/@dashboard/user/list';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../components/skeleton';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tous les echeances', 'Echances passées', 'Echanches à venir'];

const TABLE_HEAD = [
  { id: 'CodeReservation', label: 'Code de mon logement', align: 'left' },
  { id: 'program', label: 'Programme immobillier', align: 'left' },
  // { id: 'ilot', label: 'I Lot', align: 'left' },
  { id: 'montant', label: 'Montant à payer', align: 'left' },
  { id: 'date_echeance', label: 'Date Echeances', align: 'left' },
  { id: 'statut', label: 'Statut', align: 'left' },
  { id: '' },
];

export default function Deadlines() {
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

  const { themeStretch } = useSettings();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [programData, setProgramData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterProgramme, setFilterProgramme] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [isGet, setIsGet] = useState(false);

  const PROGRAMME_OPTIONS = programData;

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/booking/customer/${user?.customer_reference}`);
    setProgramData(response.data);
    const resData = response.data;
    const option = resData[0];
    setFilterProgramme(option.booking_reference);
    const booking = await axios.get(`/ws-booking-payment/payment-schedule/booking/${option.booking_reference}`);
    setTableData(booking.data);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  }, []);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterDate = (event) => {
    setIsGet(false);
    setTimeout(() => {
      setIsGet(true);
    }, 3000);

    setFilterDate(event);
  };

  const handleFilterProgramme = async (event) => {
    const response = await axios.get(`/ws-booking-payment/payment-schedule/booking/${event.target.value}`);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);

    setTableData(response.data);
    setFilterProgramme(event.target.value);
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

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterProgramme,
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
    <Page title="Consulter mes echeances">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Consulter mes echeances"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD.root }, { name: 'Mes echeances' }]}
        />

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

          <UserTableToolbarTx
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
                    dataFiltered.length > 0 ? (
                      dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <UserTableRowTx
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
                    )
                  ) : (
                    <TableSkeleton />
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

  // if (filterName) {
  //   tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  // }

  // if (filterStatus !== 'all') {
  //   tableData = tableData.filter((item) => item.status === filterStatus);
  // }

  // if (filterProgramme !== 'all') {
  //   tableData = tableData.filter((item) => item.booking_reference === filterProgramme);
  // }

  if (filterDate) {
    tableData = tableData.filter(
      (item) => moment(item.due_date).format('DD/MM/YYYY') === moment(filterDate).format('DD/MM/YYYY')
    );
  }

  return tableData;
}
