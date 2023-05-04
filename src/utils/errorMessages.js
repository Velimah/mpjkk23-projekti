const registerErrorMessages = {
  username: [
    'This field is required',
    'Minimum 3 characters',
    'Username not available',
  ],
  password: ['This field is required', 'Minimum 5 characters'],
  confirmPassword: ['This field is required', 'Passwords do not match'],
  email: ['This field is required', 'Email is not valid'],
  fullName: ['Minimum 2 characters'],
};

const updateUserErrorMessages = {
  username: ['Minimum 3 characters', 'Username not available'],
  password: ['Minimum 5 characters'],
  confirmPassword: ['Passwords do not match'],
  email: ['Email is not valid'],
  fullName: ['Minimum 2 characters', 'Incorrect symbols'],
};

const updateProfilePictureErrorMessages = {
  description: ['Minimum 2 characters', 'Maximum 750 characters'],
};

const loginErrorMessages = {
  username: ['This field is required', 'Minimum 3 characters'],
  password: ['This field is required', 'Minimum 5 characters'],
};

const uploadErrorMessages = {
  title: ['This field is required', 'Minimum 2 characters'],
  description: ['Minimum 2 characters'],
  file: ['A file is required'],
};

const commentErrorMessages = {
  comment: ['Comment required', 'Maximum 1000 characters'],
};

const searchErrorMessages = {
  search: ['Use only one word with only characters from the alphabet'],
};

export {
  registerErrorMessages,
  updateUserErrorMessages,
  loginErrorMessages,
  uploadErrorMessages,
  commentErrorMessages,
  updateProfilePictureErrorMessages,
  searchErrorMessages,
};
