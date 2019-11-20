let myCourses;
let selectedCourse;

getApi().then(() => {
    buildCourses();
    buildTeeTypes();
})

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
            <div class="course-cont" id="${theCourse.id}">
                <div class="course" id="course${theCourse.id}" onclick="showTeeTypes(${theCourse.id})">
                    <div class="course-name">${theCourse.name}</div>
                    <img src="${theCourse.image}" class="course-image">
                </div>
                <div class="tee-types">
                    <select name="tee-types" class="tee-type-select">
                        <option class="tee-type" value="Select Tee Type">Tee Type:</option>
                    </select>
                </div>               
            </div>
        `);
    }
}

function buildTeeTypes() {
    for(let i = 0; i < myCourses.courses.length; i++) {
        let theCourse = myCourses.courses[i];
        getCourse(`${theCourse.id}`).then( () => {
            for(let j = 0; j < selectedCourse.data.holes[0].teeBoxes.length; j++) {
                if(j == 4) {
                    return;
                }
                let theTee = selectedCourse.data.holes[0].teeBoxes[j];
                $(`#${theCourse.id}`).find(".tee-type-select").append(`
                    <option class="tee-type" value="${theTee.teeType}">${theTee.teeType}</option>
                `);            
            }
        })   
    }      
}

function getCourse(id) {
    return new Promise((resolve) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
                selectedCourse = JSON.parse(http.responseText);
                resolve(selectedCourse);
            }
        }
        http.open("get", `https://golf-courses-api.herokuapp.com/courses/${id}`);
        http.send();
    });
}

function showTeeTypes(id) {

    $(`#cont${id}`).append(`
        <div class="tee-select">
            <select name="tee-types" id="tee-types">
                <option value="Select Tee Type">Select Tee Type</option>
                <option value="Pro">Pro</option>
                <option value="Champion">Champion</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
            </select>
        </div>
    `);

}