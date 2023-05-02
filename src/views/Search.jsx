import {
  Grid,
  TextField,
  Container,
  IconButton,
  InputAdornment,
  Button,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import MediaTable from '../components/MediaTable';
import SearchIcon from '@mui/icons-material/Search';
import {searchValidators} from '../utils/validator';
import {searchErrorMessages} from '../utils/errorMessages';
import {MediaContext} from '../contexts/MediaContext';
import {useContext} from 'react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState(searchQuery);
  const [refreshSearch, setRefreshSearch] = useState(false);
  const [latestSearches, setLatestSearches] = useState(() => {
    // getting stored value
    const saved =
      localStorage.getItem('searchHistory') === null
        ? localStorage.setItem('searchHistory', JSON.stringify(' '))
        : localStorage.getItem('searchHistory');
    const initialValue = JSON.parse(saved);
    return initialValue || '';
  });

  // Save new query
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Refresh MediaTable with new query
  const handleClick = () => {
    setUpdatedSearchQuery(searchQuery);
    searchQuery === '' ? setRefreshSearch(false) : setRefreshSearch(true);
  };

  useEffect(() => {
    console.log('refresh');
    // only allow three max searches
    // loop through localstorage to check if its the same search keyword
    // if (localStorage.getItem('searchHistory') === null) {
    const oldQuery = JSON.parse(localStorage.getItem('searchHistory')).match(
      /\S+/g
    );

    if (!localStorage.getItem('searchHistory') === null) {
      // if new keyword hasn't already been searched, add it into search histoty
      if (!oldQuery.includes(searchQuery)) {
        console.log('yesy');
        const newQuery =
          JSON.parse(localStorage.getItem('searchHistory')) + ' ' + searchQuery;
        localStorage.setItem('searchHistory', JSON.stringify(newQuery));

        setLatestSearches(newQuery);
      }
    } else {
      localStorage.setItem('searchHistory', JSON.stringify(searchQuery));
    }

    // }
  }, [updatedSearchQuery]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{pt: '100px'}}
      >
        <TextField
          id="filled-search"
          label="Search by keyword"
          type="search"
          variant="outlined"
          validators={searchValidators.search}
          errorMessages={searchErrorMessages.search}
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
          onChange={handleChange}
          value={searchQuery}
        />
        <Button aria-label="search" onClick={handleClick}>
          <SearchIcon color="#7047A6" />
        </Button>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{pt: '100px'}}
      >
        <Typography component="h2" variant="h2" sx={{mb: 2}}>
          Latest
        </Typography>
        <Typography component="p" variant="body1">
          {latestSearches}
        </Typography>
      </Grid>
      <Grid sx={{mt: '50px', mb: '100px'}}>
        {refreshSearch && <MediaTable searchQuery={updatedSearchQuery} />}
      </Grid>
    </>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.string,
};

export default Search;
