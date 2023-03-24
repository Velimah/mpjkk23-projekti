import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';

const LoginForm = (props) => {
  const initValues = {
    username: '',
    password: '',
  };

  const doLogin = () => {
    console.log('submitted', inputs);
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doLogin,
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
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={inputs.password}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

LoginForm.propTypes = {};

export default LoginForm;
