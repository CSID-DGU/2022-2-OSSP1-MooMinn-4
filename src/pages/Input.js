import React from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import './css/Input.css';
import Header from '../components/Header';

const Input = () => {
    const input = React.useRef(null);
    const [placeholder, setPlaceholder] = React.useState('');

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
            <Stack className="input_area" flexDirection={"row"}>
                <Stack 
                    className="upload_btn"
                    flexDirection={"row"}
                    onClick={() => {input.current?.click();}}
                >
                    <span className="upload_icon"><FileUploadOutlinedIcon/></span>
                    <span className="upload">파일 업로드</span>
                </Stack>
                <Box className="file_name">{placeholder}</Box>
                <input
                    type={"file"}
                    accept={".xlsx,.xls"}
                    ref={input}
                    style={{display:'none'}}
                    onChange={(e) => {e.target.files && setPlaceholder(e.target.files[0].name);}}
                />
            </Stack>
            <Box className="btn_area">
                <Link to='/result'>
                    <button className="btn">계산</button>
                </Link>
            </Box>
        </div>
    );
};

export default Input;