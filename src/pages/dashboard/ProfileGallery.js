/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import cssStyles from '../../utils/cssStyles';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import LightboxModal from '../../components/LightboxModal';
import EmptyContent from '../../components/EmptyContent';

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

ProfileGallery.propTypes = {
  gallery: PropTypes.array.isRequired,
  isGet: PropTypes.bool,
};

export default function ProfileGallery({ gallery, isGet }) {
  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const imagesLightbox = gallery.map((img) => img.image_name);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };
  return (
    <Box sx={{ mt: 5 }}>
      {/* <Typography variant="h4" sx={{ mb: 3 }}>
        Gallery
      </Typography> */}

      <Card sx={{ p: 3 }}>
        {gallery.length > 0 ? (
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
          <EmptyContent title={'Votre gallerie est vide'} description={"Pas d'image de suivie des travaux"} />
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
