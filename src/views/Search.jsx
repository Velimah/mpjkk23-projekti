import {
  Grid,
  TextField,
  Container,
  InputAdornment,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Icon,
  ListItemButton,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import MediaTable from '../components/MediaTable';
import SearchIcon from '@mui/icons-material/Search';
import {searchValidators} from '../utils/validator';
import {searchErrorMessages} from '../utils/errorMessages';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useTheme} from '@emotion/react';
import {useTag} from '../hooks/ApiHooks';
import {appId} from '../utils/variables';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState('');
  const [refreshSearch, setRefreshSearch] = useState(false);
  const [latestSearches, setLatestSearches] = useState(() => {
    /*
    // getting stored value
    const saved =
      localStorage.getItem('searchHistory') === null
        ? localStorage.setItem('searchHistory', JSON.stringify(''))
        : localStorage.getItem('searchHistory');
    const initialValue = JSON.parse(saved);

    return '';*/
  });
  // const [popularTags, setPopularTags] = useState([]);

  const [testiData, setTestiDataData] = useState(() => {
    return JSON.parse(window.localStorage.getItem('searchTesti')) || ':(';
  });

  useEffect(() => {
    window.localStorage.setItem('searchTesti', JSON.stringify(testiData));
    setTestiDataData(testiData);
  }, [testiData]);

  const smallScreen = useMediaQuery(useTheme().breakpoints.down('sm'));

  // Save new query
  const handleChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase().replace(/\s/g, ''));
  };

  // Refresh MediaTable with new query
  const handleClick = () => {
    setTestiDataData(searchQuery);
    setUpdatedSearchQuery(searchQuery);
    searchQuery === '' ? setRefreshSearch(false) : setRefreshSearch(true);
  };

  useEffect(() => {
    const oldQuery = JSON.parse(localStorage.getItem('searchTesti'))
      .match(/[^,]+/g)
      .filter(Boolean);

    // TODO: even if same keyword has been searched, move it to latest
    // if new keyword hasn't already been searched, add it into search history
    if (!oldQuery.includes(searchQuery)) {
      // if theres three searches already, delete the oldest
      if (oldQuery.length > 3) {
        oldQuery.shift();
      }

      const newQuery = oldQuery + ',' + searchQuery;
      localStorage.setItem('searchTesti', JSON.stringify(newQuery));

      setLatestSearches(newQuery.match(/[^,]+/g).filter(Boolean));
    }
  }, [updatedSearchQuery]);

  const updateSearchHistory = () => {
    const oldQuery = JSON.parse(localStorage.getItem('searchHistory')).match(/[^,]+/g);

    // TODO: even if same keyword has been searched, move it to latest
    // if new keyword hasn't already been searched, add it into search history
    if (!oldQuery.includes(searchQuery)) {
      // if theres three searches already, delete the oldest
      if (oldQuery.length > 3) {
        oldQuery.shift();
      }

      const newQuery = oldQuery + ',' + searchQuery;
      localStorage.setItem('searchHistory', JSON.stringify(newQuery));

      setLatestSearches(newQuery.match(/[^,]+/g).filter(Boolean));
    }
  };

  /*
  const fetchTags = async () => {
    try {
      const tagInfo = await useTag().getTagsByFileId(file.file_id);
      const filteredTags = tagInfo.filter((tag) => tag.tag !== appId);
      // setOriginalTags(filteredTags);
      setPopularTags(
        filteredTags.map((tag) => tag.tag.replace(appId + '_', '') + ' ')
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  console.log(popularTags);
  */

  const renderSearchHistory = () => {
    return (
      <List
        container
        direction="column"
        justifyContent="center"
        sx={{width: smallScreen ? '100%' : 'auto'}}
      >
        {[testiData]
          .slice(0)
          .reverse()
          .map((item) => (
            <ListItemButton key={item}>
              <ListItemText primary={item} />
              <KeyboardArrowRightIcon color="#7047A6" />
            </ListItemButton>
          ))}
      </List>
    );
  };

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
      <Container maxwidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="stretch"
          sx={{pt: '50px'}}
        >
          <Grid item sx={{backgroundColor: 'green'}}>
            <Typography component="h2" variant="h2">
              Latest searches
            </Typography>
            {renderSearchHistory()}
          </Grid>
          <Grid item sx={{backgroundColor: 'green'}}>
            <Typography component="h2" variant="h2">
              Popular searches
            </Typography>
          </Grid>
        </Grid>
      </Container>

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
