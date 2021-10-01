let attendances = []
let timeTable = []
getAttendance()
function getAttendance() {
    var url = window.location.href.split("?");
    var idx = url[1].split('&')
    let code = idx[0]
    let id = idx[1]

    studentsStr = ``
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/attendance/`
    const params = `code=${code}&id=${id}`
    const xhr = new XMLHttpRequest()
    xhr.open('POST', requestURL, true)

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
            // alert(xhr.responseText);
        }
    }
    xhr.onload = function () {
        attendances = JSON.parse(xhr.response)
        attendances.forEach((element, i) => {
            getTimetable(element.TimetableId, id, i)
        });
        console.log(attendances);
    };
    xhr.send(params);
}

function getTimetable(id, lessonId, index) {
    str = ``
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/timetable/`
    const params = `id=${id}&lesson=${lessonId}`
    const xhr = new XMLHttpRequest()
    xhr.open('POST', requestURL, true)

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
            // alert(xhr.responseText);
        }
    }
    xhr.onload = function () {
        timeTable = JSON.parse(xhr.response)
        timeTable.forEach((item) => {
            str += `<div class="data">${new Date(item.Day).toDateString()}
                        <div class="sign">${attendances[index].Presence == 0 ? '-' : '+'}</div>
                    </div>`
        })
        $(`.information`).html(str);
    }
    xhr.send(params);
};