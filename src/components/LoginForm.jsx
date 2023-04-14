import useForm from '../hooks/FormHooks';
import {useAuthentication} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import Button from '@mui/material/Button';
import {loginValidators} from '../utils/validator';
import {loginErrorMessages} from '../utils/errorMessages';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';

const LoginForm = () => {
  const {setUser} = useContext(MediaContext);
  const {postLogin} = useAuthentication();
  const navigate = useNavigate();

  const initValues = {
    username: '',
    password: '',
  };

  const doLogin = async () => {
    try {
      const loginResult = await postLogin(inputs);
      localStorage.setItem('token', loginResult.token);
      setUser(loginResult.user);
      navigate('/home');
    } catch (e) {
      alert(e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doLogin,
    initValues
  );

  return (
    <>
      <ValidatorForm onSubmit={handleSubmit}>
        <TextValidator
          fullWidth
          margin="dense"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
          value={inputs.username}
          validators={loginValidators.username}
          errorMessages={loginErrorMessages.username}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={inputs.password}
          validators={loginValidators.password}
          errorMessages={loginErrorMessages.password}
        />
        <Button fullWidth sx={{mt: 1, mb: 1}} variant="contained" type="submit">
          Login
        </Button>
      </ValidatorForm>
    </>
  );
};

export default LoginForm;
