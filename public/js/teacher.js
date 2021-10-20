let lessons = []
let students = []
let groups = []
let lessonId = 0
let groupId = 0
let teacherId = 0
let changedAttendances = []
let currentTimetableId = 0

let currentData = {
    groupIndex: 0,
    groupId: 0,
    timetableId: 0

}

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

function getPairs(lessonIndex) {
    lessonId = lessons[lessonIndex].Id
    let pairsStr = ``;
    $(`.wrapper-pairs`).empty();
    $(`.wrapper-groups`).empty();
    $(`.students`).empty();
    lessons[lessonIndex].Pairs.forEach((pair, pairIndex) => {
        pairsStr += `<input class="button" type="button" onclick="getGroups(${lessonIndex}, ${pairIndex}, ${pair.TimeTableId})" value="${pair.NumOfPair} пара" id="${pair.Id}">`
    })
    $(`.wrapper-pairs`).html(pairsStr);
}


function getGroups(lessonIndex, pairIndex, timeTableId) {
    currentTimetableId = timeTableId
    groupsStr = ``
    $(`.wrapper-groups`).empty();
    $(`.students`).empty();
    lessons[lessonIndex].Pairs[pairIndex].Groups.forEach((group, index) => {
        groupsStr += `<input class="button" type="button" onclick="getStudents(${group.GroupdId}, ${lessons[lessonIndex].Pairs[pairIndex].TimeTableId}, ${index})" value="${group.GroupName}" id="${group.GroupId}">`
    })
    $(`.wrapper-groups`).html(groupsStr);
}


function getStudents(groupId, timetableId, groupIndex) {
    currentData.groupIndex = groupIndex;
    currentData.groupId = groupId;
    currentData.timetableId = timetableId;
    currentData.groupIndex = groupIndex

    studentsStr = ``
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/get-students-attendance/`
    const xhr = new XMLHttpRequest()
    const params = `groupId=${groupId}&timetableId=${timetableId}`;
    xhr.open('POST', requestURL, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
        }
    }
    xhr.onload = () => {
        $(`.students`).empty();
        students = JSON.parse(xhr.response)
        students.forEach((student) => {
            studentsStr += `
            <div class="student-item">
            <a href="./student.html?${student.CardCode}&${lessonId}">
			${student.Surname} ${student.Name}</a>
            <div class="student-presence" >${student.Presence === 1 ? '+' : '-'}</div>
            <form class="invisible radio-group">
                    <input type="radio" id="${student.CardCode}true" name="${student.CardCode}" 
                    onChange="changeStudentAttendance(${student.CardCode}, ${true})" class="invisible" 
                    ${student.Presence === 1 ? 'checked' : ''}
                    />
                <label class="presence" for="${student.CardCode}true">+</label>
                    <input type="radio" id="${student.CardCode}false" name="${student.CardCode}"
                    onChange="changeStudentAttendance(${student.CardCode}, ${false})" class="invisible" 
                    ${student.Presence === 1 ? '0' : 'checked'}
                    />
                <label class="absence" for="${student.CardCode}false">-</label>
            </form></div>
            <br>`
        })

        $(`.students`).html(studentsStr);

        if (students.length > 0) {
            $('.edit-buttons').removeClass('invisible');
        }
    }
    xhr.send(params)
}

function redirectToSchedule() {
    let url = window.location.href.split("?");
    let idx = url[1].split('&')
    let id = idx[0]
    window.location.href = './schedule.html?' + id
}

function editAttendance() {
    $('#edit').addClass('invisible');
    $('#close').removeClass('invisible');
    $('#save').removeClass('invisible');
    $('.radio-group').removeClass('invisible');
    $('.student-presence').addClass('invisible');
}

function closeEditMode() {
    $('#edit').removeClass('invisible');
    $('#close').addClass('invisible');
    $('#save').addClass('invisible');
    $('.radio-group').addClass('invisible');
    $('.student-presence').removeClass('invisible');
}

function saveAttendance() {
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/update-attendances`
    const params = `timeTableId=${currentTimetableId}&attendances=${JSON.stringify(changedAttendances)}`
    const xhr = new XMLHttpRequest()
    xhr.open('POST', requestURL, true)

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
        }
    }
    xhr.onload = function () {
        closeEditMode();
        getStudents(currentData.groupId, currentData.timetableId, currentData.groupIndex);
    }
    xhr.send(params);
}

function changeStudentAttendance(cardCode, presence) {
    changedAttendances.push({ cardCode: cardCode, presence: presence })
}
