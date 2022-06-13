import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { AllScoreData } from '../data/AllScoreData';
import { MajorScoreData } from '../data/MajorScoreData';
import { CreditData } from '../data/CreditData';
import { BestLectureData } from '../data/BestLectureData';
import LChart from '../components/LChart';
import BChart from '../components/BChart';
import Header from '../components/Header';
import './css/Stats.css';
import LoadingSpinner from '../components/LoadingSpinner';

const Stats = () => {
    const [loading, setLoading] = useState(true);
    const AllScoreData = [
        { name: '1', 나: 4.0, 평균: 3.8, },
        { name: '2', 나: 4.2, 평균: 3.5, },
        { name: '3', 나: 3.8, 평균: 4.2, },
        { name: '4', 나: 3.5, 평균: 4.5, },
        { name: '5', 나: 4.5, 평균: 3.7, },
        { name: '6', 나: 4.3, 평균: 3.5, },
        { name: '7', 나: 4.3, 평균: 4.0, },
        { name: '8', 나: 4.1, 평균: 4.3, },]
    const MajorScoreData = [
        { name: '1', 나: 4.1, 평균: 3.5, },
        { name: '2', 나: 3.6, 평균: 4.1, },
        { name: '3', 나: 3.9, 평균: 3.8, },
        { name: '4', 나: 4.2, 평균: 4.0, },
        { name: '5', 나: 3.8, 평균: 3.7, },
        { name: '6', 나: 3.8, 평균: 4.1, },
        { name: '7', 나: 3.3, 평균: 3.9, },
        { name: '8', 나: 3.7, 평균: 4.3, },]
    const CreditData = [
        { name: '1', 나: 21, 평균: 21, },
        { name: '2', 나: 41, 평균: 42, },
        { name: '3', 나: 60, 평균: 63, },
        { name: '4', 나: 79, 평균: 84, },
        { name: '5', 나: 99, 평균: 105, },
        { name: '6', 나: 120, 평균: 126, },
        { name: '7', 나: 138, 평균: 134, },
        { name: '8', 나: 144, 평균: 142, },]

    useEffect(() => {
        console.log('useEffect')
        const data = {
            email: sessionStorage.getItem('userId')
        }

        fetch("/semester", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                for (var i = 0; i < json.Semester; i++) {
                    const data = {
                        email: json.email,
                        TNumber: json.TNumList[i],
                        semester: i
                    }
                    fetch("/stats", {
                        method: 'post',
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            console.log(json)
                            fetch("/updatestat", {
                                method: 'post',
                                headers: {
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(json)
                            })
                                .then((res) => res.json())
                                .then((json) => {
                                    console.log('updatestat')
                                })

                        })
                }
            })
        fetch("/getstats", {
            method: 'post',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                AllScoreData[0].나 = json.user_ent_1
                AllScoreData[1].나 = json.user_ent_2
                AllScoreData[2].나 = json.user_ent_3
                AllScoreData[3].나 = json.user_ent_4
                AllScoreData[4].나 = json.user_ent_5
                AllScoreData[5].나 = json.user_ent_6
                AllScoreData[6].나 = json.user_ent_7
                AllScoreData[7].나 = json.user_ent_8
                AllScoreData[0].평균 = json.ent_1
                AllScoreData[1].평균 = json.ent_2
                AllScoreData[2].평균 = json.ent_3
                AllScoreData[3].평균 = json.ent_4
                AllScoreData[4].평균 = json.ent_5
                AllScoreData[5].평균 = json.ent_6
                AllScoreData[6].평균 = json.ent_7
                AllScoreData[7].평균 = json.ent_8
                MajorScoreData[0].나 = json.user_maj_1
                MajorScoreData[1].나 = json.user_maj_2
                MajorScoreData[2].나 = json.user_maj_3
                MajorScoreData[3].나 = json.user_maj_4
                MajorScoreData[4].나 = json.user_maj_5
                MajorScoreData[5].나 = json.user_maj_6
                MajorScoreData[6].나 = json.user_maj_7
                MajorScoreData[7].나 = json.user_maj_8
                MajorScoreData[0].평균 = json.maj_1
                MajorScoreData[1].평균 = json.maj_2
                MajorScoreData[2].평균 = json.maj_3
                MajorScoreData[3].평균 = json.maj_4
                MajorScoreData[4].평균 = json.maj_5
                MajorScoreData[5].평균 = json.maj_6
                MajorScoreData[6].평균 = json.maj_7
                MajorScoreData[7].평균 = json.maj_8
                CreditData[0].나 = json.user_sem_1
                CreditData[1].나 = json.user_sem_2
                CreditData[2].나 = json.user_sem_3
                CreditData[3].나 = json.user_sem_4
                CreditData[4].나 = json.user_sem_5
                CreditData[5].나 = json.user_sem_6
                CreditData[6].나 = json.user_sem_7
                CreditData[7].나 = json.user_sem_8
                CreditData[0].평균 = json.sem_1
                CreditData[1].평균 = json.sem_2
                CreditData[2].평균 = json.sem_3
                CreditData[3].평균 = json.sem_4
                CreditData[4].평균 = json.sem_5
                CreditData[5].평균 = json.sem_6
                CreditData[6].평균 = json.sem_7
                CreditData[7].평균 = json.sem_8
            })
        setTimeout(() => {
            setLoading(false)
            console.log("로딩종료")
        }, 5000)
    }, [])

    return (
        <>
<<<<<<< HEAD
            {loading ? <LoadingSpinner /> : (
                <div className="fade-in">
                    <Header mypage signout />
                    <Box className="sub_title">
                        통계
                    </Box>
                    <Stack
                        style={{ margin: '20px 80px 0 80px' }}
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LChart data={AllScoreData} title="전체평점 비교" dataKey={'평점'} />
                        <LChart data={MajorScoreData} title="전공평점 비교" dataKey="평점" />
                        <LChart data={CreditData} title="이수학점 비교" dataKey="학점" />
                    </Stack>
                    <Stack style={{ marginBottom: '80px' }} justifyContent="center" alignItems="center">
                        <Box className="B_PC">
                            <BChart data={BestLectureData}></BChart>
                        </Box>
                        <Box className="B_mobile">
                            <BChart data={BestLectureData} isMobile></BChart>
                        </Box>
                    </Stack>
                </div>
            )}
=======
        {loading ? <LoadingSpinner op={true} /> : (
            <div className="fade-in">
                <Header mypage signout />
                <Box className="sub_title">
                통계
                </Box>
                <Stack 
                    style={{margin:'20px 80px 80px 80px'}} 
                    direction={{xs:'column', sm:'row'}}
                    justifyContent="center"
                    alignItems="center"
                >
                    <LChart data={AllScoreData} title="전체평점 비교" dataKey={'평점'} />
                    <LChart data={MajorScoreData} title="전공평점 비교" dataKey="평점" />
                    <LChart data={CreditData} title="이수학점 비교" dataKey="학점" />
                </Stack>
                {/* <Stack style={{marginBottom:'80px'}}  justifyContent="center" alignItems="center">
                    <Box className="B_PC">
                        <BChart data={BestLectureData}></BChart>
                    </Box>
                    <Box className="B_mobile">
                        <BChart data={BestLectureData} isMobile></BChart>
                    </Box>
                </Stack> */}
            </div>
        )}
>>>>>>> 463b9881b17d82c0d5581fae6d8e2b83b5ed1a6f
        </>
    )
}


export default Stats;