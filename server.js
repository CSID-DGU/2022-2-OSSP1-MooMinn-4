const express = require('express')
const path = require('path')
const app = express()
const port = 3001;
const cors = require('cors')
const bodyParser = require('body-parser');
const mysql = require('mysql')
const { default: axios } = require('axios');
const http = require('http').createServer(app)


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'user',
})
connection.connect()


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

app.get('/', (req, res) => {
    res.send('abcd')
})

app.post("/signup", (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    const year = req.body.year
    const register = req.body.register
    const course = req.body.course
    const english = req.body.english
    const category = req.body.category
    const score = req.body.score

    var sql = 'INSERT INTO userinfo (`ID`, `Pincode`, `Semester`, `StudentNumber`, `Course`, `Score`, `EnglishGrade`) VALUES (?, ?, ?, ?, ?, ?, ?)'
    var params = [id, pw, register, year, course, score, english]
    connection.query(sql, params,
        function (err, rows) {
            if (err) {
                console.log("실패");
            } else {
                console.log("성공")
            }
        })
    res.end()
})
/*app.post("/userinfo", (req, res) => {
    let id = req.body.id
    let pw = req.body.pw
    let year = req.body.year
    let register = req.body.register
    let course = req.body.course
    let english = req.body.english
    let category = req.body.category
    let score = req.body.score

    console.log(req)

    var sql = 'INSERT INTO userinfo (ID, Pincode, Semester, StudentNumber, Course, Score, EnglishGrade) VALUES (`?` `?` `?` `?` `?` `?` `?`)'
    var params = [id, pw, register, year, course, score, english]
    connection.query(sql, params,
        function (err, rows, fields) {
            if (err) {
                console.log("실패");
            } else {
                console.log("성공")
            }
        })
})*/

http.listen(port, () => {
    console.log(`Server On : http://localhost:${port}/`);
})