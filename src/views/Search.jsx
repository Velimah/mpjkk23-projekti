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

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshSearch, setRefreshSearch] = useState(false);

  const sendSearchQuery = () => {
    setSearchQuery('_grey');
    setRefreshSearch(!refreshSearch);
    console.log(refreshSearch);
  };

  const [sort, setSort] = useState();

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{py: '60px', backgroundColor: '#E3A7B6'}}
      >
        <TextField
          id="filled-search"
          label="Search by keyword"
          type="search"
          variant="filled"
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
        />
        <IconButton aria-label="search" onClick={sendSearchQuery}>
          <SearchIcon style={{fill: 'blue'}} />
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
              <Select
                labelId="select-label"
                id="select"
                value={sort}
                label="Sort"
                onChange={handleChange}
              >
                <MenuItem value={1}>Newest</MenuItem>
                <MenuItem value={2}>Most liked</MenuItem>
                <MenuItem value={3}>Top rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Container>
        {refreshSearch && <MediaTable searchQuery={searchQuery} />}
      </Grid>
    </>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.any.isRequired,
};

export default Search;
