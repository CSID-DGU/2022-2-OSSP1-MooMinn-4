import React from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import './css/Input.css';
import Header from '../components/Header';
import UploadFile from '../components/UploadFile';

const Input = () => {
    return (
        <div className="fade-in">
            <Header mypage signout />
            <Box className="sub_title">
                파일업로드
            </Box>
            <Box className="guide">
                <Stack>
                    <span style={{fontSize:'20px',fontFamily:'SsangMun',marginBottom:'15px'}}>[ 파일 다운로드 방법 ]</span>
                    <span style={{fontSize:'16px',margin:'0 30px 5px 30px'}}>mdrims 로그인 → 학사정보 → 성적 → 전체성적 조회 → 엑셀 아이콘 클릭</span>
                    <span style={{fontSize:'13px'}}>(mdrims 바로가기:
                        <a href="https://mdrims.dongguk.edu/" style={{color:'#007FFF'}}> https://mdrims.dongguk.edu/</a>)
                    </span>
                </Stack>
                <img className="guide_img" alt="엑셀 파일 다운로드 방법" src="img/guide1.png"></img>
                <img className="guide_img" alt="엑셀 파일 다운로드 방법" src="img/guide2.png"></img>
            </Box>
            <UploadFile />
            <Box className="btn_area">
                <Link to='/result'>
                    <button className="btn">계산</button>
                </Link>
            </Box>
        </div>
    );
};

export default Input;