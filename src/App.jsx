import './App.css';
import {Routes, Route, HashRouter} from 'react-router-dom';
import Home from './views/Home';
import Layout from './views/Layout';
import Single from './views/Single';
import Profile from './views/Profile';
import Login from './views/Login';
import Logout from './views/Logout';
import Upload from './views/Upload';
import Modify from './views/Modify';
import UpdateUserInfo from './views/UpdateUserInfo';
import Search from './views/Search';
import Liked from './views/Liked';
import UserProfiles from './views/UserProfiles';
import CatGPT from './views/CatGPT';
import ScrollToTop from './hooks/ScrollHook';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/single" element={<Single />} />
          <Route path="/search" element={<Search />} />
          <Route path="/userprofiles" element={<UserProfiles />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/liked"
            element={
              <ProtectedRoute>
                <Liked />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/update"
            element={
              <ProtectedRoute>
                <UpdateUserInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modify"
            element={
              <ProtectedRoute>
                <Modify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catgpt"
            element={
              <ProtectedRoute>
                <CatGPT />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
