import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useState} from 'react';
import {Button, Grid, Typography} from '@mui/material';

const Login = (props) => {
  const [formToggle, setFormToggle] = useState(true);

  const toggle = () => {
    setFormToggle(!formToggle);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={6}>
        <Typography component="h1" variant="h2">
          Login / Register
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {formToggle ? <LoginForm /> : <RegisterForm />}
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" onClick={toggle}>
          {formToggle ? 'Register' : 'Login'}
        </Button>
      </Grid>
    </Grid>
  );
};

Login.propTypes = {};

export default Login;
