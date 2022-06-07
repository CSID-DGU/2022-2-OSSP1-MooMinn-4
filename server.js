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
    connection.query(sql2, [email,email,email,email,email,email,email,email,email,email,email],
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