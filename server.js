const express = require('express')
const path = require('path')
const port = 3001;
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'user'
})

const http = require('http').createServer(app)
http.listen(port, () => {
    console.log(`Server On : http://localhost:${port}/`);
})


app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})


app.post("/userinfo", (req, res) => {
    let id = req.body.id
    let pw = req.body.pw
    let year = req.body.year
    let register = req.body.register
    let course = req.body.course
    let english = req.body.english
    let category = req.body.category
    let score = req.body.score

    console.log(req)

    var sql = 'INSERT INTO userinfo (ID, Pincode, Semester, StudentNumber, Course, Score, EnglishGrade) VALUES (? ? ? ? ? ? ?)'
    var params = [id, pw, register, year, course, score, english]
    connection.query(sql, params,
        function (err, rows, fields) {
            if (err) {
                console.log("실패");
            } else {
                console.log("성공")
            }
        })
})