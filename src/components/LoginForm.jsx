import PropTypes from 'prop-types';

const LoginForm = (props) => {
  return (
    <>
      <form>
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <input name="email" type="email" placeholder="Email" />
        <input name="full_name" placeholder="Full name" />
      </form>
    </>
  );
};

LoginForm.propTypes = {};

export default LoginForm;
