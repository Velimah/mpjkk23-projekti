const registerValidators = {
  username: ['required', 'minStringLength:3', 'isUsernameAvailable'],
  password: ['required', 'minStringLength:5'],
  confirmPassword: ['required', 'isPasswordMatch'],
  email: ['required', 'isEmail'],
  fullName: ['isEmptyOrMin2', 'matchRegexp:^(.{2,})?$'],
};

const updateUserValidators = {
  username: ['isEmptyOrMin3', 'isUsernameAvailable'],
  password: ['isEmptyOrMin5'],
  confirmPassword: ['isPasswordMatch'],
  email: ['isEmail'],
  fullName: ['isEmptyOrMin2', 'matchRegexp:^(.{2,})?$'],
};

const loginValidators = {
  username: ['required'],
  password: ['required'],
};

const uploadValidators = {
  title: ['required', 'minStringLength:2'],
  description: ['isEmptyOrMin2'],
};

const commentValidators = {
  comment: ['required', 'minStringLength:1', 'maxStringLength: 1000'],
};

export {registerValidators, updateUserValidators, loginValidators, uploadValidators, commentValidators};
