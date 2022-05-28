import { React, useState } from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Stack from '@mui/material/Stack'
import SendIcon from '@mui/icons-material/Send'
import './FindPW.css';

const Cancel = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button onClick={handleOpen}>닫기</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="modal">
                    <Button onClick={handleClose}>확인</Button>
                    <Button onClick={handleClose}>취소</Button>
                </Box>
            </Modal>
        </div>
    )
}

const FindPW = () => {
    const emailList = [
        { label: 'naver.com' },
        { label: 'gmail.com' },
        { label: 'dgu.ac.kr' },
        { label: 'daum.net' },
        { label: 'hanmail.com' },
        { label: 'nate.com' }
    ]
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [inputSecurityCode, setInputSecurityCode] = useState('')
    const [securityCode, setSecurityCode] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [emailCheck, setEmailCheck] = useState(false)
    const [securityCheck, setSecurityCheck] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [emptyPW, setEmptyPW] = useState(false)
    const [incorrectPW, setCorrectPW] = useState(false)
    const [incorrectSecureCode, setIncorrectSecureCode] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangeSecurityCode = (e) => {
        setInputSecurityCode(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangePasswordCheck = (e) => {
        setPasswordCheck(e.target.value)
    }

    const handleClickChangePassword = () => {
        if (password === '') {
            console.log('비밀번호가 입력되지 않음')
            setEmptyPW(true)
        }
        else {
            console.log('비밀번호가 입력됨')
            setEmptyPW(false)
        }
        if (password === passwordCheck) {
            console.log('비밀번호가 같음')
            setCorrectPW(false)
            // 비밀번호 변경
        }
        else {
            console.log('비밀번호가 다름')
            setCorrectPW(true)
        }
    }

    const handleClickSend = (e) => {
        const data = {
            email: email,
        }

        if (email === '') {
            setEmptyEmail(true)
        }
        else {
            setEmptyEmail(false)
            // 해당 이메일로 코드 전송하기
            fetch("/sendemail", {
                method: 'post',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((json) => {
                    setSecurityCode(json.number)
                })

            setEmailCheck(true)
        }
    }

    const handleClickResend = () => {
        const data = {
            email: email,
        }

        // 이메일 다시 보내기
        fetch("/sendemail", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((json) => {
                setSecurityCode(json.number)
            })
    }

    const handleClickSecureCodeCheck = () => {
        // 보안코드가 일치하면
        if (securityCode === inputSecurityCode) {
            setSecurityCheck(true)
        }
        // 일치하지 않으면
        else {
            alert('보안코드가 잘못 입력되었습니다.')
        }

    }

    return (
        <div>
            <button className="sub_btn" onClick={handleOpen}>비밀번호 찾기</button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="modal">
                    <Box className="findPW">
                        비밀번호찾기
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={{ xs: 0, sm: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                disabled={emailCheck}
                                id='email'
                                type='text'
                                error={emptyEmail}
                                helperText={emptyEmail && '이메일을 입력하세요.'}
                                value={email}
                                label='이메일'
                                variant='outlined'
                                size="small"
                                margin='normal'
                                onChange={onChangeEmail} />
                            <span>@</span>
                            <Autocomplete
                                disabled={emailCheck}
                                id='emailAddress'
                                options={emailList}
                                renderInput={(params) => <TextField {...params} label="이메일 주소"
                                    size="small"
                                    sx={{ width: 150, marginTop: 1 }} />}
                            ></Autocomplete>
                        </Stack>
                        <Button disabled={emailCheck} variant="outlined" startIcon={<SendIcon />} size="small" className="send_btn" onClick={handleClickSend} >
                            보내기
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={5}>
                        <TextField
                            disabled={securityCheck}
                            error={incorrectSecureCode}
                            helperText={incorrectSecureCode && '보안코드를 확인하세요.'}
                            id='securityCode'
                            type='text'
                            value={inputSecurityCode}
                            label='보안코드'
                            variant='outlined'
                            size='small'
                            margin='normal'
                            onChange={onChangeSecurityCode}
                            sx={{ width: '40%' }} s />
                        <Stack direction="row" alignItems="center" style={{ marginTop: 5 }}>
                            <Button disabled={securityCheck} variant="outlined" size="small" onClick={handleClickSecureCodeCheck}>
                                확인
                            </Button>&nbsp;
                            <Button disabled={securityCheck} variant="outlined" size="small" onClick={handleClickResend}>
                                재전송
                            </Button>
                        </Stack>
                    </Stack>
                    <Stack spacing={1} className="PW_Stack">
                        <TextField
                            disabled={!securityCheck}
                            id='password'
                            error={emptyPW}
                            type='password'
                            helperText={emptyPW && '비밀번호를 입력하세요.'}
                            value={password}
                            label='비밀번호'
                            variant='outlined'
                            size='small'
                            margin='normal'
                            onChange={onChangePassword} />
                        <TextField
                            disabled={!securityCheck}
                            id='passwordCheck'
                            error={incorrectPW}
                            type='password'
                            helperText={incorrectPW && '비밀번호가 다릅니다.'}
                            value={passwordCheck}
                            label='비밀번호 확인'
                            variant='outlined'
                            size='small'
                            margin='normal'
                            onChange={onChangePasswordCheck} />
                    </Stack>
                    <Box className="btn_area" style={{ margin: '30px 0 10px 0' }}>
                        <button className="btn" onClick={handleClickChangePassword}>
                            변경
                        </button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default FindPW