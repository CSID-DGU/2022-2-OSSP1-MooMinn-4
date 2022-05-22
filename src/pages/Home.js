import React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import "./css/Home.css";

const Home = () => {
    const isSignIn = true;

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
                {(isSignIn) && 
                    <Link to='/signin'>
                        <button className="btn" variant="contained">로그인</button>
                    </Link>
                }
                {isSignIn &&
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
                    </>
                }
            </Stack>
        </div>
    );
};

export default Home;