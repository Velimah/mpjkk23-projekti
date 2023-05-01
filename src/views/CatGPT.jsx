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
  Container,
  Paper,
} from '@mui/material';
import {MediaContext} from '../contexts/MediaContext';

const CatGPT = () => {
  const [value, setValue] = useState('');
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
    const catValue =
      'Add a cat pun to the answer but answer factually: ' + value;
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
      setMessageSent(false);
    } catch (error) {
      console.error(error);
      setMessageSent(false);
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
    if (document.querySelector('.scroller')) {
      const element = document.querySelector('.scroller');
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollPage();
    }, 50);
  }, [responseData]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{p: {xs: '4rem 0', sm: '2rem 1rem', md: '2rem 3rem'}}}
      >
        <Typography
          component="h1"
          variant={!currentTitle ? 'h1' : 'h2'}
          sx={{textAlign: 'center', mb: 3}}
        >
          {!currentTitle ? 'Cat-GPT' : currentTitle}
        </Typography>
        <Paper
          sx={{
            p: {xs: 0, sm: '1rem', md: '1rem'},
            borderRadius: '1.5rem',
            bgcolor: {xs: 'transparent', sm: '#FFFFFF'},
            boxShadow: {
              xs: 'none',
              sm: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
            },
          }}
        >
          <Grid
            container
            direction="row"
            sx={{
              width: '100%',
              flexWrap: 'nowrap',
            }}
          >
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
              sx={{
                height: '70vh',
                maxWidth: '200px',
                display: {xs: 'none', sm: 'block'},
                pr: {xs: 1, sm: 3},
              }}
            >
              <Button
                sx={{width: '100%'}}
                variant="contained"
                onClick={createNewChat}
              >
                New chat
              </Button>
              {uniqueTitles?.length > 0 && (
                <Typography
                  component="p"
                  variant="h2"
                  sx={{textAlign: 'center', my: 3, width: '100%'}}
                >
                  Chats
                </Typography>
              )}
              <List
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  height: 'fit-content',
                  width: '100%',
                }}
              >
                {uniqueTitles?.map((uniqueTitle, index) => (
                  <ListItem
                    component="li"
                    variant="h6"
                    sx={{
                      backgroundColor: '#ACCC7F',
                      borderRadius: 2,
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
              sx={{
                height: {xs: '75vh', md: '70vh'},
                width: '100%',
                maxWidth: '1000px',
                flexWrap: 'nowrap',
              }}
            >
              <List
                sx={{
                  overflowY: 'scroll',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                  borderTopRightRadius: '0.5rem',
                  borderTopLeftRadius: '0.5rem',
                }}
                className="feed"
              >
                <Box className="scroller">
                  {currentChat?.map((chat, index) => (
                    <ListItem
                      sx={{
                        backgroundColor:
                          chat.role === 'assistant' ? '#F4DCE1' : '#F4DCE1',
                        p: 2,
                        mt: 2,
                        alignItems: 'start',
                        borderRadius: {xs: 0, sm: '0.5rem'},
                        display: {xs: 'block'},
                      }}
                      key={index}
                    >
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{
                          height: '100%',
                          textAlign: 'left',
                          fontSize: {xs: '0.9rem', sm: '1.1rem'},
                        }}
                      >
                        {chat.role === 'assistant'
                          ? 'Mr. Mittens'
                          : user.username}
                      </Typography>
                      <Typography
                        component="p"
                        variant="body1"
                        sx={{
                          textAlign: 'left',
                          margin: '0 10px',
                          fontSize: {xs: '0.8rem', sm: '1rem'},
                        }}
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
                    px: {xs: 4, sm: 0},
                    pt: 3,
                    display: {xs: 'block', md: 'flex'},
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
                      boxShadow:
                        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
                    }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <Button
                    sx={{
                      backgroundColor: messageSent ? '#ACCC7F' : '',
                      color: messageSent ? '#000000' : '',
                      '&:hover': {
                        backgroundColor: messageSent ? '#8FB361' : '',
                        color: messageSent ? '#000000' : '',
                      },
                      mt: {xs: 2, md: 0},
                      ml: {xs: 0, md: 2},
                      width: {xs: '100%', md: '200px'},
                    }}
                    variant="contained"
                    id="submit"
                    onClick={getMessages}
                  >
                    {messageSent ? 'Submitted!' : 'Submit'}
                  </Button>
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    flexDirection: {xs: 'column', md: 'row'},
                    display: {xs: 'none', md: 'flex'},
                  }}
                >
                  <Typography
                    component="p"
                    variant="body1"
                    sx={{
                      textAlign: 'center',
                      p: 1,
                      display: {xs: 'block', sm: 'block'},
                      fontSize: {xs: '0.9rem', sm: '1.1rem'},
                    }}
                  >
                    {responseData ? `Model: ${responseData.model}` : null}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{
                      textAlign: 'center',
                      p: {xs: 0, md: 1},
                      fontSize: {xs: '0.9rem', sm: '1.1rem'},
                      color: cost < 0.01 ? '#6B8B4D' : '#9E0022',
                    }}
                  >
                    {responseData
                      ? 'Total cost: ' + cost.toFixed(4) + '$'
                      : null}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default CatGPT;
