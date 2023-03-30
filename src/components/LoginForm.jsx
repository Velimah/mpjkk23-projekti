import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useAuthentication} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';

const LoginForm = (props) => {
  const [user, setUser] = useContext(MediaContext);
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
