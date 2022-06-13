const express = require('express')
const path = require('path')
const app = express()
const port = 3001;
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const http = require('http').createServer(app)
let nodemailer = require('nodemailer');


const connection = mysql.createConnection({
    host: 'canigraduate.ctkzirrnabqi.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'turning123!',
    database: 'graduation',
})

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/emailcheck", (req, res) => {
    const email = req.body.email

    var sql = 'SELECT COUNT(*) AS result FROM UserInfo WHERE ID = ?'
    connection.query(sql, [email],
        function (err, data) {
            if (!err) {
                res.json(data[0])
            }
            else {
                res.json(err)
            }
        })
})

app.post("/signup", (req, res) => {
    const email = req.body.email
    const pw = req.body.pw
    const year = req.body.year
    const semester = req.body.semester
    const course = req.body.course
    const english = req.body.english
    const score = req.body.score

    var sql = 'INSERT INTO UserInfo (`ID`, `Pincode`, `Semester`, `StudentNumber`, `Course`, `Score`, `EnglishGrade`) VALUES (?, ?, ?, ?, ?, ?, ?)'
    var params = [email, pw, semester, year, course, score, english]
    console.log(sql + params)
    connection.query(sql, params,
        function (err, rows) {
            if (!err) {
                res.end()
            } else {
                res.json(err)
            }
        })
})

app.post("/input", (req, res) => {
    const UserDatas = req.body

    for (var i = 1; i < UserDatas.length; i++) {
        const UserID = UserDatas[0].email
        const TNumber = UserDatas[i].TNumber
        const CNumber = UserDatas[i].CNumber
        const ClassScore = UserDatas[i].ClassScore
        var sql = 'INSERT INTO `UserSelectList` VALUES (?, ?, ?, ?)';
        var params = [UserID, TNumber, CNumber, ClassScore]
        console.log(sql + params)
        connection.query(sql, params,
            function (err) {
                if (!err) {
                    console.log("성공")
                } else {
                    console.log("실패", err)
                }
            })
    }

    const email = req.body.email
    connection.query("SELECT COUNT(*) AS result FROM UserSelectList WHERE UserID = ?", [email],
        function (err, data) {
            var sendResult = {};
            if (!err) {
                if (data[0].result > 0) {
                    console.log(data[0].result, true, ": 결과가 있음")
                    sendResult = { result: true }
                }
                else {
                    console.log(data[0].result, false, ": 결과가 없음")
                    sendResult = { result: false }
                    // res.send(sendResult)
                }
            }
            else {
                console.log("결과 존재여부 판별 error")
            }
            res.send(sendResult)
        }
    )
})

app.post("/signin", (req, res) => {
    const email = req.body.email
    const pw = req.body.pw
    var sql1 = 'SELECT COUNT(*) AS result FROM UserInfo WHERE ID = ?'
    connection.query(sql1, [email],
        function (err, data) {
            if (!err) {
                console.log(data[0].result)
                if (data[0].result < 1) {
                    res.json({ 'msg': '잘못된 ID입니다.' })
                } else { // 동일한 id 가 있으면 비밀번호 일치 확인
                    const sql2 = `SELECT 
                                    CASE (SELECT COUNT(*) FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                        WHEN '0' THEN NULL
                                        ELSE (SELECT ID FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                    END AS id
                                    , CASE (SELECT COUNT(*) FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                        WHEN '0' THEN NULL
                                        ELSE (SELECT Pincode FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                    END AS pw`;
                    // sql 란에 필요한 parameter 값을 순서대로 기재
                    const params = [email, pw, email, pw, email, pw, email, pw]
                    connection.query(sql2, params, (err, data) => {
                        if (!err) {
                            res.json(data[0])
                        }
                        else {
                            res.json(err)
                        }
                    })
                }
            }
            else {
                res.json(err)
            }
        })
})

app.post('/isthereemail', (req, res) => {
    const email = req.body.email

    const sql = 'SELECT COUNT(*) AS result FROM UserInfo WHERE ID = ?'
    connection.query(sql, [email],
        function (err, data) {
            if (!err) {
                res.json(data[0])
            }
        })
})

