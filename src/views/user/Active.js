import React from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconChecks } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedUserSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import PrimaryColorIcon from 'components/icons/PrimaryColorIcon';
import { activeUser } from 'services/userService';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';

const ActiveUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectedUserSelector);
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    try {
      const userActive = await activeUser(selectedUser.userId);
      const check = handleResponseStatus(userActive, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', userActive.message.toString()));
      } else {
        if (userActive.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', userActive.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', userActive.message.toString()));
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <PrimaryColorIcon icon={IconChecks} size={100} />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {`${t('user.form.active')} [${selectedUser.userName}]?`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleDeleteClick} color={'info'} />
        </Grid>
        <Grid item>
          <NoButton color={'error'} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ActiveUser;
