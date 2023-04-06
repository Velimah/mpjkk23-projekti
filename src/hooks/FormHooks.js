import {useState} from 'react';

const useForm = (callback, initState) => {
  const [inputs, setInputs] = useState(initState);
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  const handleInputChange = (event) => {
    event.persist && event.persist();
    setInputs((inputs) => {
      return {...inputs, [event.target.name]: event.target.value};
    });
  };
  return {inputs, handleSubmit, handleInputChange};
};

export default useForm;
