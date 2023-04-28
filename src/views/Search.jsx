import {
  Grid,
  TextField,
  Container,
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import MediaTable from '../components/MediaTable';
import SearchIcon from '@mui/icons-material/Search';
import {searchValidators} from '../utils/validator';
import {searchErrorMessages} from '../utils/errorMessages';
import useForm from '../hooks/FormHooks';
import Skeleton from '@mui/material/Skeleton';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState(searchQuery);
  const [refreshSearch, setRefreshSearch] = useState(false);

  const loading = false;

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const sendSearchQuery = () => {
    setUpdatedSearchQuery('_' + searchQuery);
    setRefreshSearch(!refreshSearch);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{py: '60px', backgroundColor: '#E3A7B6'}}
      >
        <TextField
          id="filled-search"
          label="Search by keyword"
          type="search"
          variant="filled"
          validators={searchValidators.search}
          errorMessages={searchErrorMessages.search}
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
          onChange={handleChange}
          value={searchQuery}
        />
        <IconButton
          aria-label="search"
          onClick={sendSearchQuery}
          sx={{backgroundColor: '#7047A6'}}
        >
          <SearchIcon color="white" />
        </IconButton>
      </Grid>

      <Grid sx={{mt: '50px', mb: '100px'}}>
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="h2" variant="h2" sx={{mb: 2}}>
              Search results
            </Typography>
            <FormControl sx={{width: 150}}>
              <InputLabel id="select-label">Sort</InputLabel>
              <Select labelId="select-label" id="select" value={1} label="Sort">
                <MenuItem value={1}>Newest</MenuItem>
                <MenuItem value={2}>Most liked</MenuItem>
                <MenuItem value={3}>Top rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Container>
        {refreshSearch && <MediaTable searchQuery={updatedSearchQuery} />}
      </Grid>
    </>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.any.isRequired,
};

export default Search;
