const express = require('express')
const path = require('path')
const app = express()
const port = 3001;
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const { default: axios } = require('axios');
const { ConnectingAirportsOutlined } = require('@mui/icons-material');
const { BOOLEAN } = require('sequelize');
const http = require('http').createServer(app)
let nodemailer = require('nodemailer');
const { fileURLToPath } = require('url');


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
    const category = req.body.category
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
            function (err, rows) {
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
                    sendResult = {result: true}
                }
                else {
                    console.log(data[0].result, false, ": 결과가 없음")
                    sendResult = {result: false}
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

app.post('/semester', (req, res) => {
    const email = req.body.email
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
                        console.log(data)
                        res.json(data)
                    })

            }
        })
})

app.post('/stats', (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const TNumber = req.body.TNumber
    const semester = req.body.semester
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

    // 학기별 전체 과목과 전공 과목의 이수학점, 이수과목, 평점을 구함

    var sql = ''
    sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                sql = 'UPDATE ScoreStat SET EntireCredit = ? WHERE UID = ?'
                connection.query(sql, [result[0].credit, email],
                    function (err) {

                    })
                result[0].credit
            }
        })

    // 사용자의 이수학점을 구한 후  Credit에 저장
    sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
                console.log(TNumber + '학기 credit : ' + result[0].credit)
                SemesterData.Credit = result[0].credit
            }

        })
    // 사용자의 이수과목 수를 구한 후 Count에 저장
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
                console.log(TNumber + '학기 count : ' + result[0].count)
                SemesterData.Count = result[0].count
            }
        })

    // 사용자의 전체 평점을 구한 후 ClassScore에 저장
    var sql = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
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
                    else if (grade === 'P') { SemesterData.Credit -= credit }
                    else if (grade === 'F') { }
                }
                SemesterData.ClassScore /= SemesterData.Credit
                console.log(TNumber + '학기 학점 평균 : ' + SemesterData.ClassScore)
            }
        })

    // 사용자의 전공이수학점을 구한 후 MajorCredit에 저장
    var sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '전공'],
        function (err, result) {
            if (!err) {
                console.log('MajorCredit : ' + result[0].credit)
                SemesterData.MajorCredit = result[0].credit
            }
        })

    // 사용자의 전공이수과목 수를 구한 후 MajorCount에 저장
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '전공'],
        function (err, result) {
            if (!err) {
                console.log('MajorCount : ' + result[0].count)
                SemesterData.MajorCount = result[0].count
            }
        })

    // 사용자의 전공 평점을 구한 후 MajorClassScore에 저장
    var sql = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
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
                console.log('전공 학점 평균 : ' + SemesterData.MajorClassScore)
                console.log(SemesterData)
                res.json(SemesterData)
            }
        })
})

app.post('/updatestat', (req, res) => {
    const ent = ['FirEnt', 'SecEnt', 'TrdEnt', 'FthEnt', 'FifEnt', 'SixEnt', 'SevEnt', 'EigEnt']
    const maj = ['FirMaj', 'SecMaj', 'TrdMaj', 'FthMaj', 'FifMaj', 'SixMaj', 'SevMaj', 'EigMaj']
    const email = req.body.email
    const semester = req.body.semester
    const EntScore = req.body.ClassScore
    const MajScore = req.body.MajorClassScore

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
})

