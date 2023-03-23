import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = (props) => {
  return (
    <>
      <LoginForm />
      <RegisterForm />
    </>
  );
};

Login.propTypes = {};

export default Login;
