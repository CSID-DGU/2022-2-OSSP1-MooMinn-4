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

        fetch("http://localhost:3001/signin", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json)

                if (json.id === undefined) {
                    // id 일치하지 않는 경우 userId = undefined, msg = '입력하신 id 가 일치하지 않습니다.'
                    console.log('======================', '없는 id')
                    alert('입력하신 id 가 일치하지 않습니다.')
                } else if (json.id === null) {
                    // id는 있지만, pw 는 다른 경우 userId = null , msg = undefined
                    console.log('======================', '잘못된 비밀번호')
                    alert('입력하신 비밀번호 가 일치하지 않습니다.')
                } else if (json.id === id) {
                    // id, pw 모두 일치 userId = userId1, msg = undefined
                    console.log('======================', '로그인 성공')
                    sessionStorage.setItem('user_id', id)
                }
                // 작업 완료 되면 페이지 이동(새로고침)
                document.location.href = '/'
            })
            .catch()
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