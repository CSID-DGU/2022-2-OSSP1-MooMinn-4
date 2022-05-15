import React from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Input = () => {
    return (
        <div className="fade-in">
            <Stack direction="row" justifyContent="space-between" className="nav">
                <Box style={{width: 30}}></Box>
                <Link to="/">
                    <Stack className="to_home" direction="row">
                        <img className="to_home_img" alt="YouCanGraduate" src="img/logo.png"></img>
                        <span className="to_home_title">졸업할 수 있을까?</span>
                    </Stack>
                </Link>
                <Box className="to_mypage">
                    <Link to="/mypage">
                        <AccountCircleRoundedIcon />
                    </Link>
                </Box>
            </Stack>
            <Box className="sub_title">
            파일업로드
            </Box>
            <Box className="btn_area">
                <Link to='/result'>
                    <button className="btn">계산</button>
                </Link>
            </Box>
        </div>
    );
};

export default Input;