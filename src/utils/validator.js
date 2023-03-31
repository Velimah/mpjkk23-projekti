const registerValidators = {
  username: ['required', 'minStringLength:3', 'isUsernameAvailable'],
  password: ['required', 'minStringLength:5'],
  confirmPassword: ['required', 'isPasswordMatch'],
  email: ['required', 'isEmail'],
  fullName: ['matchRegexp:^(.{2,})?$'],
};

const loginValidators = {
  username: ['required'],
  password: ['required'],
};

export {registerValidators, loginValidators};
