import React from 'react';
import { Link } from 'react-router-dom';
import "./css/Home.css";

const Home = () => {
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
            <div className="btn_area">
                <Link to='/signin'>
                    <button className="btn" variant="contained">로그인</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;