/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');

// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
  user: PropTypes.object,
  customer: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ invoice, customer, program, user }) {
  const theme = useTheme();

  if (!invoice) {
    return null;
  }

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    // console.log(Primenumeral);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  // const { items, taxes, status, dueDate, discount, invoiceTo, createDate, totalPrice, invoiceNumber, subTotalPrice } =
  //   invoice;

  return (
    <>
      <InvoiceToolbar invoice={invoice} customer={customer} program={program} user={user} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/logo/s3i-logo.png" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={'success'}
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                PAYÉE
              </Label>

              <Typography variant="h6">{invoice.payment_reference}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Facturé à
            </Typography>
            <Typography variant="body2">
              {customer.firstname} {customer.lastname}
            </Typography>
            <Typography variant="body2">Tel: {customer.phone_number}</Typography>
            <Typography variant="body2">Email: {customer.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5, textAlign: 'right' }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Payer à
            </Typography>
            <Typography variant="body2">S3I - bâtisseur du confort</Typography>
            <Typography variant="body2">Tel: (+225) 07 77 001 002</Typography>
            <Typography variant="body2">Email: serviceclients@s3i-groupe.com</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Date de facturation
            </Typography>
            <Typography variant="body2">{moment(invoice.payment_date).format('DD MMM YYYY')}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5, textAlign: 'right' }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Mode de paiement
            </Typography>
            <Typography variant="body2">{invoice.payment_method}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell align="left" colSpan={4}>
                    Description
                  </TableCell>
                  <TableCell align="right" sx={{ textAligin: 'right' }} colSpan={1}>
                    Montant versé
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell align="left" colSpan={4}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontSize: 17 }}>
                        {/* {invoice.payment_schedule_reference} */}
                        {invoice.payment_schedule_reference === 'FRAIS RESERVATION'
                          ? 'Paiement de frais réservation'
                          : "Paiement d'échéance"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }} noWrap>
                        {program.label} {program.formula} {program.real_estate_program_type} {' - '}
                        {program.location}
                      </Typography>
                      {/* <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }} noWrap>
                        {invoice.payment_schedule_reference}
                      </Typography> */}
                    </Box>
                  </TableCell>
                  <TableCell colSpan={1} align="right" sx={{ textAligin: 'right' }}>
                    {sepMillier(invoice.amount)} CFA
                  </TableCell>
                </TableRow>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Box sx={{ mt: 2 }} />
                    <Typography>Sous-total</Typography>
                  </TableCell>
                  <TableCell align="right" width={220}>
                    <Box sx={{ mt: 2 }} />
                    <Typography>{sepMillier(invoice.amount)} CFA</Typography>
                  </TableCell>
                </RowResultStyle>

                {/* <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Discount</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography sx={{ color: 'error.main' }}>{invoice.amount && fCurrency(-invoice.amount)}</Typography>
                  </TableCell>
                </RowResultStyle> */}

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Taxes</Typography>
                  </TableCell>
                  <TableCell align="right" width={220}>
                    <Typography>0 CFA</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right" width={240}>
                    <Typography variant="h6">{sepMillier(invoice.amount)} CFA</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">
              Si vous souhaitez que nous ajoutions des notes supplémentaires, faites-le nous savoir!
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Vous avez des questions ?</Typography>
            <Typography variant="body2">serviceclients@s3i-groupe.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
