import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../pages/css/Result.css';
import EssLecturesModal from '../components/EssLecturesModal';

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
    const [course, setCourse] = useState();
    const [studentNumber, setStudentNumber] = useState();
    const [engLevel, setEngLevel] = useState();
    const [notTakingNC, setNotTakingNC] = useState([]);
    const [notTakingBSM_GS, setNotTakingBSM_GS] = useState([]);
    const [notTakingMJ, setNotTakingMJ] = useState(["전공1"]);
    const [leadershipCredit, setleadershipCredit] = useState();
    const [GSCredit, setGSCredit] = useState();
    const [bsmExperimentCredit, setbsmExperimentCredit] = useState();
    const [isTakingNecessaryClass, setIsTakingNecessaryClass] = useState();
    //const [tempString, setTempString] = useState("");

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
                setCourse(json.Course)
                setStudentNumber(json.StudentNumber)
                setEngLevel(json.EngLevel)
                setNotTakingNC(json.notTakingNC)
                setNotTakingBSM_GS(json.notTakingBSM)
                setNotTakingMJ(json.notTakingMJ)
                setleadershipCredit(json.leadershipCredit)
                setGSCredit(json.GSCredit)
                setbsmExperimentCredit(json.bsmExperimentCredit)
                if (notTakingNC.length) setIsTakingNecessaryClass(false)
                else if (notTakingBSM_GS.length) setIsTakingNecessaryClass(false)
                else if (notTakingMJ.length) {
                    if (notTakingMJ.length === 1 && notTakingMJ[0] === "계산적사고법" && course === "일반" && studentNumber >= 2020) {
                        notTakingMJ.pop()
                    }
                    else
                        setIsTakingNecessaryClass(false)
                }
                else if (leadershipCredit < 2) setIsTakingNecessaryClass(false)
                else if (GSCredit < 9) setIsTakingNecessaryClass(false)
                else if (bsmExperimentCredit < 3) setIsTakingNecessaryClass(false)
                else setIsTakingNecessaryClass(true)
                // for (var i = 0; i < notTakingNC.length; i++){
                //     setTempString(tempString+' '+notTakingNC[i])
                // }
                // for (var i = 0; i < notTakingBSM_GS.length; i++){
                //     setTempString(tempString+notTakingBSM_GS[i])
                // }
                // for (var i=0; i < notTakingMJ.length; i++) {
                //     setTempString(tempString + notTakingMJ)
                // }
                console.log(isTakingNecessaryClass)
            })
    })

    return (
        <Box className="detail_box">
            <Accordion className="acc" onChange={handleChange('panel1')}>
                {isTakingNecessaryClass ?
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
                    <Stack direction="row" spacing={2} alignItems="center">
                        {!notTakingNC.length ?
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                <span className="category_title">공통교양</span>
                                <span className="category_content">모두 이수</span>
                            </Stack> :
                            <>
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                    <span className="category_title">공통교양</span>
                                    <span className="category_content"><b style={{ color: 'crimson' }}>{notTakingNC.length}개</b> 미이수</span>
                                </Stack>
                                <EssLecturesModal category={"공통교양"} notTakingList={notTakingNC} />
                            </>
                        }
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {!notTakingBSM_GS.length ?
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                <span className="category_title">학문기초</span>
                                <span className="category_content">모두 이수</span>
                            </Stack> :
                            <>
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                    <span className="category_title">학문기초</span>
                                    <span className="category_content"><b style={{ color: 'crimson' }}>{notTakingBSM_GS.length}개</b> 미이수</span>
                                </Stack>
                                <EssLecturesModal category={"학문기초"} notTakingList={notTakingBSM_GS} />
                            </>
                        }
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {!notTakingMJ.length ?
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                <span className="category_title">전공</span>
                                <span className="category_content">모두 이수</span>
                            </Stack> :
                            <>
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                    <span className="category_title">전공</span>
                                    <span className="category_content"><b style={{ color: 'crimson' }}>{notTakingMJ.length}개</b> 미이수</span>
                                </Stack>
                                <EssLecturesModal category={"전공"} notTakingList={notTakingMJ} />
                            </>
                        }
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {leadershipCredit >= 2 ?
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                <span className="category_title">리더쉽</span>
                                <span className="category_content">모두 이수</span>
                            </Stack> :
                            <>
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                    <span className="category_title">리더쉽</span>
                                    <span className="category_content">소셜앙트레프러너십과리더십, 글로벌앙트레프러너십과리더십, 테크노앙트레프러너십과리더십 중 하나 이수해야 함</span>
                                </Stack>
                            </>
                        }
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {GSCredit >= 9 ?
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                <span className="category_title">기본소양</span>
                                <span className="category_content">모두 이수</span>
                            </Stack> :
                            <>
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                    <span className="category_title">기본소양</span>
                                    <span className="category_content">기술창조와특허, 공학경제, 공학윤리를 이수해야 합니다.</span>
                                </Stack>
                            </>
                        }
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {bsmExperimentCredit >= 3 ?
                            <Stack className="category" direction="row" spacing={1}>
                                <img className="check_img2" alt="check_img" src="img/yeah.png"></img>
                                <span className="category_title">BSM 실험</span>
                                <span className="category_content">모두 이수</span>
                            </Stack> :
                            <>
                                <Stack className="category" direction="row" spacing={1}>
                                    <img className="check_img2" alt="check_img" src="img/nope.png"></img>
                                    <span className="category_title">BSM 실험</span>
                                    <span className="category_content">BSM 실험과목 중 하나를 이수해야 합니다</span>
                                </Stack>
                            </>
                        }
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default EssLectures;