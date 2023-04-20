import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {Button} from '@mui/material';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {registerErrorMessages} from '../utils/errorMessages';
import {registerValidators} from '../utils/validator';
import {useEffect} from 'react';

const RegisterForm = ({toggle}) => {
  const {postUser, getCheckUser} = useUser();

  const initValues = {
    username: '',
    password: '',
    confirm: '',
    email: '',
    full_name: '',
  };

  const doRegister = async () => {
    try {
      const withoutConfirm = {...inputs};
      delete withoutConfirm.confirm;
      const userResult = await postUser(withoutConfirm);
      alert(userResult.message);
      toggle();
    } catch (e) {
      alert(e.message);
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
      } catch (e) {
        alert(e.message);
      }
    });
    ValidatorForm.addValidationRule('isEmptyOrMin2', (value) => {
      return value === '' || value.length >= 2;
    });
  }, [inputs]);

  return (
    <>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <TextValidator
          fullWidth
          margin="dense"
          name="username"
          label="Username"
          onChange={handleInputChange}
          value={inputs.username}
          validators={registerValidators.username}
          errorMessages={registerErrorMessages.username}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="password"
          type="password"
          label="Password"
          onChange={handleInputChange}
          value={inputs.password}
          validators={registerValidators.password}
          errorMessages={registerErrorMessages.password}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="confirm"
          type="password"
          label="Confirm password"
          onChange={handleInputChange}
          value={inputs.confirm}
          validators={registerValidators.confirmPassword}
          errorMessages={registerErrorMessages.confirmPassword}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="email"
          type="email"
          label="Email"
          onChange={handleInputChange}
          value={inputs.email}
          validators={registerValidators.email}
          errorMessages={registerErrorMessages.email}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="full_name"
          label="Full name"
          onChange={handleInputChange}
          value={inputs.full_name}
          validators={registerValidators.fullName}
          errorMessages={registerErrorMessages.fullName}
        />
        <Button fullWidth variant="contained" sx={{mt: 1, mb: 1}} type="submit">
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
