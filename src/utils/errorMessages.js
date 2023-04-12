const registerErrorMessages = {
  username: [
    'this field is required',
    'minimum 3 characters',
    'username not available',
  ],
  password: ['this field is required', 'minimum 5 characters'],
  confirmPassword: ['this field is required', 'passwords do not match'],
  email: ['this field is required', 'email is not valid'],
  fullName: ['minimum 2 characters'],
};

const loginErrorMessages = {
  username: ['this field is required', 'minimum 3 characters'],
  password: ['this field is required', 'minimum 5 characters'],
};

const uploadErrorMessages = {
  title: ['this field is required', 'minimum 3 characters'],
  description: ['minimum 3 characters'],
};

export {registerErrorMessages, loginErrorMessages, uploadErrorMessages};
