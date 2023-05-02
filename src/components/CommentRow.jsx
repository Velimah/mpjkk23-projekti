import {Grid, Paper, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import UserHeader from './UserHeader';
import {MediaContext} from '../contexts/MediaContext';

const CommentRow = ({file, refreshData, setRefreshData}) => {
  const {user} = useContext(MediaContext);

  return (
    <Paper
      sx={{
        p: 2,
        my: 2,
        backgroundColor: '#E3A7B6',
        borderRadius: '1.25rem',
      }}
      elevation={0}
    >
      {user ? (
        <>
          <UserHeader
            file={file}
            comment={true}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
          <Typography component="p" variant="body1">
            {file.comment}
          </Typography>
        </>
      ) : (
        <Grid container>
          <Grid item xs={8}>
            <Typography component="p" variant="body1">
              {file.comment}
            </Typography>
          </Grid>
          <Grid item xs={true}>
            <UserHeader
              file={file}
              comment={true}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

CommentRow.propTypes = {
  file: PropTypes.object.isRequired,
  refreshData: PropTypes.bool,
  setRefreshData: PropTypes.func,
};

export default CommentRow;
