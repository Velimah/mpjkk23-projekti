import {Paper, Typography} from '@mui/material';
import PropTypes from 'prop-types';

import UserHeader from './UserHeader';

const CommentRow = ({file, refreshData, setRefreshData}) => {
  return (
    <Paper
      sx={{
        p: 2,
        my: 2,
        mx: {xs: -2, sm: 0},
        backgroundColor: '#F4DCE1',
        borderRadius: '1.25rem',
      }}
      elevation={0}
    >
      <UserHeader
        file={file}
        comment={true}
        refreshData={refreshData}
        setRefreshData={setRefreshData}
      />
      <Typography component="p" variant="body1">
        {file.comment}
      </Typography>
    </Paper>
  );
};

CommentRow.propTypes = {
  file: PropTypes.object.isRequired,
  refreshData: PropTypes.bool,
  setRefreshData: PropTypes.func,
};

export default CommentRow;
