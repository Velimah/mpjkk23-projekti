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
import {useMedia, useTag} from '../hooks/ApiHooks';
import {appId} from '../utils/variables';

const Search = () => {
  const {getTagsByFileId} = useTag();
  const {mediaArray, getMedia} = useMedia();

  const [searchQuery, setSearchQuery] = useState('');
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState('');
  const [refreshSearch, setRefreshSearch] = useState(false);

  const [allTags, setAllTags] = useState([]);

  const [latestSearches, setLatestSearches] = useState(() => {
    return JSON.parse(window.localStorage.getItem('searchHistory')) || '';
  });

  useEffect(() => {
    window.localStorage.setItem(
      'searchHistory',
      JSON.stringify(latestSearches)
    );
    setLatestSearches(latestSearches);
  }, [latestSearches]);

  const smallScreen = useMediaQuery(useTheme().breakpoints.down('sm'));

  // Save new query
  const handleChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase().replace(/\s/g, ''));
  };

  // Refresh MediaTable with new query
  const handleClick = () => {
    latestSearches === ''
      ? setLatestSearches(searchQuery)
      : updateSearchHistory();

    setUpdatedSearchQuery(searchQuery);
    searchQuery === '' ? setRefreshSearch(false) : setRefreshSearch(true);
  };

  const updateSearchHistory = () => {
    const oldQuery = JSON.parse(localStorage.getItem('searchHistory'));

    // TODO: even if same keyword has been searched, move it to latest
    // if theres a new keyword, add it to search list
    if (!oldQuery.includes(searchQuery)) {
      // if theres 4 searches already, delete the oldest
      const oldQuerySplit = oldQuery.split(',');
      if (oldQuerySplit.length > 3) {
        oldQuerySplit.shift();
        setLatestSearches(oldQuerySplit.toString() + ',' + searchQuery);
      } else {
        setLatestSearches(oldQuery + ',' + searchQuery);
      }
    }
  };

  const renderSearchHistory = () => {
    // if search history is null, dont render list
    if (latestSearches === '') {
      return;
    }
    const splitLatestSearches = latestSearches.split(',').reverse();
    return (
      <List
        container
        direction="column"
        justifyContent="center"
        sx={{
          width: smallScreen ? '100%' : 'auto',
          columns: smallScreen ? 1 : 2,
        }}
      >
        {splitLatestSearches.map((item) => (
          <ListItemButton key={item}>
            <KeyboardArrowRightIcon color="#7047A6" />
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const fetchTags = async () => {
    try {
      const tagArray = [];
      // const tagInfo = await getTagsByFileId(files.file_id);
      // const filteredTags = tagInfo.filter((tag) => tag.tag !== appId);
      for (const file of mediaArray) {
        const tagInfo = await getTagsByFileId(file.file_id);
        const filteredTags = tagInfo.filter((tag) => tag.tag !== appId);

        for (const test of filteredTags) {
          // console.log(test.tag);
          tagArray.push(test.tag.replace(appId), '');
        }
        // if (!filteredTags.length === 0) {
          // tagArray.push(filteredTags);
        // }
      }
      console.log(tagArray);
      /*
      setAllTags(
        filteredTags.map((tag) => tag.tag.replace(appId + '_', '') + ' ')
      );
      */
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getMedia();
    fetchTags();
  }, []);

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
            {allTags}
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
