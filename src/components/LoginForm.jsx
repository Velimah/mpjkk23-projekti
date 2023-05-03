import useForm from '../hooks/FormHooks';
import {useAuthentication} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {useContext, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {loginValidators} from '../utils/validator';
import {loginErrorMessages} from '../utils/errorMessages';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import {InputAdornment, IconButton, Button} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';

const LoginForm = () => {
  const {setUser, setToastSnackbar, setToastSnackbarOpen} =
    useContext(MediaContext);
  const {postLogin} = useAuthentication();
  const [showPassword, setShowPassword] = useState(false);
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
      setToastSnackbar({severity: 'success', message: loginResult.message});
      setToastSnackbarOpen(true);
      navigate('/');
    } catch (error) {
      setToastSnackbar({severity: 'error', message: error.message});
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doLogin,
    initValues
  );

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <ValidatorForm onSubmit={handleSubmit}>
        <TextValidator
          fullWidth
          margin="dense"
          name="username"
          placeholder="Username"
          label="Username"
          onChange={handleInputChange}
          value={inputs.username}
          validators={loginValidators.username}
          errorMessages={loginErrorMessages.username}
          sx={{mb: 3}}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          label="Password"
          onChange={handleInputChange}
          value={inputs.password}
          validators={loginValidators.password}
          errorMessages={loginErrorMessages.password}
          sx={{mb: 3}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{mt: 1}}
          size="large"
        >
          Login
        </Button>
      </ValidatorForm>
    </>
  );
};

export default LoginForm;
