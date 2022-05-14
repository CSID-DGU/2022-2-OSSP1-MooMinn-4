import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import FindPW from './pages/FindPW';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';
import Input from './pages/Input';
import Result from './pages/Result';
import Stats from './pages/Stats';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: "'NanumSquare', 'SsangMun', sans-serif"
  }
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Link to ="/"><button>HOME</button></Link>
        <Link to ="/signin"><button>SIGNIN</button></Link>
        <Link to ="/findpw"><button>FINDPW</button></Link>
        <Link to ="/signup"><button>SIGNUP</button></Link>
        <Link to ="/mypage"><button>MYPAGE</button></Link>
        <Link to ="/input"><button>INPUT</button></Link>
        <Link to ="/result"><button>RESULT</button></Link>
        <Link to ="/stats"><button>STATS</button></Link>
        <Routes>
          <Route path="/" element={<Home />} exact={true} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/findpw" element={<FindPW />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/input" element={<Input />} />
          <Route path="/result" element={<Result />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
