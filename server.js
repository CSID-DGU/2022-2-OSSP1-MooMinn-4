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

app.post("/result",(req,res)=>{
    const email =req.body.email

    var sql1 = 'select count(*) AS result From UserSelectList where UserID = ? and CNumber like ?'// 필수과목 판별시 사용
    var sql2  = 'select count(*) AS result from UserSelectList where UserID = ? and CNumber like ? or CNumber like ? or CNumber like ?'//선택과목 판별시 사용(3과목)
    var sql3 = 'select count(*) AS result from UserSelectList where where UserID = ? and CNumber like ? or CNumber like ?'//EAS 판별시 사용(2과목)
    var sql4 = 'select EnglishGrade As result from UserInfo where ID = ?'// S0인지 아닌지 판별할 떄 사용
    var sql5 = 'select sum(ClassCredit) As result from UserSelectList,Lecture where where TNumber = TermNumber,CNumber=ClassNumber, UserID = ? and ClassArea like ?'//기본소양, BSM수학,Bsm과학 학점 판정시 사용
    var sql6= 'select count(*) AS result from UserSelectList where UserID = ? and CNumber like ?' //필수 전공과목 이수 판별
    var sql7= 'select sum(ClassCredit) AS result from UserSelectList,Lecture where TNumber = TermNumber, CNumber=ClassNumber, UserID = ? and Curriculum=?'//전공 학점 수가 84학점이 되는지 여부 확인
    var sql8= 'select sum(ClassCredit) AS result from UserSelectList,Lecture where CNumber=ClassNumber, UserID = ? and ClassArea=?'// 전공 전문 학점 수가 42학점이 되는지 여부 확인
    var sql9= 'select sum(ClassCredit) AS result from UserSelectList,Lecture where TNumber = TermNumber, UserID = ? and CNumber=ClassNumber'//총 학점이 140점이 되는지 여부 확인
    var sql10= 'select Score AS result from UserInfo where ID= ?'//외국어 성적이 700을 넘는지 조건 확인
    var sql11= 'select ClassScore,ClassCredit from UserSelectList, Lecture where TNumber = TermNumber, CNumber=ClassNumber ,UserID = ?'//평점 평균이 2.0을 넘는지 조건 확인
    var sql12= 'select sum(EnglishClass) AS result from UserSelectList, Lecture where CNumber=ClassNumber, TNumber=TermNumber ,UserID = ?' //영어 강의 수가 4개 이상인지 조건 확인
    var sql13= 'select Course AS result from UserInfo where ID = ?'//일반 심화 판별
    var sql14 = 'select StudentNumber As result from UserInfo where ID =?'//학번 판별
   
	// 공통 교양 판별
	var necessay_common_class = ['RGC-1074%', 'RGC-0017%', 'RGC-0018%', 'RGC-0003%', 'RGC-0005%']//공통 필수 과목
	var select_common_class = ['RGC-1050%', 'RGC-1051%', 'RGC-1052%']//공통 선택 필수 과목
	var EAS1_common_class = ['RGC-1080%', 'RGC-1033%']//EAS1
	var EAS2_common_class = ['RGC-1081%', 'RGC-1034%']//EAS2
    var math_class = ['PRI-4001%','PRI-4023%','PRI-4024%']//수학 필수 과목
	// 필수 공통 교양 판별
	for (var i = 0; i < necessay_common_class.length; i++){
	let isNotClass = document.createElement('isNotClass')//수강하지 않은 강의를 담을 배열
	connection.query(sql1, [email, necessary_common_class[i]],
		function (err, data) {
			if (!err) {
				if(data[0].result <1){//해당 강의를 수강하지 않은 경우
					console.log('해당 필수 과목을 수강하지 않음')
					isNotClass.append(necessary_common_class[i]);
				} else{//해당 강의를 수강한 경우
					console.log('해당 강의를 수강함')
				}
			}
            else {//에러 처리
                res.send(err)
                console.log('필수 공통 교양 판별 error')
            }
		}
	)
	}
    // 선택 필수 공통 교양 판별
    connection.query(sql2, [email, select_common_class],
        function (err, data) {
            if(!err) {
                if(data[0].result>0){//리더쉽 수업을 적어도 하나를 이수한 경우
                    console.log('선택 필수 공통 교양 요건 만족')
                } else{//리더쉽 강의를 하나도 이수하지 않은경우
                    console.log('리더쉽 과목 중 하나를 수강하시오')
                }        
             } else{
                 console.log('선택 필수 공통 교양 판별 error')
             }
        }
    )
    
    connection.query(sql4, [email],
        function (err, data) {
            if(!err){
                if(data[0].result != 0){
                    // EAS1 판별
                    connection.quary(sql3, [email, EAS1_common_class],
                        function (err, data2) {
                            if(!err){
                                if(data2[0].result>0){//두 종류의 EAS1중 하나라도 이수한 경우
                                    console.log('EAS1을 수강하였습니다')
                                }else{// 둘 다 수강하지 않은 경우
                                    console.log('EAS1을 수강하지 않았습니다')
                                }
                            } else{
                                console.log('EAS1 error')
                            }
                        }
                    )
                    //EAS2 판별
                    connection.query(sql3, [email, EAS2_common_class],
                        function (err, data) {
                            if(!err){
                                if(data[0].result>0){//두 종류의 EAS2중 하나라도 수강한 경우
                                    console.log('EAS2을 수강하였습니다')
                                }else{//둘 다 수강하지 않은 경우
                                    console.log('EAS2을 수강하지 않았습니다')
                                }
                            } else{
                                console.log('EAS2 error')
                            }
                        }
                    )
                } else{
                    console.log('EAS를 수강하지 않아도 됩니다')
                }
            } else {
                console.log('EAS판별 오류')
            }
        }
    )
    //기본 소양 9학점이상
    connection.query(sql5, [email, '기본소양%'],
        function(err, data) {
            if(!err){
                if(data[0].result>=9){
                    console.log('기본소양 학점을 만족합니다')
                } else{
                    console.log('기본소양 학점이 모자랍니다')
                }
            } else{
                console.log('기본소양 err')
            }
        }
    )
    
    for (var i = 0; i < math_class.length; i++){
        let isNotClass = document.createElement('isNotClass')//수강하지 않은 강의를 담을 배열
        connection.query(sql1, [email, math_class[i]],
            function (err, data) {
                if (!err) {
                    if(data[0].result <1){//해당 강의를 수강하지 않은 경우
                        console.log('해당 필수 과목을 수강하지 않음')
                        isNotClass.append(math_class[i]);
                    } else{//해당 강의를 수강한 경우
                        console.log('해당 강의를 수강함')
                    }
                }
                else {//에러 처리
                    res.send(err)
                    console.log('BSM 수학 필수 과목 error')
                }
            }
        )
    }
//bsm수학 최저학점 판정
    connection.query(sql5, [email, 'BSM_수학%'],
        function(err, data) {
            if(!err){
                if(data[0].result>=12){
                    console.log('BSM수학 학점을 만족합니다')
                } else{
                    console.log('BSM수학 학점이 모자랍니다')
                }
            } else{
                console.log('Bsm수학 학점 err')
            }
        }
    )
//bsm 과확 실험 수강여부 확인
    connection.query(sql5, [email, 'BSM_과학(실험)%'],
        function(err, data) {
            if(!err){
                if(data[0].result>=3){
                    console.log('BSM과학 실험 학점을 만족합니다')
                } else{
                    console.log('BSM과학 실험 학점이 모자랍니다')
                }
            } else{
                console.log('Bsm과학 실험 학점 err')
            }
        }
    )
//Bsm 과학 수강여부 확인
    connection.query(sql5, [email, 'BSM_과학%'],
        function(err, data) {
            if(!err){
                if(data[0].result>=6){
                    console.log('BSM과학 학점을 만족합니다')
                } else{
                    console.log('BSM과학 학점이 모자랍니다')
                }
            } else{
                console.log('Bsm과학 학점 err')
            }
        }
    )
//bsm 총학점
    connection.query(sql5, [email, 'BSM%'],
        function(err, data) {
            if(!err){
                if(data[0].result>=21){
                    console.log('BSM 학점을 만족합니다')
                } else{
                    console.log('BSM 학점이 모자랍니다')
                }
            } else{
                console.log('Bsm 학점 err')
            }
        }
    )
    //필수 전공과목 이수 판별
    var necessary_major_class=['CSE2017%','CSE2018%','CSE2025%','CSE2026%','CSE2028%','CSE4066%','CSE4067%','CSE4074%','CSE2013%']
    connection.query(sql14, [email],
        function(err, data){
            if(!err){
                if(data[0].result>=2020){
                    connection.query(sql13, [email],
                        function(err,data){
                            if(!err){
                                if(data[0].result == '일반'){
                                    necessary_major_class.splice(2,1)
                                    necessary_major_class.splice(6,1)
                                }
                            }else{
                                console.log('필수 전공 배정 오류')
                            }
                        })
                } else{
                    console.log('학번 판정 오류')
                }
            }
        } )
    
    for(var i=0; i<necessary_major_class.length; i++){
    let isNotClass=document.createElement('isNotClass')
    connection.query(sql6,[email, necessary_major_class[i]],
        function(err,data){
            if(!err){
                if(data[0].result<1){
                    console.log('해당 필수 전공을 수강하지 않음')
                    isNotClass.append(necessary_major_class[i]);
                } else{
                    console.log('해당 강의를 수강함')
                }
            }
            else{
                res.send(err)
                console.log('필수 전공 판별 error')
            }
        }
    )
    }
    connection.query(sql13, [email],
        function(err, data){
            if(!err){
                if(data[0].result == '심화'){
                    var sumOfCredit=0;
                    for(var i=0; i<major.length; i++){
                        connection.quary(sql7,[email, '전공'],
                            function(err,data){
                                if(!err){
                                    if(data[0].result>=84){
                                        console.log("전공학점을 만족합니다")
                                    } else{
                                        console.log("전공학점이 부족합니다")
                                    }
                                }
                                else{
                                res.send(err)
                                console.log('전공학점 총합 계산 error')
                            }
                        }
                        )
                    }
                    // 전공 전문 학점 수가 42학점이 되는지 여부 확인
                    sumOfCredit=0;
                    for(var i=0; i<special.length; i++){
                
                        connection.query(sql8,[email, '전문'],
                            function(err,data){
                                if(!err){
                                    if(data[0].result>=42){
                                        console.log("전문 학점을 만족합니다")
                                    }else{
                                        console.log("전문학점이 부족합니다")
                                    }
                                }
                                else{
                                    res.send(err)
                                    console.log('전문 학점 총합 계산 error')
                                }
                            }
                            )
                        }
                    //총 학점이 140점이 되는지 여부 확인
                    sumOfCredit=0;
                    connection.query(sql9,[email],
                        function(err,data){
                            if(!err){
                                if(data[0].result>=140){
                                    console.log('총 학점 조건을 만족함')
                                }
                                else{
                                    console.log('총 학점 조건을 만족하지 않음')
                                }
                            }
                        else{
                            res.send(err)
                            console.log('총 학점 계산 error')
                        }
                    }
                    )
                }else{//전공 학점 계산 72학점 이상
                    var sumOfCredit=0;
                    for(var i=0; i<major.length; i++){
                        connection.query(sql7,[email,'전공'],
                            function(err,data){
                                if(!err){
                                    if(data[0].result>=72){
                                        console.log('총 전공학점 조건을 만족함')
                                    }
                                    else{
                                        console.log('총 전공학점 조건을 만족하지 않음')
                                    }
                                }
                                else{
                                res.send(err)
                                console.log('전공학점 총합 계산 error')
                            }
                        }
                        )
                    }
                    // 전공 전문 학점 수가 36학점이 되는지 여부 확인
                    sumOfCredit=0;
                    for(var i=0; i<special.length; i++){
                
                        connection.query(sql8,[email,'전문'],
                            function(err,data){
                                if(!err){
                                    if(data[0].result>=36){
                                        console.log('총 전문강의 수강 학점 조건을 만족함')
                                    }
                                    else{
                                        console.log('총 전문강의 수강 조건을 만족하지 않음')
                                    }
                                }
                                else{
                                    res.send(err)
                                    console.log('전문 학점 총합 계산 error')
                                }
                            }
                            )
                        }
                    //총 학점이 130점이 되는지 여부 확인
                    sumOfCredit=0;
                    connection.query(sql9,[email],
                        function(err,data){
                            if(!err){
                                if(data[0].result>=130){
                                    console.log('총 학점 조건을 만족함')
                                }
                                else{
                                    console.log('총 학점 조건을 만족하지 않음')
                                }
                            }
                        else{
                            res.send(err)
                            console.log('총 학점 계산 error')
                        }
                    }
                    )
                }
            }
        })
    
    //외국어 성적이 700을 넘는지 조건 확인
    connection.query(sql10, [email],
        function(err,data){
            if(!err){
                if(data[0].result>=700){
                    console.log('외국어 성적 조건을 만족함')
                }
                else{
                    console.log('외국어 성적 조건을 만족하지 않음')
                }
            }
            else{
                console.log('외국어 성적 계산 error')
            }
        }
    )
    var temp=0
    //평점 평균이 2.0을 넘는지 조건 확인
    connection.query(sql11,[email],
                    function(err,rows,fields){
                        if(!err){
                            for(var i=0; i<rows.length; i++){
                                temp+=row[i].ClassScore*rows[i].ClassCredit
                            }
                            connection.query(sql9,
                                function(err,data){
                                    if(!err){
                                        sumOfCredit=data[0].result
                                    }
                                    else{
                                        console.log("총 학점 수 계산 error")
                                    }
                                }
                            )
                            if(temp/sumOfCredit>=2.0){
                                console.log("총 평점 조건을 만족함")
                            }
                            else{
                                console.log("총 평점 조건을 만족하지 않음")
                            }
                        } else{
                            console.log("평점 계산 오류")
                        }
                    }   
    )
    //영어 강의 수가 4개 이상인지 조건 확인
    var English=0;
    connection.query(sql12,[email],
        function(err,data){
            if(!err){
                
                if(data[0].result>=4)
                {
                    console.log('영어 강의 수 조건을 만족함')
                }
                else{
                    console.log('영어 강의 수 조건을 만족하지 않음')
                }
            }
            else{
                console.log('영어 강의 판별 error')
            }
        }
        )
}
)
