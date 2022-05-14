import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FindPW from './FindPW';

const onClickLogin = () => {
    console.log('로그인 버튼 클릭')
}

const onClickSignup = () => {
    console.log('회원가입 버튼 클릭')
}

const onClickFindPassword = () => {
    console.log('비밀번호 찾기 버튼 클릭')
}

const SignIn = () => {
    return (
        <div>
            <Stack direction="row" justifyContent="space-between" className="nav">
                <Box style={{width: 30}}></Box>
                <Link to='/'>
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
            <TextField
                name='id'
                label='이메일'
                type='text'
                variant='standard'
            /><br />
            <TextField
                name='pw'
                label='비밀번호'
                type='password'
                variant='standard'
            /><br />
            <button className="btn" onClick={onClickLogin}>로그인</button><br />
            <Link to='/signup'>
                <Button variant='outlined' onClick={onClickSignup}>회원가입</Button>
            </Link>
            <FindPW>비밀번호 찾기</FindPW>
      </div>
    );
};

export default SignIn;