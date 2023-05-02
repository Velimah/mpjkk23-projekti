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

const AlertDialog = ({
  title,
  content,
  dialogOpen,
  setDialogOpen,
  functionToDo,
}) => {
  const handleNo = () => {
    setDialogOpen(false);
  };

  return (
    <Dialog
      open={dialogOpen}
      keepMounted
      onClose={() => setDialogOpen(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={functionToDo}>Yes</Button>
        <Button onClick={handleNo}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  functionToDo: PropTypes.func.isRequired,
};

export default AlertDialog;