app.post('/sendemail', (req, res) => {
    const email = req.body.email
    console.log(email)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
            user: 'wdse123@gmail.com',
            pass: 'zmalqp-6213'
        }
    })

    var generateRandom = function (min, max) {
        var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return ranNum;
    }
    const number = String(generateRandom(111111, 999999))

    console.log(number)
    let info = transporter.sendMail({
        from: 'wdse123@gmail.com',
        to: email,
        subject: '[졸업할 수 있을까?] 인증 관련 이메일 입니다.',
        text: '인증 보안 코드 : ' + number
    })
    res.json({ number: number })
})

app.post('/changepw', (req, res) => {
    const email = req.body.email
    const pw = req.body.pw

    var sql = 'UPDATE `UserInfo` SET `Pincode` = ? WHERE `ID` = ?'
    const params = [pw, email]
    connection.query(sql, params,
        function (err, data) {
            if (!err) {
                res.end()
            }
            else {
                res.json(err)
            }
        })
})

app.post('/mypage', (req, res) => {
    const email = req.body.email

    var sql = 'SELECT * FROM UserInfo WHERE ID = ?'
    connection.query(sql, [email],
        function (err, data) {
            if (!err) {
                res.json(data[0])
            }
            else {
                res.json(err)
            }
        })
})

