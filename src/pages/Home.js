import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import "./css/Home.css";
import { useEffect } from 'react';
import { useState } from 'react';

const Home = () => {
    useEffect(() => {
        console.log(sessionStorage.getItem('userId'))
        if (sessionStorage.getItem('userId') === null) {
            // 로그인 안 되었다면
            setIsSignIn(true)
        }
        else {
            // 로그인 되었다면
            setIsSignIn(false)
        }
    })

    const [isSignIn, setIsSignIn] = useState(true)
    const onClickLogout = () => {
        sessionStorage.clear()
        window.location.replace('/')
    }

    return (
        <div>
            <div className="title_area">
                <div className="logo">
                    <img className="logo_img" alt="YouCanGraduate" src="img/logo.png"></img>
                </div>
                <span className="title">졸업할 수 있을까?</span>
                <div className="link">
                    <a href="https://github.com/CSID-DGU/2022-1-OSSP2-turning-7">github.com/🎓</a>
                </div>
            </div>
            <Stack className="btn_area" spacing={1}>
<<<<<<< HEAD
                {(isSignIn) &&
=======
                {isSignIn && 
>>>>>>> 156e9f947526741e083293d4d3bd06601ff7480f
                    <Link to='/signin'>
                        <button className="btn" variant="contained">로그인</button>
                    </Link>
                }
<<<<<<< HEAD
                {!isSignIn &&
=======
                {!(isSignIn) &&
>>>>>>> 156e9f947526741e083293d4d3bd06601ff7480f
                    <>
                        <Link to='/input'>
                            <button className="btn" variant="contained">입력</button>
                        </Link>
                        <Link to='/result'>
                            <button className="btn" variant="contained">결과</button>
                        </Link>
                        <Link to='/stats'>
                            <button className="btn" variant="contained">통계</button>
                        </Link>
                        <Box className="signout_home" title="로그아웃">
                            <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
                                <Stack direction="row">
                                    <LogoutOutlinedIcon /><div className="tool_title" onClick={onClickLogout}>로그아웃</div>
                                </Stack>
                            </Link>
                        </Box>
                    </>
                }
            </Stack>
        </div>
    );
};

export default Home;