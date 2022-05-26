import React from 'react';
import { capitalCase } from 'change-case';
import moment from 'moment';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography, CardMedia } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
import illustrationLogin from '../../assets/images/illustration_login.png';
import videoBg from '../../assets/video/builder.mp4';

// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginFormAdmin } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const salutation = moment(Date.now()).format('k') < 12 ? 'Bonjour' : 'Bonsoir';

// ----------------------------------------------------------------------

export default function LoginAdmin() {
  const { method } = useAuth();
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Connexion Admin">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h2" sx={{ px: 5, mt: 10 }}>
              {salutation},
            </Typography>
            <Typography variant="h4" sx={{ px: 5, mb: 5 }}>
              Bienvenue
            </Typography>
            <CardMedia component="video" image={videoBg} autoPlay loop muted />

            {/* <Image visibleByDefault disabledEffect alt="login" src={illustrationLogin} /> */}
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Connectez-vous
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Entrez vos coordonnées ci-dessous.</Typography>
              </Box>
            </Stack>

            <Alert severity="info" sx={{ mb: 3 }}>
              Utiliser l'email : <strong>virginie.douakouadio@s3i-groupe.com</strong> / Mot de passe :
              <strong> @dm1&&</strong>
            </Alert>

            <LoginFormAdmin />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