app.post('/result/essLectures', (req, res) => {
    const email = req.body.email

    // basic, eas1, eas2, 자명1, 자명2, 불인, 기보작, 커디
    var notTakingNC = ['basicEAS', 'EAS1', 'EAS2', '자아와명상1', '자아와명상2', '불교와인간', '기술보고서작성', '커리어디자인']
    // 리더십 2학점
    var leadershipCredit = 0;
    var leadership = "리더십 과목 중 택 1";
    // 미적1, 확통, 공선대
    var notTakingBSM = ['미적분학및연습1', '확률및통계학', '공학선형대수학']
    // 기본 소양 9학점
    var GSCredit = 0;
    var GS = "기본소양 과목 중 택 ";
    // 실험 과목 4학점
    var bsmExperimentCredit = 0;
    var bsmExperiment = "과학실험 과목 중 택 1";
    // 계사, 공소, 어벤디, 자구, 컴구, 이산, 종설1, 종설2, 시소프
    var notTakingMJ = ['계산적사고법', '공개SW프로젝트', '어드벤처디자인', '자료구조와실습', '컴퓨터구성', '이산구조', '컴퓨터종합설계1', '컴퓨터종합설계2', '시스템소프트웨어와실습']
    var data = {
        notTakingNC: notTakingNC,
        notTakingBSM: notTakingBSM,
        notTakingMJ: notTakingMJ,
        leadershipCredit: leadershipCredit,
        GSCredit: GSCredit,
        bsmExperimentCredit: bsmExperimentCredit
    }

    var sql = ''
    var index = 0

    // 영어등급에 따라 EAS 수강 여부 결정
    sql = 'SELECT EnglishGrade FROM UserInfo WHERE ID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                if (result[0].EnglishGrade === '0') {
                    // S0일 경우 basic EAS부터 세 개(BASIC EAS1 EAS2를 지움
                    notTakingNC.splice(notTakingNC.findIndex(function (value) { return value === 'basicEAS' }), 3)
                }
                else if (result[0].EnglishGrade !== '4') {
                    notTakingNC.splice(notTakingNC.findIndex(function (value) { return value === 'basicEAS' }), 1)
                }
            }
        })

    // 일반과정이고 20학번 이후로는 계사, 공소 제외

    sql = 'select COUNT(*) AS count from UserSelectList where UserID = ? AND CNumber LIKE ?'
    // Basic EAS
    connection.query(sql, [email, 'RGC1030%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === 'basicEAS' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // EAS1
    connection.query(sql, [email, 'RGC1033%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === 'EAS1' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // EAS2
    connection.query(sql, [email, 'RGC1034%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === 'EAS2' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 자명1
    connection.query(sql, [email, 'RGC0017%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '자아와명상1' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 자명2
    connection.query(sql, [email, 'RGC0018%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '자아와명상2' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 불인
    connection.query(sql, [email, 'RGC0003%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '불교와인간' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 기보작 RGC0005
    connection.query(sql, [email, 'RGC0005%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '기술보고서작성' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 커디 RGC1074
    connection.query(sql, [email, 'RGC1074%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '커리어디자인' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 나삶나비 RGC1001
    connection.query(sql, [email, 'RGC1001%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '커리어디자인' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // 미적1 PRI4001
    connection.query(sql, [email, 'PRI4001%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '미적분학및연습1' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    // 확통 PRI4023
    connection.query(sql, [email, 'PRI4023%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '확률및통계학' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    // 공선대 PRI4024
    connection.query(sql, [email, 'PRI4024%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '공학선형대수학' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    // 계사 CSE2025
    connection.query(sql, [email, 'CSE2025%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '계산적사고법' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 공소 CSE4074
    connection.query(sql, [email, 'CSE4074%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '공개SW프로젝트' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 어벤디 CSE2028
    connection.query(sql, [email, 'CSE2028%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '어드벤처디자인' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 창공 CSE2016
    connection.query(sql, [email, 'CSE2016%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '어드벤처디자인' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 자구 CSE2017
    connection.query(sql, [email, 'CSE2017%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '자료구조와실습' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 컴구 CSE2018
    connection.query(sql, [email, 'CSE2018%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '컴퓨터구성' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 이산 CSE2026
    connection.query(sql, [email, 'CSE2026%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '이산구조' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 종설1 CSE4066
    connection.query(sql, [email, 'CSE4066%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '컴퓨터종합설계1' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 종설2 CSE4067
    connection.query(sql, [email, 'CSE4067%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '컴퓨터종합설계2' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 시소프 CSE2013
    connection.query(sql, [email, 'CSE2013%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '시스템소프트웨어와실습' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // 소셜리더십 RGC1050
    connection.query(sql, [email, 'RGC1050%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    leadershipCredit += 2;
                }
            }
        })
    // 글로벌리더십 RGC1051
    connection.query(sql, [email, 'RGC1051%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    leadershipCredit += 2;
                }
            }
        })
    // 테크노리더십 RGC1052
    connection.query(sql, [email, 'RGC1052%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    leadershipCredit += 2;
                }
            }
        })
    // 물실1 PRI4002
    connection.query(sql, [email, 'PRI4002%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // 화실1 PRI4003
    connection.query(sql, [email, 'PRI4003%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // 생실 PRI4004
    connection.query(sql, [email, 'PRI4004%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // 물실2 PRI4013
    connection.query(sql, [email, 'PRI4013%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // 화실2 PRI4014
    connection.query(sql, [email, 'PRI4014%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // 생실1 PRI4015
    connection.query(sql, [email, 'PRI4015%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // 공경 PRI4041
    connection.query(sql, [email, 'PRI4041%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    GSCredit += 3;
                }
            }
        })
    // 공윤 EGC4039
    connection.query(sql, [email, 'EGC4039%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    GSCredit += 3;
                }
            }
        })
    // 기창특 EGC7026
    connection.query(sql, [email, 'EGC7026%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    GSCredit += 3;
                }
            }
        })

    // 기사 PRI4040
    sql = 'SELECT count(ClassArea) AS count from UserSelectList,Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? AND CNumber LIKE ?'
    connection.query(sql, [email, 'PRI4040%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    sql = 'SELECT ClassArea from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? AND CNumber LIKE ?'
                    connection.query(sql, [email, 'PRI4040%'],
                        function (err, result) {
                            if (!err) {
                                if (result[0].ClassArea === '기본소양')
                                    GSCredit += 3
                            }
                        })
                }
            }
        })

    // 공법 PRI4043
    sql = 'SELECT count(ClassArea) AS count from UserSelectList,Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? AND CNumber LIKE ?'
    connection.query(sql, [email, 'PRI4043%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    sql = 'SELECT ClassArea from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? AND CNumber LIKE ?'
                    connection.query(sql, [email, 'PRI4043%'],
                        function (err, result) {
                            if (!err) {
                                if (result[0].ClassArea === '기본소양')
                                    GSCredit += 3
                            }
                            if (leadershipCredit < 2) notTakingNC.push(leadership)
                            if (GSCredit < 3) notTakingBSM.push(GS+"3")
                            else if (GSCredit < 6) notTakingBSM.push(GS+"2")
                            else if (GSCredit < 9) notTakingBSM.push(GS+"1")
                            if (bsmExperimentCredit < 3) notTakingBSM.push(bsmExperiment)        
                            data = {
                                name: 0,
                                notTakingNC: notTakingNC,
                                notTakingBSM: notTakingBSM,
                                notTakingMJ: notTakingMJ,
                            }
                            console.log(data)
                            res.json(data)
                        })
                }
                else {
                    if (leadershipCredit < 2) notTakingNC.push(leadership)
                    if (GSCredit < 3) notTakingBSM.push(GS+"3")
                    else if (GSCredit < 6) notTakingBSM.push(GS+"2")
                    else if (GSCredit < 9) notTakingBSM.push(GS+"1")
                    if (bsmExperimentCredit < 3) notTakingBSM.push(bsmExperiment)
                    data = {
                        name: 1,
                        notTakingNC: notTakingNC,
                        notTakingBSM: notTakingBSM,
                        notTakingMJ: notTakingMJ,
                    }
                    console.log(data)
                    res.json(data)
                }
            }
        })
})

app.post('/semester', (req, res) => {
    const email = req.body.email
    var Credit = 0;
    var Count = 0;
    var ClassScore = 0;
    var Semester = 0;
    var TNumList = []
    var data = {
        email: email,
        Semester: Semester,
        TNumList: TNumList,
    }
    var sql = ''
    sql = 'INSERT INTO ScoreStat (UID) VALUES (?)'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {

            }
        })

    // 전체 총 이수학점을 구한 후 DB와 credit에 저장
    sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                Credit = result[0].credit
                sql = 'UPDATE ScoreStat SET EntireCredit = ? WHERE UID = ?'
                connection.query(sql, [result[0].credit, email],
                    function (err) {

                    })
            }
        })

    // 전체 총 이수과목 수를 구한 후 count에 저장
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                Count = result[0].count
            }
        })

    // 사용자의 전체 평점을 구한 후 ClassScore에 저장
    var sql = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                for (var i = 0; i < Count; i++) {
                    var grade = result[i].ClassScore
                    var credit = result[i].ClassCredit
                    if (grade === 'A+') { ClassScore += 4.5 * credit }
                    else if (grade === 'A0') { ClassScore += 4.0 * credit }
                    else if (grade === 'B+') { ClassScore += 3.5 * credit }
                    else if (grade === 'B0') { ClassScore += 3.0 * credit }
                    else if (grade === 'C+') { ClassScore += 2.5 * credit }
                    else if (grade === 'C0') { ClassScore += 2.0 * credit }
                    else if (grade === 'D+') { ClassScore += 1.5 * credit }
                    else if (grade === 'D0') { ClassScore += 1.0 * credit }
                    else if (grade === 'P') { Credit -= credit }
                    else if (grade === 'F') { }
                }
                ClassScore /= Credit
                sql = 'UPDATE ScoreStat SET EntireScore = ? WHERE UID = ?'
                connection.query(sql, [ClassScore, email],
                    function (err) {

                    })
            }
        })

    // 사용자의 학기 수를 구한 후 Semester에 저장
    sql = 'SELECT COUNT(c.TNumber) AS semester FROM (select TNumber, count(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? group by TNumber) AS c;'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                Semester = result[0].semester
                data.Semester = Semester
                // 사용자가 이수한 학기 목록을 TNumList에 저장
                sql = 'select TNumber, count(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? group by TNumber';
                connection.query(sql, [email],
                    function (err, result) {
                        if (!err) {
                            for (var i = 0; i < Semester; i++) {
                                TNumList.push(result[i].TNumber)
                            }
                        }
                        data.TNumList = TNumList
                        res.json(data)
                    })

            }
        })
})

app.post('/stats', (req, res) => {
    const email = req.body.email
    const TNumber = req.body.TNumber
    const semester = req.body.semester
    const semesters = ['Semester_1', 'Semester_2', 'Semester_3', 'Semester_4', 'Semester_5', 'Semester_6', 'Semester_7', 'Semester_8']
    var SemesterData = {
        email: email,
        semester: semester,
        Count: 0,
        MajorCount: 0,
        Credit: 0,
        MajorCredit: 0,
        ClassScore: 0.0,
        MajorClassScore: 0.0,
    }
    var sql = ''


    // 사용자의 이수학점을 구한 후  Credit에 저장
    sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
                SemesterData.Credit = result[0].credit
                /*sql = 'UPDATE ScoreStat SET '
                sql += semesters[semester]
                sql += ' = ? WHERE UID = ?'
                connection.query(sql, [SemesterData.Credit, email],
                    function (err) {
                        if (!err) {

                        }
                    })
                */
            }
        })
    // 사용자의 이수과목 수를 구한 후 Count에 저장
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
                SemesterData.Count = result[0].count
            }
        })

    // 사용자의 전체 평점을 구한 후 ClassScore에 저장
    var sql = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
                var tmpCredit = SemesterData.Credit
                for (var i = 0; i < SemesterData.Count; i++) {
                    var grade = result[i].ClassScore
                    var credit = result[i].ClassCredit
                    if (grade === 'A+') { SemesterData.ClassScore += 4.5 * credit }
                    else if (grade === 'A0') { SemesterData.ClassScore += 4.0 * credit }
                    else if (grade === 'B+') { SemesterData.ClassScore += 3.5 * credit }
                    else if (grade === 'B0') { SemesterData.ClassScore += 3.0 * credit }
                    else if (grade === 'C+') { SemesterData.ClassScore += 2.5 * credit }
                    else if (grade === 'C0') { SemesterData.ClassScore += 2.0 * credit }
                    else if (grade === 'D+') { SemesterData.ClassScore += 1.5 * credit }
                    else if (grade === 'D0') { SemesterData.ClassScore += 1.0 * credit }
                    else if (grade === 'P') { tmpCredit -= credit }
                    else if (grade === 'F') { }
                }
                SemesterData.ClassScore /= tmpCredit
            }
        })

    // 사용자의 전공이수학점을 구한 후 MajorCredit에 저장
    var sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '전공'],
        function (err, result) {
            if (!err) {
                SemesterData.MajorCredit = result[0].credit
            }
        })

    // 사용자의 전공이수과목 수를 구한 후 MajorCount에 저장
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '전공'],
        function (err, result) {
            if (!err) {
                SemesterData.MajorCount = result[0].count
            }
        })

    // 사용자의 전공 평점을 구한 후 MajorClassScore에 저장
    var sql = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '전공'],
        function (err, result) {
            if (!err) {
                for (var i = 0; i < SemesterData.MajorCount; i++) {
                    var grade = result[i].ClassScore
                    var credit = result[i].ClassCredit
                    if (grade === 'A+') { SemesterData.MajorClassScore += 4.5 * credit }
                    else if (grade === 'A0') { SemesterData.MajorClassScore += 4.0 * credit }
                    else if (grade === 'B+') { SemesterData.MajorClassScore += 3.5 * credit }
                    else if (grade === 'B0') { SemesterData.MajorClassScore += 3.0 * credit }
                    else if (grade === 'C+') { SemesterData.MajorClassScore += 2.5 * credit }
                    else if (grade === 'C0') { SemesterData.MajorClassScore += 2.0 * credit }
                    else if (grade === 'D+') { SemesterData.MajorClassScore += 1.5 * credit }
                    else if (grade === 'D0') { SemesterData.MajorClassScore += 1.0 * credit }
                    else if (grade === 'P') { SemesterData.Credit -= credit }
                    else if (grade === 'F') { }
                }
                SemesterData.MajorClassScore /= SemesterData.MajorCredit
                res.json(SemesterData)
            }
        })
})

app.post('/updatestat', (req, res) => {
    const ent = ['FirEnt', 'SecEnt', 'TrdEnt', 'FthEnt', 'FifEnt', 'SixEnt', 'SevEnt', 'EigEnt']
    const maj = ['FirMaj', 'SecMaj', 'TrdMaj', 'FthMaj', 'FifMaj', 'SixMaj', 'SevMaj', 'EigMaj']
    const semesters = ['Semester_1', 'Semester_2', 'Semester_3', 'Semester_4', 'Semester_5', 'Semester_6', 'Semester_7', 'Semester_8']
    const email = req.body.email
    const semester = req.body.semester
    const EntScore = req.body.ClassScore
    const MajScore = req.body.MajorClassScore
    var Credit = req.body.Credit

    var sql = ''
    sql = 'UPDATE ScoreStat SET '
    sql += ent[semester]
    sql += ' = ? WHERE UID = ?'
    connection.query(sql, [EntScore, email],
        function (err,) {
            if (!err) {

            }
        })

    sql = 'UPDATE ScoreStat SET '
    sql += maj[semester]
    sql += ' = ? WHERE UID = ?'
    connection.query(sql, [MajScore, email],
        function (err) {
            if (!err) {

            }
        })


    sql = 'UPDATE ScoreStat SET '
    sql += semesters[semester]
    sql += ' = ? WHERE UID = ?'
    connection.query(sql, [Credit, email],
        function (err) {
            if (!err) {

            }
        })

})

app.post('/getstats', (req, res) => {
    const email = req.body.email
    var data = {
        user_ent_1: 0,
        user_ent_2: 0,
        user_ent_3: 0,
        user_ent_4: 0,
        user_ent_5: 0,
        user_ent_6: 0,
        user_ent_7: 0,
        user_ent_8: 0,
        user_maj_1: 0,
        user_maj_2: 0,
        user_maj_3: 0,
        user_maj_4: 0,
        user_maj_5: 0,
        user_maj_6: 0,
        user_maj_7: 0,
        user_maj_8: 0,
        user_sem_1: 0,
        user_sem_2: 0,
        user_sem_3: 0,
        user_sem_4: 0,
        user_sem_5: 0,
        user_sem_6: 0,
        user_sem_7: 0,
        user_sem_8: 0,
        ent_1: 0,
        ent_2: 0,
        ent_3: 0,
        ent_4: 0,
        ent_5: 0,
        ent_6: 0,
        ent_7: 0,
        ent_8: 0,
        maj_1: 0,
        maj_2: 0,
        maj_3: 0,
        maj_4: 0,
        maj_5: 0,
        maj_6: 0,
        maj_7: 0,
        maj_8: 0,
        sem_1: 0,
        sem_2: 0,
        sem_3: 0,
        sem_4: 0,
        sem_5: 0,
        sem_6: 0,
        sem_7: 0,
        sem_8: 0
    }
    var sql = '';

    // user_ent, user_maj, user_sem
    sql = 'SELECT * FROM ScoreStat WHERE UID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                data.user_ent_1 = result[0].FirEnt
                data.user_ent_2 = result[0].SecEnt
                data.user_ent_3 = result[0].TrdEnt
                data.user_ent_4 = result[0].FthEnt
                data.user_ent_5 = result[0].FifEnt
                data.user_ent_6 = result[0].SixEnt
                data.user_ent_7 = result[0].SevEnt
                data.user_ent_8 = result[0].EigEnt
                data.user_maj_1 = result[0].FirMaj
                data.user_maj_2 = result[0].SecMaj
                data.user_maj_3 = result[0].TrdMaj
                data.user_maj_4 = result[0].FthMaj
                data.user_maj_5 = result[0].FifMaj
                data.user_maj_6 = result[0].SixMaj
                data.user_maj_7 = result[0].SevMaj
                data.user_maj_8 = result[0].EigMaj
                data.user_sem_1 = result[0].Semester_1
                data.user_sem_2 = result[0].Semester_2 + data.user_sem_1
                data.user_sem_3 = result[0].Semester_3 + data.user_sem_2
                data.user_sem_4 = result[0].Semester_4 + data.user_sem_3
                data.user_sem_5 = result[0].Semester_5 + data.user_sem_4
                data.user_sem_6 = result[0].Semester_6 + data.user_sem_5
                data.user_sem_7 = result[0].Semester_7 + data.user_sem_6
                data.user_sem_8 = result[0].Semester_8 + data.user_sem_7
            }
        })

    // ent_1 - ent_8
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FirEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FirEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_1 += result[i].FirEnt
                    }
                    data.ent_1 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SecEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SecEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_2 += result[i].SecEnt
                    }
                    data.ent_2 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE TrdEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE TrdEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_3 += result[i].TrdEnt
                    }
                    data.ent_3 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FthEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FthEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_4 += result[i].FthEnt
                    }
                    data.ent_4 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FifEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FifEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_5 += result[i].FifEnt
                    }
                    data.ent_5 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SixEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SixEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_6 += result[i].SixEnt
                    }
                    data.ent_6 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SevEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SevEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_7 += result[i].SevEnt
                    }
                    data.ent_7 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE EigEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE EigEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.ent_8 += result[i].EigEnt
                    }
                    data.ent_8 /= count[0].count
                })
        })

    // maj_1 - maj_8
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FirMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FirMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_1 += result[i].FirMaj
                    }
                    data.maj_1 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SecMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SecMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_2 += result[i].SecMaj
                    }
                    data.maj_2 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE TrdMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE TrdMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_3 += result[i].TrdMaj
                    }
                    data.maj_3 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FthMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FthMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_4 += result[i].FthMaj
                    }
                    data.maj_4 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FifMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FifMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_5 += result[i].FifMaj
                    }
                    data.maj_5 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SixMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SixMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_6 += result[i].SixMaj
                    }
                    data.maj_6 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SevMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SevMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_7 += result[i].SevMaj
                    }
                    data.maj_7 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE EigMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE EigMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.maj_8 += result[i].EigMaj
                    }
                    data.maj_8 /= count[0].count
                })
        })

    // sem_1 - sem_8
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_1 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_1 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_1 += result[i].Semester_1
                    }
                    data.sem_1 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_2 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_2 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_2 += result[i].Semester_1
                        data.sem_2 += result[i].Semester_2
                    }
                    data.sem_2 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_3 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_3 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_3 += result[i].Semester_1
                        data.sem_3 += result[i].Semester_2
                        data.sem_3 += result[i].Semester_3
                    }
                    data.sem_3 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_4 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_4 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_4 += result[i].Semester_1
                        data.sem_4 += result[i].Semester_2
                        data.sem_4 += result[i].Semester_3
                        data.sem_4 += result[i].Semester_4
                    }
                    data.sem_4 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_5 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_5 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_5 += result[i].Semester_1
                        data.sem_5 += result[i].Semester_2
                        data.sem_5 += result[i].Semester_3
                        data.sem_5 += result[i].Semester_4
                        data.sem_5 += result[i].Semester_5
                    }
                    data.sem_5 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_6 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_6 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_6 += result[i].Semester_1
                        data.sem_6 += result[i].Semester_2
                        data.sem_6 += result[i].Semester_3
                        data.sem_6 += result[i].Semester_4
                        data.sem_6 += result[i].Semester_5
                        data.sem_6 += result[i].Semester_6
                    }
                    data.sem_6 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_7 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_7 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_7 += result[i].Semester_1
                        data.sem_7 += result[i].Semester_2
                        data.sem_7 += result[i].Semester_3
                        data.sem_7 += result[i].Semester_4
                        data.sem_7 += result[i].Semester_5
                        data.sem_7 += result[i].Semester_6
                        data.sem_7 += result[i].Semester_7
                    }
                    data.sem_7 /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_8 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_8 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data.sem_8 += result[i].Semester_1
                        data.sem_8 += result[i].Semester_2
                        data.sem_8 += result[i].Semester_3
                        data.sem_8 += result[i].Semester_4
                        data.sem_8 += result[i].Semester_5
                        data.sem_8 += result[i].Semester_6
                        data.sem_8 += result[i].Semester_7
                        data.sem_8 += result[i].Semester_8
                    }
                    data.sem_8 /= count[0].count
                    res.json(data)
                })
        })
})

