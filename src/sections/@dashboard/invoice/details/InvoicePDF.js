/* eslint-disable import/first */
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types';
import numeral from 'numeral';
// eslint-disable-next-line import/newline-after-import
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');

import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired,
  facture: PropTypes.string.isRequired,
};

export default function InvoicePDF({ invoice, customer, program, facture }) {
  const {
    items,
    taxes,
    status,
    dueDate,
    discount,
    invoiceTo,
    createDate,
    totalPrice,
    invoiceFrom,
    invoiceNumber,
    subTotalPrice,
  } = invoice;

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    // console.log(Primenumeral);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/s3i-logo.png" style={{ height: 64 }} />
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>PAYÉE</Text>
            <Text> {invoice.payment_reference} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}> Facturé à</Text>
            <Text style={styles.body1}>
              {customer.firstname} {customer.lastname}
            </Text>
            <Text style={styles.body1}>Tel: {customer.phone_number}</Text>
            <Text style={styles.body1}>Email: {customer.email}</Text>
          </View>

          <View style={[styles.col6, styles.alignRight]}>
            <Text style={[styles.overline, styles.mb8]}>Payer à</Text>
            <Text style={styles.body1}>S3I - bâtisseur du confort</Text>
            <Text style={styles.body1}>Tel: (+225) 07 77 001 002</Text>
            <Text style={styles.body1}>Email: serviceclients@s3i-groupe.com</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Date de facturation</Text>
            <Text style={styles.body1}>{moment(invoice.payment_date).format('DD MMM YYYY')}</Text>
          </View>
          <View style={(styles.col6, styles.textAlign)}>
            <Text style={[styles.overline, styles.mb8]}>Mode de paiement</Text>
            <Text style={styles.body1}>{invoice.payment_method}</Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Détails de la facture</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Description</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Montant versé</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2} colSpan={4}>
                <Text style={styles.subtitle2}>
                  {invoice.payment_schedule_reference === 'FRAIS RESERVATION'
                    ? 'Paiement de frais réservation'
                    : "Paiement d'échéance"}
                </Text>
                <Text>
                  {program.label} {program.formula} {program.real_estate_program_type} {' - '}
                  {program.location}
                </Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]} colSpan={1}>
                <Text>{sepMillier(invoice.amount)} CFA</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Sous-total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{sepMillier(invoice.amount)} CFA</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Taxes</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>0 CFA</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{sepMillier(invoice.amount)} CFA</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>Si vous souhaitez que nous ajoutions des notes supplémentaires, faites-le nous savoir!</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Vous avez des questions ?</Text>
            <Text>serviceclients@s3i-groupe.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
