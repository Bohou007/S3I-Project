/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import moment from 'moment';

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
import { UserTableToolbarReservation, UserTableRowPaiment } from '../../../sections/@dashboard/user/list';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../components/skeleton';
import { AddLogs } from '../log/AddLogs';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tous les echeances', 'Echances passées', 'Echanches à venir'];

const TABLE_HEAD = [
  { id: 'programmeImobillier', label: 'Programme Immobillier', align: 'left' },
  { id: 'montant', label: 'Montant versé', align: 'left' },
  { id: 'input_payment_reference', label: 'Référence', align: 'left' },
  { id: 'payment_method', label: 'Mode de paiement', align: 'left' },
  { id: 'bank', label: 'Banque', align: 'center' },
  { id: 'payment_date', label: 'Date de paiement', align: 'center' },
  { id: '' },
];
export default function Payment() {
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
  const [tableData, setTableData] = useState([]);
  const [program, setProgram] = useState([]);
  const navigate = useNavigate();
  const PROGRAMME_OPTIONS = program;

  const [filterName, setFilterName] = useState('');
  const [isGet, setIsGet] = useState(false);
  const [listProName, setListProName] = useState('');

  const [filterProgramme, setFilterProgramme] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/payment/customer/${user?.customer_reference}`);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${user?.customer_reference}`
    );
    setProgram(programData.data);

    setTableData(response.data);
    // if (response.status === 200 && programData.status === 200) {
    //   setIsGet(true);
    // }
    AddLogs('a consulté ces versements', user);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  }, []);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterDate = async (event) => {
    setFilterDate(event);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${user?.customer_reference}`
    );

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const handleFilterProgramme = async (event) => {
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${user?.customer_reference}`
    );
    handleGetProgramme(event.target.value);
    setFilterProgramme(event.target.value);
    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const handleGetProgramme = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value}`);
    const programme = response.data.label + ' ' + response.data.formula + ' ' + response.data.real_estate_program_type;
    setListProName(programme);
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

  const handleViewRow = (paymentReference) => {
    navigate(PATH_DASHBOARD.general.paymentView(paymentReference));
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
  }, 2100);

  return (
    <Page title="Consulter mes versements">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Consulter mes versements"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD.root }, { name: 'Mes versements' }]}
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
                    dataFiltered.length > 0 ? (
                      dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <UserTableRowPaiment
                            key={index}
                            tableData={tableData}
                            row={row}
                            onViewRow={() => handleViewRow(row.payment_reference)}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            handleGetProgramme={handleGetProgramme}
                            listProName={listProName}
                            user={user}
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

// ----------------------------------------------------------------------
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
    tableData = tableData.filter((item) => item.real_estate_program_reference === filterProgramme);
  }

  if (filterDate) {
    tableData = tableData.filter(
      (item) => moment(item.payment_date).format('DD/MM/YYYY') === moment(filterDate).format('DD/MM/YYYY')
    );
  }

  return tableData;
}