app.post('/updateuserinfo', (req, res) => {
    const email = req.body.email
    const year = req.body.year
    const register = req.body.register
    const course = req.body.course
    const english = req.body.english
    const score = req.body.score

    var sql = 'UPDATE UserInfo SET `StudentNumber` = ?, `Semester` = ?, `Course` = ?, `EnglishGrade` = ?, `Score` = ? WHERE `ID` = ?'
    var params = [year, register, course, english, score, email]
    connection.query(sql, params,
        function (err, data) {
            if (!err) {
                res.end()
            }
            else {
                res.json(err)
            }
        })
})


http.listen(port, () => {
    console.log(`Server On : http://localhost:${port}/`);
})

app.post("/result", (req, res) => {
    const email = req.body.email

    var sql1 = "CREATE VIEW tempView (ClassScore, S) AS SELECT ClassScore, SUM(ClassCredit) AS S FROM UserSelectList, Lecture WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? GROUP BY ClassScore;"
    connection.query(sql1, [email],
        function (err) {
            if (!err) {
                console.log("성적 뷰 만들기 성공")
            }
            else {
                console.log("성적 뷰 만들기 실패")
            }
        })

    var sql2 = "SELECT (SELECT COUNT(*) \
        	FROM UserSelectList WHERE UserID=?) AS Result, \
        	Course, StudentNumber, EnglishGrade AS EngLevel, Semester AS Register, Score AS EngScore, SUM(ClassCredit) AS TotalCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber) AND (CNumber=ClassNumber) AND UserID=? AND Curriculum='공통교양') AS CommonClassCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber) AND (CNumber=ClassNumber) AND UserID=? AND ClassArea='기본소양') AS GibonSoyangCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber) AND (CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE 'bsm%') AS BSMCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE 'bsm_수학%') AS BSMMathCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE 'bsm_과학%') AS BSMSciCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND Curriculum='전공') AS MajorCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND Curriculum='전공' AND ClassArea='전문') AS SpecialMajorCredit, \
        	(SELECT COUNT(*) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND EnglishClass=1) AS EngClassCount, \
        	ROUND((SELECT SUM(CASE \
        	WHEN ClassScore='A+' THEN S*4.5 \
        	WHEN ClassScore='A0' THEN S*4.0 \
        	WHEN ClassScore='B+' THEN S*3.5 \
        	WHEN ClassScore='B0' THEN S*3.0 \
        	WHEN ClassScore='C+' THEN S*2.5 \
        	WHEN ClassScore='C0' THEN S*2.0 \
        	WHEN ClassScore='D+' THEN S*1.5 \
        	WHEN ClassScore='D0' THEN S*1.0 \
        	WHEN ClassScore='F' THEN S*0.0 \
        	WHEN ClassScore='P' THEN S*0.0 \
        	END) / \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? \
        	AND ClassScore IN ('A+','A0','B+','B0','C+','C0','D+','D0','F')) AS result \
        	FROM tempView),2) AS TotalScore \
        FROM UserInfo, UserSelectList, Lecture \
        WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=ID AND ID=?;"
    connection.query(sql2, [email, email, email, email, email, email, email, email, email, email, email],
        function (err, data) {
            if (!err) {
                console.log(data[0], "판정 성공")
                res.send(data[0])
            }
            else {
                console.log("판정 error")
            }
        })

    var sql3 = "DROP VIEW tempView CASCADE;"
    connection.query(sql3,
        function (err) {
            if (!err) {
                console.log("성적 뷰 삭제 성공")
            }
            else {
                console.log("성적 뷰 삭제 실패")
            }
        })
})