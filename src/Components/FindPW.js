import { React, useState } from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import SendIcon from '@mui/icons-material/Send'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
}


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
                <Box sx={{ ...style, width: 200 }}>
                    <Button onClick={handleClose}>확인</Button>
                    <Button onClick={handleClose}>취소</Button>
                </Box>
            </Modal>
        </div>
    )
}

const FindPW = () => {
    const emailList = [
        { label: '@naver.com' },
        { label: '@gmail.com' },
        { label: '@dgu.ac.kr' },
        { label: '@daum.net' },
        { label: '@hanmail.com' },
        { label: '@nate.com' }
    ]
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [securityCode, setSecurityCode] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [emailCheck, setEmailCheck] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [emptyPW, setEmptyPW] = useState(false)
    const [incorrectPW, setCorrectPW] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangeSecurityCode = (e) => {
        setSecurityCode(e.target.value)
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

    const handleClickSend = () => {
        if (email === '') {
            setEmptyEmail(true)
        }
        else {
            setEmptyEmail(false)
        }
    }

    const handleClickResend = () => {
        // 이메일 다시 보내기
    }

    const handleClickSecureCodeCheck = () => {
        // 보안코드가 일치하면

    }

    return (
        <div>
            <button className="sub_btn" onClick={handleOpen}>비밀번호 찾기</button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ ...style, width: 400 }}>
                    <TextField
                        disabled={emailCheck}
                        id='email'
                        type='text'
                        error={emptyEmail}
                        helperText={emptyEmail && '이메일을 입력하세요.'}
                        value={email}
                        label='이메일'
                        variant='standard'
                        margin='normal'
                        onChange={onChangeEmail} />
                    <Button variant='contained' onClick={handleClickSend} endIcon={<SendIcon />}>
                        보내기
                    </Button>
                    <Autocomplete
                        id='emailAddress'
                        options={emailList}
                        renderInput={(params) => <TextField {...params} label="이메일 주소" />}
                    ></Autocomplete>
                    <TextField
                        id='securityCode'
                        type='text'
                        value={securityCode}
                        label='보안코드'
                        variant='standard'
                        margin='normal'
                        onChange={onChangeSecurityCode} />
                    <Button variant='contained' onClick={handleClickSecureCodeCheck}>
                        확인
                    </Button>
                    <Button variant='contained' onClick={handleClickResend}>
                        재전송
                    </Button>
                    <TextField
                        id='password'
                        error={emptyPW}
                        type='password'
                        helperText={emptyPW && '비밀번호를 입력하세요.'}
                        value={password}
                        label='비밀번호'
                        variant='standard'
                        margin='normal'
                        onChange={onChangePassword} />
                    <TextField
                        id='passwordCheck'
                        error={incorrectPW}
                        helperText={incorrectPW && '비밀번호가 다릅니다.'}
                        type='password'
                        value={passwordCheck}
                        label='비밀번호 확인'
                        variant='standard'
                        margin='normal'
                        onChange={onChangePasswordCheck} />
                    <br />
                    <Button variant='contined' onClick={handleClickChangePassword}>
                        변경
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default FindPW