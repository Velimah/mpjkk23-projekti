import {useState, useEffect} from 'react';
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

const CatGPT = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [responseData, setRestponseData] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

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
    const catValue = /* "Answer like a cat:" + */ value;
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
      setMessageSent(false);
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
      inline: 'nearest',
    });
  };

  useEffect(() => {
    scrollPage();
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
        style={{
          height: '80vh',
          width: '100%',
          maxWidth: '1000px',
          margin: 'auto',
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
          }}
        >
          <Button sx={{mt: 15}} variant="contained" onClick={createNewChat}>
            New chat
          </Button>
          <List sx={{height: 'fit-content'}}>
            {uniqueTitles?.map((uniqueTitle, index) => (
              <ListItem
                component="h4"
                variant="h6"
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
            height: '80vh',

            width: '100%',
            maxWidth: '800px',
          }}
        >
          <Typography
            component="h1"
            variant={!currentTitle ? 'h3' : 'h4'}
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
            }}
          >
            <Box className="scroller">
              {currentChat?.map((chat, index) => (
                <ListItem
                  sx={{
                    backgroundColor:
                      chat.role === 'assistant' ? 'pink' : 'turquoise',
                    padding: '20px',
                    margin: '20px 0',
                  }}
                  key={index}
                >
                  <Typography sx={{minWidth: '100px', height: '100%'}}>
                    {chat.role === 'assistant' ? 'Mr. Mittens' : chat.role}
                  </Typography>
                  <Typography sx={{textAlign: 'left', margin: '0 10px'}}>
                    {chat.content}
                  </Typography>
                </ListItem>
              ))}
            </Box>
          </List>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            sx={{borderTop: 'solid 0.5px black', pt: 2}}
          >
            <TextField
              multiline
              maxRows={4}
              fullWidth
              variant="outlined"
              label="Ask Mr. Mittens a question!"
              type="text"
              sx={{mx: 2}}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
              <Button
                sx={{
                  backgroundColor: messageSent ? 'red' : '',
                  mr: 2,
                }}
                variant="contained"
                id="submit"
                onClick={getMessages}
              >
                {messageSent ? 'Sent!' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Typography component="h2" variant="h5" sx={{textAlign: 'center', my: 2}}>
        {responseData ? `Model: ${responseData.model}` : null}
      </Typography>
    </>
  );
};

export default CatGPT;
