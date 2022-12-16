import React, { Component } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import './css/UserInfo.css';
import Header from '../Components/Header';

class Lectures extends Component {
    state = {
        //TermNumber, ClassNumber, LectureNick, Curriculum, ClassArea, 
        //ProfessorName, ClassCredit, DesignCredit, EnglishClass
        id: sessionStorage.getItem('userId'),
        tnumber: [],
        cnumber: [],
        lnick: [],
        cculum: [],
        carea: [],
        pname: [],
        ccredit: [],
        eclass: [],
    }

    
    componentDidMount() {
        this.setState({
            id: sessionStorage.getItem('userId')
        })
        const data = {
            email: this.state.id
        }
        fetch("/lecture", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((json) => {
                this.setState({ 
                    //TermNumber, ClassNumber, LectureNick, Curriculum, ClassArea, 
                    //ProfessorName, ClassCredit, DesignCredit, EnglishClass
                    tnumber: json.TermNumber,
                    cnumber: json.ClassNumber,
                    lnick: json.LectureNick,
                    cculum: json.Curriculum,
                    carea: json.ClassArea,
                    pname: json.ProfessorName,
                    ccredit: json.ClassCredit,
                    eclass: json.EnglishClass
                })
            })

    }

    appChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    appClick = () => {
        const data = {
            email: this.state.id,
            year: this.state.year,
            register: this.state.register,
            course: this.state.course,
            english: this.state.english,
            score: this.state.score
        }

        fetch("/updatelecture", {
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
        const { tnumber, cnumber, lnick, cculum, carea, pname, ccredit, eclass } = this.state;
        const { appChange, appClick } = this;
        const YEAR = [2018, 2019, 2020, 2021, 2022];
        const REGISTER = [8, 7, 6, 5, 4, 3, 2, 1];
        const COURSE = ["심화", "일반"];
        const ENGLISH = [0, 1, 2, 3, 4];
        const SCORE_TOEIC = [550, 600, 620, 650, 680, 700, 750, 800];

        return (
            <div className="fade-in">
                <Header signout />
                <Box className="mypage">
                    강의 정보
                </Box>
                <Box className="result_detail">
                    <Box className="detail_box">
                    <Box className="text_area" component="form">
                        <span style={{ fontSize: '14px' }}>학기</span>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                className="text"
                                defaultValue={tnumber}
                                name="id"
                                label="학기"
                                value={cnumber}
                                variant="outlined"
                                size="small"
                                margin="normal"
                                onChange={appChange}
                                sx={{ width: 250 }} />
                        </Stack>
                    </Box>
                    <Box className="text_area" component="form">
                        <span style={{ fontSize: '14px' }}>학수번호</span>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                className="select"
                                defaultValue={cnumber}
                                labelId="cnumber"
                                value={cnumber}
                                name="cnumber"
                                label="학수번호"
                                variant="outlined"
                                size="small"
                                margin="normal"
                                sx={{ width: 250 }} />
                        </Stack>
                    </Box>
                    <Box className="text_area" component="form">
                        <span style={{ fontSize: '14px' }}>강의명</span>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                className="text"
                                defaultValue={lnick}
                                name="lnick"
                                label="강의명"
                                value={lnick}
                                variant="outlined"
                                size="small"
                                margin="normal"
                                onChange={appChange}
                                sx={{ width: 250 }} />
                        </Stack>
                    </Box>
                </Box>
                <Box className="detail_box">
                            <div className="stack">
                            </div>
                        </Box>
                        <Box className="detail_box">
                            <div className="stack">
                            </div>
                            <span className="detail_content">{tnumber} | {cnumber} | {lnick} | {cculum} | {carea} | {pname} | {ccredit} | {eclass}</span>
                        </Box>
                        <Box className="btn_area">
                            <button className="btn" variant="contained" onClick={appClick}>수정</button>
                        </Box>
                </Box>
            </div>
        );
    }
};

export default Lectures;