app.post('/updateuserinfo', (req, res) => {
    const email = req.body.email
    const year = req.body.year
    const register = req.body.register
    const course = req.body.course
    const english = req.body.english
    const category = req.body.category
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

    var sql1 = 'select count(*) AS result From UserSelectList where UserID = ? and CNumber like ?'// 필수과목 판별시 사용
    var sql2 = 'select count(*) AS result from UserSelectList where UserID = ? and (CNumber like ? or CNumber like ? or CNumber like ?)'//선택과목 판별시 사용(3과목)
    var sql3 = 'select count(*) AS result from UserSelectList where UserID = ? and (CNumber like ? or CNumber like ?)'//EAS 판별시 사용(2과목)
    var sql4 = 'select EnglishGrade As result from UserInfo where ID = ?'// S0인지 아닌지 판별할 떄 사용
    var sql5 = 'select sum(ClassCredit) As result from UserSelectList,Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and ClassArea like ?'//기본소양, BSM수학,Bsm과학 학점 판정시 사용
    var sql6 = 'select count(*) AS result from UserSelectList where UserID = ? and CNumber like ?' //필수 전공과목 이수 판별
    var sql7 = 'select sum(ClassCredit) AS result from UserSelectList,Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and Curriculum=?'//전공 학점 수가 84학점이 되는지 여부 확인
    var sql8 = 'select sum(ClassCredit) AS result from UserSelectList,Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ? and ClassArea=?'// 전공 전문 학점 수가 42학점이 되는지 여부 확인
    var sql9 = 'select sum(ClassCredit) AS result from UserSelectList,Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ?'//총 학점이 140점이 되는지 여부 확인
    var sql10 = 'select Score AS result from UserInfo where ID= ?'//외국어 성적이 700을 넘는지 조건 확인
    var sql11 = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ?'//평점 평균이 2.0을 넘는지 조건 확인
    var sql12 = 'select sum(EnglishClass) AS result from UserSelectList, Lecture where (CNumber=ClassNumber and TNumber=TermNumber) and UserID = ?' //영어 강의 수가 4개 이상인지 조건 확인
    var sql13 = 'select Course AS result from UserInfo where ID = ?'//일반 심화 판별
    var sql14 = 'select StudentNumber As result from UserInfo where ID =?'//학번 판별
    var sql15 = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and Curriculum=? and UserID = ?'//전공 평점 계산에 이용

    // 공통 교양 판별
    const necessary_common_class = ['RGC0017%', 'RGC0018%', 'RGC0003%', 'RGC0005%']//공통 필수 과목
    const select_common_class = [email, 'RGC1050%', 'RGC1051%', 'RGC1052%']//공통 선택 필수 과목
    const EAS1_common_class = [email, 'RGC1080%', 'RGC1033%']//EAS1
    const EAS2_common_class = [email, 'RGC1081%', 'RGC1034%']//EAS2
    const math_class = ['PRI4001%', 'PRI4023%', 'PRI4024%']//수학 필수 과목
<<<<<<< HEAD
    const major_classScore = [email, '전공']
=======
    const major_classScore=[email,'전공']
    
    
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
    // 대학 탐구 판별
    var isNotCommonClass = new Array()//수강하지 않은 공통교양을 담는 배열
    connection.query(sql3, [email, 'RGC1074%', 'RGC1001%'],
<<<<<<< HEAD
        function (err, data) {
            if (!err) {
                if (data[0].result > 0) {
                    console.log('대학 탐구 과목을 수강함')
                } else {
                    console.log('대학 탐구 과목을 수강하지 않음')
                }
            } else {
                console.log('대학 탐구 판별 error')
            }
        }
=======
                        function(err,data){
                            if(!err){
                                if (data[0].result>0){
                                    console.log('대학 탐구 과목을 수강함')
                                } else{
                                    console.log('대학 탐구 과목을 수강하지 않음')
                                    isNotCommonClass.push('커리어디자인')
                                }
                            } else{
                                console.log('대학 탐구 판별 error')
                            }
                        }
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
    )
    // 필수 공통 교양 판별
    for (var i = 0; i < necessary_common_class.length; i++) {
        connection.query(sql1, [email, necessary_common_class[i]],
            function (err, data) {
                if (!err) {
                    if (data[0].result < 1) {//해당 강의를 수강하지 않은 경우
                        console.log('해당 필수 과목을 수강하지 않음')
                        if(necessary_common_class[i] == 'RGC0017%'){
                            isNotCommonClass.push('자아와명상1');
                        } else if(necessary_common_class[i] == 'RGC0018%'){
                            isNotCommonClass.push('자아와명상2');
                        } else if(necessary_common_class[i] == 'RGC0003%'){
                            isNotCommonClass.push('불교와인간');
                        } else if(necessary_common_class[i] == 'RGC0005%'){
                            isNotCommonClass.push('기술보고서작성및발표');
                        }
                    } else {//해당 강의를 수강한 경우
                        console.log('해당 강의를 수강함')
                    }
                }
                else {//에러 처리
                    console.log('필수 공통 교양 판별 error')
                }
            }
        )
    }
    // 선택 필수 공통 교양 판별
    connection.query(sql2, select_common_class,
        function (err, data) {
            if (!err) {
                if (data[0].result > 0) {//리더쉽 수업을 적어도 하나를 이수한 경우
                    console.log('선택 필수 공통 교양 요건 만족')
                    isNotLeadership = true
                } else {//리더쉽 강의를 하나도 이수하지 않은경우
                    console.log('리더쉽 과목 중 하나를 수강하시오')
                    isNotCommonClass.push('리더쉽(소셜앙트레프러너십과리더십 or 글로벌앙트레프러너십과리더십 or 테크노앙트레프러너십과리더십)')
                }
            } else {
                console.log('선택 필수 공통 교양 판별 error')
            }
        }
    )

    connection.query(sql4, [email],
        function (err, data) {
            if (!err) {
                if (data[0].result != 0) {
                    // EAS1 판별
                    connection.query(sql3, EAS1_common_class,
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result > 0) {//두 종류의 EAS1중 하나라도 이수한 경우
                                    console.log('EAS1을 수강하였습니다')
                                } else {// 둘 다 수강하지 않은 경우
                                    console.log('EAS1을 수강하지 않았습니다')
                                    isNotCommonClass.push('EAS1')
                                }
                            } else {
                                console.log('EAS1 error')
                            }
                        }
                    )
                    //EAS2 판별
                    connection.query(sql3, EAS2_common_class,
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result > 0) {//두 종류의 EAS2중 하나라도 수강한 경우
                                    console.log('EAS2을 수강하였습니다')
                                } else {//둘 다 수강하지 않은 경우
                                    console.log('EAS2을 수강하지 않았습니다')
                                    isNotCommonClass.push('EAS2')
                                }
                            } else {
                                console.log('EAS2 error')
                            }
                        }
                    )
                } else {
                    console.log('EAS를 수강하지 않아도 됩니다')
                }
            } else {
                console.log('EAS판별 오류')
            }
        }
    )
    //기본 소양 9학점이상
    var gibon_soyang
    connection.query(sql5, [email, '기본소양%'],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 9) {
                    console.log('기본소양 학점을 만족합니다')
                    gibon_soyang = '기본소양 최소 학점을 만족합니다'
                } else {
                    console.log('기본소양 학점이 모자랍니다')
                    tmp = 9 - data[0].result
                    gibon_soyang = `기본소양 학점이 ${tmp}점 더 필요합니다`
                }
            } else {
                console.log('기본소양 err')
            }
        }
    )
