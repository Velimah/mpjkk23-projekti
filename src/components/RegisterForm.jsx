import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {Button, TextField} from '@mui/material';

const RegisterForm = (props) => {
  const {postUser, getCheckUser} = useUser();

  const initValues = {
    username: '',
    password: '',
    email: '',
    full_name: '',
  };

  const doRegister = async () => {
    try {
      const userResult = await postUser(inputs);
      alert(userResult.message);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUsername = async () => {
    try {
      const userNameResult = await getCheckUser(inputs.username);
      console.log(userNameResult);
      userNameResult.available || alert('Username already exists');
    } catch (e) {
      alert(e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doRegister,
    initValues
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
          value={inputs.username}
          onBlur={handleUsername}
        />
        <TextField
          fullWidth
          margin="dense"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={inputs.password}
        />
        <TextField
          fullWidth
          margin="dense"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={inputs.email}
        />
        <TextField
          fullWidth
          margin="dense"
          name="full_name"
          placeholder="Full name"
          onChange={handleInputChange}
          value={inputs.full_name}
        />
        <Button fullWidth variant="contained" sx={{mt: 1, mb: 1}} type="submit">
          Register
        </Button>
      </form>
    </>
  );
};

RegisterForm.propTypes = {};

export default RegisterForm;
