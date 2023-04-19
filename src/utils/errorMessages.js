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

const updateUserErrorMessages = {
  username: [
    'minimum 3 characters',
    'username not available',
  ],
  password: ['minimum 5 characters'],
  confirmPassword: ['passwords do not match'],
  email: ['email is not valid'],
  fullName: ['minimum 2 characters', 'incorrect symbols'],
};

const loginErrorMessages = {
  username: ['this field is required', 'minimum 3 characters'],
  password: ['this field is required', 'minimum 5 characters'],
};

const uploadErrorMessages = {
  title: ['this field is required', 'minimum 2 characters'],
  description: ['minimum 2 characters'],
};

const commentErrorMessages = {
  comment: ['Comment required', 'minimum 1 character', 'maximum 1000 characters'],
};

export {registerErrorMessages, updateUserErrorMessages, loginErrorMessages, uploadErrorMessages, commentErrorMessages};
