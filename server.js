const express = require('express')
const path = require('path')
const app = express()
const port = 3001;
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const http = require('http').createServer(app)
let nodemailer = require('nodemailer')


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
                console.log(data[0].result)
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
    const register = req.body.register
    const course = req.body.course
    const english = req.body.english
    const category = req.body.category
    const score = req.body.score

    var sql = 'INSERT INTO UserInfo (`ID`, `Pincode`, `Semester`, `StudentNumber`, `Course`, `Score`, `EnglishGrade`) VALUES (?, ?, ?, ?, ?, ?, ?)'
    var params = [email, pw, register, year, course, score, english]
    connection.query(sql, params,
        function (err, rows) {
            if (err) {
                console.log("실패");
                console.log(err);
            } else {
                console.log("성공")
            }
        })
    res.end()
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
            pass: 'tkddns-6213'
        }
    })

    var generateRandom = function (min, max) {
        var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return ranNum;
    }
    const number = generateRandom(111111, 999999)
    console.log(number)
    let info = transporter.sendMail({
        from: 'wdse123@gmail.com',
        to: email,
        subject: '[졸업할 수 있을까?] 인증 관련 이메일 입니다.',
        text: '인증 보안 코드 : ' + number
    })
    res.json({ number: number })
})

http.listen(port, () => {
    console.log(`Server On : http://localhost:${port}/`);
})