/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/first */
/* eslint-disable no-unused-vars */
/* eslint-disable import/newline-after-import */
/* eslint-disable react-hooks/exhaustive-deps */
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';

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
  Dialog,
  DialogTitle,
  Stack,
  Grid,
  CardContent,
  TextField,
  DialogActions,
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
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
import { DialogAnimate } from '../../../components/animate';

import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  TableSelectedActions,
} from '../../../components/table';
// sections
import { UserTableToolbarAdminTx, UserTableRowAdminTx } from '../../../sections/@dashboard/user/list';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../components/skeleton';
import ProgramNewEditForm from '../../../sections/@dashboard/form/ProgramNewEditForm';
// import UserNewEditForm from '../../../sections/@dashboard/form/';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tous les echeances', 'Echances passées', 'Echanches à venir'];

const TABLE_HEAD = [
  { id: 'label', label: 'Nom du programme', align: 'left' },
  { id: 'formula', label: 'Formule', align: 'left' },
  { id: 'real_estate_program_type', label: "Type d'habitation", align: 'left' },
  { id: 'location', label: 'Localisation', align: 'left' },
  { id: 'createdAt', label: 'Date de creation', align: 'left' },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function BuildingPrograms() {
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

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [detailRow, setDetailRow] = useState('');
  const [codeProgrm, setCodeProgrm] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [event, setEvent] = useState(false);

  const [isNotFound, setIsNotFound] = useState(false);
  const [isGet, setIsGet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    getAllProgramm();
  }, []);

  const getAllProgramm = async () => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program`);
    setTimeout(() => {
      setIsGet(true);
    }, 3000);

    setTableData(response.data);
  };

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setIsGet(false);
    setTimeout(() => {
      setIsGet(true);
    }, 1000);
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterDate = (event) => {
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 1000);
  };

  const handleFilterProgramme = async (event) => {
    const response = await axios.get(`/ws-booking-payment/payment-schedule/booking/${event.target.value}`);
    // if (response.status === 200) {
    //   setIsGet(true);
    // }
    setTimeout(() => {
      setIsGet(true);
    }, 3000);
    setTableData(response.data);
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
  });

  const denseHeight = dense ? 52 : 72;

  setTimeout(() => {
    setIsNotFound((!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus));
  }, 4000);

  const handleAddEvent = async (value) => {
    // const response = await axios.get(`/ws-booking-payment/real-estate-program/${value.real_estate_program_reference}`);
    setDetailRow(value);
    setCodeProgrm(value.real_estate_program_reference);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEvent(false);
  };

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setDetailRow({ ...detailRow, [name]: value });
  };

  const handleRuleChange = (event) => {
    const { name, value } = event.target;
    if (value === '') {
      setErrorText('Veuillez remplir le champ');
    }
  };

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const handleSubmitToUpdate = (data) => {
    setIsLoading(true);
    const item = {
      ...data,
    };
    axios
      .put(`/ws-booking-payment/real-estate-program/${codeProgrm}`, item)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          setIsGet(false);
          getAllProgramm();
          setIsOpenModal(false);
          setEvent(false);
          setIsLoading(false);
          enqueueSnackbar('Les informations du programmme immobilier ont été mise à jour', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {});
  };

  const handleSubmitToCreate = (data) => {
    setIsLoading(true);
    axios
      .post(`/ws-booking-payment/real-estate-program`, data)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          setIsGet(false);
          getAllProgramm();
          setIsOpenModal(false);
          setEvent(false);
          enqueueSnackbar('Le programmme immobilier a été enregistrer avec succès', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {});
  };

  return (
    <Page title="Programmes immobiliers">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Programmes immobiliers"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.general.dashboardAmin },
            { name: 'Programmes immobiliers' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              onClick={() => {
                handleAddEvent('');
                setEvent(true);
              }}
              to=""
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Nouveau programmme immobilier
            </Button>
          }
        />

        <Card>
          <UserTableToolbarAdminTx filterName={filterName} onFilterName={handleFilterName} />

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
                          <UserTableRowAdminTx
                            key={index}
                            tableData={tableData}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            handleChangeEdit={(event) => handleChangeEdit(event)}
                            detailRow={detailRow}
                            handleAddEvent={() => handleAddEvent(row)}
                            isOpenModal={isOpenModal}
                            handleCloseModal={() => handleCloseModal()}
                            handleSubmitToUpdate={(event) => handleSubmitToUpdate(event)}
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

        <Dialog open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
            S3I - Bâtisseur du confort
          </DialogTitle>
          <Stack spacing={3} sx={{ p: 3 }}>
            <ProgramNewEditForm
              isEdit={event}
              onSubmit={event ? handleSubmitToCreate : handleSubmitToUpdate}
              handleCloseModal={handleCloseModal}
              isLoading={isLoading}
              program={detailRow}
            />
            {/* <Card sx={{ minWidth: 275 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CardContent sx={{ marginTop: 2 }}>
                    <TextField
                      name="label"
                      onChange={handleChangeEdit}
                      value={detailRow.label}
                      defaultValue={event ? '' : ' '}
                      label="Nom du programme"
                      sx={{ width: '100%' }}
                      error={errorText.label === ''}
                      helperText={errorText.label}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="formula"
                      id="outlined-basic"
                      value={detailRow.formula}
                      onChange={handleChangeEdit}
                      defaultValue={event ? '' : ' '}
                      label="Formule"
                      onClick={handleRuleChange}
                      sx={{ width: '100%' }}
                      error={errorText.formula === ''}
                      helperText={errorText.formula}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      id="outlined-basic"
                      name="real_estate_program_type"
                      value={detailRow.real_estate_program_type}
                      defaultValue={event ? '' : ' '}
                      onChange={handleChangeEdit}
                      required
                      label="Type d'habitation"
                      sx={{ width: '100%' }}
                      error={errorText.real_estate_program_type === ''}
                      helperText={errorText.real_estate_program_type}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      id="outlined-basic"
                      value={detailRow.location}
                      name="location"
                      defaultValue={event ? '' : ' '}
                      onChange={handleChangeEdit}
                      label="Localisation"
                      sx={{ width: '100%' }}
                      error={errorText.location === ''}
                      helperText={errorText.location}
                    />
                  </CardContent>
                </Grid>
              </Grid>
            </Card> */}
          </Stack>
          {/* <DialogActions>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                handleCloseModal();
                setEvent(false);
              }}
            >
              Fermer
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                event ? handleSubmitToCreate() : handleSubmitToUpdate();
              }}
            >
              {isLoading ? (
                <>
                  {event ? ' Enregistrement du programme...' : 'Modification du programme...'}
                  <CircularProgress
                    size={14}
                    sx={{
                      color: '#fff',
                      marginLeft: 2,
                    }}
                  />
                </>
              ) : event ? (
                'Enregistrer le programme immobilier'
              ) : (
                ' Enregistrer les modifications'
              )}
            </Button>
          </DialogActions> */}
        </Dialog>
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

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.label.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.formula.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.real_estate_program_type.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

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
