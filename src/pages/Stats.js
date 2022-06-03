import React, { useEffect } from 'react';
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

const Stats = () => {
    let state = {
        Semester: 0,
        Count: 0,
        MajorCount: 0,
        Credit: 0,
        MajorCredit: 0,
        ClassScore: 0.0,
        MajorClassScore: 0,
    }

    useEffect(() => {
        console.log('useeffect')
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
                const s = json.Semester
                fetch("/stats", {
                    method: 'post',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(json)
                })
                    .then((res) => res.json())
                    .then((json) => {
                        state = json
                        console.log(json)
                        AllScoreData.at(3).나 = json.ClassScore
                        console.log(AllScoreData)
                    })


            })

    })

    return (
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
    );
};

export default Stats;