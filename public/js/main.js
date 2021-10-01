let groups = []
let students = []
let studentsStr = ``
let codeString = ``
getGroups()

function getGroups() {
	const requestURL = 'https://secure-mountain-75949.herokuapp.com/api/groups'
	const xhr = new XMLHttpRequest()
	xhr.open('GET', requestURL)
	xhr.onload = () => {
		groups = JSON.parse(xhr.response)
		renderGroups()
	}
	xhr.send()
}

function getStudents(id) {
	studentsStr = ``
	const requestURL = `https://secure-mountain-75949.herokuapp.com/api/students/`
	const xhr = new XMLHttpRequest()
	xhr.open('GET', requestURL + `${id}`)
	xhr.onload = () => {
		students = JSON.parse(xhr.response)
		students.forEach((student) => {
			studentsStr += `<a href="./student.html?${student.GroupId}">
			${student.Surname} ${student.Name}</a><br>`
		})

		$(`.students`).html(studentsStr);
	}
	xhr.send()
}

function renderGroups() {
	let string = ``
	codeString = ``
	groups.forEach((group) => {
		string = `
		<button class="wrapper-list" onclick="getStudents(${group.Id})" id="${group.Id}">${group.GroupName}</button>`
		codeString += string
	})

	$('.wrapper-button').html(codeString);
}

getAttendance()
function getAttendance() {
	str = ``
	var url = window.location.href.split("?");
	var idx = url[1].split('&')
	let groupid = idx[0]

	const requestURL = `https://secure-mountain-75949.herokuapp.com/api/lessons/`
	const xhr = new XMLHttpRequest()
	xhr.open('GET', requestURL + `${groupid}`)
	xhr.onload = () => {
		let lessons = JSON.parse(xhr.response)
		lessons.forEach((lesson) => {
			str += `<button class="wrapper-list" onclick="" id="${lesson.Id}">${lesson.Name}</button>`
		})
		$(`.lessons`).html(str);
	}
	xhr.send()
	
}
 
