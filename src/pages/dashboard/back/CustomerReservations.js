/* eslint-disable no-restricted-syntax */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-duplicates */
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import numeral from 'numeral';
import DatePicker from '@mui/lab/DatePicker';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
  Chip,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// _mock_
import { _invoices } from '../../../_mock';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  TableSelectedActions,
} from '../../../components/table';
// sections
import InvoiceAnalytic from '../../../sections/@dashboard/invoice/InvoiceAnalytic';
import { UserTableToolbarReservationAdmin, UserTableRowAdminReserv } from '../../../sections/@dashboard/user/list';

import { DialogAnimate } from '../../../components/animate';
// import AddPayment from './payment/AddPayment';
import InvoiceNewEditForm from '../../../sections/@dashboard/invoice/new-edit-form';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { AppFeatured, AppWelcome, AppWidget } from '../../../sections/@dashboard/general/app';
import { SkeletonConversationItem, SkeletonMailSidebarItem } from '../../../components/skeleton';
import InvoiceAddressListDialog from '../../../sections/@dashboard/invoice/new-edit-form/InvoiceAddressListDialog';
import InvoiceAddressListDialogProgram from '../../../sections/@dashboard/invoice/new-edit-form/InvoiceAddressListDialogProgram';
import useToggle from '../../../hooks/useToggle';
import useResponsive from '../../../hooks/useResponsive';
import BookingNewEditForm from '../../../sections/@dashboard/form/BookingNewEditForm';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../components/hook-form';
import { UploadMultiFile } from '../../../components/upload';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer', label: 'Client', align: 'left' },
  { id: 'programmeImobillier', label: 'Programme immobillier', align: 'left' },
  { id: 'montantReservation', label: 'Montant total', align: 'left' },
  { id: 'montantReservation', label: 'Montant versé', align: 'left' },
  { id: 'date_fin', label: 'fin de paiement', align: 'left' },
  { id: '' },
];

