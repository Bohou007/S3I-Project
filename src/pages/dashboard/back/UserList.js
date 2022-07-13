/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  DialogActions,
  Dialog,
  DialogTitle,
  CircularProgress,
  Stack,
} from '@mui/material';
// routes
import { PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// _mock_
import { _userList } from '../../../_mock';
import axios from '../../../utils/axios';

// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../../sections/@dashboard/user/list';
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';
import UserNewEditFormPassword from '../../../sections/@dashboard/user/UserNewEditFormPassword';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 'nom', label: 'Nom complet', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Numero de telephone', align: 'left' },
  { id: 'status', label: 'Status matrimonial', align: 'left' },
  { id: 'date', label: 'Date de creation', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
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
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalPassword, setIsOpenModalPassword] = useState(false);
  const [event, setEvent] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [isGet, setIsGet] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailRow, setDetailRow] = useState('');

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  useEffect(async () => {
    handleChargePage();
  }, []);

  const handleChargePage = async () => {
    const response = await axios.get(`/ws-booking-payment/customer`);
    setTableData(response.data);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEvent(false);
  };

  const handleCloseModalPassword = () => {
    setIsOpenModalPassword(false);
  };

  const handleOpeneModalPassword = async (value) => {
    // const response = await axios.get(`/ws-booking-payment/customer/${value.customer_reference}`);
    setDetailRow(value);
    setIsOpenModalPassword(true);
  };

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
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
    navigate(PATH_DASHBOARD_ADMIN.user.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  setTimeout(() => {
    setIsNotFound(
      (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterRole) ||
        (!dataFiltered.length && !!filterStatus)
    );
  }, 4000);

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setDetailRow({ ...detailRow, [name]: value });
  };

  const handleAddEvent = async (value) => {
    const response = await axios.get(`/ws-booking-payment/customer/${value.customer_reference}`);
    setDetailRow(value);
    setIsOpenModal(true);
  };

  const onSubmitChangePassword = async (data) => {
    setIsLoading(true);
    const item = {
      new_password: data.password,
      confirm_password: data.password_confirmation,
    };
    axios
      .put(`/ws-booking-payment/customer/update-password/${detailRow.customer_reference}`, item)
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModalPassword(false);
          setEvent(false);
          setIsLoading(false);
          enqueueSnackbar('Le mot de passe du client a été mise à jour.', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {
        setIsOpenModalPassword(false);
        setEvent(false);
        setIsLoading(false);
        enqueueSnackbar("Le mot de passe du client n'a pas été mise à jour.", { variant: 'error' });
      });
  };

  const handleSubmitToUpdate = (data) => {
    setIsLoading(true);

    const item = {
      ...data,
      customer_reference: 'C' + data.phone_number,
    };
    axios
      .put(`/ws-booking-payment/customer/${detailRow.customer_reference}`, item)
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModal(false);
          setEvent(false);
          setIsLoading(false);
          enqueueSnackbar('Les informations du client ont été mise à jour', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {
        setIsOpenModal(false);
        setEvent(false);
        setIsLoading(false);
        enqueueSnackbar("Les informations du client n'ont été pas mise à jour", { variant: 'error' });
      });
  };

  const handleSubmitToCreate = (data) => {
    setIsLoading(true);

    const item = {
      ...data,
      customer_reference: 'C' + data.phone_number,
    };

    axios
      .post(`/ws-booking-payment/customer`, item)
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModal(false);
          setEvent(false);
          setIsLoading(false);
          enqueueSnackbar('Le client a été enregistré avec succès', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {
        setIsOpenModal(false);
        setEvent(false);
        setIsLoading(false);
        enqueueSnackbar("Le client n' a pas été penregistré.", { variant: 'error' });
      });
  };

  return (
    <Page title="Listes des clients">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listes des Clients"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root }, { name: 'Listes des clients' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to=""
              onClick={() => {
                handleAddEvent('');
                setEvent(true);
              }}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Ajouter un nouveau client
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
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
                      dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.name)}
                          handleChangeEdit={(event) => handleChangeEdit(event)}
                          detailRow={detailRow}
                          handleAddEvent={() => handleAddEvent(row)}
                          handleOpeneModalPassword={() => handleOpeneModalPassword(row)}
                          isOpenModal={isOpenModal}
                          handleCloseModal={() => handleCloseModal()}
                          // handleSubmitToUpdate={(event) => handleSubmitToUpdate(event)}
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
                    <>
                      <TableSkeleton />
                    </>
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
          </Box>
        </Card>

        <Dialog open={isOpenModal} onClose={handleCloseModal} fullWidth="true" maxWidth="md">
          <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
            S3I - Bâtisseur du confort
          </DialogTitle>
          <Stack spacing={1} sx={{ p: 3 }}>
            <UserNewEditForm
              isEdit={event}
              currentUser={detailRow}
              onSubmit={event ? handleSubmitToCreate : handleSubmitToUpdate}
              isLoading={isLoading}
              handleCloseModal={handleCloseModal}
            />
          </Stack>
        </Dialog>
        <Dialog open={isOpenModalPassword} onClose={handleCloseModalPassword} fullWidth="true" maxWidth="md">
          <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
            S3I - Bâtisseur du confort
          </DialogTitle>
          <Stack spacing={1} sx={{ p: 3 }}>
            <UserNewEditFormPassword
              currentUser={detailRow}
              onSubmit={onSubmitChangePassword}
              isLoading={isLoading}
              handleCloseModal={handleCloseModalPassword}
            />
          </Stack>
        </Dialog>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.lastname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.firstname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.customer_reference.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.phone_number.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // if (filterStatus !== 'all') {
  //   tableData = tableData.filter((item) => item.status === filterStatus);
  // }

  // if (filterRole !== 'all') {
  //   tableData = tableData.filter((item) => item.role === filterRole);
  // }

  return tableData;
}
