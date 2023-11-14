import { Grid } from '@mui/material';
import { IconChecks } from '@tabler/icons';
import YesButton from 'components/button/YesButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { capBangBansaoSelector, usersSelector } from 'store/selectors';
import MuiTypography from '@mui/material/Typography';
import NoButton from 'components/button/NoButton';
import { setLoading, setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { XacNhanInBanSao } from 'services/capbangbansaoService';

const XacNhanIn = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hocsinh_madon = useSelector(capBangBansaoSelector);
  const user = useSelector(usersSelector);
  const hanldeXacNhanIn = async () => {
    dispatch(setLoading(true));
    try {
      let response = await XacNhanInBanSao(hocsinh_madon.donYeuCauCapBanSao.id, user.username);

      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        dispatch(setLoading(false));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      dispatch(setLoading(false));
    }
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <IconChecks size={100} color="#2196F3" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t(`Bạn có muốn xác nhận đã in bản sao của [${hocsinh_madon.hoTen}] ?`)}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeXacNhanIn} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
};

export default XacNhanIn;
