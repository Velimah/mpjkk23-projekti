import './App.css';
import Home from './views/Home';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './views/Layout';
import Single from './views/Single';
import Profile from './views/Profile';
import Login from './views/Login';
import Logout from './views/Logout';
import Upload from './views/Upload';
import {MediaProvider} from './contexts/MediaContext';
import MyFiles from './views/MyFiles';
import Modify from './views/Modify';
import UpdateUserInfo from './views/UpdateUserInfo';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <MediaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/single" element={<Single />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/update" element={<UpdateUserInfo />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/myfiles" element={<MyFiles />} />
            <Route path="/modify" element={<Modify />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </MediaProvider>
    </Router>
  );
};

export default App;
