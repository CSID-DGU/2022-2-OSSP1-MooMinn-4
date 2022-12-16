import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './css/Result.css';
import Header from '../Components/Header';
import AlertModal from '../Components/AlertModal';
import LoadingSpinner from '../Components/LoadingSpinner';

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
    const [expanded, setExpanded] = useState('panel1');
    const [loading, setLoading] = useState(true);

    const [takingNC, setTakingNC] = useState(["NULL"]);
    const [takingBSM, setTakingBSM] = useState(["NULL"]);
    const [takingMJ, setTakingMJ] = useState(["NULL"]);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        const data = {
            email: sessionStorage.getItem('userId')
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
            setTakingNC(json.TakingNC)
            setTakingBSM(json.TakingBSM)
            setTakingMJ(json.TakingMJ)
        })
        setTimeout(()=> {
            setLoading(false)
            console.log("로딩종료") }, 5000)
    })

    return (
        <>
        {loading ? <LoadingSpinner op={false} /> : (
            
            <Box className="final_detail_box">
                <Header mypage signout />
                <Box className="mypage">
                    필수 과목 정보
                </Box>
                <Accordion className="acc" onChange={handleChange('panel1')}>
                        <>
                        <AccordionSummary aria-controls="panel1d-content">
                            <div>
                                <span className="detail_title2">필수강의</span>
                            </div>
                            <span className="detail_content2">졸업에 필요한 필수강의 목록입니다.</span>
                        </AccordionSummary>
                        </>
                    <AccordionDetails>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {!takingNC.length ?
                                <Stack className="category" direction="row" spacing={1}>
                                    <span className="category_title">공통교양</span>
                                    <span className="category_content">해당없음</span>
                                </Stack> :
                                <Stack direction={{ xs: 'column', sm: 'row' }}>
                                    <Stack className="category" direction="row" spacing={1}>
                                        <span className="category_title">공통교양</span>
                                        <span className="category_content" style={{width:80}}><b style={{ color: 'crimson' }}>{takingNC.length}개</b> 이수가 필요합니다.</span>
                                    </Stack>
                                    <div className="badge_box">
                                        {
                                            takingNC.map((names, idx) => (<div style={{display:"inline"}} key={idx}><span className="badge2">{names}</span></div>))
                                        }
                                    </div>
                                </Stack>
                            }
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {!takingBSM.length ?
                                <Stack className="category" direction="row" spacing={1}>
                                    <span className="category_title">BSM</span>
                                    <span className="category_content">해당없음</span>
                                </Stack> :
                                <Stack direction={{ xs: 'column', sm: 'row' }}>
                                    <Stack className="category" direction="row" spacing={1}>
                                        <span className="category_title">BSM</span>
                                        <span className="category_content" style={{width:80}}><b style={{ color: 'crimson' }}>{takingBSM.length}개</b> 이수가 필요합니다.</span>
                                    </Stack>
                                    <div className="badge_box">
                                        {
                                            takingBSM.map((names, idx) => (<div style={{display:"inline"}} key={idx}><span className="badge2">{names}</span></div>))
                                        }
                                    </div>                                
                                </Stack>
                            }
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {!takingMJ.length ?
                                <Stack className="category" direction="row" spacing={1}>
                                    <span className="category_title">전공</span>
                                    <span className="category_content">해당없음</span>
                                </Stack> :
                                <Stack direction={{ xs: 'column', sm: 'row' }}>
                                    <Stack className="category" direction="row" spacing={1}>
                                        <span className="category_title">전공</span>
                                        <span className="category_content" style={{width:80}}><b style={{ color: 'crimson' }}>{takingMJ.length}개</b> 이수가 필요합니다.</span>
                                    </Stack>
                                    <div className="badge_box">
                                        {
                                            takingMJ.map((names, idx) => (<div style={{display:"inline"}} key={idx}><span className="badge2">{names}</span></div>))
                                        }
                                    </div>                                
                                </Stack>
                            }
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>
        )}
        </>
    );
};

export default Result;