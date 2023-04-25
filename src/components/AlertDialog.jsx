import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const AlertDialog = ({title, content, dialogOpen, setDialogOpen}) => {
  const navigate = useNavigate();

  const handleNo = () => {
    setDialogOpen(false);
  };

  const handleYes = () => {
    setDialogOpen(false);
    navigate(-1);
  };

  return (
    <Dialog
      open={dialogOpen}
      keepMounted
      onClose={dialogOpen}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={handleNo}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  dialogOpen: PropTypes.bool,
  setDialogOpen: PropTypes.func,
};

export default AlertDialog;
