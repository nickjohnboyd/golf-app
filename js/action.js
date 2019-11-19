let allCourses;
let myCourse;

getApi();
function getApi() {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
                allCourses = JSON.parse(http.responseText);
                resolve(allCourses);
            }
        }
        http.open("get", "https://golf-courses-api.herokuapp.com/courses");
        http.send();
    });
}

function getCourse(id) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
                myCourse = JSON.parse(http.responseText);
                resolve(myCourse);
            }
        }
        http.open("get", `https://golf-courses-api.herokuapp.com/courses/:${id}`);
        http.send();
    });
}