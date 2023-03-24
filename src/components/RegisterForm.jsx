import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';

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
        <input
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
          value={inputs.username}
          onBlur={handleUsername}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={inputs.password}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={inputs.email}
        />
        <input
          name="full_name"
          placeholder="Full name"
          onChange={handleInputChange}
          value={inputs.full_name}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

RegisterForm.propTypes = {};

export default RegisterForm;
