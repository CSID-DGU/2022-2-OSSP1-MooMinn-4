import React from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Chart from '../components/Chart';
import { data1 } from '../data/data1';
import { data2 } from '../data/data2';
import { data3 } from '../data/data3';

const Stats = () => {
    return (
        <div className="fade-in">
            <Stack direction="row" justifyContent="space-between" className="nav">
                <Box style={{width: 30}}></Box>
                <Link to="/">
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
            <Box className="sub_title">
            통계
            </Box>
            <Stack 
                style={{marginTop:'20px', marginBottom:'30px'}} 
                direction={{xs:'column', sm:'row'}}
                justifyContent="center"
                alignItems="center"
            >
                <Chart data={data1} title="전체평점 비교" dataKey={'평점'} />
                <Chart data={data2} title="전공평점 비교" dataKey="평점" />
                <Chart data={data3} title="이수학점 비교" dataKey="학점" />
            </Stack>
            <Stack flexDirection='row' justifyContent="center" mb={10}>
                <Stack>
                    <Box sx={{
                        width:600,
                        height:150,
                        backgroundColor:'white',
                        borderRadius:'15px',
                        margin:'5px',
                        boxShadow: '0 0 10px lightgray'
                        }}></Box>
                    <Box sx={{
                        width:600,
                        height:150,
                        backgroundColor:'white',
                        borderRadius:'15px',
                        margin:'5px',
                        boxShadow: '0 0 10px lightgray'
                        }}></Box>
                </Stack>
                <Box sx={{
                    width:400,
                    height:310,
                    backgroundColor:'white',
                    borderRadius:'15px',
                    margin:'5px',
                    boxShadow: '0 0 10px lightgray'
                    }}></Box>
            </Stack>
        </div>
    );
};

export default Stats;