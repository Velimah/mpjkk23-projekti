import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {Button} from '@mui/material';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {mofidyUserErrorMessages} from '../utils/errorMessages';
import {updateUserValidators} from '../utils/validator';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const ModifyUserForm = () => {
  const {putUser, getCheckUser} = useUser();
  const navigate = useNavigate();

  const initValues = {
    username: '',
    password: '',
    confirm: '',
    email: '',
    full_name: '',
  };

  const DoModify = async () => {
    try {
      const token = localStorage.getItem('token');
      const withoutConfirm = {...inputs};
      delete withoutConfirm.confirm;
      console.log(withoutConfirm);
      const userResult = await putUser(withoutConfirm, token);
      alert(userResult.message);
      navigate(0);
    } catch (e) {
      alert(e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    DoModify,
    initValues
  );

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return value === inputs.password;
    });

    ValidatorForm.addValidationRule('isUsernameAvailable', async (value) => {
      try {
        console.log(inputs.username);
        return await getCheckUser(inputs.username);
      } catch (e) {
        alert(e.message);
      }
    });
  }, [inputs]);

  return (
    <>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <TextValidator
          fullWidth
          margin="dense"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
          value={inputs.username}
          validators={updateUserValidators.username}
          errorMessages={mofidyUserErrorMessages.username}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={inputs.password}
          validators={updateUserValidators.password}
          errorMessages={mofidyUserErrorMessages.password}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="confirm"
          type="password"
          placeholder="Confirm password"
          onChange={handleInputChange}
          value={inputs.confirm}
          validators={updateUserValidators.confirmPassword}
          errorMessages={mofidyUserErrorMessages.confirmPassword}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={inputs.email}
          validators={updateUserValidators.email}
          errorMessages={mofidyUserErrorMessages.email}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="full_name"
          placeholder="Full name"
          onChange={handleInputChange}
          value={inputs.full_name}
          validators={updateUserValidators.fullName}
          errorMessages={mofidyUserErrorMessages.fullName}
        />
        <Button fullWidth variant="contained" sx={{mt: 1, mb: 1}} type="submit">
          Update user info
        </Button>
      </ValidatorForm>
    </>
  );
};

export default ModifyUserForm;