import React from 'react';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import CheckIcon from '@mui/icons-material/Check';
import "./css/UserInfo.css";
import Header from '../Components/Header';
import ConversionTable from '../Components/ConversionTable';

const SignUp = () => {
    const [email, setEmail] = React.useState('')
    const [emptyEmail, setEmptyEmail] = React.useState(false)
    const [duplicatedEmail, setDuplicatedEmail] = React.useState(true)
    const [emailAddress, setEmailAddress] = React.useState('')
    const [emptyEmailAddress, setEmptyEmailAddress] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [emptyPW, setEmptyPW] = React.useState(false)
    const [year, setYear] = React.useState('')
    const [emptyYear, setEmptyYear] = React.useState(false)
    const [semester, setSemester] = React.useState('')
    const [emptySemester, setEmptySemester] = React.useState(false)
    const [course, setCourse] = React.useState('')
    const [emptyCourse, setEmptyCourse] = React.useState(false)
    const [english, setEnglish] = React.useState('')
    const [emptyEnglish, setEmptyEnglish] = React.useState(false)
    const [score, setScore] = React.useState('')
    const [major, setMajor] = React.useState('')
    const [passwordCheck, setPasswordCheck] = React.useState('')
    const [incorrectPW, setCorrectPW] = React.useState(false)

    const EMAILADDRESS = ['naver.com', 'gmail.com', 'dgu.ac.kr', 'daum.net', 'hanmail.com', 'nate.com']

    const onChangeEmail = (e) => { setEmail(e.target.value) }
    const onChangeEmailAddress = (e) => { setEmailAddress(e.target.value) }
    const onChangePassword = (e) => { setPassword(e.target.value) }
    const onChangeYear = (e) => { setYear(e.target.value) }
    const onChangeSemester = (e) => { setSemester(e.target.value) }
    const onChangeCourse = (e) => { setCourse(e.target.value) }
    const onChangeEnglish = (e) => { setEnglish(e.target.value) }
    const onChangeScore = (e) => { setScore(e.target.value) }
    const onChangeMajor = (e) => { setMajor(e.target.value) }
    const onChangePasswordCheck = (e) => { setPasswordCheck(e.target.value) }

    const data = {
        email: email + '@' + emailAddress,
        pw: password,
        year: year,
        semester: semester,
        course: course,
        english: english,
        score: score,
        major: major,
    }

    const onClickDuplication = (e) => {
        e.preventDefault()
        const body = {
            email: data.email
        }
        if (email === '') {
            setEmptyEmail(true)
            alert('ID??? ???????????????.')
        }
        else {
            setEmptyEmail(false)
            if (emailAddress === '') {
                setEmptyEmailAddress(true)
                alert('?????????????????? ????????????.')
            }
            else {
                setEmptyEmailAddress(false)
                fetch("/emailcheck", {
                    method: 'post',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((json) => {
                        console.log(json)

                        if (json.result === 1) {
                            // ??????
                            alert('????????? ID?????????.')
                        }
                        else {
                            // ????????????
                            setDuplicatedEmail(false)
                            alert('??????????????? ID?????????.')
                        }

                    })
                    .catch()
            }
        }
    }

    const onClickSignUp = (e) => {
        e.preventDefault()
        if (email === '') { setEmptyEmail(true) }
        else { setEmptyEmail(false) }
        if (emailAddress === '') { setEmptyEmailAddress(true) }
        else { setEmptyEmailAddress(false) }
        if (password === '') { setEmptyPW(true) }
        else { setEmptyPW(false) }
        if (year === '') { setEmptyYear(true) }
        else { setEmptyYear(false) }
        if (semester === '') { setEmptySemester(true) }
        else { setEmptySemester(false) }
        if (course === '') { setEmptyCourse(true) }
        else { setEmptyCourse(false) }
        if (english === '') { setEmptyEnglish(true) }
        else { setEmptyEnglish(false) }
        //if (major === '') { setEmptyMajor(true) }
        //else { setEmptyMajor(false) }
        if (password === passwordCheck) { setCorrectPW(false) }
        else { setCorrectPW(true) }


        if (duplicatedEmail) {
            alert('????????? ??????????????? ?????????.')
        }
        else {
            fetch("/signup", {
                method: 'post',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then(res => console.log(res))
            alert("???????????? ??????!")
            window.location.replace('/')
        }
    }

    const YEAR = [2017, 2018, 2019, 2020, 2021, 2022];
    const SEMESTER = [8, 7, 6, 5, 4, 3, 2, 1];
    const COURSE = ["??????", "??????"];
    const ENGLISH = [0, 1, 2, 3, 4];
    const SCORE_TOEIC = [550, 600, 620, 650, 680, 700, 750, 800];
    const MAJOR = ['??????????????????', '?????????????????????', '?????????????????????'];

    return (
        <div className="fade-in">
            <Header />
            <Box className="signup">
                ????????????
            </Box>
            <Box className="text_area" component="form">
                <span style={{ fontSize: '14px' }}>????????????</span>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack className="helperStack">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField // ????????? ??????
                                disabled={!duplicatedEmail}
                                className="email"
                                error={emptyEmail}
                                name="id"
                                label="?????????"
                                variant="outlined"
                                size="small"
                                margin="normal"
                                onChange={onChangeEmail} />
                            <span style={{ marginTop: 6 }}>@</span>
                            <FormControl sx={{ width: 140 }} size="small">
                                <InputLabel id="emailAdress" sx={{ marginTop: 1 }}>???????????????</InputLabel>
                                <Select
                                    disabled={!duplicatedEmail}
                                    className="select"
                                    error={emptyEmailAddress}
                                    labelId="emailAddress"
                                    value={emailAddress}
                                    name="emailAddress"
                                    label="????????? ??????"
                                    onChange={onChangeEmailAddress}
                                    sx={{ marginTop: 1 }}
                                >
                                    {
                                        EMAILADDRESS.map((emailAddress, idx) => {
                                            return <MenuItem key={idx} value={emailAddress}>{emailAddress}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Stack>
                        <span className="helper">{emptyEmail && '???????????? ???????????????.'}</span>
                    </Stack>
                    <button disabled={!duplicatedEmail} onClick={onClickDuplication} className="check_btn" title="????????????">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CheckIcon fontSize="small" /><span className="check_text">????????????</span>
                        </Stack>
                    </button>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Stack className="helperStack">
                        <TextField // ???????????? ??????
                            className="text"
                            error={emptyPW}
                            value={password}
                            name="pw"
                            label="????????????"
                            type="Password"
                            size="small"
                            margin="normal"
                            onChange={onChangePassword} />
                        <span className="helper">{emptyPW && '??????????????? ???????????????.'}</span>
                    </Stack>
                    <Stack className="helperStack">
                        <TextField // ???????????? ??????
                            className="text"
                            error={incorrectPW}
                            value={passwordCheck}
                            name="pw"
                            label="???????????? ??????"
                            type="Password"
                            size="small"
                            margin="normal"
                            onChange={onChangePasswordCheck} />
                        <span className="helper">{incorrectPW && '??????????????? ????????????.'}</span>
                    </Stack>
                </Stack>
            </Box>
            <Box className="select_area" component="form" mt={2}>
                <span style={{ fontSize: '14px' }}>????????????</span>
                <Stack direction="row" spacing={2} mt={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="year">????????????</InputLabel>
                        <Select // ???????????? ??????
                            className="select"
                            error={emptyYear}
                            labelId="year"
                            value={year}
                            name="year"
                            label="????????????"
                            onChange={onChangeYear}
                        >
                            {
                                YEAR.map((year, idx) => {
                                    return <MenuItem key={idx} value={year}>{year}?????????</MenuItem>
                                })
                            }
                        </Select>
                        <span className="helper" style={{ marginTop: '5px' }}>{emptyYear && '??????????????? ???????????????.'}</span>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel id="register">???????????????</InputLabel>
                        <Select // ??????????????? ??????
                            className="select"
                            error={emptySemester}
                            labelId="semester"
                            value={semester}
                            name="semester"
                            label="???????????????"
                            onChange={onChangeSemester}
                        >
                            {
                                SEMESTER.map((semester, idx) => {
                                    return <MenuItem key={idx} value={semester}>{semester}??????</MenuItem>
                                })
                            }
                        </Select>
                        <span className="helper" style={{ marginTop: '5px' }}>{emptySemester && '?????????????????? ???????????????.'}</span>
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} mt={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="course">??????/??????</InputLabel>
                        <Select // ??????/?????? ?????? ??????
                            className="select"
                            error={emptyCourse}
                            labelId="course"
                            value={course}
                            name="course"
                            label="??????/??????"
                            onChange={onChangeCourse}
                        >
                            {
                                COURSE.map((course, idx) => {
                                    return <MenuItem key={idx} value={course}>{course}</MenuItem>
                                })
                            }
                        </Select>
                        <span className="helper" style={{ marginTop: '5px' }}>{emptyCourse && '???????????? ????????? ???????????????.'}</span>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel id="english">????????????</InputLabel>
                        <Select // ?????? ?????? ??????
                            className="select"
                            error={emptyEnglish}
                            labelId="english"
                            value={english}
                            name="english"
                            label="????????????"
                            onChange={onChangeEnglish}
                        >
                            {
                                ENGLISH.map((english, idx) => {
                                    return <MenuItem key={idx} value={english}>S{english}</MenuItem>
                                })
                            }
                        </Select>
                        <span className="helper" style={{ marginTop: '5px' }}>{emptyEnglish && '??????????????? ???????????????.'}</span>
                    </FormControl>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mt={2}>
                    <FormControl fullWidth size="small" sx={{ maxWidth:'40%', minWidth: 80 }}>
                        <InputLabel id="major">??????</InputLabel>
                        <Select
                            className="select"
                            labelId="major"
                            value={major}
                            name="major"
                            label="??????"
                            onChange={onChangeMajor}
                        >
                            {
                                MAJOR.map((major, idx) => {
                                    return <MenuItem key={idx} value={major}>{major}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mt={2}>
                    <FormControl fullWidth size="small" sx={{ maxWidth:'40%', minWidth: 80 }}>
                        <InputLabel id="score">???????????????</InputLabel>
                        <Select
                            className="select"
                            labelId="score"
                            value={score}
                            name="score"
                            label="???????????????"
                            onChange={onChangeScore}
                        >
                            {
                                SCORE_TOEIC.map((score, idx) => {
                                    return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <ConversionTable />
                </Stack>
            </Box>
            <Box className="btn_area">
                <button className="btn" variant="contained" onClick={onClickSignUp}>????????????</button>
            </Box>
        </div>
    );
};

export default SignUp;