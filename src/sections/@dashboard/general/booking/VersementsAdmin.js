/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import sumBy from 'lodash/sumBy';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';

import moment from 'moment';
moment.locale('fr');
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Divider,
  TableBody,
  TableContainer,
  DialogTitle,
  DialogActions,
  Dialog,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  CardContent,
  CardHeader,
} from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../../routes/paths';
// hooks
import useTabs from '../../../../hooks/useTabs';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
import axios from '../../../../utils/axios';
import useResponsive from '../../../../hooks/useResponsive';

// _mock_
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSkeleton } from '../../../../components/table';
import useToggle from '../../../../hooks/useToggle';

// sections
import { InvoiceTableRow } from '../../invoice/list';
// import AddPayment from './payment/AddPayment';
import InvoiceAddressListDialog from '../../invoice/new-edit-form/InvoiceAddressListDialog';
import InvoiceAddressListDialogProgram from '../../invoice/new-edit-form/InvoiceAddressListDialogProgram';
import InvoiceAddressListDialogBooking from '../../invoice/new-edit-form/InvoiceAddressListDialogBooking';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer', label: 'Client', align: 'left' },
  { id: 'programmeImobillier', label: 'Programme immobillier', align: 'left' },
  { id: 'amount', label: 'Montant payé', align: 'left' },
  { id: 'payment_method', label: 'Methode de paiement', align: 'left' },
  { id: 'bank', label: 'Banque', align: 'left' },
  { id: 'payment_date', label: 'Date de payment', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function VersementsAdmin() {
  const { enqueueSnackbar } = useSnackbar();

  const { toggle: openTo, onOpen: onOpenTo, onClose: onCloseTo } = useToggle();
  const { toggle: openProgram, onOpen: onOpenProgram, onClose: onCloseProgram } = useToggle();
  const { toggle: openBooking, onOpen: onOpenBooking, onClose: onCloseBooking } = useToggle();
  const upMd = useResponsive('up', 'md');
  const navigate = useNavigate();

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
  } = useTable({ defaultOrderBy: 'createDate' });

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [program, setProgram] = useState([]);
  const [allProgram, setAllProgram] = useState([]);
  const [customer, setCustomer] = useState({});
  const [oneCustomer, setOneCustomer] = useState({});
  const [oneProgram, setOneProgram] = useState({});
  const [allCustomer, setAllCustomer] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [oneBooking, setOneBooking] = useState({});

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [isGet, setIsGet] = useState(false);
  const [detailRow, setDetailRow] = useState('');
  const [codeProgrm, setCodeProgrm] = useState('');

  const [event, setEvent] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('all');
  const [filterProgramme, setFilterProgramme] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  useEffect(async () => {
    handleChargePage();
  }, []);

  const handleChargePage = async () => {
    const response = await axios.get(`/ws-booking-payment/payment`);

    const users = await axios.get(`/ws-booking-payment/customer`);
    const programAllData = await axios.get(`/ws-booking-payment/real-estate-program`);
    setProgram(programAllData.data);
    // const booking = await axios.get(`/ws-booking-payment/booking`);
    setAllCustomer(users.data);
    // setAllBookings(booking.data);

    setTableData(response.data);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const PROGRAMME_OPTIONS = program;

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterService = (event) => {
    setFilterService(event.target.value);
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
    navigate(PATH_DASHBOARD.invoice.edit(id));
  };

  const handleViewRow = (paymentReference) => {
    navigate(PATH_DASHBOARD_ADMIN.payments.paymentView(paymentReference));
  };

  const handleCustomer = async (customerCode) => {
    const response = await axios.get(`/ws-booking-payment/customer/${customerCode}`);
    setCustomer(response.data);
    return response.data;
  };

  const handleFilterProgramme = async (event) => {
    setFilterProgramme(event.target.value);
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const handleClick = () => {
    navigate(PATH_DASHBOARD_ADMIN.payments.paymentList);
  };

  const onFilterStartDate = async (event) => {
    setFilterStartDate(event);
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const onFilterEndDate = async (event) => {
    setFilterEndDate(event);
    setIsGet(false);

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterProgramme,
    filterStartDate,
    filterEndDate,
  });

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setDetailRow({ ...detailRow, [name]: value });
  };

  const handleAddEvent = async (value) => {
    const response = await axios.get(`/ws-booking-payment/customer/${value.customer_reference}`);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/${value.real_estate_program_reference}`
    );
    const bookingData = await axios.get(`/ws-booking-payment/booking/${value.booking_reference}`);
    const programAllData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${value.customer_reference}`
    );
    setAllProgram(programAllData.data);
    console.log('bookingData', bookingData);

    setOneBooking(bookingData.data);
    setOneProgram(programData.data);
    setOneCustomer(response.data);
    setDetailRow(value);
    setStartDate(value.payment_schedule_start_date);
    setEndDate(value.payment_schedule_end_date);
    setCodeProgrm(value.real_estate_program_reference);
    setIsOpenModal(true);
    const bookingAllData = await axios.get(
      `/ws-booking-payment/booking/customer/${oneCustomer.customer_reference}/real_estate_program/${value.real_estate_program_reference}`
    );
    console.log('bookingAllData', bookingAllData);
    setAllBookings(bookingAllData.data);
  };

  const handleOnselectCustomer = async (value) => {
    setOneCustomer(value);
    const programAllData = await axios.get(
      `/ws-booking-payment/real-estate-program/booking-by-customer/${value.customer_reference}`
    );
    setAllProgram(programAllData.data);

    setOneBooking();
    setOneProgram();
  };

  const handleOnselectProgram = async (value) => {
    setOneProgram(value);
    const bookingData = await axios.get(
      `/ws-booking-payment/booking/customer/${oneCustomer.customer_reference}/real_estate_program/${value.real_estate_program_reference}`
    );
    console.log('bookingData', bookingData);
    setAllBookings(bookingData.data);

    setOneBooking();
  };

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const denseHeight = dense ? 56 : 76;
  setTimeout(() => {
    setIsNotFound(
      (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterProgramme) ||
        (!dataFiltered.length && !!filterEndDate) ||
        (!dataFiltered.length && !!filterStartDate)
    );
  }, 4000);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalPrice'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: tableData.length },
    { value: 'paid', label: 'Paid', color: 'success', count: getLengthByStatus('paid') },
    { value: 'unpaid', label: 'Unpaid', color: 'warning', count: getLengthByStatus('unpaid') },
    { value: 'overdue', label: 'Overdue', color: 'error', count: getLengthByStatus('overdue') },
    { value: 'draft', label: 'Draft', color: 'default', count: getLengthByStatus('draft') },
  ];

  const handleSubmitToUpdate = (event) => {
    setIsLoading(true);

    const item = {
      customer_reference: oneCustomer.customer_reference,
      real_estate_program_reference: oneProgram.real_estate_program_reference,

      booking_reference: oneBooking.booking_reference,

      customer_lastname: oneCustomer.lastname,
      customer_firstname: oneCustomer.firstname,
      amount: detailRow.amount.split(' ').join(''),
      bank: detailRow.bank,
      payment_method: detailRow.payment_method,
      input_payment_reference: detailRow.input_payment_reference,
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
          enqueueSnackbar('Les informations de la reservation ont été mise à jour', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {});
  };

  const handleSubmitToCreate = (event) => {
    setIsLoading(true);

    const item = {
      customer_reference: oneCustomer.customer_reference,
      real_estate_program_reference: oneProgram.real_estate_program_reference,
      booking_reference: oneBooking.booking_reference,
      customer_lastname: oneCustomer.lastname,
      customer_firstname: oneCustomer.firstname,
      amount: detailRow.amount.split(' ').join(''),
      bank: detailRow.bank,
      payment_method: detailRow.payment_method,
      input_payment_reference: detailRow.input_payment_reference,
    };

    axios
      .post(`/ws-booking-payment/payment`, item)
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModal(false);
          setEvent(false);
          enqueueSnackbar('La reservation été enregistrer avec succès', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Card>
        <CardHeader title="Versements" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
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
                        <InvoiceTableRow
                          key={row.id}
                          row={row}
                          handleCustomer={() => handleCustomer(row.customer_reference)}
                          customer={customer}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.payment_reference)}
                          onEditRow={() => handleEditRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
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

        <Dialog open={isOpenModal} onClose={handleCloseModal} fullWidth="true" maxWidth="md">
          <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
            S3I - Bâtisseur du confort
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
                      onSelect={(address) => handleOnselectCustomer(address)}
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
                      Veuillez sélectionner un client
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
                      disabled={allProgram.length === 0}
                    >
                      {oneProgram ? 'Modifier' : 'Ajouter'}
                    </Button>

                    <InvoiceAddressListDialogProgram
                      open={openProgram}
                      dialogTitle="Selectionner le programme"
                      onClose={onCloseProgram}
                      selected={(selectedId) => oneProgram?.id === selectedId}
                      onSelect={(programs) => handleOnselectProgram(programs)}
                      customer={oneCustomer}
                      addressOptions={allProgram}
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
                      Veuillez sélectionner un programme immobillier
                    </Typography>
                  )}
                </Stack>
                <Stack sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.disabled' }}>
                      Information de la reservation:
                    </Typography>

                    <Button
                      size="small"
                      startIcon={<Iconify icon={oneBooking ? 'eva:edit-fill' : 'eva:plus-fill'} />}
                      onClick={onOpenBooking}
                      disabled={allBookings.length === 0}
                    >
                      {oneBooking ? 'Modifier' : 'Ajouter'}
                    </Button>

                    <InvoiceAddressListDialogBooking
                      open={openBooking}
                      dialogTitle="Selectionner la reservation"
                      onClose={onCloseBooking}
                      selected={(selectedId) => oneBooking?.id === selectedId}
                      onSelect={(book) => setOneBooking(book)}
                      customer={oneCustomer}
                      program={oneProgram}
                      addressOptions={allBookings}
                    />
                  </Stack>

                  {oneBooking ? (
                    <Booking
                      lot={oneBooking.lot}
                      booking_reference={oneBooking.booking_reference}
                      sub_lot={oneBooking.sub_lot}
                    />
                  ) : (
                    <Typography typography="caption" sx={{ color: 'error.main' }}>
                      {/* {errors.invoiceFrom ? errors.invoiceFrom.message : null} */}
                      Veuillez sélectionner une reservation
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
                      name="payment_method"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.payment_method}
                      defaultValue={event ? '' : ' '}
                      label="Methode de paiement"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="bank"
                      id="outlined-basic"
                      value={detailRow.bank}
                      onChange={handleChangeEdit}
                      defaultValue={event ? '' : ' '}
                      label="Banque"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="amount"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.amount ? sepMillier(detailRow.amount) : ''}
                      // defaultValue={event ? '' : ' '}
                      label="Montant payer"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent sx={{ marginTop: 0 }}>
                    <TextField
                      name="input_payment_reference"
                      // id="outlined-basic"
                      onChange={handleChangeEdit}
                      value={detailRow.input_payment_reference}
                      defaultValue={event ? '' : ' '}
                      label="Reference de paiement"
                      sx={{ width: '100%' }}
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

/// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterProgramme, filterStartDate, filterEndDate }) {
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
      // item.invoiceTo.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterProgramme !== 'all') {
    tableData = tableData.filter((item) => item.real_estate_program_reference === filterProgramme);
  }

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        moment(item.payment_date).format('DD/MM/YYYY') >= moment(filterStartDate).format('DD/MM/YYYY') &&
        moment(item.payment_date).format('DD/MM/YYYY') <= moment(filterEndDate).format('DD/MM/YYYY')
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

Booking.propTypes = {
  booking_reference: PropTypes.string,
  lot: PropTypes.string,
  sub_lot: PropTypes.string,
};

function Booking({ lot, booking_reference, sub_lot }) {
  return (
    <>
      <Typography variant="subtitle2">{booking_reference}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        <b>Lot</b> : {lot}
      </Typography>
      <Typography variant="body2">
        <b>Sous-lot</b>: {sub_lot}
      </Typography>
    </>
  );
}
