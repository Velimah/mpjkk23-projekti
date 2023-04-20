import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useState} from 'react';
import {Button, Grid, Typography, Container} from '@mui/material';

const Login = () => {
  const [formToggle, setFormToggle] = useState(true);

  const toggle = () => {
    setFormToggle(!formToggle);
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      sx={{
        backgroundColor: {sm: '#E3A7B6'},
        minHeight: {sm: 'calc(100vh - 4rem)'},
      }}
    >
      <Container maxWidth="lg" sx={{display: 'flex', justifyContent: 'center'}}>
        <Grid
          item
          xs={5}
          alignSelf="center"
          sx={{display: {xs: 'none', md: 'inline-block'}}}
        >
          <img
            src={'/src/assets/onlycats_illustration2.png'}
            alt={'Cat illustration'}
            loading="lazy"
            width="100%"
            style={{maxWidth: '450px'}}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            borderRadius: {xs: 0, sm: '25px'},
            backgroundColor: '#FDF7F4',
            boxShadow: {xs: 0, sm: 3},
            p: {xs: 0, sm: '2rem'},
            m: {xs: '8rem 0', sm: '0 1rem'},
            maxWidth: {sm: '480px'},
          }}
        >
          <Grid item xs={12} textAlign="center" sx={{mb: 3}}>
            <Typography component="h1" variant="h1">
              {formToggle
                ? 'Log in to OnlyCats'
                : 'Create an account to OnlyCats'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {formToggle ? <LoginForm /> : <RegisterForm toggle={toggle} />}
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="body1" sx={{mt: 1}}>
              {formToggle
                ? "Don't have an account?"
                : 'Already have an account'}
              <Button large onClick={toggle}>
                {formToggle ? 'Register' : 'Login'}
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Login;