//Bsm 수학 필수 과목
    var isNotMath = new Array();
    for (var i = 0; i < math_class.length; i++) {
        var isNotClass = new Array()//수강하지 않은 강의를 담을 배열
        connection.query(sql1, [email, math_class[i]],
            function (err, data) {
                if (!err) {
                    if (data[0].result < 1) {//해당 강의를 수강하지 않은 경우
                        console.log('해당 필수 과목을 수강하지 않음')
                        if (math_class[i] == 'PRI4001%'){
                            isNotMath.push('미적분학및연습1');
                        } else if(math_class[i] == 'PRI4023%'){
                            isNotMath.push('확률및통계학');
                        } else if(math_class[i] == 'PRI4024%'){
                            isNotMath.push('공학선형대수학')
                        }
                    } else {//해당 강의를 수강한 경우
                        console.log('해당 강의를 수강함')
                    }
                }
                else {//에러 처리
                    console.log('BSM 수학 필수 과목 error')
                }
            }
        )
    }
    //bsm수학 최저학점 판정
    var BSM_math
    connection.query(sql5, [email, 'BSM_수학%'],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 12) {
                    console.log('BSM수학 학점을 만족합니다')
                    BSM_math = 'BSM 수학 최저 학점을 만족합니다'
                } else {
                    console.log('BSM수학 학점이 모자랍니다')
                    BSM_math = `BSM 수학 학점이 ${12 - data[0].result}점 모자랍니다`
                }
            } else {
                console.log('Bsm수학 학점 err')
            }
        }
    )
    //bsm 과확 실험 수강여부 확인
    var BSM_experiment
    connection.query(sql5, [email, 'BSM_과학(실험)%'],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 3) {
                    console.log('BSM과학 실험 학점을 만족합니다')
                    BSM_experiment = '실험 과목을 이수하였습니다'
                } else {
                    console.log('BSM과학 실험 학점이 모자랍니다')
                    BSM_experiment = '실험과목을 하나이상 이수해야 합니다'
                }
            } else {
                console.log('Bsm과학 실험 학점 err')
            }
        }
    )
    //Bsm 과학 수강여부 확인
    var BSM_science
    connection.query(sql5, [email, 'BSM_과학%'],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 6) {
                    console.log('BSM과학 학점을 만족합니다')
                    BSM_science = 'BSM 과학 최저 학점을 만족합니다'
                } else {
                    console.log('BSM과학 학점이 모자랍니다')
                    BSM_science = `BSM 과학 학점이${6 - data[0].result}점 모자랍니다`
                }
            } else {
                console.log('Bsm과학 학점 err')
            }
        }
    )
    //bsm 총학점
    var BSM
    connection.query(sql5, [email, 'BSM%'],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 21) {
                    console.log('BSM 학점을 만족합니다')
                    BSM = 'BSM 최저 학점을 만족합니다'
                } else {
                    console.log('BSM 학점이 모자랍니다')
                    BSM = `BSM 최저 학점이 ${21 - data[0].result}점 부족합니다`
                }
            } else {
                console.log('Bsm 학점 err')
            }
        }
    )
    //어드밴처 or 창공 이수 판별
