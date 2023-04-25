import {useState, useEffect, useContext} from 'react';
import {calculateTokenCost} from '../utils/UnitConversions';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import {MediaContext} from '../contexts/MediaContext';

const CatGPT = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [responseData, setRestponseData] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const [cost, setCost] = useState(0);
  const {user} = useContext(MediaContext);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  };

  const getMessages = async () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
    }, 5000);
    const catValue = 'Add a cat pun to the answer:' + value;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: catValue,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        'https://cat-gpt4.herokuapp.com/completions',
        options
      );
      const data = await response.json();
      console.log(data);
      setMessage(data.choices[0].message);
      setRestponseData(data);
      const newCost = parseFloat(
        calculateTokenCost(
          data.usage.completion_tokens,
          data.usage.prompt_tokens
        )
      );
      const addedCost = newCost + cost;
      setCost(addedCost);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const scrollPage = () => {
    const element = document.querySelector('.scroller');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollPage();
    }, 1000);
  }, [responseData]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="nowrap"
        sx={{
          height: '100vh',
          width: '100%',
          maxWidth: '1200px',
          position: 'absolute',
          top: {xs: '55%', sm: '58%'},
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pb: 10,
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            height: '100%',
            width: '200px',
            display: {xs: 'none', sm: 'none', md: 'block'},
          }}
          pl={1}
        >
          <Button
            sx={{mt: 9, mb: 4, width: '180px'}}
            variant="contained"
            onClick={createNewChat}
          >
            New chat
          </Button>
          {uniqueTitles?.length > 0 && (
            <Typography component="p" variant="h6" sx={{}}>
              Chats
            </Typography>
          )}
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              height: 'fit-content',
              width: '184px',
              m: 1,
              textAlign: 'left',
            }}
          >
            {uniqueTitles?.map((uniqueTitle, index) => (
              <ListItem
                component="li"
                variant="h6"
                sx={{
                  backgroundColor: '#ACCC7F',
                  borderRadius: '5px',
                  '&:hover': {
                    backgroundColor: '#8FB361',
                  },
                  mb: 1,
                }}
                key={index}
                onClick={() => handleClick(uniqueTitle)}
              >
                {uniqueTitle}
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          textAlign="center"
          flexWrap="nowrap"
          sx={{
            height: '90vh',
            width: '100%',
            maxWidth: '1000px',
            px: 2,
          }}
        >
          <Typography
            component="h1"
            variant={!currentTitle ? 'h1' : 'h2'}
            sx={{textAlign: 'center', my: 2}}
          >
            {!currentTitle ? 'Cat-GPT' : currentTitle}
          </Typography>
          <List
            sx={{
              overflowY: 'scroll',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              borderRadius: '5px 5px 0 0',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
            }}
            className="feed"
          >
            <Box className="scroller">
              {currentChat?.map((chat, index) => (
                <ListItem
                  sx={{
                    backgroundColor:
                      chat.role === 'assistant' ? '#F4DCE1' : '#F4DCE1',
                    padding: '20px',
                    marginTop: '20px',
                    alignItems: 'start',
                    borderRadius: '5px',
                    display: {xs: 'block'},
                  }}
                  key={index}
                >
                  <Typography
                    variant="Body1"
                    component="p"
                    sx={{
                      minWidth: '120px',
                      height: '100%',
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }}
                  >
                    {chat.role === 'assistant' ? 'Mr. Mittens' : user.username}
                  </Typography>
                  <Typography
                    component="p"
                    variant="body1"
                    sx={{textAlign: 'left', margin: '0 10px'}}
                  >
                    {chat.content}
                  </Typography>
                </ListItem>
              ))}
            </Box>
          </List>
          <Box display="flex" flexDirection="column" width="100%">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              sx={{
                borderTop: 'solid 0.5px black',
                pt: 2,
                display: {xs: 'block', sm: 'flex'},
              }}
            >
              <TextField
                className="text-field"
                multiline
                maxRows={4}
                fullWidth
                variant="outlined"
                label="Ask Mr. Mittens a question!"
                type="text"
                sx={{
                  m: 0,
                  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
                sx={{
                  justifyContent: {xs: 'center', sm: 'flex-end'},
                  alignContent: {xs: 'center', sm: 'flex-end'},
                }}
              >
                <Button
                  sx={{
                    backgroundColor: messageSent ? 'red' : '',
                    '&:hover': {
                      backgroundColor: messageSent ? 'crimson' : '',
                    },
                    mt: {xs: 1, sm: 0},
                    ml: {xs: 0, sm: 2},
                    width: {xs: '200px', sm: '150px'},
                  }}
                  variant="contained"
                  id="submit"
                  onClick={getMessages}
                >
                  {messageSent ? 'Sent!' : 'Submit'}
                </Button>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                component="p"
                variant="h6"
                sx={{
                  textAlign: 'center',
                  mx: {xs: 2, sm: 1},
                  py: {xs: 2, sm: 1},
                }}
              >
                {responseData
                  ? `Responding model: ${responseData.model}`
                  : null}
              </Typography>
              <Typography
                component="p"
                variant="h6"
                sx={{
                  textAlign: 'center',
                  mx: {xs: 2, sm: 1},
                  py: {xs: 2, sm: 1},
                  variant: {xs: 'body1', sm: 'h6'},
                  color: cost < 0.01 ? '#6B8B4D' : '#9E0022',
                  borderRadius: '5px',
                  p: 1,
                  '&:hover': {
                    textShadow:
                      cost < 0.01
                        ? '0px 0px 1px #6B8B4D'
                        : '0px 0px 1px #9E0022',
                  },
                }}
              >
                {'Total cost: ' + cost.toFixed(4) + '$'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CatGPT;
