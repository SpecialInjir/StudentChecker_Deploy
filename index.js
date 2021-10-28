var fs = require('fs');
var sys = require('sys');
const express = require("express")
const app = express()
const moment=require('moment')
const mysql = require('mysql2')     //подключаем библиотеку для работы с базой данных
const cors = require('cors')
const timeConstants = require('./consts/time_consts');
const PORT = process.env.PORT || 8000


const connection = mysql.createPool({
    host: "eu-cdbr-west-01.cleardb.com", //адрес базы данных
    user: "b266462846649d",
    database: "heroku_28d2ba6f5985a82", //название бд
    password: "2e18d860",
    multipleStatements: true,
});



app.set("view options", {layout: false});
app.use(express.static(__dirname +'/public'));
app.use(cors())

let students = []
let lessons = []

app.get("/",(req, res)=>{
    res.end("<div>Happy me</div>")
})


app.get('/api/get-lessons/:id', (req, res) => {
    const teacherId = req.params.id;
    let sql = `SELECT l.Id, l.Name,t.NumOfPair, t.Day, t.Audience,  t.Id as TimeTableId, g.Id as GroupId, g.GroupName, count(t.Id) as Count FROM Lessons l
    LEFT JOIN timitable t ON (l.Id = t.LessonId AND timestampdiff(day, t.Day, curdate()) = 0)
	INNER JOIN groups g ON t.GroupId = g.Id
    WHERE TeacherID = ${teacherId}
    GROUP BY t.Id
    ORDER BY NumOfPair`

    connection.query(sql, (err, data) => {
        let lessons = [];
        data.forEach((val)=>{
            let existingLessonIdx = lessons.findIndex((les)=>  les.Id === val.Id);
            if (existingLessonIdx === -1){
                if (val.Count > 0){
                    lessons.push({
                        Id: val.Id,
                        Name: val.Name,
                        Pairs: [{
                            TimeTableId: val.TimeTableId,
                            NumOfPair: val.NumOfPair,
                            Day: val.Day,
                            Audience: val.Audience,
                            Groups: [{
                                GroupdId: val.GroupId,
                                GroupName: val.GroupName
                            }]
                        }]
                    })
                } else {
                    lessons.push({
                        Id: val.Id,
                        Name: val.Name,
                        Pairs: [null]
                    })
                }
                
            } else{
                if (val.Count > 0){
                    let existingPair = lessons[existingLessonIdx].Pairs
                    .findIndex((pair)=> pair.NumOfPair === val.NumOfPair)

                    if (existingPair === -1){
                        lessons[existingLessonIdx].Pairs.push({
                            TimeTableId: val.TimeTableId,
                            NumOfPair: val.NumOfPair,
                            Day: val.Day,
                            Audience: val.Audience,
                            Groups: [{
                                GroupdId: val.GroupId,
                                GroupName: val.GroupName
                            }]
                        })
                    } else {
                        let existingGroup = lessons[existingLessonIdx].Pairs[existingPair].Groups
                            .findIndex((group)=> group.GroupdId === val.GroupdId)
                        if (existingGroup === -1){
                            lessons[existingLessonIdx].Pairs[existingPair].Groups.push({
                                GroupdId: val.GroupId,
                                GroupName: val.GroupName
                            })
                        }
                    }

                    
                }
            }
        })
        res.json(lessons)
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

app.post('/api/insert-attendance', async (req, res) => {//обработчик для записи в базу
    const id = req.body.id
    let allCards = req.body.cards
    let cards = allCards
    let numOfPair = checkCurrentLesson()
    let audience = await getAudience(id)
    let timitableId = await getTimetable(audience, numOfPair)
    .then(
        result =>  insertAttendance(cards, result).then(
            result => res.send('Attendances has been inserted in DB'),
            error => res.status(500).send({error: 'Attendances inserting has been failed'})
            ),
        error => res.status(500).send({error: 'Timetable does not find'})
    )
    

})

async function getAudience(id){
    return new Promise(function(resolve, reject) {
        let audienceSql = ` SELECT audience FROM slots WHERE id=${id}`
        connection.execute(audienceSql, (err, data) => {
            resolve(data[0].audience);
        })
    })
}

async function getTimetable(audience, numOfPair){
    return new Promise(function(resolve, reject) {
        let timetableSql = ` SELECT Id FROM timitable WHERE Audience=${audience} AND timestampdiff(DAY, Day , curdate()) = 0 AND NumOfPair=${numOfPair}`
        connection.execute(timetableSql, (err, data) => {
            if (data.length>0){
                resolve(data[0].Id);
            } else {
                reject(new Error())
            }
        })
    })
}

async function insertAttendance(cards,timetableId){
    return new Promise(function(resolve, reject) {
    let sql = ``
    if (timetableId){
        cards.forEach((card) => {
            sql = `INSERT INTO normal_attendance(CardCode, TimetableId, Presence) VALUES (${card}, ${timetableId}, 1)`
            connection.query(sql, (err, data) => {
                resolve();
            })
        })
    } else {
        reject(new Error())
    }
    })

}

app.post('/api/sign-in', (req, res) => {
    const login = req.body.login
    const password = req.body.password
    let sql = `SELECT id FROM teacher WHERE login='${login}' AND password='${password}'`
   
    connection.query(sql, (err, data) => {
        console.log(data)
        if (data) {
            res.send(data[0])
        } else {
            res.status(500).send({ error: 'Something failed!' });
        }
    })
   
})
checkCurrentLesson()

function checkCurrentLesson() {
    let date = moment.utc();
    let utcDate = new Date(date.format());
    let time = Date.parse(utcDate)
    let currentLesson
console.log('time', time)

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
    console.log('lesson',currentLesson )


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


app.post('/api/get-students-attendance', (req, res) =>{
    let groupId = req.body.groupId;
    let timeTableId = req.body.timetableId;
    console.log(req.body)


    let sql = `SELECT * FROM students s
    LEFT JOIN normal_attendance n ON (s.CardCode = n.CardCode)
    WHERE s.GroupId = ${groupId} AND n.TimetableId = ${timeTableId}
    ORDER BY s.Surname`

    connection.query(sql,(err, data)=>{
        console.log(data)
        res.send(data);
    })
})

app.post('/api/update-attendances', (req, res)=>{
    let timeTableId = req.body.timeTableId
    let attendances = JSON.parse(req.body.attendances)
    console.log(attendances)
    let sql = ``
    attendances.forEach((val)=>{
        sql += `UPDATE normal_attendance SET Presence = ${val.presence} WHERE TimetableId = ${timeTableId} AND CardCode = ${val.cardCode};`
    })
     connection.query(sql, (err, data)=>{
         if (!err){
             res.status(200).send("Students attendances had been saved")
         } else {
            res.status(500).send("Error. Students attendances had not been saved")
         }
     })
})

app.listen(PORT, ()=>{
    console.log("Server has been started!!!!")
})