<<<<<<< HEAD
    connection.query(sql3, [email, 'CSE2028%', 'CSE2016%'],
        function (err, data) {
            if (!err) {
                if (data[0].result > 0) {
                    console.log("어드밴처 디자인 or 창의적 공학설계를 이수하였습니다")
                } else {
                    console.log("어드밴처 디자인 or 창의적 공학설계를 이수하지 않았습니다")
                }
            } else {
                console.log("어드밴처, 창공 이수 판별 error")
            }
        }
    )
=======
    var isNotmajor = new Array()//수강하지않은 전공과목
    connection.query(sql3, [email, 'CSE2028%', 'CSE2016%'],
                        function (err, data){
                            if(!err) {
                                if(data[0].result > 0){
                                    console.log("어드밴처 디자인 or 창의적 공학설계를 이수하였습니다")
                              
                                } else{
                                    console.log("어드밴처 디자인 or 창의적 공학설계를 이수하지 않았습니다")
                                    isNotmajor.push('어드밴처디자인')
                                }
                            } else {
                                console.log("어드밴처, 창공 이수 판별 error")
                            }
                        }
                    )
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
    //필수 전공과목 이수 판별
    var necessary_major_class = ['CSE2017%', 'CSE2018%', 'CSE2025%', 'CSE2026%', 'CSE4066%', 'CSE4067%', 'CSE4074%', 'CSE2013%']

    connection.query(sql14, [email],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 2020) {
                    connection.query(sql13, [email],
                        function (err, data) {
                            if (!err) {
                                if (data[0].result == '일반') {
                                    necessary_major_class.splice(2, 1)
                                    necessary_major_class.splice(5, 1)
                                }
                            } else {
                                console.log('필수 전공 배정 오류')
                            }
                        })
                }
            } else {
                console.log('학번 판정 오류')
            }
        })

    for (var i = 0; i < necessary_major_class.length; i++) {
        connection.query(sql6, [email, necessary_major_class[i]],
            function (err, data) {
                if (!err) {
                    if (data[0].result < 1) {
                        console.log('해당 필수 전공을 수강하지 않음')
                        if(necessary_major_class[i] == 'CSE2017%'){
                            isNotmajor.push('자료구조와실습')
                        } else if(necessary_major_class[i] == 'CSE2018%'){
                            isNotmajor.push('컴퓨터구성')
                        } else if(necessary_major_class[i] == 'CSE2025%'){
                            isNotmajor.push('계산적사고법')
                        } else if(necessary_major_class[i] == 'CSE2026%'){
                            isNotmajor.push('이산구조')
                        } else if(necessary_major_class[i] == 'CSE4066%'){
                            isNotmajor.push('컴퓨터공학종합설계1')
                        } else if(necessary_major_class[i] == 'CSE4067%'){
                            isNotmajor.push('컴퓨터공학종합설계2')
                        } else if(necessary_major_class[i] == 'CSE4074%'){
                            isNotmajor.push('공개SW프로젝트')
                        } else if(necessary_major_class[i] == 'CSE2013%'){
                            isNotmajor.push('시스템소프트웨어와실습')
                        }
                    } else {
                        console.log('해당 강의를 수강함')
                    }
                }
            }
        )
    }
    var major_credit
    var special_credit
    var all_credit
    connection.query(sql13, [email],
        function (err, data) {
            if (!err) {
                if (data[0].result == '심화') {
                    connection.query(sql7, [email, '전공'],
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result >= 84) {
                                    console.log("전공학점을 만족합니다")
                                    major_credit = '전공학점을 만족합니다' 
                                } else {
                                    console.log("전공학점이 부족합니다")
                                    major_credit = `전공학점이 ${84-data2[0].result}점 부족합니다`
                                }
                            }
                            else {
                                console.log('전공학점 총합 계산 error')
                            }
                        }
                    )

                    // 전공 전문 학점 수가 42학점이 되는지 여부 확인

                    connection.query(sql8, [email, '전문'],
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result >= 42) {
                                    console.log("전문 학점을 만족합니다")
                                    special_credit = '전문학점을 만족합니다'
                                } else {
                                    console.log("전문학점이 부족합니다")
                                    special_credit = `전문학점이 ${42-data2[0].result}점 부족합니다`
                                }
                            }
                            else {
                                console.log('전문 학점 총합 계산 error')
                            }
                        }
                    )

                    //총 학점이 140점이 되는지 여부 확인

                    connection.query(sql9, [email],
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result >= 140) {
                                    console.log('총 학점 조건을 만족함')
                                    all_credit = '최저 학점을 만족합니다'
                                }
                                else {
                                    console.log('총 학점 조건을 만족하지 않음')
                                    all_credit = `총 학점이 ${140-data2[0].result}점 부족합니다`
                                }
                            } else {
                                console.log('총 학점 계산 error')
                            }
                        }
                    )
