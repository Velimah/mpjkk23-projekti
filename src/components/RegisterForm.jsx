import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {InputAdornment, IconButton, Button} from '@mui/material';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {registerErrorMessages} from '../utils/errorMessages';
import {registerValidators} from '../utils/validator';
import {useContext, useEffect, useState} from 'react';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {MediaContext} from '../contexts/MediaContext';

const RegisterForm = ({toggle}) => {
  const {postUser, getCheckUser} = useUser();
  const {setToastSnackbar, setToastSnackbarOpen} = useContext(MediaContext);
  const [showPassword, setShowPassword] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const initValues = {
    username: '',
    password: '',
    confirm: '',
    email: '',
    full_name: '',
  };

  const doRegister = async () => {
    try {
      setMessageSent(true);
      const withoutConfirm = {...inputs};
      delete withoutConfirm.confirm;
      const userResult = await postUser(withoutConfirm);
      setToastSnackbar({severity: 'success', message: userResult.message});
      setToastSnackbarOpen(true);
      setMessageSent(false);
      toggle();
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: error.message,
      });
      setMessageSent(false);
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doRegister,
    initValues
  );

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return value === inputs.password;
    });

    ValidatorForm.addValidationRule('isUsernameAvailable', async (value) => {
      try {
        return await getCheckUser(inputs.username);
      } catch (error) {
        console.error(error.message);
      }
    });
    ValidatorForm.addValidationRule('isEmptyOrMin2', (value) => {
      return value === '' || value.length >= 2;
    });
  }, [inputs]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <TextValidator
          fullWidth
          margin="dense"
          name="full_name"
          placeholder="Name"
          inputProps={{
            autoCapitalize: 'none',
          }}
          label="Name"
          onChange={handleInputChange}
          value={inputs.full_name}
          validators={registerValidators.fullName}
          errorMessages={registerErrorMessages.fullName}
          sx={{mb: 3}}
        />
        <TextValidator
          fullWidth
          margin="dense"
          inputProps={{
            autoCapitalize: 'none',
          }}
          name="username"
          placeholder="Username"
          label="Username"
          onChange={handleInputChange}
          value={inputs.username}
          validators={registerValidators.username}
          errorMessages={registerErrorMessages.username}
          sx={{mb: 3}}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="email"
          type="email"
          placeholder="Email"
          label="Email"
          onChange={handleInputChange}
          value={inputs.email}
          validators={registerValidators.email}
          errorMessages={registerErrorMessages.email}
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
          validators={registerValidators.password}
          errorMessages={registerErrorMessages.password}
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
        <TextValidator
          fullWidth
          margin="dense"
          name="confirm"
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm password"
          label="Confirm password"
          onChange={handleInputChange}
          value={inputs.confirm}
          validators={registerValidators.confirmPassword}
          errorMessages={registerErrorMessages.confirmPassword}
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
          sx={{
            backgroundColor: messageSent ? '#ACCC7F' : '',
            color: messageSent ? '#000000' : '',
            '&:hover': {
              backgroundColor: messageSent ? '#8FB361' : '',
              color: messageSent ? '#000000' : '',
            },
            mt: 1,
          }}
          variant="contained"
          type="submit"
          size="large"
        >
          Register
        </Button>
      </ValidatorForm>
    </>
  );
};

RegisterForm.propTypes = {
  toggle: PropTypes.func,
};

export default RegisterForm;
