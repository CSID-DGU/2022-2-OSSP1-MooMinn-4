import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import "./Header.css";

const Header = ({mypage}) => {
    return (
        <Stack direction="row" justifyContent="space-between" className="nav">
            <Box style={{width: 30}}></Box>
            <Link to='/'>
                <Stack className="to_home" direction="row">
                    <img className="to_home_img" alt="YouCanGraduate" src="img/logo.png"></img>
                    <span className="to_home_title">졸업할 수 있을까?</span>
                </Stack>
            </Link>
            <Box className="to_mypage">
                { mypage && 
                    <Link to="/mypage">
                        <AccountCircleRoundedIcon />
                    </Link>
                }
            </Box>
        </Stack>
    )
}

export default Header;