<<<<<<< HEAD
                } else {//전공 학점 계산 72학점 이상

                    var SumofMajorCredit = 0
                    connection.query(sql7, [email, '전공'],
                        function (err, data2) {
                            if (!err) {
                                SumofMajorCredit = data2[0].result
=======
                } else {
                    //전공 학점 계산 72학점 이상
                    connection.query(sql7, [email, '전공'],
                        function (err, data2) {
                            if (!err) {
                                
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
                                if (data2[0].result >= 72) {
                                    console.log('총 전공학점 조건을 만족함')
                                    major_credit = '전공학점을 만족합니다' 
                                }
                                else {
                                    console.log('총 전공학점 조건을 만족하지 않음')
                                    major_credit = `전공학점이 ${72-data2[0].result}점 부족합니다`
                                }
                            }
                            else {
                                console.log('전공학점 총합 계산 error')
                            }
                        }
                    )

                    // 전공 전문 학점 수가 36학점이 되는지 여부 확인
                    connection.query(sql8, [email, '전문'],
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result >= 36) {
                                    console.log('총 전문강의 수강 학점 조건을 만족함')
                                    special_credit = '전문학점을 만족합니다'
                                }
                                else {
                                    console.log('총 전문강의 수강 조건을 만족하지 않음')
                                    special_credit = `전문 학점이 ${36-data2[0].result}점 부족합니다`
                                }
                            }
                            else {
                                console.log('전문 학점 총합 계산 error')
                            }
                        }
                    )

                    //총 학점이 130점이 되는지 여부 확인
                   
                    connection.query(sql9, [email],
                        function (err, data2) {
                            if (!err) {
                                if (data2[0].result >= 130) {
                                    console.log('총 학점 조건을 만족함')
                                    all_credit = '최저 학점을 만족합니다'
                                }
                                else {
                                    console.log('총 학점 조건을 만족하지 않음')
                                    all_credit = `총 학점이 ${130-data2[0].result}점 부족합니다`
                                }
                            }
                            else {
                                console.log('총 학점 계산 error')
                            }
                        }
                    )
                }
            }
        }
    )
    var GB
    connection.query(sql1, [email, 'DES3%'],
<<<<<<< HEAD
        function (err, data) {
            if (!err) {
                if (data[0].result >= 2) {
                    console.log('개별연구 수강 완료')
                } else {
                    console.log('개별연구를 2개이상 수강하지 않음')
                }
            } else {
                console.log('개별연구 err')
            }
        }
    )

=======
                        function(err,data){
                            if(!err){
                                if(data[0].result>=2){
                                    console.log('개별연구 수강 완료')
                                    GB = '개별연구를 2개이상 이수했습니다'
                                } else {
                                    console.log('개별연구를 2개이상 수강하지 않음')
                                    GB = `개별 연구를 ${2-data[0].result}개 더 이수해야 합니다`
                                }
                            } else{
                                console.log('개별연구 err')
                            }
                        }
  )
    
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
    //외국어 성적이 700을 넘는지 조건 확인
    var English_exam
    connection.query(sql10, [email],
        function (err, data) {
            if (!err) {
                if (data[0].result >= 700) {
                    console.log('외국어 성적 조건을 만족함')
                    English_exam = '외국어 성적을 만족합니다'
                }
                else {
                    console.log('외국어 성적 조건을 만족하지 않음')
                    English_exam = '외국어 성적이 부족합니다'
                }
            }
            else {
                console.log('외국어 성적 계산 error')
            }
        }
    )
