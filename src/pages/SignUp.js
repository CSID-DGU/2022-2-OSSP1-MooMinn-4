import React from 'react';
import { Link } from 'react-router-dom';
import "./css/SignUp.css";
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CheckIcon from '@mui/icons-material/Check';

const SignUp = () => {
    const [email, setEmail] = React.useState('')
    const [emptyEmail, setEmptyEmail] = React.useState(false)
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
    const [category, setCategory] = React.useState('')
    const [score, setScore] = React.useState('')
    const [passwordCheck, setPasswordCheck] = React.useState('')
    const [incorrectPW, setCorrectPW] = React.useState(false)

    const onChangeEmail = (e) => { setEmail(e.target.value) }
    const onChangePassword = (e) => { setPassword(e.target.value) }
    const onChangeYear = (e) => { setYear(e.target.value) }
    const onChangeSemester = (e) => { setSemester(e.target.value) }
    const onChangeCourse = (e) => { setCourse(e.target.value) }
    const onChangeEnglish = (e) => { setEnglish(e.target.value) }
    const onChangeCategory = (e) => { setCategory(e.target.value) }
    const onChangeScore = (e) => { setScore(e.target.value) }
    const onChangePasswordCheck = (e) => { setPasswordCheck(e.target.value) }

    const onClickSignUp = () => {
        if (email === '') {setEmptyEmail(true)}
        else {setEmptyEmail(false)}
        if (password === '') {setEmptyPW(true)}
        else {setEmptyPW(false)}
        if (year === '') {setEmptyYear(true)}
        else {setEmptyYear(false)}
        if (semester === '') {setEmptySemester(true)}
        else {setEmptySemester(false)}
        if (course === '') {setEmptyCourse(true)}
        else {setEmptyCourse(false)}
        if (english === '') {setEmptyEnglish(true)}
        else {setEmptyEnglish(false)}
        if (password === passwordCheck) {setCorrectPW(false)}
        else {setCorrectPW(true)}
    }    

    const YEAR = [2018, 2019, 2020, 2021, 2022];
    const SEMESTER = [8, 7, 6, 5, 4, 3, 2, 1];
    const COURSE = ["심화", "일반"];
    const ENGLISH = [0, 1, 2, 3, 4];
    const CATEGORY = ["토익", "토플CBT", "토플IBT", "텝스", "TOEIC Speaking", "OPIc", "Cambridge ESOL Examinations", "IELTS Academic", "G-TELP"];
    const SCORE_TOEIC = [550, 600, 620, 650, 680, 700, 750, 800];
    const SCORE_CBT = [136, 177, 182, 192, 200, 207, 212, 227];
    const SCORE_IBT = [57, 62, 64, 68, 72, 76, 82, 87];
    const SCORE_TEPS = [436, 478, 494, 521, 551, 600, 633, 728];
    const SCORE_TOEICS = [120, 130, 140, 150];
    const SCORE_OPIC = ["IL", "IM 1", "IM 2", "IM 3"];
    const SCORE_ESOL = ["PET", "FCE"];
    const SCORE_IELTS = [4.5, 5, 5.5, 6];
    const SCORE_GTELP = ["LEVEL3 63", "LEVEL3 71", "LEVEL2 50", "LEVEL3 73", "LEVEL2 53", "LEVEL3 78", "LEVEL2 57",
                            "LEVEL3 82", "LEVEL2 61", "LEVEL3 85", "LEVEL2 64", "LEVEL3 92", "LEVEL2 69", "LEVEL3 99", "LEVEL2 76"];
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
            <Box className="signup">
                회원가입
            </Box>
            <Box className="text_area" component="form">
                    <Stack direction="row" spacing={2}>
                        <Stack style={{width: '70%'}}>
                            <TextField // 이메일 입력
                                className="text"
                                error={emptyEmail}
                                name="id" 
                                label="이메일" 
                                variant="outlined" 
                                size="small" 
                                margin="normal"
                                onChange={onChangeEmail} />
                            <span className="helper">{emptyEmail && '이메일을 입력하세요.'}</span>
                        </Stack>
                        <Button startIcon={<CheckIcon />} size="small">
                            중복확인
                        </Button>
                    </Stack>
                    <Stack style={{width: '70%'}}>
                        <TextField // 비밀번호 입력
                            className="text"
                            error={emptyPW}
                            value={password}
                            name="pw" 
                            label="비밀번호" 
                            type="Password" 
                            size="small" 
                            margin="normal" 
                            onChange={onChangePassword} />
                        <span className="helper">{emptyPW && '비밀번호를 입력하세요.'}</span>
                    </Stack>
                    <Stack style={{width: '70%'}}>
                        <TextField // 비밀번호 확인
                            className="text"
                            error={incorrectPW}
                            value={passwordCheck}
                            name="pw" 
                            label="비밀번호 확인" 
                            type="Password" 
                            size="small" 
                            margin="normal"
                            onChange={onChangePasswordCheck} />
                        <span className="helper">{incorrectPW && '비밀번호가 다릅니다.'}</span>
                    </Stack>
            </Box>
            <Box className="select_area" component="form">
                    <Stack direction="row" spacing={2} mt={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="year">입학년도</InputLabel>
                            <Select // 입학년도 선택
                                className="select"
                                error={emptyYear}
                                labelId="year"
                                value={year}
                                name="year"
                                label="입학년도" 
                                onChange={onChangeYear}
                            >
                                {
                                    YEAR.map((year, idx) => {
                                        return <MenuItem key={idx} value={year}>{year}학년도</MenuItem>
                                    })
                                }
                            </Select>
                            <span className="helper" style={{marginTop:'5px'}}>{emptyYear && '입학년도를 선택하세요.'}</span>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel id="semester">이수학기수</InputLabel>
                            <Select // 이수학기수 선택
                                className="select"
                                error={emptySemester}
                                required
                                labelId="semester"
                                value={semester}
                                name="semester"
                                label="이수학기수" 
                                onChange={onChangeSemester}
                            >
                                {
                                    SEMESTER.map((semester, idx) => {
                                        return <MenuItem key={idx} value={semester}>{semester}학기</MenuItem>
                                    })
                                }
                            </Select>
                            <span className="helper" style={{marginTop:'5px'}}>{emptySemester && '이수학기수을 선택하세요.'}</span>
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mt={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="course">심화/일반</InputLabel>
                            <Select // 심화/일반 과정 선택
                                className="select"
                                error={emptyCourse}
                                labelId="course"
                                value={course}
                                name="course"
                                label="심화/일반" 
                                onChange={onChangeCourse}
                            >
                                {
                                    COURSE.map((course, idx) => {
                                        return <MenuItem key={idx} value={course}>{course}</MenuItem>
                                    })
                                }
                            </Select>
                            <span className="helper" style={{marginTop:'5px'}}>{emptyCourse && '심화과정 여부를 선택하세요.'}</span>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel id="english">영어레벨</InputLabel>
                            <Select // 영어 레벨 선택
                                className="select"
                                error={emptyEnglish}
                                labelId="english"
                                value={english}
                                name="english"
                                label="영어레벨" 
                                onChange={onChangeEnglish}
                            >
                                {
                                    ENGLISH.map((english, idx) => {
                                        return <MenuItem key={idx} value={english}>S{english}</MenuItem>
                                    })
                                }
                            </Select>
                            <span className="helper" style={{marginTop:'5px'}}>{emptyEnglish && '영어레벨을 선택하세요.'}</span>
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mt={2}>
                        <FormControl fullWidth size="small" sx={{maxWidth: 130, minWidth: 80}}>
                            <InputLabel id="category">외국어시험</InputLabel>
                            <Select // 외국어 시험 종류 선택
                                className="select"
                                labelId="category"
                                value={category}
                                name="category"
                                label="외국어시험" 
                                onChange={onChangeCategory}
                            >
                                {
                                    CATEGORY.map((category, idx) => {
                                        return <MenuItem key={idx} value={category}>{category}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel id="score">외국어성적</InputLabel>
                            <Select // 외국어 성적 선택
                                className="select"
                                labelId="score"
                                value={score}
                                name="score"
                                label="외국어성적" 
                                onChange={onChangeScore}
                            >
                                {
                                    category === "토익" ?
                                    SCORE_TOEIC.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) :
                                    category === "토플CBT" ?
                                    SCORE_CBT.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    category === "토플IBT" ?
                                    SCORE_IBT.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    category === "텝스" ?
                                    SCORE_TEPS.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    category === "TOEIC Speaking" ?
                                    SCORE_TOEICS.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    category === "OPIc" ?
                                    SCORE_OPIC.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    category === "Cambridge ESOL Examinations" ?
                                    SCORE_ESOL.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    category === "IELTS Academic" ?
                                    SCORE_IELTS.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    }) : 
                                    SCORE_GTELP.map((score, idx) => {
                                        return <MenuItem key={idx} value={score}>{score}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Stack>
            </Box>
            <Box className="btn_area">
                    <button className="btn" variant="contained" onClick={onClickSignUp}>회원가입</button>
            </Box>
        </div>
    );
};

export default SignUp;