import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../pages/css/Result.css';
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

const EssLectures = () => {
    const [expanded, setExpanded] = useState('panel1');
    const [loading, setLoading] = useState(true);

    const [course, setCourse] = useState();
    const [studentNumber, setStudentNumber] = useState();
    const [engLevel, setEngLevel] = useState();
    const [notTakingNC, setNotTakingNC] = useState(["NULL"]);
    const [notTakingBSM_GS, setNotTakingBSM_GS] = useState(["NULL"]);
    const [notTakingMJ, setNotTakingMJ] = useState(["NULL"]);
    const [isTakingNecessaryClass, setIsTakingNecessaryClass] = useState();
    //const [tempString, setTempString] = useState("");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        const data = {
            email: sessionStorage.getItem('userId'),
            major: sessionStorage.getItem('Major')
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
            setCourse(json.Course)
            setStudentNumber(json.StudentNumber)
            setEngLevel(json.EngLevel)
            setNotTakingNC(json.notTakingNC)
            setNotTakingBSM_GS(json.notTakingBSM)
            setNotTakingMJ(json.notTakingMJ)
            if (notTakingNC.length) setIsTakingNecessaryClass(false)
            else if (notTakingBSM_GS.length) setIsTakingNecessaryClass(false)
            else if (notTakingMJ.length)
            {
                if (notTakingMJ.length === 1 && notTakingMJ[0] === "??????????????????" && course === "??????" && studentNumber >= 2020) {
                    notTakingMJ.pop()
                }
                else
                    setIsTakingNecessaryClass(false)
            }
            else setIsTakingNecessaryClass(true)
            console.log({"notTakingNC": notTakingNC, "notTakingBSM_GS": notTakingBSM_GS, "notTakingMJ": notTakingMJ})
            console.log(isTakingNecessaryClass)
        })
        setTimeout(()=> {
            setLoading(false)
            console.log("????????????") }, 5000)
    })

    return (
        <>
        {loading ? <LoadingSpinner op={false} /> : (
            <Box className="final_detail_box">
                <Accordion className="acc" onChange={handleChange('panel1')}>
                    {isTakingNecessaryClass ?
                        <>
                        {(notTakingNC[0] == "NULL" || notTakingBSM_GS[0] == "NULL" || notTakingMJ[0] == "NULL") ?
                        <div style={{
                            textAlign: "right",
                            fontSize: 12,
                            color: "#007FFF",
                        }}>?????? ?????? ?????? ?????? ?????? ??? ????????????. ????????? ??????????????????!</div> : <></>
                        }
                        <AccordionSummary aria-controls="panel1d-content">
                            <div>
                                <img className="check_img0" alt="check_img" src="img/yeah.png"></img>
                                <span className="detail_title2">????????????</span>
                            </div>
                            <span className="detail_content2">??????????????? ?????? ?????????????????????.</span>
                        </AccordionSummary>
                        </> :
                        <>
                        {(notTakingNC[0] == "NULL" || notTakingBSM_GS[0] == "NULL" || notTakingMJ[0] == "NULL") ?
                        <div style={{
                            textAlign: "right",
                            fontSize: 12,
                            color: "#007FFF",
                        }}>?????? ?????? ?????? ?????? ?????? ??? ????????????. ????????? ??????????????????!</div> : <></>
                        }
                        <AccordionSummary aria-controls="panel1d-content">
                            <div>
                                <img className="check_img0" alt="check_img" src="img/nope.png"></img>
                                <span className="detail_title2">????????????</span>
                            </div>
                            <span className="detail_content2"><b style={{ color: 'crimson' }}>?????????</b>??? ??????????????? ????????????.</span>
                        </AccordionSummary>
                        </>
                    }
                    <AccordionDetails>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {!notTakingNC.length ?
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                    <span className="category_title">????????????</span>
                                    <span className="category_content">?????? ??????</span>
                                </Stack> :
                                <Stack direction={{ xs: 'column', sm: 'row' }}>
                                    <Stack className="category" direction="row" spacing={1}>
                                        <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                        <span className="category_title">????????????</span>
                                        <span className="category_content" style={{width:80}}><b style={{ color: 'crimson' }}>{notTakingNC.length}???</b> ?????????</span>
                                    </Stack>
                                    <div className="badge_box">
                                        {
                                            notTakingNC.map((names, idx) => (<div style={{display:"inline"}} key={idx}><span className="badge">{names}</span></div>))
                                        }
                                    </div>
                                </Stack>
                            }
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {!notTakingBSM_GS.length ?
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                    <span className="category_title">????????????</span>
                                    <span className="category_content">?????? ??????</span>
                                </Stack> :
                                <Stack direction={{ xs: 'column', sm: 'row' }}>
                                    <Stack className="category" direction="row" spacing={1}>
                                        <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                        <span className="category_title">????????????</span>
                                        <span className="category_content" style={{width:80}}><b style={{ color: 'crimson' }}>{notTakingBSM_GS.length}???</b> ?????????</span>
                                    </Stack>
                                    <div className="badge_box">
                                        {
                                            notTakingBSM_GS.map((names, idx) => (<div style={{display:"inline"}} key={idx}><span className="badge">{names}</span></div>))
                                        }
                                    </div>                                
                                </Stack>
                            }
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {!notTakingMJ.length ?
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                    <span className="category_title">??????</span>
                                    <span className="category_content">?????? ??????</span>
                                </Stack> :
                                <Stack direction={{ xs: 'column', sm: 'row' }}>
                                    <Stack className="category" direction="row" spacing={1}>
                                        <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                        <span className="category_title">??????</span>
                                        <span className="category_content" style={{width:80}}><b style={{ color: 'crimson' }}>{notTakingMJ.length}???</b> ?????????</span>
                                    </Stack>
                                    <div className="badge_box">
                                        {
                                            notTakingMJ.map((names, idx) => (<div style={{display:"inline"}} key={idx}><span className="badge">{names}</span></div>))
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

export default EssLectures;