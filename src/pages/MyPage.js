import React, { Component } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import './css/UserInfo.css';
import Header from '../components/Header';

class MyPage extends Component {
    state = {
        id: sessionStorage.getItem('userId'),
        pw: '',
        year: '',
        register: '',
        course: '',
        english: '',
        category: '토익',
        score: '',
    }

    componentDidMount() {
        this.setState({
            id: sessionStorage.getItem('userId')
        })
        const data = {
            email: this.state.id
        }
        fetch("/mypage", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setState({
                    year: json.StudentNumber,
                    register: json.Semester,
                    course: json.Course,
                    english: json.EnglishGrade,
                    score: json.Score
                })
            })

    }



    appChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    appClick = () => {
        console.log(`ID: ${this.state.id}\nPW: ${this.state.pw}\nYEAR: ${this.state.year}
REGISTER: ${this.state.register}\nCOURSE: ${this.state.course}\nENGLISH: ${this.state.english}
CATEGORY: ${this.state.category}\nSCORE: ${this.state.score}`);

        const data = {
            email: this.state.id,
            year: this.state.year,
            register: this.state.register,
            course: this.state.course,
            english: this.state.english,
            category: this.state.category,
            score: this.state.score
        }

        fetch("/updateuserinfo", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
        alert('변경이 완료되었습니다.')
        document.location.href = '/'
    }

    render() {
        const { id, year, register, course, english, category, score } = this.state;
        const { appChange, appClick } = this;
        const YEAR = [2018, 2019, 2020, 2021, 2022];
        const REGISTER = [8, 7, 6, 5, 4, 3, 2, 1];
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
                <Header signout />
                <Box className="mypage">
                    마이페이지
                </Box>
                <Box className="text_area" component="form">
                    <Stack direction="row" spacing={2}>
                        <TextField
                            className="text"
                            disabled
                            defaultValue={id}
                            name="id"
                            label="이메일"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            onChange={appChange} />
                    </Stack>
                </Box>
                <br />
                <Box className="select_area">
                    <Stack direction="row" spacing={2} mt={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="year">입학년도</InputLabel>
                            <Select
                                className="select"
                                defaultValue={2019}
                                labelId="year"
                                value={year}
                                name="year"
                                label="입학년도"
                                onChange={appChange}
                            >
                                {
                                    YEAR.map((year, idx) => {
                                        return <MenuItem key={idx} value={year}>{year}학년도</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel id="register">이수학기수</InputLabel>
                            <Select
                                className="select"
                                labelId="register"
                                value={register}
                                name="register"
                                label="이수학기수"
                                onChange={appChange}
                            >
                                {
                                    REGISTER.map((register, idx) => {
                                        return <MenuItem key={idx} value={register}>{register}학기</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mt={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="course">심화/일반</InputLabel>
                            <Select
                                className="select"
                                labelId="course"
                                value={course}
                                name="course"
                                label="심화/일반"
                                onChange={appChange}
                            >
                                {
                                    COURSE.map((course, idx) => {
                                        return <MenuItem key={idx} value={course}>{course}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel id="english">영어레벨</InputLabel>
                            <Select
                                className="select"
                                labelId="english"
                                value={english}
                                name="english"
                                label="영어레벨"
                                onChange={appChange}
                            >
                                {
                                    ENGLISH.map((english, idx) => {
                                        return <MenuItem key={idx} value={english}>S{english}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mt={2}>
                        <FormControl fullWidth size="small" sx={{ maxWidth: 130, minWidth: 80 }}>
                            <InputLabel id="category">외국어시험</InputLabel>
                            <Select // 외국어 시험 종류 선택
                                className="select"
                                labelId="category"
                                value={category}
                                name="category"
                                label="외국어시험"
                                onChange={appChange}
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
                                onChange={appChange}
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
                    <button className="btn" variant="contained" onClick={appClick}>수정</button>
                </Box>
            </div>
        );
    }
};

export default MyPage;