/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import numeral from 'numeral';
import DatePicker from '@mui/lab/DatePicker';

import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import moment from 'moment';
moment.locale('fr');
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

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
  Typography,
  CardHeader,
} from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../../routes/paths';
// hooks
import useTabs from '../../../../hooks/useTabs';
import useSettings from '../../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// _mock_
// import { _invoices } from '../../../_mock';
// components
import Page from '../../../../components/Page';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  TableSelectedActions,
} from '../../../../components/table';
// sections
import InvoiceAnalytic from '../../invoice/InvoiceAnalytic';
import { UserTableToolbarReservationAdmin, UserTableRowAdminReserv } from '../../user/list';

import { DialogAnimate } from '../../../../components/animate';
// import AddPayment from './payment/AddPayment';
import InvoiceNewEditForm from '../../invoice/new-edit-form';
import useAuth from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { AppFeatured, AppWelcome, AppWidget } from '../app';
import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../../components/skeleton';
import InvoiceAddressListDialog from '../../invoice/new-edit-form/InvoiceAddressListDialog';
import InvoiceAddressListDialogProgram from '../../invoice/new-edit-form/InvoiceAddressListDialogProgram';
import useToggle from '../../../../hooks/useToggle';
import useResponsive from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer', label: 'Client', align: 'left' },
  { id: 'programmeImobillier', label: 'Programme immobillier', align: 'left' },
  { id: 'montantReservation', label: 'Montant total', align: 'left' },
  { id: 'montantReservation', label: 'Montant vers??', align: 'left' },
  { id: 'date_fin', label: 'fin de paiement', align: 'left' },
  { id: '' },
];

