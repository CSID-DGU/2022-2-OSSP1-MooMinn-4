import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './css/Result.css';
import Header from '../components/Header';
import AlertModal from '../components/AlertModal';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(-2),
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: '#F6f6f6',
}));

const Result = () => {
    const [expanded, setExpanded] = React.useState('panel1');
    const [hasResult, setHasResult] = React.useState();
    
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        const data = {
            email: sessionStorage.getItem('userId')
        }
        fetch("/result", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json)
            setHasResult(json.result)
        })
    })

    return (
        <div className="fade-in">
            {!hasResult && 
                <AlertModal 
                    msg1="저장된 결과가 없습니다."
                    msg2="성적 파일을 입력해주세요!"
                    move1="/input"
                    move2="/input" // 정상적으로 동작하면 move2="/" 로 수정
                    op1="확인"
                    op2="취소"
                    />
            }
            <Header mypage signout />
            <Stack className="result_stack" justifyContent="center" direction="row">
                <span className="r0">졸업</span>
                <span className="r1">불가능</span>
                <span className="r0">합니다!</span>
                {/* <span className="r0">졸업</span>
                <span className="r2">가능</span>
                <span className="r0">합니다! 🥳</span> */}
            </Stack>
            <Box className="result_detail">
                <Box className="detail_box">
                    <div className="stack">
                        <img className="check_img" alt="nope" src="img/nope.png"></img>
                        <span className="detail_title">등록학기</span>
                    </div>
                    <span className="detail_content"><u>5학기</u>를 이수하였습니다. <b style={{ color: 'crimson' }}>3학기</b>가 부족합니다.</span>
                </Box>
                <Box className="detail_box">
                    <div className="stack">
                        <img className="check_img" alt="yeah" src="img/yeah.png"></img>
                        <span className="detail_title">외국어성적</span>
                    </div>
                    <span className="detail_content"><u>850점</u>으로 700점 이상입니다.</span>
                </Box>
                <Box className="detail_box">
                    <Accordion className="acc" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content">
                            <div>
                                <img className="check_img0" alt="nope" src="img/nope.png"></img>
                                <span className="detail_title2">취득학점</span>
                            </div>
                            <span className="detail_content2">총 <u>122학점</u>으로 <b style={{ color: 'crimson' }}>18학점</b>이 부족합니다.</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="yeah" src="img/yeah.png"></img>
                                <span className="category_title">공통교양</span>
                                <span className="category_content">16 / 16</span>
                            </Stack>
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="nope" src="img/nope.png"></img>
                                <span className="category_title">학문기초</span>
                                <span className="category_content">2 / 30</span>
                            </Stack>
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="nope" src="img/nope.png"></img>
                                <span className="category_title">전공</span>
                                <span className="category_content">3 / 84</span>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box className="detail_box">
                    <div className="stack">
                        <img className="check_img" alt="yeah" src="img/yeah.png"></img>
                        <span className="detail_title">성적평점</span>
                    </div>
                    <span className="detail_content"><u>4.5점</u>으로 2.0점 이상입니다.</span>
                </Box>
                <Box className="detail_box">
                    <div className="stack">
                        <img className="check_img" alt="yeah" src="img/yeah.png"></img>
                        <span className="detail_title">필수강의</span>
                    </div>
                    <span className="detail_content">필수강의를 모두 이수하였습니다.</span>
                </Box>
                <Box className="detail_box">
                    <div className="stack">
                        <img className="check_img" alt="nope" src="img/nope.png"></img>
                        <span className="detail_title">영어강의</span>
                    </div>
                    <span className="detail_content"><u>3강의</u>를 이수하였습니다. <b style={{ color: 'crimson' }}>1강의</b>가 부족합니다.</span>
                </Box>
                <Box className="final_detail_box">
                    <div className="stack">
                        <img className="check_img" alt="yeah" src="img/yeah.png"></img>
                        <span className="detail_title">졸업논문</span>
                    </div>
                    <span className="detail_content">컴퓨터공학종합설계 1,2를 모두 이수하였습니다.</span>
                </Box>
            </Box>
        </div>
    );
};

export default Result;