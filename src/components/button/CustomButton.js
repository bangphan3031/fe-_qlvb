import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';

const CustomButton = ({ handleClick, icon: Icon, title, label, variant, color }) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={3}>
        <AnimateButton>
          <Tooltip title={title} placement="bottom">
            <Button color={color} variant={variant} size="medium" onClick={handleClick}>
              {Icon && <Icon />} {label}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default CustomButton;
