/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import PSPDFKit from 'pspdfkit';

import { saveAs } from 'file-saver';
import fileDownload from 'js-file-download';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer, pdf, usePDF } from '@react-pdf/renderer';
// @mui
import { Box, Stack, Button, Dialog, Tooltip, IconButton, DialogActions, CircularProgress } from '@mui/material';
// hooks
import useToggle from '../../../../hooks/useToggle';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
//
import InvoicePDF from './InvoiceSituationPDF';
import { AddLogs } from '../../../../pages/dashboard/log/AddLogs';

// ----------------------------------------------------------------------

InvoiceSituationToolbar.propTypes = {
  invoice: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  user: PropTypes.object,
  versement: PropTypes.array,
  program: PropTypes.object.isRequired,
  somme: PropTypes.number,
};

export default function InvoiceSituationToolbar({ invoice, customer, program, user, versement, somme }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [isPrint, setisPrint] = useState(false);
  // const { toggle: open, onOpen, onClose } = useToggle();
  const facture = 'avis-situation-' + invoice.booking_reference + '.pdf';

  const [instance, updateInstance] = usePDF({
    document: (
      <InvoicePDF
        invoice={invoice}
        customer={customer}
        program={program}
        facture={facture}
        versement={versement}
        somme={somme}
      />
    ),
  });

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.invoice.edit(invoice.id));
  };

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const generatePDFDocument = async (url) => {
    setIsDownload(true);

    setTimeout(() => {
      setIsDownload(false);
      axios
        .get(url, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, facture);

          AddLogs(
            "a téléchargée la facture d'un de ces versements ayant pour reference " +
              invoice.payment_schedule_reference,
            user
          );
        });
    }, 3000);
  };

  const handlePrint = async (url) => {
    setisPrint(true);
    setTimeout(() => {
      setisPrint(false);
      axios
        .get(url, {
          responseType: 'blob',
        })
        .then(async (res) => {
          const blob = await new Blob([res.data], { type: 'application/pdf' });
          const blobURL = URL.createObjectURL(blob);

          const iframe = document.createElement('iframe');
          document.body.appendChild(iframe);

          iframe.style.display = 'none';
          iframe.src = blobURL;
          iframe.onload = function () {
            setTimeout(function () {
              iframe.focus();
              iframe.contentWindow.print();
            }, 1);
          };

          AddLogs(
            "a imprimée la facture d'un de ces versements ayant pour reference " + invoice.payment_schedule_reference,
            user
          );
        });
    }, 3000);
  };

  console.log(facture);
  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            variant="outlined"
            disabled={isDownload ? 'disabled' : ''}
            onClick={() => generatePDFDocument(instance.url)}
            startIcon={isDownload ? '' : <Iconify icon={'eva:download-fill'} />}
            sx={{ textAlign: 'right' }}
          >
            {isDownload ? 'Téléchargement en cours...' : 'Télécharger ma facture'}

            {isDownload && (
              <CircularProgress
                size={14}
                sx={{
                  color: '#f2e',
                  marginLeft: 2,
                }}
              />
            )}
          </Button>

          <Button
            color="inherit"
            disabled={isPrint ? 'disabled' : ''}
            onClick={() => handlePrint(instance.url)}
            variant="outlined"
            startIcon={isPrint ? '' : <Iconify icon={'eva:printer-fill'} />}
            sx={{}}
          >
            {isPrint ? 'Impression en cours...' : 'Imprimer ma facture'}
            {isPrint && (
              <CircularProgress
                size={14}
                sx={{
                  color: '#f2e',
                  marginLeft: 2,
                }}
              />
            )}
          </Button>
        </Stack>
      </Stack>

      <Dialog fullScreen open={open}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={onClose}>
                <Iconify icon={'eva:close-fill'} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF invoice={invoice} customer={customer} program={program} versement={versement} somme={somme} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

// function generatePDF(invoice, customer, program, facture) {
//   const [pdfLink, setPdfLink] = useState('');

//   return (
//     <PDFDownloadLink
//       document={<InvoicePDF invoice={invoice} customer={customer} program={program} />}
//       fileName={facture}
//       style={{ textDecoration: 'none' }}
//     >
//       {({ loading, url }) => (
//         <Tooltip title="Download">
//           {/* <IconButton> */}
//           {loading ? (
//             <CircularProgress size={24} color="inherit" />
//           ) : (
//            {this}
//           )}
//           {/* </IconButton> */}
//         </Tooltip>
//       )}
//     </PDFDownloadLink>
//   );
// }
