const express = require('express')
const path = require('path')
const app = express()
const port = 3001;
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const http = require('http').createServer(app)
let nodemailer = require('nodemailer');
const { ConstructionOutlined, CommentsDisabledOutlined } = require('@mui/icons-material');


const connection = mysql.createConnection({
    host: 'dgugraduation.cojh5uzorzha.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'asdf1234',
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
    const major = req.body.major

    var sql = 'INSERT INTO UserInfo (`ID`, `Pincode`, `Semester`, `StudentNumber`, `Course`, `Score`, `EnglishGrade`, `Major`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    var params = [email, pw, semester, year, course, score, english, major]
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

    //Lecture ????????? ?????? ??????
    for (var i = 1; i < UserDatas.length; i++) {
        //TermNumber, ClassNumber, LectureNick, Curriculum, ClassArea, 
        //ProfessorName, ClassCredit, DesignCredit, EnglishClass, Major
        const TNumber = UserDatas[i].TNumber
        const CNumber = UserDatas[i].CNumber
        const LNick = UserDatas[i].LNick
        const Cculum = UserDatas[i].Cculum
        const CArea = UserDatas[i].CArea
        const PName = UserDatas[i].PName
        const CCredit = UserDatas[i].CCredit
        const DCredit = UserDatas[i].DCredit
        const EClass = UserDatas[i].EClass
        const Major = UserDatas[i].Major

        var sql = 'INSERT INTO `Lecture` VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var params = [TNumber, CNumber, LNick, Cculum, CArea, PName, CCredit, DCredit, EClass, Major]
        console.log(sql + params)
        connection.query(sql, params,
            function (err) {
                if (!err) {
                    console.log("??????")
                } else {
                    console.log("??????", err)
                }
            })
    }

    //UserSelectList ??????
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
                    console.log("??????")
                } else {
                    console.log("??????", err)
                }
            })
    } 

    const email = req.body.email
    connection.query("SELECT COUNT(*) AS result FROM UserSelectList WHERE UserID = ?", [email],
        function (err, data) {
            var sendResult = {};
            if (!err) {
                if (data[0].result > 0) {
                    console.log(data[0].result, true, ": ????????? ??????")
                    sendResult = { result: true }
                }
                else {
                    console.log(data[0].result, false, ": ????????? ??????")
                    sendResult = { result: false }
                    // res.send(sendResult)
                }
            }
            else {
                console.log("?????? ???????????? ?????? error")
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
                    res.json({ 'msg': '????????? ID?????????.' })
                } else { // ????????? id ??? ????????? ???????????? ?????? ??????
                    const sql2 = `SELECT 
                                    CASE (SELECT COUNT(*) FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                        WHEN '0' THEN NULL
                                        ELSE (SELECT ID FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                    END AS id
                                    , CASE (SELECT COUNT(*) FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                        WHEN '0' THEN NULL
                                        ELSE (SELECT Pincode FROM UserInfo WHERE ID = ? AND Pincode = ?)
                                    END AS pw`;
                    // sql ?????? ????????? parameter ?????? ???????????? ??????
                    const params = [email, pw, email, pw, email, pw, email, pw]
                    connection.query(sql2, params, (err, data) => {
                        if (!err) {
                            var sql = 'SELECT Major FROM UserInfo WHERE ID = ?'
                            connection.query(sql, [email],
                                function (err, result){
                                    if (!err){
                                        var sendData = {
                                            id:data[0].id,
                                            major:result[0].Major
                                        }
                                        console.log(sendData)
                                        res.json(sendData)
                                    }
                                })
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
        subject: '[????????? ??? ??????????] ?????? ?????? ????????? ?????????.',
        text: '?????? ?????? ?????? : ' + number
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

app.post('/lecture', (req, res) => {
    const major = req.body.major

    const type1 = '????????????'
    const type2 = 'bsm'
    const type3 = '????????????'

    var TakingNC = []
    var TakingBSM = []
    var TakingMJ = []

    //?????? ??????
    var sql = 'SELECT ClassName FROM Requirement WHERE Major = ? AND ClassType = ?'
        connection.query(sql, [major, type1],
            function (err, result) {
                if (!err) {
                    for (var i = 0; i < result.length; i++) {
                        TakingNC.push(result[i].ClassName)
                    }
                }
            })
            
        sql = 'SELECT ClassName FROM Requirement WHERE Major = ? AND ClassType = ?'
            connection.query(sql, [major, type2],
            function (err, result) {
                if (!err) {
                    for (var i = 0; i < result.length; i++) {
                        TakingBSM.push(result[i].ClassName)
                    }
                }
            })
    
        sql = 'SELECT ClassName FROM Requirement WHERE Major = ? AND ClassType = ?'
            connection.query(sql, [major, type3],
            function (err, result) {
                if (!err) {
                    for (var i = 0; i < result.length; i++) {
                        TakingMJ.push(result[i].ClassName)
                    }
                    var data = {
                        TakingNC: TakingNC,
                        TakingBSM: TakingBSM,
                        TakingMJ: TakingMJ
                    }
                    //console.log(data)
                    res.json(data)
                }
            })
            
})

app.post('/result/essLectures', (req, res) => {
    const email = req.body.email
    const major = req.body.major
    
    var type = '????????????'
    var index = 0

    //???????????? ???????????? ????????? ??????
    var notTakingNC = []

    sql = 'SELECT ClassName FROM Requirement WHERE Major = ? AND ClassType = ?'
        connection.query(sql, [major, type],
        function (err, result) {
            if (!err) {
                for (var i = 1; i < result.length; i++) {
                    notTakingNC.push(result[i].ClassName)
                }
            }
        })
    
    // ????????? 2??????
    var leadershipCredit = 0;
    var leadership = "????????? ?????? ??? ??? 1";

    //bsm?????? ????????????
    var notTakingBSM = []
    type = 'bsm'
    sql = 'SELECT ClassName FROM Requirement WHERE Major = ? AND ClassType = ?'
    connection.query(sql, [major, type],
    function (err, result) {
        if (!err) {
            for (var i = 1; i < result.length; i++) {
                notTakingBSM.push(result[i].ClassName)
            }
        }
    })

    // ?????? ?????? 9??????
    var GSCredit = 0;
    var GS = "???????????? ?????? ??? ??? ";
    // ?????? ?????? 4??????
    var bsmExperimentCredit = 0;
    var bsmExperiment = "???????????? ?????? ??? ??? 1";

    var notTakingMJ = []
    type = '????????????'
    sql = 'SELECT ClassName FROM Requirement WHERE Major = ? AND ClassType = ?'
    connection.query(sql, [major, type],
    function (err, result) {
        if (!err) {
            for (var i = 1; i < result.length; i++) {
                notTakingMJ.push(result[i].ClassName)
            }
        }
    })

    var data = {
        notTakingNC: notTakingNC,
        notTakingBSM: notTakingBSM,
        notTakingMJ: notTakingMJ,
        leadershipCredit: leadershipCredit,
        GSCredit: GSCredit,
        bsmExperimentCredit: bsmExperimentCredit
    }

    // ??????????????? ?????? EAS ?????? ?????? ??????
    sql = 'SELECT EnglishGrade FROM UserInfo WHERE ID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                if (result[0].EnglishGrade === '0') {
                    // S0??? ?????? basic EAS?????? ??? ???(BASIC EAS1 EAS2??? ??????
                    notTakingNC.splice(notTakingNC.findIndex(function (value) { return value === 'basicEAS' }), 3)
                }
                else if (result[0].EnglishGrade !== '4') {
                    notTakingNC.splice(notTakingNC.findIndex(function (value) { return value === 'basicEAS' }), 1)
                }
            }
        })

    // ?????????????????? 20?????? ???????????? ??????, ?????? ??????

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
    // EAS2 ??????????????????
    connection.query(sql, [email, 'RGC1081%'],
    function (err, result) {
        if (!err) {
            if (result[0].count > 0) {
                index = notTakingNC.findIndex(function (value) { return value === 'EAS2' })
                if (index > -1)
                    notTakingNC.splice(index, 1)
            }
        }
    })
    // ??????1
    connection.query(sql, [email, 'RGC0017%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '???????????????1' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // ??????2
    connection.query(sql, [email, 'RGC0018%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '???????????????2' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // ??????
    connection.query(sql, [email, 'RGC0003%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '???????????????' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // ????????? RGC0005
    connection.query(sql, [email, 'RGC0005%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // ?????? RGC1074
    connection.query(sql, [email, 'RGC1074%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // ???????????? RGC1001
    connection.query(sql, [email, 'RGC1001%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingNC.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingNC.splice(index, 1)
                }
            }
        })
    // ??????1 PRI4001
    connection.query(sql, [email, 'PRI4001%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '?????????????????????1' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    // ??????2 PRI4012
    connection.query(sql, [email, 'PRI4012%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '?????????????????????2' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
     // ????????? PRI4035
     connection.query(sql, [email, 'PRI4035%'],
     function (err, result) {
         if (!err) {
             if (result[0].count > 0) {
                 index = notTakingBSM.findIndex(function (value) { return value === '??????????????????????????????' })
                 if (index > -1)
                     notTakingBSM.splice(index, 1)
             }
         }
     })  
     // ?????? PRI4051
     connection.query(sql, [email, 'PRI4051%'],
     function (err, result) {
         if (!err) {
             if (result[0].count > 0) {
                 index = notTakingBSM.findIndex(function (value) { return value === '????????????' })
                 if (index > -1)
                     notTakingBSM.splice(index, 1)
             }
         }
     })      
    // ?????? PRI4023
    connection.query(sql, [email, 'PRI4023%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    // ????????? PRI4024
    connection.query(sql, [email, 'PRI4024%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingBSM.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    // ?????? CSE2025
    connection.query(sql, [email, 'CSE2025%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? CSE4074
    connection.query(sql, [email, 'CSE4074%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '??????SW????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ????????? CSE2028
    connection.query(sql, [email, 'CSE2028%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? CSE2016
    connection.query(sql, [email, 'CSE2016%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC2026
    connection.query(sql, [email, 'INC2026%'],
    function (err, result) {
        if (!err) {
            if (result[0].count > 0) {
                index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????' })
                if (index > -1)
                    notTakingMJ.splice(index, 1)
            }
        }
    })
    // ?????? CSE2017
    connection.query(sql, [email, 'CSE2017%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC2027
    connection.query(sql, [email, 'INC2027%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? CSE2018
    connection.query(sql, [email, 'CSE2018%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '???????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC2028
    connection.query(sql, [email, 'INC2028%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '???????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC2033
    connection.query(sql, [email, 'INC2033%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC2021
    connection.query(sql, [email, 'INC2021%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '???????????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC4058
    connection.query(sql, [email, 'INC4058%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '???????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? ?????? INC4056
    connection.query(sql, [email, 'INC4056%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ???1 ?????? INC4084
    connection.query(sql, [email, 'INC4084%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ???2 ?????? INC4085
    connection.query(sql, [email, 'INC4085%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '??????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ?????? CSE2026
    connection.query(sql, [email, 'CSE2026%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ??????1 CSE4066
    connection.query(sql, [email, 'CSE4066%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????1' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ??????2 CSE4067
    connection.query(sql, [email, 'CSE4067%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????2' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ????????? CSE2013
    connection.query(sql, [email, 'CSE2013%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    index = notTakingMJ.findIndex(function (value) { return value === '?????????????????????????????????' })
                    if (index > -1)
                        notTakingMJ.splice(index, 1)
                }
            }
        })
    // ??????????????? RGC1050
    connection.query(sql, [email, 'RGC1050%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    leadershipCredit += 2;
                }
            }
        })
    // ?????????????????? RGC1051
    connection.query(sql, [email, 'RGC1051%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    leadershipCredit += 2;
                }
            }
        })
    // ?????????????????? RGC1052
    connection.query(sql, [email, 'RGC1052%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    leadershipCredit += 2;
                }
            }
        })
    // ??????1 PRI4002
    connection.query(sql, [email, 'PRI4002%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // ??????1 PRI4003
    connection.query(sql, [email, 'PRI4003%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // ??????1 PRI4004
    connection.query(sql, [email, 'PRI4004%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // ??????2 PRI4013
    connection.query(sql, [email, 'PRI4013%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // ??????2 PRI4014
    connection.query(sql, [email, 'PRI4014%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    // ??????2 PRI4015
    connection.query(sql, [email, 'PRI4015%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    bsmExperimentCredit += 4;
                }
            }
        })
    //?????? ?????? ?????? 1,2 ?????? ????????????
    if(major === '?????????????????????') {
        var sql2 = 'SELECT COUNT(*) AS count FROM UserSelectList WHERE UserId = ? and CNumber Like ? or CNumber Like ?'
        connection.query(sql2, [email, 'PRI4002%', 'PRI4013%'], //??????
        function (err, result) {
            if (!err) {
                if (result[0].count > 1) {
                    console.log('d')
                    index = notTakingBSM.findIndex(function (value) { return value === '?????? ?????? ?????? 1, 2??????' })
                    console.log(index)
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
        connection.query(sql2, [email, 'PRI4003%', 'PRI4014%'], //??????
        function (err, result) {
            if (!err) {
                if (result[0].count > 1) {
                    index = notTakingBSM.findIndex(function (value) { return value === '?????? ?????? ?????? 1, 2??????' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
        connection.query(sql2, [email, 'PRI4004%', 'PRI4015%'], //??????
        function (err, result) {
            if (!err) {
                if (result[0].count > 1) {
                    index = notTakingBSM.findIndex(function (value) { return value === '?????? ?????? ?????? 1, 2??????' })
                    if (index > -1)
                        notTakingBSM.splice(index, 1)
                }
            }
        })
    }

    // ?????? PRI4041
    connection.query(sql, [email, 'PRI4041%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    GSCredit += 3;
                }
            }
        })
    // ?????? EGC4039
    connection.query(sql, [email, 'EGC4039%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    GSCredit += 3;
                }
            }
        })
    // ????????? EGC7026
    connection.query(sql, [email, 'EGC7026%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    GSCredit += 3;
                }
            }
        })

    // ?????? PRI4040
    connection.query(sql, [email, 'PRI4040%'],
    function (err, result) {
        if (!err) {
            if (result[0].count > 0) {
                GSCredit += 3;
            }
        }
    })

    // ????????? PRI4048
    connection.query(sql, [email, 'PRI4048%'],
    function (err, result) {
        if (!err) {
            if (result[0].count > 0) {
                GSCredit += 3;
            }
        }
    })

    // ?????? PRI4043
    connection.query(sql, [email, 'PRI4043%'],
    function (err, result) {
        if (!err) {
            if (result[0].count > 0) {
                GSCredit += 3;
            }
        }
    })

    // ????????? ??????
    var sql = 'SELECT count(ClassArea) AS count from UserSelectList,Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? AND CNumber LIKE ?'
    connection.query(sql, [email, 'PRI4043%'],
        function (err, result) {
            if (!err) {
                if (result[0].count > 0) {
                    sql = 'SELECT ClassArea from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? AND CNumber LIKE ?'
                    connection.query(sql, [email, 'PRI4043%'],
                        function (err, result) {
                            if (!err) {
                                if (result[0].ClassArea === '????????????_????????????')
                                    GSCredit += 3
                            }
                            
                            if (major === '?????????????????????') leadershipCredit += 3
                            if (leadershipCredit < 2) notTakingNC.push(leadership)
                            if (major === '?????????????????????') GSCredit += 3
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
                    if (major === '?????????????????????') leadershipCredit += 3
                    if (leadershipCredit < 2) notTakingNC.push(leadership)
                    if (major === '?????????????????????') GSCredit += 3
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

    // ?????? ??? ??????????????? ?????? ??? DB??? credit??? ??????
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

    // ?????? ??? ???????????? ?????? ?????? ??? count??? ??????
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber=ClassNumber) and UserID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                Count = result[0].count
            }
        })

    // ???????????? ?????? ????????? ?????? ??? ClassScore??? ??????
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

    // ???????????? ?????? ?????? ?????? ??? Semester??? ??????
    sql = 'SELECT COUNT(c.TNumber) AS semester FROM (select TNumber, count(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? group by TNumber) AS c;'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                Semester = result[0].semester
                data.Semester = Semester
                // ???????????? ????????? ?????? ????????? TNumList??? ??????
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


    // ???????????? ??????????????? ?????? ???  Credit??? ??????
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
    // ???????????? ???????????? ?????? ?????? ??? Count??? ??????
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ?'
    connection.query(sql, [email, TNumber],
        function (err, result) {
            if (!err) {
                SemesterData.Count = result[0].count
            }
        })

    // ???????????? ?????? ????????? ?????? ??? ClassScore??? ??????
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

    // ???????????? ????????????????????? ?????? ??? MajorCredit??? ??????
    var sql = 'select sum(ClassCredit) AS credit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '??????'],
        function (err, result) {
            if (!err) {
                SemesterData.MajorCredit = result[0].credit
            }
        })

    // ???????????? ?????????????????? ?????? ?????? ??? MajorCount??? ??????
    var sql = 'select COUNT(*) AS count from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '??????'],
        function (err, result) {
            if (!err) {
                SemesterData.MajorCount = result[0].count
            }
        })

    // ???????????? ?????? ????????? ?????? ??? MajorClassScore??? ??????
    var sql = 'select ClassScore,ClassCredit from UserSelectList, Lecture where (TNumber = TermNumber and CNumber = ClassNumber) and UserID = ? and TNumber = ? and Curriculum = ?'
    connection.query(sql, [email, TNumber, '??????'],
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
    var data = [
        [                                   // user_ent         ent
            { name: '1', ???: 0, ??????: 0, }, // data[0][0]["???"] data[0][0]["??????"]
            { name: '2', ???: 0, ??????: 0, }, // data[0][1]["???"]
            { name: '3', ???: 0, ??????: 0, }, // data[0][2]["???"]
            { name: '4', ???: 0, ??????: 0, }, // data[0][3]["???"]
            { name: '5', ???: 0, ??????: 0, }, // data[0][4]["???"]
            { name: '6', ???: 0, ??????: 0, }, // data[0][5]["???"]
            { name: '7', ???: 0, ??????: 0, }, // data[0][6]["???"]
            { name: '8', ???: 0, ??????: 0, }, // data[0][7]["???"]
        ],
        [                                   // user_maj          maj
            { name: '1', ???: 0, ??????: 0, }, // data[1][0]["???"] data[1][0]["??????"]
            { name: '2', ???: 0, ??????: 0, }, // data[1][1]["???"]
            { name: '3', ???: 0, ??????: 0, }, // data[1][2]["???"]
            { name: '4', ???: 0, ??????: 0, }, // data[1][3]["???"]
            { name: '5', ???: 0, ??????: 0, }, // data[1][4]["???"]
            { name: '6', ???: 0, ??????: 0, }, // data[1][5]["???"]
            { name: '7', ???: 0, ??????: 0, }, // data[1][6]["???"]
            { name: '8', ???: 0, ??????: 0, }, // data[1][7]["???"]
        ],
        [                                   // user_sem         sem
            { name: '1', ???: 0, ??????: 0, }, // data[2][0]["???"] data[2][0]["??????"]
            { name: '2', ???: 0, ??????: 0, }, // data[2][1]["???"]
            { name: '3', ???: 0, ??????: 0, }, // data[2][2]["???"]
            { name: '4', ???: 0, ??????: 0, }, // data[2][3]["???"]
            { name: '5', ???: 0, ??????: 0, }, // data[2][4]["???"]
            { name: '6', ???: 0, ??????: 0, }, // data[2][5]["???"]
            { name: '7', ???: 0, ??????: 0, }, // data[2][6]["???"]
            { name: '8', ???: 0, ??????: 0, }, // data[2][7]["???"]
        ]
    ];

    var sql = '';

    // user_ent, user_maj, user_sem
    sql = 'SELECT * FROM ScoreStat WHERE UID = ?'
    connection.query(sql, [email],
        function (err, result) {
            if (!err) {
                data[0][0]["???"] = result[0].FirEnt
                data[0][1]["???"] = result[0].SecEnt
                data[0][2]["???"] = result[0].TrdEnt
                data[0][3]["???"] = result[0].FthEnt
                data[0][4]["???"] = result[0].FifEnt
                data[0][5]["???"] = result[0].SixEnt
                data[0][6]["???"] = result[0].SevEnt
                data[0][7]["???"] = result[0].EigEnt
                data[1][0]["???"] = result[0].FirMaj
                data[1][1]["???"] = result[0].SecMaj
                data[1][2]["???"] = result[0].TrdMaj
                data[1][3]["???"] = result[0].FthMaj
                data[1][4]["???"] = result[0].FifMaj
                data[1][5]["???"] = result[0].SixMaj
                data[1][6]["???"] = result[0].SevMaj
                data[1][7]["???"] = result[0].EigMaj
                data[2][0]["???"] = result[0].Semester_1
                data[2][1]["???"] = result[0].Semester_2 + data[2][0]["???"]
                data[2][2]["???"] = result[0].Semester_3 + data[2][1]["???"]
                data[2][3]["???"] = result[0].Semester_4 + data[2][2]["???"]
                data[2][4]["???"] = result[0].Semester_5 + data[2][3]["???"]
                data[2][5]["???"] = result[0].Semester_6 + data[2][4]["???"]
                data[2][6]["???"] = result[0].Semester_7 + data[2][5]["???"]
                data[2][7]["???"] = result[0].Semester_8 + data[2][6]["???"]
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
                        data[0][0]["??????"] += result[i].FirEnt
                    }
                    data[0][0]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SecEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SecEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][1]["??????"] += result[i].SecEnt
                    }
                    data[0][1]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE TrdEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE TrdEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][2]["??????"] += result[i].TrdEnt
                    }
                    data[0][2]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FthEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FthEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][3]["??????"] += result[i].FthEnt
                    }
                    data[0][3]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FifEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FifEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][4]["??????"] += result[i].FifEnt
                    }
                    data[0][4]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SixEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SixEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][5]["??????"] += result[i].SixEnt
                    }
                    data[0][5]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SevEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SevEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][6]["??????"] += result[i].SevEnt
                    }
                    data[0][6]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE EigEnt is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE EigEnt is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[0][7]["??????"] += result[i].EigEnt
                    }
                    data[0][7]["??????"] /= count[0].count
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
                        data[1][0]["??????"] += result[i].FirMaj
                    }
                    data[1][0]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SecMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SecMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][1]["??????"] += result[i].SecMaj
                    }
                    data[1][1]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE TrdMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE TrdMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][2]["??????"] += result[i].TrdMaj
                    }
                    data[1][2]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FthMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FthMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][3]["??????"] += result[i].FthMaj
                    }
                    data[1][3]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE FifMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE FifMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][4]["??????"] += result[i].FifMaj
                    }
                    data[1][4]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SixMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SixMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][5]["??????"] += result[i].SixMaj
                    }
                    data[1][5]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE SevMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE SevMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][6]["??????"] += result[i].SevMaj
                    }
                    data[1][6]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE EigMaj is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE EigMaj is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[1][7]["??????"] += result[i].EigMaj
                    }
                    data[1][7]["??????"] /= count[0].count
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
                        data[2][0]["??????"] += result[i].Semester_1
                    }
                    data[2][0]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_2 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_2 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][1]["??????"] += result[i].Semester_1
                        data[2][1]["??????"] += result[i].Semester_2
                    }
                    data[2][1]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_3 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_3 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][2]["??????"] += result[i].Semester_1
                        data[2][2]["??????"] += result[i].Semester_2
                        data[2][2]["??????"] += result[i].Semester_3
                    }
                    data[2][2]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_4 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_4 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][3]["??????"] += result[i].Semester_1
                        data[2][3]["??????"] += result[i].Semester_2
                        data[2][3]["??????"] += result[i].Semester_3
                        data[2][3]["??????"] += result[i].Semester_4
                    }
                    data[2][3]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_5 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_5 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][4]["??????"] += result[i].Semester_1
                        data[2][4]["??????"] += result[i].Semester_2
                        data[2][4]["??????"] += result[i].Semester_3
                        data[2][4]["??????"] += result[i].Semester_4
                        data[2][4]["??????"] += result[i].Semester_5
                    }
                    data[2][4]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_6 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_6 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][5]["??????"] += result[i].Semester_1
                        data[2][5]["??????"] += result[i].Semester_2
                        data[2][5]["??????"] += result[i].Semester_3
                        data[2][5]["??????"] += result[i].Semester_4
                        data[2][5]["??????"] += result[i].Semester_5
                        data[2][5]["??????"] += result[i].Semester_6
                    }
                    data[2][5]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_7 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_7 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][6]["??????"] += result[i].Semester_1
                        data[2][6]["??????"] += result[i].Semester_2
                        data[2][6]["??????"] += result[i].Semester_3
                        data[2][6]["??????"] += result[i].Semester_4
                        data[2][6]["??????"] += result[i].Semester_5
                        data[2][6]["??????"] += result[i].Semester_6
                        data[2][6]["??????"] += result[i].Semester_7
                    }
                    data[2][6]["??????"] /= count[0].count
                })
        })
    sql = 'SELECT COUNT(*) AS count FROM ScoreStat WHERE Semester_8 is NOT NULL'
    connection.query(sql,
        function (err, count) {
            sql = 'SELECT * FROM ScoreStat WHERE Semester_8 is NOT NULL'
            connection.query(sql,
                function (err, result) {
                    for (var i = 0; i < count[0].count; i++) {
                        data[2][7]["??????"] += result[i].Semester_1
                        data[2][7]["??????"] += result[i].Semester_2
                        data[2][7]["??????"] += result[i].Semester_3
                        data[2][7]["??????"] += result[i].Semester_4
                        data[2][7]["??????"] += result[i].Semester_5
                        data[2][7]["??????"] += result[i].Semester_6
                        data[2][7]["??????"] += result[i].Semester_7
                        data[2][7]["??????"] += result[i].Semester_8
                    }
                    data[2][7]["??????"] /= count[0].count
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

app.post('/updatelecture', (req, res) => {
    const email = req.body.email
    const year = req.body.year
    const register = req.body.register
    const course = req.body.course
    const english = req.body.english
    const score = req.body.score

    var sql = 'UPDATE Lecture SET `StudentNumber` = ?, `Semester` = ?, `Course` = ?, `EnglishGrade` = ?, `Score` = ? WHERE `ID` = ?'
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
                console.log("?????? ??? ????????? ??????")
            }
            else {
                console.log("?????? ??? ????????? ??????")
            }
        })

    var sql2 = "SELECT (SELECT COUNT(*) \
        	FROM UserSelectList WHERE UserID=?) AS Result, \
        	Course, StudentNumber, EnglishGrade AS EngLevel, Semester AS Register, Score AS EngScore, SUM(ClassCredit) AS TotalCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber) AND (CNumber=ClassNumber) AND UserID=? AND Curriculum='??????') AS CommonClassCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber) AND (CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE '%????????????') AS GibonSoyangCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber) AND (CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE 'MSC%') AS BSMCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE '%??????') AS BSMMathCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND ClassArea LIKE '%??????') AS BSMSciCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND (Curriculum='??????' OR Curriculum='??????')) AS MajorCredit, \
        	(SELECT SUM(ClassCredit) \
        	FROM UserSelectList, Lecture \
        	WHERE (TNumber=TermNumber AND CNumber=ClassNumber) AND UserID=? AND Curriculum='??????' AND Major='??????') AS SpecialMajorCredit, \
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
                console.log(data[0], "?????? ??????")
                res.send(data[0])
            }
            else {
                console.log("?????? error")
            }
        })

    var sql3 = "DROP VIEW tempView CASCADE;"
    connection.query(sql3,
        function (err) {
            if (!err) {
                console.log("?????? ??? ?????? ??????")
            }
            else {
                console.log("?????? ??? ?????? ??????")
            }
        })
})