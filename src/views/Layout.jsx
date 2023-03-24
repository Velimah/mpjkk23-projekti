import {Link, Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';
import {useEffect} from 'react';

const Layout = () => {
  const {getUserByToken} = useUser();
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      console.log(userToken);
      const user = await getUserByToken(userToken);
      if (user) {
        const target = location.pathname === '/' ? '/home' : location.pathname;
        navigate(target);
        return;
      }
    }
    navigate('/');
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
