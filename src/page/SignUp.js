import React, { Component } from 'react';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

class SignUp extends Component {
    state = {
        id: '',
        pw: '',
        year: '',
        register: '',
        course: '',
        english: '',
    }

    appChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    appClick = () => {
        console.log(`ID: ${this.state.id}\nPW: ${this.state.pw}\nYEAR: ${this.state.year}
REGISTER: ${this.state.register}\nCOURSE: ${this.state.course}\nENGLISH: ${this.state.english}`);
    }

    render() {
        const { id, pw, year, register, course, english } = this.state;
        const { appChange, appClick } = this;

        return (
            <div>
                <h1> SIGNUP PAGE </h1>
                <Box component="form" sx={{maxWidth: 300, minWidth: 100}}>
                    <TextField 
                        name="id" 
                        label="이메일" 
                        variant="outlined" 
                        size="small" 
                        margin="normal" 
                        onChange={appChange} />
                    <TextField 
                        name="pw" 
                        label="비밀번호" 
                        type="Password" 
                        size="small" 
                        margin="normal" 
                        onChange={appChange} />
                </Box>
                <Stack direction="row" spacing={2} sx={{maxWidth: 400, minWidth: 200}} mt={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="year">입학년도</InputLabel>
                        <Select 
                            labelId="year"
                            value={year}
                            name="year"
                            label="입학년도" 
                            onChange={appChange}
                        >
                            <MenuItem value={2018}>2018학년도</MenuItem>
                            <MenuItem value={2019}>2019학년도</MenuItem>
                            <MenuItem value={2020}>2020학년도</MenuItem>
                            <MenuItem value={2021}>2021학년도</MenuItem>
                            <MenuItem value={2022}>2022학년도</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel id="register">이수학기수</InputLabel>
                        <Select 
                            labelId="register"
                            value={register}
                            name="register"
                            label="이수학기수" 
                            onChange={appChange}
                        >
                            <MenuItem value={8}>8학기</MenuItem>
                            <MenuItem value={7}>7학기</MenuItem>
                            <MenuItem value={6}>6학기</MenuItem>
                            <MenuItem value={5}>5학기</MenuItem>
                            <MenuItem value={4}>4학기</MenuItem>
                            <MenuItem value={3}>3학기</MenuItem>
                            <MenuItem value={2}>2학기</MenuItem>
                            <MenuItem value={1}>1학기</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{maxWidth: 400, minWidth: 200}} mt={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="course">심화/일반</InputLabel>
                        <Select 
                            labelId="course"
                            value={course}
                            name="course"
                            label="심화/일반" 
                            onChange={appChange}
                        >
                            <MenuItem value={0}>심화</MenuItem>
                            <MenuItem value={1}>일반</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel id="english">영어레벨</InputLabel>
                        <Select 
                            labelId="english"
                            value={english}
                            name="english"
                            label="영어레벨" 
                            onChange={appChange}
                        >
                            <MenuItem value={0}>S0</MenuItem>
                            <MenuItem value={1}>S1</MenuItem>
                            <MenuItem value={2}>S2</MenuItem>
                            <MenuItem value={3}>S3</MenuItem>
                            <MenuItem value={4}>S4</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <br/><br/>
                <Button variant="contained" onClick={appClick}>Sign Up</Button>
            </div>
        );
    }
};

export default SignUp;