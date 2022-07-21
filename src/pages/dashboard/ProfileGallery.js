/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, CardContent, Alert } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import cssStyles from '../../utils/cssStyles';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import LightboxModal from '../../components/LightboxModal';
import EmptyContent from '../../components/EmptyContent';
import noDataImg from '../../assets/images/noData.png';
import { AddLogs } from './log/AddLogs';

// ----------------------------------------------------------------------

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(8, 2),
}));

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProfileGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
  detailRow: PropTypes.object,
  user: PropTypes.object,
  bookingReference: PropTypes.string,
};

export default function ProfileGallery({ gallery, user, detailRow, bookingReference }) {
  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const imagesLightbox = gallery.map((img) => img.image_name);

  useEffect(() => {
    if (user.role.toUpperCase() === 'CUSTOMER') {
      AddLogs("a consulté son état d'avancement pour la reservation de référence " + bookingReference, user);
    }
  }, []);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };
  const isSolde = detailRow.booking_fees_due > 0 ? true : false;

  return (
    <Box sx={{ mt: 5 }}>
      {/* <Typography variant="h4" sx={{ mb: 3 }}>
        Gallery
      </Typography> */}

      <Card sx={{ p: 3 }}>
        {user.role.toUpperCase() === 'CUSTOMER' ? (
          gallery.length < 0 && isSolde ? (
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {gallery.map((image) => (
                <GalleryItem key={image.id} image={image} onOpenLightbox={handleOpenLightbox} />
              ))}
            </Box>
          ) : (
            <>
              <RootStyle>
                <Image
                  disabledEffect
                  visibleByDefault
                  alt="empty content"
                  src={noDataImg}
                  sx={{ height: 240, mb: 3 }}
                />

                <Alert severity="error" sx={{ p: 2, fontWeight: 'bold' }}>
                  Merci de vous acquitter de vos frais de réservations afin de constater l'évolution de votre logement.
                </Alert>
              </RootStyle>
            </>
          )
        ) : gallery.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {gallery.map((image) => (
              <GalleryItem key={image.id} image={image} onOpenLightbox={handleOpenLightbox} />
            ))}
          </Box>
        ) : (
          <EmptyContent
            title={"Pas d'image pour cette reservation"}
            description={"Cette reservation n'a pas d'image de suivie d'activité."}
          />
        )}

        <LightboxModal
          images={imagesLightbox}
          mainSrc={imagesLightbox[selectedImage]}
          photoIndex={selectedImage}
          setPhotoIndex={setSelectedImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
        />
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

GalleryItem.propTypes = {
  image: PropTypes.object,
  onOpenLightbox: PropTypes.func,
};

function GalleryItem({ image, onOpenLightbox }) {
  const saveFile = (url, name) => {
    saveAs(url, name);
  };
  const { image_name, title, image_link, createdAt } = image;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery image" ratio="1/1" src={image_name} onClick={() => onOpenLightbox(image_name)} />

      <CaptionStyle>
        <div>
          {/* <Typography variant="subtitle1">{fDate(postAt)}</Typography> */}
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {moment(createdAt).format('DD MMM YYYY')}
          </Typography>
        </div>
        <IconButton color="inherit">
          <Iconify
            icon={'eva:download-outline'}
            width={20}
            height={20}
            onClick={() => saveFile(image_name, image_link)}
          />
        </IconButton>
      </CaptionStyle>
    </Card>
  );
}