<<<<<<< HEAD

    var sumOfCredit = 0
    var temp = 0
    var entireClassScore = 0
=======
    
    var sumOfCredit =0
    var temp=0
    var entireClassScore=0
    var scores = {'A+':4.5, 'A0':4.0, 'B+':3.5, 'B0':3.0, 'C+':2.5, 'C0':2.0, 'D+':1.5, 'D0':1.0, 'F':0.0}
    var score
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
    //평점 평균이 2.0을 넘는지 조건 확인
    connection.query(sql11, [email],
        function (err, rows, fields) {
            if (!err) {
                for (var i = 0; i < rows.length; i++) {
                    temp += scores[rows[i].ClassScore] * rows[i].ClassCredit
                    console.log(scores[rows[i].ClassScore], rows[i].ClassCredit)
                }
                connection.query(sql9, [email],
                    function (err, data) {
                        if (!err) {
                            sumOfCredit = data[0].result
                        }
                        else {
                            console.log("총 학점 수 계산 error")
                        }
                    }
                )
<<<<<<< HEAD
                entireClassScore = temp / sumOfCredit
                if (entireClassScore >= 2.0) {
                    console.log("총 평점 조건을 만족함")
=======
                entireClassScore=temp/sumOfCredit
                if (entireClassScore>=2.0) {
                    console.log(entireClassScore, ": 총 평점 조건을 만족함")
                    score = "최소 평점을 만족함"
                    
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
                }
                else {
                    console.log(entireClassScore, ": 총 평점 조건을 만족하지 않음")
                    score = `평점이 ${entireClassScore}로 2.0미만입니다`
                }
            } else {
                console.log("평점 계산 오류")
            }
        }
    )
    //영어 강의 수가 4개 이상인지 조건 확인
    var English_class
    connection.query(sql12, [email],
        function (err, data) {
            if (!err) {

                if (data[0].result >= 4) {
                    console.log('영어 강의 수 조건을 만족함')
                    English_class = '영어 강의 조건을 만족합니다'
                }
                else {
                    console.log('영어 강의 수 조건을 만족하지 않음')
                    var tmp = 4-data[0].result
                    English_class = `영어강의를 ${4-tmp}개 더 이수해야 합니다` 
                }
            }
            else {
                console.log('영어 강의 판별 error')
            }
        }
    )
    var temp2 = 0
    var sumOfCredit = 0
    var majorClassScore = 0
    connection.query(sql15, major_classScore,
        function (err, rows, fields) {
            if (!err) {
                for (var i = 0; i < rows.length; i++) {
                    temp2 += scores[rows[i].ClassScore] * rows[i].ClassCredit
                }
                connection.query(sql9, [email],
                    function (err, data) {
                        if (!err) {
                            sumOfCredit = data[0].result
                        }
                        else {
                            console.log("총 전공 학점 수 계산 error")
                        }
                    }
                )
<<<<<<< HEAD
                majorClassScore = temp2 / sumOfCredit
                if (majorClassScore >= 2.0) {
                    console.log("총 전공평점 계산 완료")
=======
                majorClassScore=temp2/sumOfCredit
                if (majorClassScore>=2.0) {
                    console.log(majorClassScore, ": 총 전공평점 계산 완료")
>>>>>>> aaca1c176dfbde29aba9fde5a362723884838506
                }
                else {
                    console.log(majorClassScore, ": 총 전공평점 계산 실패")
                }
            } else {
                console.log("전공 평점 계산 오류")
            }
        }
    )
//전달할 변수
    var deliver = [isNotCommonClass, gibon_soyang, isNotMath,BSM_math, BSM_experiment, BSM_science,BSM,isNotmajor,major_credit,special_credit,all_credit,GB,English_exam,English_class,score]




    res.end()
    
    connection.query("SELECT COUNT(*) AS result FROM UserSelectList WHERE UserID = ?", [email],
        function (err, data) {
            var sendResult = {};
            if (!err) {
                if (data[0].result > 0) {
                    console.log(data[0].result, true, ": 결과가 있음")
                    sendResult = {result: true}
                }
                else {
                    console.log(data[0].result, false, ": 결과가 없음")
                    sendResult = {result: false}
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