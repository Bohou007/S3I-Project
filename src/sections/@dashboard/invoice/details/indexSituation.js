/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import { useEffect, useState } from 'react';

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
import InvoiceToolbar from './InvoiceSituationToolbar';

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
  versement: PropTypes.array,
};

export default function InvoiceDetails({ invoice, customer, program, user, versement }) {
  const theme = useTheme();

  const [somme, setSomme] = useState(0);

  useEffect(() => {
    const sumWithInitial = versement.reduce(
      (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue.amount),
      somme
    );
    setSomme(sumWithInitial);
  }, []);

  if (!invoice) {
    return null;
  }

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    // console.log(Primenumeral);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
        customer={customer}
        program={program}
        user={user}
        versement={versement}
        somme={somme}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/logo/s3i-logo.png" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mb: 6 }}>
            <Typography variant="h6">
              SITUATION DE COMPTE : {customer.lastname} {customer.firstname}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mb: 4 }}>
            <Typography variant="body2">
              <b style={{ fontSize: 15, fontWeight: 'bold' }}>Situation du logement</b> : Lot {invoice.lot} Ilot{' '}
              {invoice.sub_lot}
            </Typography>
            <Typography variant="body2">
              <b style={{ fontSize: 15, fontWeight: 'bold' }}> Superficie totale</b> : {invoice.area} m&sup2;
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 15 }}>
              <b style={{ fontSize: 15, fontWeight: 'bold' }}>Date</b> :
              {moment(invoice.createdAt).format(' DD MMMM YYYY')}
            </Typography>
          </Grid>
        </Grid>
        <Scrollbar sx={{ mb: 6 }}>
          <TableContainer sx={{ maxWidth: 618 }}>
            <Table>
              <TableHead
                sx={{
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell
                    align="left"
                    colSpan={4}
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    Libellé
                  </TableCell>
                  <TableCell align="right" sx={{ textAligin: 'right' }}>
                    Montant FCFA
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell
                    align="left"
                    colSpan={4}
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" noWrap>
                        Prix du logement {program.label} {program.formula}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={1} align="right" sx={{ textAligin: 'right' }}>
                    {sepMillier(invoice.purchase_amount)}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell
                    align="left"
                    colSpan={4}
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" noWrap>
                        Frais de dossier
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={1} align="right" sx={{ textAligin: 'right' }}>
                    {sepMillier(invoice.booking_fees)}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell
                    align="left"
                    colSpan={4}
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" noWrap>
                        Terrain supplémentaire
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={1} align="right" sx={{ textAligin: 'right' }}>
                    {sepMillier(invoice.additional_land_amount)}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell
                    align="left"
                    colSpan={4}
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 16 }} noWrap>
                        TOTAL à payer hors frais notaire
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={1} align="right" sx={{ textAligin: 'right', fontWeight: 'bold', fontSize: 16 }}>
                    {sepMillier(invoice.house_amount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {versement.length > 0 && (
          <Scrollbar sx={{ mb: 6 }}>
            <TableContainer sx={{ minWidth: 100 }}>
              <Table>
                <TableHead
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    '& th': { backgroundColor: 'transparent' },
                  }}
                >
                  <TableRow>
                    <TableCell
                      align="left"
                      // colSpan={2}
                      sx={{
                        borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                        width: 418,
                      }}
                    >
                      Détail des paiements reçus
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                        width: 200,
                      }}
                      // colSpan={2}
                    >
                      Montant FCFA
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                      }}
                      // colSpan={2}
                    >
                      Banque
                    </TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {versement.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <Box sx={{ maxWidth: 560 }}>
                          <Typography variant="body2">
                            {item.payment_method} {item.input_payment_reference}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        {' '}
                        {sepMillier(item.amount)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        {item.bank}
                      </TableCell>
                      <TableCell align="right">{moment(item.payment_date).format('DD MMM YYYY')}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    sx={
                      {
                        // borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        // minWidth: 120,
                      }
                    }
                  >
                    <TableCell
                      align="left"
                      sx={{
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 'bold', fontSize: 16 }}>
                          TOTAL
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                        textAligin: 'right',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {sepMillier(somme)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}

        <Scrollbar sx={{ mb: 3 }}>
          <TableContainer sx={{ maxWidth: 618 }}>
            <Table>
              <TableBody>
                <TableRow
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                      width: 418,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" noWrap>
                        Reste à payer hors frais notaire
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ textAligin: 'right' }}>
                    {sepMillier(invoice.balance_due)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Scrollbar sx={{ mb: 3 }}>
          <TableContainer sx={{ maxWidth: 618 }}>
            <Table>
              <TableBody>
                <TableRow
                  sx={{
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    width: '100%',
                  }}
                >
                  <TableCell
                    align="left"
                    // colSpan={4}
                    sx={{
                      borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                      width: 418,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" noWrap>
                        Total impayé sur frais de reservation
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ textAligin: 'right' }}>
                    {sepMillier(invoice.booking_fees_due)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Typography variant="body2" sx={{ fontSize: 15 }}>
          *<b style={{ fontSize: 15, fontWeight: 'bold' }}>Sauf erreur ou omission de notre part</b>
        </Typography>
        <Divider sx={{ mt: 30 }} />
        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">Ce document strictement confidentiel</Typography>
          </Grid>
          {/* <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Vous avez des questions ?</Typography>
            <Typography variant="body2">serviceclients@s3i-groupe.com</Typography>
          </Grid> */}
        </Grid>
      </Card>
    </>
  );
}
