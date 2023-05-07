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
// import {searchValidators} from '../utils/validator';
// import {searchErrorMessages} from '../utils/errorMessages';
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
  const {setToastSnackbar, setToastSnackbarOpen} = useContext(MediaContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState('');
  // const [refreshSearch, setRefreshSearch] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [fetchOk, setFetchOk] = useState(false);

  useEffect(() => {
    if (state) {
      setSearchQuery(state);
      setTimeout(() => {
        setUpdatedSearchQuery(state);
      }, 200);
    }
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

    // check if tag doesn't exists, tell it to user
    if (!allTags.includes(searchQuery) && searchQuery.length > 0) {
      searchQuery === 'dog'
        ? setToastSnackbar({severity: 'error', message: 'NO DOGS ALLOWED! >:('})
        : setToastSnackbar({severity: 'error', message: 'Keyword not found'});
      setToastSnackbarOpen(true);
    }

    setUpdatedSearchQuery(searchQuery);
  };

  const handleClickTag = (tag) => {
    setSearchQuery(tag);
    setUpdatedSearchQuery(tag);
  };

  const updateSearchHistory = () => {
    const oldQuery = JSON.parse(localStorage.getItem('searchHistory'));

    // TODO: even if same keyword has been searched, move it to latest
    // if theres a new keyword, add it to search list
    if (!oldQuery.includes(updatedSearchQuery)) {
      // if theres 4 searches already, delete the oldest
      const oldQuerySplit = oldQuery.split(',');
      if (oldQuerySplit.length > 3) {
        oldQuerySplit.shift();
        setLatestSearches(oldQuerySplit.toString() + ',' + updatedSearchQuery);
      } else {
        setLatestSearches(oldQuery + ',' + updatedSearchQuery);
      }
    }
  };

  const renderSearchHistory = () => {
    // if search history is null, dont render list
    if (latestSearches === '') {
      return (
        <Typography
          component="p"
          variant="body1"
          align="center"
          paddingTop="25px"
        >
          You don't have any searches
        </Typography>
      );
    }
    return (
      <List
        sx={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        {latestSearches
          .split(',')
          .reverse()
          .map((item) => (
            <ListItem key={item} sx={{p: 0, width: 'auto'}}>
              <Chip
                variant="outlined"
                color="primary"
                key={item}
                label={item}
                onClick={() => handleClickTag(item)}
                size="small"
              />
            </ListItem>
          ))}
      </List>
    );
  };

  const renderPopularSearches = () => {
    return (
      <List
        sx={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        {tagDuplicateCount(allTags)
          .slice(0, 4)
          .map((item) => (
            <ListItem key={item} sx={{p: 0, width: 'auto'}}>
              <Chip
                variant="outlined"
                color="primary"
                key={item}
                label={item}
                onClick={() => handleClickTag(item)}
                size="small"
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
      <Container maxWidth="sm">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
          sx={{pt: '100px', position: 'sticky'}}
        >
          <Grid item xs={true}>
            <TextField
              fullWidth
              id="filled-search"
              label="Search by keyword"
              placeholder="Search by keyword"
              type="search"
              variant="outlined"
              // validators={searchValidators.search}
              // errorMessages={searchErrorMessages.search}
              onChange={handleChange}
              value={searchQuery}
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              variant="contained"
              aria-label="Search"
              onClick={handleClick}
              sx={{
                borderRadius: '0.75rem',
                minWidth: '56px',
                width: '56px',
                py: '16px',
              }}
              size="large"
            >
              <SearchRounded />
            </Button>
          </Grid>
        </Grid>
        {!searchQuery && (
          <Grid
            container
            direction={smallScreen ? 'column' : 'row'}
            spacing={4}
            sx={{pt: '2rem', justifyContent: !user && 'center'}}
          >
            <Grid item xs={6}>
              <Typography component="h2" variant="h3" align="center">
                Your latest searches
              </Typography>
              {renderSearchHistory()}
            </Grid>
            {/* if not logged in, don't show this */}
            {user && (
              <Grid item xs={6}>
                <Typography component="h2" variant="h3" align="center">
                  Popular keywords
                </Typography>
                {fetchOk && renderPopularSearches()}
              </Grid>
            )}
          </Grid>
        )}
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
