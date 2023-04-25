import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './views/Home';
import Layout from './views/Layout';
import Single from './views/Single';
import Profile from './views/Profile';
import Login from './views/Login';
import Logout from './views/Logout';
import Upload from './views/Upload';
import {MediaProvider} from './contexts/MediaContext';
import Modify from './views/Modify';
import UpdateUserInfo from './views/UpdateUserInfo';
import Search from './views/Search';
import Liked from './views/Liked';
import UserProfiles from './views/UserProfiles';
import CatGPT from './views/CatGPT';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <MediaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/single" element={<Single />} />
            <Route path="/search" element={<Search />} />
            <Route path="/Liked" element={<Liked />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/update" element={<UpdateUserInfo />} />
            <Route path="/userprofiles" element={<UserProfiles />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/modify" element={<Modify />} />
            <Route path="/catgpt" element={<CatGPT />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </MediaProvider>
    </Router>
  );
};

export default App;
