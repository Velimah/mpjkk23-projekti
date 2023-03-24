import {useUser} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';

const Profile = () => {
  const [user, setUser] = useState({});
  const {getUserByToken} = useUser();

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    const user = await getUserByToken(userToken);
    setUser(user);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>Full name: {user.full_name}</p>
      <p>Email: {user.email}</p>
    </>
  );
};

export default Profile;
