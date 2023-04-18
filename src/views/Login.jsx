import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useState} from 'react';
import {Button, Grid, Typography} from '@mui/material';
import {Box} from '@mui/system';

const Login = () => {
  const [formToggle, setFormToggle] = useState(true);

  const toggle = () => {
    setFormToggle(!formToggle);
  };

  return (
    <Box sx={{maxWidth: 'sm', margin: 'auto'}}>
      <Grid container justifyContent="center">
        <Grid item xs={12} textAlign="center" sx={{my: 6}}>
          <Typography component="h1" variant="h2">
            {formToggle ? 'Login' : 'Register'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {formToggle ? <LoginForm /> : <RegisterForm toggle={toggle} />}
        </Grid>
        <Grid
          item
          xs={12}
          textAlign="center"
          sx={{mt: 1, mb: 1, typography: 'body1'}}
        >
          {formToggle ? 'Need to register?' : 'Want to log in?'}
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button onClick={toggle}>{formToggle ? 'Register' : 'Login'}</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
