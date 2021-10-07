let lessons = []
let students = []
let groups = []
let lessonId = 0
let groupId = 0
let teacherId = 0


getLessons()
function getLessons() {
    var url = window.location.href.split("?");
    var idx = url[1].split('&')
    let id = idx[0]
    teacherId = id
    lessonsStr = ``
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/get-lessons/`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL + `${id}`)
    xhr.onload = () => {
        $(`.wrapper-lessons`).empty();
        lessons = JSON.parse(xhr.response)
        lessons.forEach((lesson, index) => {
            lessonsStr += `<input type="button" class="button" value="${lesson.Name}" onclick="getPairs(${index})" id="${lesson.Id}">`
        })

        $(`.wrapper-lessons`).html(lessonsStr);
    }
    xhr.send()
}

function getPairs(lessonIndex){
    lessonId=lessons[lessonIndex].Id
    let pairsStr = ``;
    $(`.wrapper-pairs`).empty();
    $(`.wrapper-groups`).empty();
    $(`.students`).empty();
    lessons[lessonIndex].Pairs.forEach((pair, pairIndex) => {
        pairsStr += `<input class="button" type="button" onclick="getGroups(${lessonIndex}, ${pairIndex})" value="${pair.NumOfPair} пара" id="${pair.Id}">`
    })
    $(`.wrapper-pairs`).html(pairsStr);
}


function getGroups(lessonIndex, pairIndex) {
    groupsStr = ``
        $(`.wrapper-groups`).empty();
        $(`.students`).empty();
        lessons[lessonIndex].Pairs[pairIndex].Groups.forEach((group) => {
            groupsStr += `<input class="button" type="button" onclick="getStudents(${group.GroupdId}, ${lessons[lessonIndex].Pairs[pairIndex].TimeTableId})" value="${group.GroupName}" id="${group.GroupId}">`
        })
        $(`.wrapper-groups`).html(groupsStr);
}


function getStudents(groupId, timetableId) {
    studentsStr = ``
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/get-students-attendance/`
    const xhr = new XMLHttpRequest()
    const params = `groupId=${groupId}&timetableId=${timetableId}`;
    xhr.open('POST', requestURL , true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
        }
    }
    xhr.onload = () => {
        $(`.students`).empty();
        students = JSON.parse(xhr.response)
        students.forEach((student) => {
            studentsStr += `<a href="./student.html?${student.CardCode}&${lessonId}">
			${student.Surname} ${student.Name}</a><div class="student-presence" >${student.Presence === 1? '+': '-'}</div><br>`
        })

        $(`.students`).html(studentsStr);
    }
    xhr.send(params)
}

function redirectToSchedule(){
	var url = window.location.href.split("?");
    var idx = url[1].split('&')
    let id = idx[0]
	console.log(id)
	window.location.href = './schedule.html?' + id
}
