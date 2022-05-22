import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FindPW from './FindPW';
import "./css/SignUp.css";



const SignIn = () => {
    const [id, setId] = useState('')
    const [pw, setPw] = useState('')

    const appChangeId = (e) => {
        setId(e.target.value)
    }

    const appChangePw = (e) => {
        setPw(e.target.value)
    }

    const onClickLogin = (e) => {
        e.preventDefault()
        const data = {
            id: id,
            pw: pw,
        }
        console.log(data);

        fetch("http://localhost:3001/signin", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)

        })
    }

    const onClickSignup = () => {
        console.log('회원가입 버튼 클릭')
    }

    const onClickFindPassword = () => {
        console.log('비밀번호 찾기 버튼 클릭')
    }

    return (
        <div className="fade-in">
            <Stack direction="row" justifyContent="space-between" className="nav">
                <Box style={{ width: 30 }}></Box>
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
                    name='id'
                    label='이메일'
                    variant="outlined"
                    margin="normal"
                    onChange={appChangeId} />
                <TextField
                    className="text_in"
                    name='pw'
                    label='비밀번호'
                    type='password'
                    variant="outlined"
                    margin="normal"
                    onChange={appChangePw} />
            </Box>
            <Box className="btn_area">
                <Link to='/'>
                    <button className="btn" onClick={onClickLogin}>로그인</button>
                </Link>
            </Box>
            <Box className="sub_btn_area">
                <Link to='/signup'>
                    <button className="sub_btn" onClick={onClickSignup}>회원가입</button>
                </Link>
                <FindPW>비밀번호찾기</FindPW>
            </Box>
        </div>
    );
};

export default SignIn;