export default function BookingAdmin() {
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
  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();

  const { toggle: openTo, onOpen: onOpenTo, onClose: onCloseTo } = useToggle();
  const { toggle: openProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useToggle();
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const upMd = useResponsive('up', 'md');

  const [tableData, setTableData] = useState([]);
  const [program, setProgram] = useState([]);
  const [customer, setCustomer] = useState({});
  const [oneCustomer, setOneCustomer] = useState({});
  const [oneProgram, setOneProgram] = useState({});
  const [allCustomer, setAllCustomer] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [isGet, setIsGet] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterProgramme, setFilterProgramme] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);

  const [detailRow, setDetailRow] = useState('');
  const [codeProgrm, setCodeProgrm] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [event, setEvent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [totalReservationAmount, setTotalReservationAmount] = useState(0);
  const [totalAmountPay, setTotalAmountPay] = useState(0);

  useEffect(async () => {
    handleChargePage();
  }, []);

  const handleChargePage = async () => {
    const response = await axios.get(`/ws-booking-payment/booking`);
    const programData = await axios.get(`/ws-booking-payment/real-estate-program`);

    const users = await axios.get(`/ws-booking-payment/customer`);
    setAllCustomer(users.data);
    // const totalReservationAmountData = await axios.get(
    //   `/ws-booking-payment/booking/customer/${user?.customer_reference}/total_house_amount`
    // );
    // setTotalReservationAmount(totalReservationAmountData.data);
    // setTotalAmountPay(totalAmountPayData.data);
    setTableData(response.data);
    setProgram(programData.data);

    // if (response.status === 200 && programData.status === 200) {
    //   setIsGet(true);
    // }

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  // const {
  //   watch,
  //   setValue,
  //   formState: { errors },
  // } = useFormContext();

  // const values = watch();
  const navigate = useNavigate();

  const PROGRAMME_OPTIONS = program;

  const handleClick = () => {
    navigate(PATH_DASHBOARD_ADMIN.general.customerReservation);
  };

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
    setPage(0);
  };

  const handleFilterDate = async (event) => {
    setFilterDate(event);
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const handleFilterProgramme = async (event) => {
    console.log('event.target.value', event.target.value);
    setFilterProgramme(event.target.value);
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const handleCustomer = async (customerCode) => {
    const response = await axios.get(`/ws-booking-payment/customer/${customerCode}`);
    setCustomer(response.data);
    return response.data;
  };

  const statisticsAmount = (total, partial) => {
    // Calculate the percentage
    const percent = (partial / total) * 100;
    // arrondi sans nombre aores la virgule
    const percentRounded = Math.round(percent);
    console.log(percent);
    return percentRounded > 0 ? percentRounded : 0;
  };

  const dataFiltered = applySortFilter({
    tableData,
    allCustomer,
    comparator: getComparator(order, orderBy),
    filterName,
    filterProgramme,
  });
  const denseHeight = dense ? 52 : 72;
  setTimeout(() => {
    setIsNotFound((!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterProgramme));
  }, 4000);

  const handleAddEvent = async (value) => {
    const response = await axios.get(`/ws-booking-payment/customer/${value.customer_reference}`);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/${value.real_estate_programe_reference}`
    );
    setOneProgram(programData.data);
    setOneCustomer(response.data);
    setDetailRow(value);
    setStartDate(value.payment_schedule_start_date);
    setEndDate(value.payment_schedule_end_date);
    setCodeProgrm(value.real_estate_program_reference);
    setIsOpenModal(true);
  };

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEvent(false);
  };

  const handleChangeDat?? = (event) => {};

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setDetailRow({ ...detailRow, [name]: value });
  };

  const handleSubmitToUpdate = (event) => {
    setIsLoading(true);

    const item = {
      customer_reference: oneCustomer.customer_reference,
      real_estate_programe_reference: oneProgram.real_estate_program_reference,
      lot: detailRow.lot,
      sub_lot: detailRow.sub_lot,
      additional_land: detailRow.additional_land,
      additional_land_amount: detailRow.additional_land_amount.split(' ').join(''),
      additional_fence_amount: detailRow.additional_fence_amount.split(' ').join(''),
      purchase_amount: detailRow.purchase_amount.split(' ').join(''),
      application_fees: detailRow.application_fees.split(' ').join(''),
      booking_fees: detailRow.booking_fees.split(' ').join(''),
      house_amount: detailRow.house_amount.split(' ').join(''),
      balance_due: detailRow.balance_due.split(' ').join(''),
      payment_schedule_start_date: startDate,
      payment_schedule_end_date: endDate,
      amount_paid: '0',
    };
    axios
      .put(`/ws-booking-payment/booking/${detailRow.booking_reference}`, detailRow)
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModal(false);
          setEvent(false);
          setIsLoading(false);
          enqueueSnackbar('Les informations du logement ont ??t?? mise ?? jour', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {});
  };

  const handleSubmitToCreate = (event) => {
    setIsLoading(true);

    const item = {
      customer_reference: oneCustomer.customer_reference,
      real_estate_programe_reference: oneProgram.real_estate_program_reference,
      lot: detailRow.lot,
      sub_lot: detailRow.sub_lot,
      additional_land: detailRow.additional_land,
      additional_land_amount: detailRow.additional_land_amount.split(' ').join(''),
      additional_fence_amount: detailRow.additional_fence_amount.split(' ').join(''),
      purchase_amount: detailRow.purchase_amount.split(' ').join(''),
      application_fees: detailRow.application_fees.split(' ').join(''),
      booking_fees: detailRow.booking_fees.split(' ').join(''),
      house_amount: detailRow.house_amount.split(' ').join(''),
      balance_due: detailRow.balance_due.split(' ').join(''),
      payment_schedule_start_date: startDate,
      payment_schedule_end_date: endDate,
      amount_paid: '0',
    };

    axios
      .post(`/ws-booking-payment/booking`, item)
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModal(false);
          setEvent(false);
          enqueueSnackbar('Le logement ??t?? enregistr?? avec succ??s', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Card>
        <CardHeader title="Logements" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
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
                        <UserTableRowAdminReserv
                          key={index}
                          tableData={tableData}
                          row={row}
                          handleCustomer={() => handleCustomer(row.customer_reference)}
                          customer={customer}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          handleChangeEdit={(event) => handleChangeEdit(event)}
                          detailRow={detailRow}
                          handleAddEvent={() => handleAddEvent(row)}
                          isOpenModal={isOpenModal}
                          hide="true"
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

        <Dialog open={isOpenModal} onClose={handleCloseModal} fullWidth="true" maxWidth="md">
          <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
            S3I - B??tisseur du confort
          </DialogTitle>
          <Stack spacing={1} sx={{ p: 3 }}>
            <Card sx={{ minWidth: 275 }}>
              <Stack
                spacing={{ xs: 2, md: 5 }}
                direction={{ xs: 'column', md: 'column' }}
                divider={
                  <Divider
                    flexItem
                    orientation={upMd ? 'horizontal' : 'horizontal'}
                    sx={{ borderStyle: 'dashed', borderWidth: 1, borderColor: '#000', opacity: 0.5 }}
                  />
                }
                sx={{ p: 3 }}
              >
                <Stack sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.disabled' }}>
                      Information du client:
                    </Typography>

                    <Button
                      size="small"
                      startIcon={<Iconify icon={oneCustomer ? 'eva:edit-fill' : 'eva:plus-fill'} />}
                      onClick={onOpenTo}
                    >
                      {oneCustomer ? 'Modifier' : 'Ajouter'}
                    </Button>

                    <InvoiceAddressListDialog
                      open={openTo}
                      dialogTitle="Selectionner le client"
                      onClose={onCloseTo}
                      selected={(selectedId) => oneCustomer?.id === selectedId}
                      onSelect={(address) => setOneCustomer(address)}
                      addressOptions={allCustomer}
                    />
                  </Stack>

                  {oneCustomer ? (
                    <AddressInfo
                      // eslint-disable-next-line prefer-template
                      name={oneCustomer.lastname + ' ' + oneCustomer.firstname}
                      code={oneCustomer.customer_reference}
                      email={oneCustomer.email}
                    />
                  ) : (
                    <Typography typography="caption" sx={{ color: 'error.main' }}>
                      {/* {errors.oneCustomer ? errors.oneCustomer.message : null} */}
                      Veuillez s??lectionner un client
                    </Typography>
                  )}
                </Stack>
                <Stack sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.disabled' }}>
                      Information du programme:
                    </Typography>

                    <Button
                      size="small"
                      startIcon={<Iconify icon={oneProgram ? 'eva:edit-fill' : 'eva:plus-fill'} />}
                      onClick={onOpenProgram}
                    >
                      {oneProgram ? 'Modifier' : 'Ajouter'}
                    </Button>

                    <InvoiceAddressListDialogProgram
                      open={openProgram}
                      dialogTitle="Selectionner le programme"
                      onClose={onCloseProgram}
                      selected={(selectedId) => oneProgram?.id === selectedId}
                      onSelect={(programs) => setOneProgram(programs)}
                      addressOptions={program}
                    />
                  </Stack>

                  {oneProgram ? (
                    <Programme
                      name={oneProgram.label + ' ' + oneProgram.formula}
                      real_estate_program_type={oneProgram.real_estate_program_type}
                      location={oneProgram.location}
                    />
                  ) : (
                    <Typography typography="caption" sx={{ color: 'error.main' }}>
                      {/* {errors.invoiceFrom ? errors.invoiceFrom.message : null} */}
                      Veuillez s??lectionner un programme immobillier
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Card>
            <Card sx={{ minWidth: 275 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="lot"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.lot}
                      defaultValue={event ? '' : ' '}
                      label="Lot"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="sub_lot"
                      id="outlined-basic"
                      value={detailRow.sub_lot}
                      onChange={handleChangeEdit}
                      defaultValue={event ? '' : ' '}
                      label="Sous-Lot"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="additional_land"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.additional_land}
                      defaultValue={event ? '' : ' '}
                      label="Terrain suppl??mentaires (m??)"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="additional_land_amount"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.additional_land_amount ? sepMillier(detailRow.additional_land_amount) : ''}
                      defaultValue={event ? '' : ' '}
                      label="Montant du terrain suppl??mentaire"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="additional_fence_amount"
                      id="outlined-basic"
                      value={detailRow.additional_fence_amount ? sepMillier(detailRow.additional_fence_amount) : ''}
                      onChange={handleChangeEdit}
                      defaultValue={event ? '' : ' '}
                      label="montant de la cl??ture suppl??mentaire"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="purchase_amount"
                      id="outlined-basic"
                      value={detailRow.purchase_amount ? sepMillier(detailRow.purchase_amount) : ''}
                      onChange={handleChangeEdit}
                      defaultValue={event ? '' : ' '}
                      label="Montant de l'achat"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="application_fees"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.application_fees ? sepMillier(detailRow.application_fees) : ''}
                      defaultValue={event ? '' : ' '}
                      label="Frais de demande"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="booking_fees"
                      id="outlined-basic"
                      value={detailRow.booking_fees ? sepMillier(detailRow.booking_fees) : ''}
                      onChange={handleChangeEdit}
                      defaultValue={event ? '' : ' '}
                      label="Frais de r??servation"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="house_amount"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.house_amount ? sepMillier(detailRow.house_amount) : ''}
                      defaultValue={event ? '' : ' '}
                      label="Montant total de la maison"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="balance_due"
                      // id="outlined-basic"
                      // disabled
                      onChange={handleChangeEdit}
                      value={detailRow.balance_due ? sepMillier(detailRow.balance_due) : ''}
                      defaultValue={event ? '' : ' '}
                      label="Solde d??"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <DatePicker
                      label="Date de d??but de paiement"
                      value={startDate ? startDate : ''}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <DatePicker
                      label="Date de fin de paiement"
                      value={endDate ? endDate : ''}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Stack>
          <DialogActions>
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
                  {event ? ' Enregistrement du logement...' : 'Modification du logement...'}
                  <CircularProgress
                    size={14}
                    sx={{
                      color: '#fff',
                      marginLeft: 2,
                    }}
                  />
                </>
              ) : event ? (
                'Enregistrer la logement'
              ) : (
                ' Enregistrer les modifications'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            onClick={handleClick}
            size="small"
            color="inherit"
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
function applySortFilter({ tableData, comparator, filterName, filterProgramme, filterDate }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) => item.customer_reference.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      // ||
      // item.formula.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      // item.real_estate_program_type.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
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

// ----------------------------------------------------------------------

AddressInfo.propTypes = {
  code: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
};

function AddressInfo({ name, code, email }) {
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {code}
      </Typography>
      <Typography variant="body2">{email}</Typography>
    </>
  );
}

Programme.propTypes = {
  real_estate_program_type: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
};

function Programme({ name, real_estate_program_type, location }) {
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        <b>Type d'habitation</b> : {real_estate_program_type}
      </Typography>
      <Typography variant="body2">
        <b>Localisation</b>: {location}
      </Typography>
    </>
  );
}
