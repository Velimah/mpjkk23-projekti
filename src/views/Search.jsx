import {
  Grid,
  TextField,
  Container,
  Button,
  Typography,
  List,
  ListItem,
  useMediaQuery,
  Chip,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useState, useEffect, useContext} from 'react';
import MediaTable from '../components/MediaTable';
import {searchValidators} from '../utils/validator';
import {searchErrorMessages} from '../utils/errorMessages';
import {useTheme} from '@emotion/react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {appId} from '../utils/variables';
import {MediaContext} from '../contexts/MediaContext';
import {useLocation} from 'react-router-dom';
import {SearchRounded} from '@mui/icons-material';

const Search = () => {
  const {user} = useContext(MediaContext);
  const {getTagsByFileId} = useTag();
  const {mediaArray, getMedia} = useMedia();
  const {state} = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState('');
  // const [refreshSearch, setRefreshSearch] = useState(false);

  const [allTags, setAllTags] = useState([]);

  const [fetchOk, setFetchOk] = useState(false);

  useEffect(() => {
    state && setSearchQuery(state);
    getMedia();
  }, []);

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
    setSearchQuery(e.target.value.toLowerCase().replace(/[^\wäöåÄÖÅ]/g, ''));
  };

  // Refresh MediaTable with new query
  const handleClick = () => {
    latestSearches === ''
      ? setLatestSearches(searchQuery)
      : updateSearchHistory();

    setUpdatedSearchQuery(searchQuery);
  };

  const handleClickTag = (tag) => {
    setSearchQuery(tag);
  };

  useEffect(() => {
    handleClick();
  }, [searchQuery]);

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
      return (
        <Typography component="p" variant="body1">
          You don't have any searches
        </Typography>
      );
    }
    return (
      <List
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: smallScreen ? '100%' : 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {latestSearches
          .split(',')
          .reverse()
          .map((item) => (
            <ListItem key={item} justifyContent="center" sx={{p: 0}}>
              <Chip
                variant="outlined"
                color="primary"
                key={item}
                label={item}
                onClick={() => handleClickTag(item)}
                sx={{mr: 1, mt: 1}}
              />
            </ListItem>
          ))}
      </List>
    );
  };

  const renderPopularSearches = () => {
    return (
      <List
        container
        sx={{
          width: smallScreen ? '100%' : 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          justifyItems: 'center',
        }}
      >
        {tagDuplicateCount(allTags)
          .slice(0, 4)
          .map((item) => (
            <ListItem key={item} justifyContent="center" sx={{p: 0}}>
              <Chip
                variant="outlined"
                color="primary"
                key={item}
                label={item}
                onClick={() => handleClickTag(item)}
                sx={{mr: 1, mt: 1}}
              />
            </ListItem>
          ))}
      </List>
    );
  };

  // count all tags and return them sorted
  const tagDuplicateCount = (tagArray) => {
    const countTags = tagArray.reduce((counts, string) => {
      counts[string] = (counts[string] || 0) + 1;
      return counts;
    }, {});

    // sort the strings by their occurrence count (in descending order)
    const sortedStrings = Object.keys(countTags).sort(
      (a, b) => countTags[b] - countTags[a]
    );

    // return the sorted strings and their occurrence counts
    return sortedStrings.map((item) => `${item}`);
  };

  const fetchTags = async () => {
    try {
      const tagArray = [];
      for (const file of mediaArray) {
        const tagInfo = await getTagsByFileId(file.file_id);
        const filteredTags = tagInfo.filter((tag) => tag.tag !== appId);
        for (const test of filteredTags) {
          tagArray.push(test.tag.split('_')[1]);
        }
      }
      setAllTags(tagArray);
      setFetchOk(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [mediaArray]);

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
          placeholder="Search by keyword"
          type="search"
          variant="outlined"
          validators={searchValidators.search}
          errorMessages={searchErrorMessages.search}
          onChange={handleChange}
          value={searchQuery}
        />
        <Button variant="contained" aria-label="search" onClick={handleClick}>
          <SearchRounded />
        </Button>
      </Grid>
      <Container maxwidth="lg">
        <Grid
          container
          direction={smallScreen ? 'column' : 'row'}
          alignContent="center"
          justifyContent="space-evenly"
          alignItems="stretch"
          sx={{pt: '50px'}}
        >
          <Grid item>
            <Typography component="h2" variant="h2" align="center">
              Your Latest searches
            </Typography>
            {renderSearchHistory()}
          </Grid>
          {/* if not logged in, don't show this */}
          {user ? (
            <Grid item sx={{pt: smallScreen ? '40px' : ''}}>
              <Typography component="h2" variant="h2" align="center">
                Popular keywords
              </Typography>
              {fetchOk && renderPopularSearches()}
            </Grid>
          ) : null}
        </Grid>
      </Container>

      <Grid sx={{mt: '3rem', mb: '3.5rem'}}>
        <MediaTable searchQuery={updatedSearchQuery} searchOnly={true} />
      </Grid>
    </>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.string,
};

export default Search;
