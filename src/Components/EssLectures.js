import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../pages/css/Result.css';

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

const EssLectures = () => {
    const [expanded, setExpanded] = useState('panel1');
    
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        const data = {
            email: sessionStorage.getItem('userId')
        }
        fetch("/result/essLectures", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((json) => {
            // 받아온 json파일 변수에 저장
        })
    })

    return (
        <Box className="detail_box">
            <Accordion className="acc" onChange={handleChange('panel1')}>
                {true ?
                    <AccordionSummary aria-controls="panel1d-content">
                        <div>
                            <img className="check_img0" alt="check_img" src="img/yeah.png"></img>
                            <span className="detail_title2">필수강의</span>
                        </div>
                        <span className="detail_content2">필수강의를 모두 이수하였습니다.</span>
                    </AccordionSummary> :
                    <AccordionSummary aria-controls="panel1d-content">
                        <div>
                            <img className="check_img0" alt="check_img" src="img/nope.png"></img>
                            <span className="detail_title2">필수강의</span>
                        </div>
                        <span className="detail_content2"><b style={{ color: 'crimson' }}>미이수</b>한 필수강의가 있습니다.</span>
                    </AccordionSummary>
                }
                <AccordionDetails>
                    {/* {true ?
                        <Stack className="category" direction="row" spacing={1}>
                            <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                            <span className="category_title">공통교양</span>
                            <span className="category_content">0 / 14</span>
                        </Stack> :
                        <Stack className="category" direction="row" spacing={1}>
                            <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                            <span className="category_title">공통교양</span>
                            <span className="category_content"><b style={{ color: 'crimson' }}>0</b> / 14</span>
                        </Stack>
                    } */}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default EssLectures;