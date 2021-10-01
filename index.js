const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000
const mysql = require('mysql2')     //подключаем библиотеку для работы с базой данных
const cors = require('cors')
const timeConstants = require('./consts/time_consts')

const connection = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com", //адрес базы данных
    user: "b5928688e75919",
    database: "heroku_ae5eccf704ed2e1", //название бд
    password: "8c6374a2"
});

app.use(cors())

let students = []
let lessons = []

app.get("/",(req, res)=>{
    res.end("<div>Happy me</div>")
})

app.get('/api/lessons/:id', (req, res) => {//достаю список предметов по id препода из совпадений id в lessons
    const id = req.params.id
    let sql = `SELECT lessonId FROM groups_attendance WHERE groupId=${id}`;
    connection.query(sql, (err, data) => {
        data.forEach((item) => {
            getLessons(item.lessonId)
        })
    })
    res.json(lessons)
    lessons = []
})

function getLessons(id) {
    let sql = `SELECT * FROM lessons WHERE Id=${id}`;
    connection.query(sql, (err, data) => {
        data.forEach((item) => {
            lessons.push(item)
        })
    })
}

app.get('/api/get-lessons/:id', (req, res) => {
    const teacherId = req.params.id;
    let sql = `SELECT * FROM Lessons WHERE TeacherID=${teacherId}`
    connection.query(sql, (err, data) => {
        res.json(data)
    })
})

app.get('/api/get-groups/:id', (req, res) => {// id предмета достаем id группы и все о ней знаем
    const lessonId = req.params.id;
    let sql = `SELECT DISTINCT GroupId , GroupName  FROM Groups INNER JOIN
    timitable ON Groups.Id = timitable.GroupId WHERE LessonId=${lessonId}`
    connection.query(sql, (err, data) => {
        res.json(data)
    })
})


app.get('/api/students/:id', (req, res) => {// id групппы получаем по этому id получаем студентов
    const id = req.params.id
    console.log(id)
    let sql = `SELECT * FROM students WHERE GroupId=${id}`;
    connection.query(sql, (err, data) => {
        console.log(students)
        res.send(data)
    })
})

app.use(
    express.urlencoded({
        extended: true
    })
)


app.use(express.json())

app.post('/api/attendance/', (req, res) => {
  
    const code = req.body.code

    let sql = `SELECT * FROM normal_attendance WHERE CardCode=${code}`

    connection.query(sql, (err, data) => {
        console.log(data)
        res.send(data)
    })
})

app.post('/api/timetable/', (req, res) => {//id пары и предмета но перед этим получаем список всех посещ ст
    
    const id = req.body.id
    const lessonId = req.body.lesson
    console.log(id)

    let sql = `SELECT * FROM timitable  WHERE Id=${id} AND LessonId=${lessonId}`
    connection.query(sql, (err, data) => {
        console.log(data)
        res.send(data)
    })
})

app.post('/api/insert-attendance', (req, res) => {//обработчик для записи в базу
   
    const id = req.body.id

    let allCards = req.body.cards
    let cards = allCards.split(',')

    let sql = ``
    cards.forEach((card) => {
        sql = `INSERT INTO normal_attendance(CardCode, TimetableId, Presence) VALUES (${card.trim()}, ${id}, 1)`
        console.log(sql)
        connection.query(sql, (err, data) => {
            console.log('SQL request has been executed')
        })
    })
})

app.post('/api/insert-attendance', (req, res) => {//обработчик для записи в базу
    const id = req.body.id

    let allCards = req.body.cards
    let cards = allCards.split(',')
    let numOfPair = checkCurrentLesson()

    let audience
    if (numOfPair) {
        let audienceSql = ` SELECT audience FROM slots WHERE id=${id}`
        connection.execute(audienceSql, (err, data) => {
            audience = data;
        })
    }

    if (audience && numOfPair) {
        let date = new Date()
        date = date.toLocaleDateString()
        let timitableId
        let timetableSql = ` SELECT id FROM timitabe WHERE audience=${audience} AND Day=${date} AND NumOfPair=${numOfPair}`
        connection.execute(audienceSql, (err, data) => {
            timitableId = data;
        })
    }


    let sql = ``
    cards.forEach((card) => {
        sql = `INSERT INTO normal_attendance(CardCode, TimetableId, Presence) VALUES (${card.trim()}, ${timitableId}, 1)`
        console.log(sql)
        connection.query(sql, (err, data) => {
            console.log('SQL request has been executed')
        })
    })
})

// app.post('api/signin/',(req, res)=>{
// let login=req.body.login
// let password=req.body.password
// console.log(password)
// })
app.post('/api/sign-in', (req, res) => {
    const login = req.body.login
    const password = req.body.password
    let sql = `SELECT id FROM teacher WHERE login='${login}' AND password='${password}'`
   
    connection.query(sql, (err, data) => {
        console.log(data)
        if (data) {
            res.send(data[0])
        } else {
            res.status(200).send({ error: 'Something failed!' });
        }
    })
   
})
checkCurrentLesson()

function checkCurrentLesson() {
    let nowDate = new Date();
    let time = Date.parse(nowDate)
    let currentLesson

    if (timeConstants.LESSON_1_START <= time && time <= timeConstants.LESSON_1_END) {
        
        currentLesson = 1
    }
    else if (timeConstants.LESSON_2_START <= time && time <= timeConstants.LESSON_2_END) {
        currentLesson = 2
    }
    else if (timeConstants.LESSON_3_START <= time && time <= timeConstants.LESSON_3_END) {
        currentLesson = 3
    }
    else if (timeConstants.LESSON_4_START <= time && time <= timeConstants.LESSON_4_END) {
        currentLesson = 4
    }
    else if (timeConstants.LESSON_5_START <= time && time <= timeConstants.LESSON_5_END) {
        currentLesson = 5
    }
    else if (timeConstants.LESSON_6_START <= time && time <= timeConstants.LESSON_6_END) {
        currentLesson = 6
    }
    else if (timeConstants.LESSON_7_START <= time && time <= timeConstants.LESSON_7_END) {
        currentLesson = 7
    } else {
        currentLesson = 0
    }
    return currentLesson;
}
app.get('/api/teacher-timetable/:id', (req, res) => {// id групппы получаем по этому id получаем студентов
    const id = req.params.id
    console.log(id)
    let sql = `SELECT * FROM teachertimetable      
LEFT JOIN lessons  ON lessons.Id=teachertimetable.LessonId 
WHERE teachertimetable.TeacherId=${id}
ORDER BY teachertimetable.Day`;
    connection.query(sql, (err, data) => {
        console.log(data)
        res.send(data)
    })
})

app.listen(PORT, ()=>{
    console.log("Server has been started!!!!")
})
