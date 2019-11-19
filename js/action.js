let myCourses;
let theCourse;

getApi();

setTimeout(function(){
    buildCourses();
}, 100)

function getApi() {
    return new Promise((resolve) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
                myCourses = JSON.parse(http.responseText);
                resolve(myCourses);
            }
        }
        http.open("get", "https://golf-courses-api.herokuapp.com/courses");
        http.send();
    });
}

function buildCourses() {
    for(let i = 0; i < myCourses.courses.length; i++) {
        let theCourse = myCourses.courses[i];
        $(".all-courses").append(`
            <div class="course" id="${theCourse.id}">
                <div class="course-name">${theCourse.name}</div>
                <img src="${theCourse.image}" class="course-image">
            </div>
        `);
    }  
}



function getCourse(id) {
    return new Promise((resolve) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
                myCourse = JSON.parse(http.responseText);
                resolve(myCourse);
            }
        }
        http.open("get", `https://golf-courses-api.herokuapp.com/courses/${id}`);
        http.send();
    });
}