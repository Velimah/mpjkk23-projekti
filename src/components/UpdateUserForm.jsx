import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {Button, Grid} from '@mui/material';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {updateUserErrorMessages} from '../utils/errorMessages';
import {updateUserValidators} from '../utils/validator';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const UpdateUserForm = () => {
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
        if (withoutConfirm.username === '') {
          delete withoutConfirm.username;
        }
        if (withoutConfirm.password === '') {
          delete withoutConfirm.password;
        }
        if (withoutConfirm.email === '') {
          delete withoutConfirm.email;
        }
        if (withoutConfirm.full_name === '') {
          delete withoutConfirm.full_name;
        }
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
      if (value === '') return true;
      try {
        return await getCheckUser(inputs.username);
      } catch (e) {
        alert(e.message);
      }
    });
    ValidatorForm.addValidationRule('isEmptyOrMin5', (value) => {
      return value === '' || value.length >= 5;
    });
    ValidatorForm.addValidationRule('isEmptyOrMin3', (value) => {
      return value === '' || value.length >= 3;
    });
    ValidatorForm.addValidationRule('isEmptyOrMin2', (value) => {
      return value === '' || value.length >= 2;
    });
  }, [inputs]);

  return (
    <>
    <Grid container direction={'column'} sx={{maxWidth:'sm', mt:5 }}>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <TextValidator
          fullWidth
          margin="dense"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
          value={inputs.username}
          validators={updateUserValidators.username}
          errorMessages={updateUserErrorMessages.username}
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
          errorMessages={updateUserErrorMessages.password}
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
          errorMessages={updateUserErrorMessages.confirmPassword}
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
          errorMessages={updateUserErrorMessages.email}
        />
        <TextValidator
          fullWidth
          margin="dense"
          name="full_name"
          placeholder="Full name"
          onChange={handleInputChange}
          value={inputs.full_name}
          validators={updateUserValidators.fullName}
          errorMessages={updateUserErrorMessages.fullName}
        />
        <Button fullWidth variant="contained" sx={{mt: 1, mb: 1}} type="submit">
          Update user info
        </Button>
      </ValidatorForm>
      </Grid>
    </>
  );
};

export default UpdateUserForm;