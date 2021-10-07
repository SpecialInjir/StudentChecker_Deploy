getLessons()

function getLessons() {
    var url = window.location.href.split("?");
    var idx = url[1].split('&')
    let id = idx[0]
    //let id=2;
    let lessonsStr = `<tr>
         <th> Num of lesson </th>
         <th> Name of lesson </th>
         <th> Day </th>
    </tr>`
    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/teacher-timetable/`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL + `${id}`)
    xhr.onload = () => {
    let date;
       let lessons = JSON.parse(xhr.response)
        lessons.forEach((lesson) => {
            date= new Date(lesson.Day)
            lessonsStr += `<tr>
            <td>${lesson.NumofPair}</td>
            <td>${lesson.Name}</td>
            <td>${date.toLocaleDateString()}</td>
            </tr>`
        })
     console.log(lessons)
        $(`#table-content`).html(lessonsStr);
    }
    xhr.send()
}