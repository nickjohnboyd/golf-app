let myCourses;
let selectedCourse;

init();

function init() {
    getApi().then(() => {
        buildCourses();
        buildCourseOptions();
    })
}

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
                <div class="course" id="course${theCourse.id}" onclick="showCourseOptions(${theCourse.id})">
                    <div class="course-name">${theCourse.name}</div>
                    <img src="${theCourse.image}" class="course-image">
                </div>
                <div class="course-options">
                    <div class="empty-select-alert">
                        <div class="alert alert-danger" role="alert">
                            <div>All fields must be filled</div>
                            <div>out before submitting</div>
                        </div>                    
                    </div>
                    <select name="tee-types" class="form-control tee-type-select">
                        <option value="empty">Tee Type:</option>
                    </select>
                    <select name="num-players" class="form-control num-players-select">
                        <option value="empty">Number of Players:</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <button class="btn btn-dark build-card-btn" onclick="buildScorecard(${theCourse.id})">Build Scorecard</button>
                </div>               
            </div>
        `);
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

function buildCourseOptions() {
    for(let i = 0; i < myCourses.courses.length; i++) {
        let theCourse = myCourses.courses[i];
        getCourse(`${theCourse.id}`).then(() => {
            for(let j = 0; j < selectedCourse.data.holes[0].teeBoxes.length; j++) {
                if(j == 4) {
                    return;
                }
                let theTee = selectedCourse.data.holes[0].teeBoxes[j];
                $(`#${theCourse.id}`).find(".tee-type-select").append(`
                    <option value="${theTee.teeType}">${theTee.teeType}</option>
                `);            
            }
        })  
    }      
}

function showCourseOptions(id) {
    $(`#${id}`).find(".course-options").slideToggle();
}

function buildScorecard(id) {
    let teeType = $(`#${id}`).find(".tee-type-select").val();
    let numPlayers = $(`#${id}`).find(".num-players-select").val();
    if(teeType == "empty" || numPlayers == "empty"){
        console.log("empty alert");
        $(`#${id}`).find(".empty-select-alert").slideDown();
        return;
    }
    console.log(teeType);
    console.log(numPlayers);

    $(".content").html("");
    $(".content").append(`
        <div class="scorecard">
            <div class="row-titles">
                <div class="hole-title">Hole</div>
                <div class="tee-type-yards">
                    <div class="tee-title">${teeType}</div>
                </div>
                <div class="handicap">
                    <div class="hcp-title">Handicap</div>
                </div>
                <div class="players"></div>
                <div class="par">
                    <div class="par-title">Par</div>
                </div>                
            </div>
        </div>
    `);   

    getCourse(id).then(() => {
        console.log(selectedCourse);
        for(let i = 0; i < selectedCourse.data.holes.length; i++) {
            if(i == 9) {

            }
            for(let j = 0; j < numPlayers.length; j++) {
                
            }
        }
    })
}