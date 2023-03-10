import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { AddLogs } from '../../../pages/dashboard/log/AddLogs';

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // ----------------------------------------------------------------------

  const MENU_OPTIONS = [
    {
      label: 'Tableau de bord',
      linkTo: '/',
    },
    {
      label: 'Gérer mon compte',
      linkTo: user?.role === 'customer' ? PATH_DASHBOARD.user.account : PATH_DASHBOARD_ADMIN.user.account,
    },
  ];

  // ----------------------------------------------------------------------

  const handleLogout = async () => {
    try {
      AddLogs("s'est deconnecté.", user);
      await logout();
      navigate(PATH_AUTH.login, { replace: true });
      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
            },
          }),
        }}
      >
        <MyAvatar />
        {/* <Box sx={{ my: 1.5, px: 1.5 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textAlign: 'left' }}
            noWrap
          >
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }} noWrap>
            {user?.customer_reference}
          </Typography>
        </Box> */}
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Déconnexion
        </MenuItem>
      </MenuPopover>
    </>
  );
}
