/* eslint-disable radix */
/* eslint-disable import/first */
import React, { useRef, useState, useEffect } from 'react';
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
import styles from './InvoiceSituationStyle';

// ----------------------------------------------------------------------

InvoiceSituationPDF.propTypes = {
  invoice: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired,
  facture: PropTypes.string.isRequired,
  versement: PropTypes.array,
};

export default function InvoiceSituationPDF({ invoice, customer, program, facture, versement }) {
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

  const [somme, setSomme] = useState(0);

  useEffect(() => {
    const sumWithInitial = versement.reduce(
      (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue.amount),
      somme
    );
    setSomme(sumWithInitial);
  }, []);

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    // console.log(Primenumeral);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb30]}>
          <Image source="/logo/s3i-logo.png" style={{ height: 64 }} />
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <View style={styles.col12}>
            <Text style={[styles.overline, styles.title2]}>
              SITUATION DE COMPTE : {customer.lastname} {customer.firstname}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb30]}>
          <View style={styles.col6}>
            <Text style={styles.body1}>
              <b>Situation du logement</b> : Lot {invoice.lot} Ilot {invoice.sub_lot}
            </Text>
            <Text style={styles.body1}>
              <b> Superficie totale</b> : {invoice.area} m&sup2;
            </Text>
            <Text style={styles.body1}>
              <b>Date</b> :{moment(invoice.createdAt).format('DD MMM YYYY')}
            </Text>
          </View>
        </View>

        <View style={styles.table1}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2_1}>
                <Text style={styles.subtitle2}>Libellé</Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text style={styles.subtitle2}>Montant FCFA</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2_1}>
                <Text>
                  Prix du logement {program.label} {program.formula}
                </Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text>{sepMillier(invoice.purchase_amount)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2_1}>
                <Text>Frais de dossier</Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text>{sepMillier(invoice.booking_fees)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_2_1}>
                <Text>Terrain supplémentaire</Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text>{sepMillier(invoice.additional_land_amount)}</Text>
              </View>
            </View>
            <View style={styles.tableRow1}>
              <View style={styles.tableCell_2_1}>
                <Text style={styles.subtitle2}>TOTAL à payer hors frais notaire</Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text style={styles.subtitle2}>{sepMillier(invoice.house_amount)}</Text>
              </View>
            </View>
          </View>
        </View>
        {versement.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader2}>
              <View style={styles.tableRow}>
                <View style={styles.tableCell_0}>
                  <Text style={styles.subtitle2}>Détail des paiements reçus</Text>
                </View>

                <View style={[styles.tableCell_3_3, styles.alignRight]}>
                  <Text style={styles.subtitle2}>Montant FCFA</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text style={styles.subtitle2}>Banque</Text>
                </View>

                <View style={[styles.tableCell_4, styles.alignRight]}>
                  <Text style={styles.subtitle2}>Date</Text>
                </View>
              </View>
            </View>

            <View style={styles.tableBody}>
              {versement.map((item, index) => (
                <View style={styles.tableRow} key={item.id}>
                  <View style={styles.tableCell_0_1}>
                    {/* <Text style={styles.subtitle2}>{item.title}</Text> */}
                    <Text>
                      {item.payment_method} {item.input_payment_reference}
                    </Text>
                  </View>

                  <View style={[styles.tableCell_3_3, styles.alignRight]}>
                    <Text>{sepMillier(item.amount)}</Text>
                  </View>

                  <View style={[styles.tableCell_3, styles.alignRight]}>
                    <Text>{item.bank}</Text>
                  </View>

                  <View style={[styles.tableCell_4_0, styles.alignRight]}>
                    <Text>{moment(item.payment_date).format('DD MMM YYYY')}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.tableRow2}>
                <View style={styles.tableCell_0_1}>
                  <Text style={styles.subtitle2}>TOTAL</Text>
                </View>
                <View style={[styles.tableCell_3_3, styles.alignRight]}>
                  <Text style={styles.subtitle2}> {sepMillier(somme)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.table1}>
          <View style={styles.tableBody}>
            <View style={styles.tableRow1}>
              <View style={styles.tableCell_2_1}>
                <Text>Reste à payer hors frais notaire</Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text>{sepMillier(invoice.balance_due)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table1_0}>
          <View style={styles.tableBody}>
            <View style={styles.tableRow1}>
              <View style={styles.tableCell_2_1}>
                <Text>Total impayé sur frais de reservation</Text>
              </View>

              <View style={[styles.tableCell_4_1, styles.alignRight]}>
                <Text>{sepMillier(invoice.booking_fees_due)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.saufBlock}>
          <Text style={styles.sauf}>*Sauf erreur ou omission de notre part</Text>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>Ce document strictement confidentiel.</Text>
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
