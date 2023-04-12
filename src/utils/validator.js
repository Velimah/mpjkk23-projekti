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

const uploadValidators = {
  title: ['required', 'minStringLength:2'],
  description: ['minStringLength:2'],
};

export {registerValidators, loginValidators, uploadValidators};
