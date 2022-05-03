import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './page/Home';
import SignUp from './page/SignUp';
import MyPage from './page/MyPage';

const App = () => {
  return (
    <div>
      <Link to ="/"><button>HOME</button></Link>
      <Link to ="/signup"><button>SIGNUP</button></Link>
      <Link to ="/mypage"><button>MYPAGE</button></Link>
      <Routes>
        <Route path="/" element={<Home />} exact={true} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  );
};

export default App;
