
 $(document).on('click', '#sign-in', () => {
    let login = $('#login').val();
    let password = $('#password').val();

    const requestURL = `https://secure-mountain-75949.herokuapp.com/api/sign-in`
    const params = `login=${login}&password=${password}`
    const xhr = new XMLHttpRequest()
    xhr.open('POST', requestURL, true)

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
        }
    }
    xhr.onload = function () {
        res = JSON.parse(xhr.response)
        console.log(res)
        if (res) {
            window.location.href = './main.html?' + res.id
        }

    }
    xhr.send(params);
});