export default function CustomerReservations() {
  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  }));

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
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
  const [imageView, setImageView] = useState([]);
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

  const [currentBook, setCurrentBook] = useState('');
  const [detailRow, setDetailRow] = useState('');
  const [codeProgrm, setCodeProgrm] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isOpenModalImage, setIsOpenModalImage] = useState(false);

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
    setTableData(response.data);
    setProgram(programData.data);
    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  };

  const PROGRAMME_OPTIONS = program;

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
  const handleOpenModalImage = (value) => {
    setIsOpenModalImage(true);
    setCurrentBook(value);
  };
  const handleCloseModalImage = () => {
    setIsOpenModalImage(false);
  };
  const handleChangeDaté = (event) => {};

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setDetailRow({ ...detailRow, [name]: value });
  };

  const NewProductSchema = Yup.object().shape({
    image: Yup.array().min(1, 'Les images sont requises'),
  });
  const defaultValues = useMemo(
    () => ({
      image: [],
    }),
    [currentBook]
  );
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const dd = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('image', [...getValues().image, ...dd]);
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('image', []);
  };

  const handleViewRow = (bookingReference) => {
    navigate(PATH_DASHBOARD_ADMIN.general.customerDetailsReservation(bookingReference));
  };

  const handleRemove = (file) => {
    const filteredItems = values.image?.filter((_file) => _file !== file);
    setValue('image', filteredItems);
  };

  const handleStartDate = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDate = (newValue) => {
    setEndDate(newValue);
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
          enqueueSnackbar('Les informations du logement ont été mis à jour', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {
        enqueueSnackbar("Les informations du logement n'ont pas été mis à jour", { variant: 'error' });
        setIsLoading(false);
        setIsOpenModal(false);
        setEvent(false);
      });
  };

  const handleSubmitToCreate = (data) => {
    setIsLoading(true);
    const item = {
      customer_reference: oneCustomer.customer_reference,
      real_estate_programe_reference: oneProgram.real_estate_program_reference,
      lot: data.lot,
      sub_lot: data.sub_lot,
      additional_land: data.additional_land,
      additional_land_amount: data.additional_land_amount.split(' ').join(''),
      additional_fence: data.additional_fence,
      additional_fence_amount: data.additional_fence_amount.split(' ').join(''),

      financing_method: data.financing_method,
      initial_contribution: data.initial_contribution.split(' ').join(''),

      purchase_amount: data.purchase_amount.split(' ').join(''),
      application_fees: data.application_fees.split(' ').join(''),

      booking_fees: data.booking_fees.split(' ').join(''),
      booking_fees_paid: data.booking_fees_paid.split(' ').join(''),

      payment_schedule_start_date: startDate,
      payment_schedule_end_date: endDate,
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
          setIsLoading(false);
          enqueueSnackbar('Le logement été enregistré avec succès', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {
        enqueueSnackbar("Le logement n'a pas enregistré.", { variant: 'error' });
        setIsLoading(false);
        setIsOpenModal(false);
        setEvent(false);
      });
  };

  const onSubmitImage = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('booking_reference', currentBook.booking_reference);
    for (const key of Object.keys(data.image)) {
      formData.append('image', data.image[key]);
    }

    const item = {
      image: data.image,
      booking_reference: currentBook.booking_reference,
    };
    console.log('==============formData send======================');
    console.log(formData);
    console.log('====================================');

    axios
      .post(`/ws-booking-payment/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res.data);
        handleChargePage();
        setTimeout(() => {
          setIsGet(false);
          setIsOpenModalImage(false);
          setIsLoading(false);
          handleRemoveAll();
          enqueueSnackbar('Les images ont été enregistrées avec succès', { variant: 'success' });
        }, 3000);
      })
      .catch((error) => {
        setIsOpenModalImage(false);
        enqueueSnackbar("Les images n'ont pas enregistrées.", { variant: 'error' });
        setIsLoading(false);
      });
  };

  return (
    <Page title="Logements">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Logements"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root }, { name: 'Logements' }]}
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
              Nouveau logements
            </Button>
          }
        />

        <Card>
          <UserTableToolbarReservationAdmin
            filterName={filterName}
            filterProgramme={filterProgramme}
            filterDate={filterDate}
            onFilterDate={handleFilterDate}
            onFilterName={handleFilterName}
            onFilterProgramme={handleFilterProgramme}
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
                      <IconButton color="primary">
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
                            onViewRow={() => handleViewRow(row.booking_reference)}
                            handleCloseModal={() => handleCloseModal()}
                            handleSubmitToUpdate={(event) => handleSubmitToUpdate(event)}
                            handleOpenModalImage={() => handleOpenModalImage(row)}
                            handleCloseModalImage={() => handleCloseModalImage()}
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

            {/* <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            /> */}
          </Box>
        </Card>
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
                      Veuillez sélectionner un programme immobillier
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Card>
            <BookingNewEditForm
              isEdit={event}
              onSubmit={event ? handleSubmitToCreate : handleSubmitToUpdate}
              handleCloseModal={handleCloseModal}
              isLoading={isLoading}
              booking={detailRow}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
            />
          </Stack>
        </Dialog>
        <Dialog open={isOpenModalImage} onClose={handleCloseModalImage} fullWidth="true" maxWidth="md">
          <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
            S3I - Bâtisseur du confort
          </DialogTitle>
          <Stack spacing={1} sx={{ p: 3 }}>
            <Card sx={{ minWidth: 275 }}>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitImage)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <div>
                          <LabelStyle>Images</LabelStyle>
                          {/* <UploadMultiFile
                            showPreview
                            files={files}
                            onDrop={handleDropMultiFile}
                            onRemove={handleRemove}
                            onRemoveAll={handleRemoveAll}
                          /> */}
                          <RHFUploadMultiFile
                            name="image"
                            showPreview
                            accept="image/*"
                            maxSize={3145728}
                            onDrop={handleDropMultiFile}
                            onRemove={handleRemove}
                            onRemoveAll={handleRemoveAll}
                          />
                        </div>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>

                <DialogActions>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => {
                      handleCloseModalImage();
                    }}
                  >
                    Fermer
                  </Button>

                  <LoadingButton type="submit" disabled={isLoading} variant="contained" size="" loading={isSubmitting}>
                    {isLoading ? (
                      <>
                        Enregistrement des images...
                        <CircularProgress
                          size={14}
                          sx={{
                            color: '#fff',
                            marginLeft: 2,
                          }}
                        />
                      </>
                    ) : (
                      'Enregistrer les images'
                    )}
                  </LoadingButton>
                </DialogActions>
              </FormProvider>
            </Card>
          </Stack>
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
