import React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FindPW from './FindPW';
import "./css/SignUp.css";

const SignIn = () => {
    const [email, setEmail] = React.useState('')
    const [emptyEmail, setEmptyEmail] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [emptyPW, setEmptyPW] = React.useState(false)

    const onClickLogin = () => {
        if (email === '') {setEmptyEmail(true)}
        else {setEmptyEmail(false)}
        if (password === '') {setEmptyPW(true)}
        else {setEmptyPW(false)}
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangePW = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div className="fade-in">
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
            <Box className="signin">
                로그인
            </Box>
            <Box className="text_area_in" component="form">
                <TextField
                    className="text_in"
                    error={emptyEmail}
                    name='id'
                    label='이메일'
                    variant="outlined" 
                    margin="normal"
                    onChange={onChangeEmail} />
                <span className="helper">{emptyEmail && '이메일을 입력하세요.'}</span>
                <TextField
                    className="text_in"
                    error={emptyPW}
                    name='pw'
                    label='비밀번호'
                    type='password'
                    variant="outlined" 
                    margin="normal" 
                    onChange={onChangePW} />
                <span className="helper">{emptyPW && '비밀번호를 입력하세요.'}</span>
            </Box>
            <Box className="btn_area">
                {/* <Link to='/'> */}
                <button className="btn" onClick={onClickLogin}>로그인</button>
                {/* </Link> */}
            </Box>
            <Box className="sub_btn_area">
                <Link to='/signup'>
                    <button className="sub_btn">회원가입</button>
                </Link>
                <FindPW>비밀번호찾기</FindPW>
            </Box>
      </div>
    );
};

export default SignIn;