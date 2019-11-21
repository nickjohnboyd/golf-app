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

    $(".content").html("");
    $(".content").append(`
        <div class="scorecard">
            <div class="row-titles">
                <div class="row-title col-item">HOLE</div>
                <div class="row-title col-item tee-title">${teeType}</div>
                <div class="row-title col-item">Handicap</div>
                <div class="players"></div>
                <div class="row-title col-item">Par</div>
            </div>
        </div>
    `); 

    replaceHeaderName(id);

    buildCol(id, numPlayers);

    buildPlayers(numPlayers);

}



function buildCol(id, numPlayers) {
    getCourse(id).then(() => {
        console.log(selectedCourse);

        for(let i = 0; i < selectedCourse.data.holes.length; i++) {
            if(i == 9) {
                $(".scorecard").append(`
                    <div class="column out-col">
                        <div class="out-title col-item">OUT</div>
                    </div>
                `);
                buildMidColItems(selectedCourse);
            }

            $(".scorecard").append(`
                <div class="column" id="col${i}">
                    <div class="hole-num col-item">${i}</div> 
                </div
            `)
            buildColItems(selectedCourse, i, numPlayers);
        }

        $(".scorecard").append(`
            <div class="column in-col">
                <div class="in-title col-item">IN</div>
            </div>       
        `);
        buildEndColItems(selectedCourse);
    })
}

function buildColItems(selectedCourse, colNum, numPlayers) {
    let theHole = selectedCourse.data.holes[colNum].teeBoxes[0];

    $(`#col${colNum}`).append(`
        <div class="tee-yards col-item">${theHole.yards}</div>
        <div class="hcp col-item">${theHole.hcp}</div>
        <div class="score-input"></div>
        <div class="hcp col-item">${theHole.par}</div>
    `);

    for(let i = 0; i < numPlayers; i++) {
        $(`#col${colNum}`).find(".score-input").append(`
            <div class="score col-item">box</div>
        `)
    }
}

function buildMidColItems(selectedCourse) {
    let totalOutYards = 0;
    for(let i = 0; i < 8; i++) {
        let theHole = selectedCourse.data.holes[i].teeBoxes[0];
        totalOutYards += theHole.yards;
    }

    $(".out-col").append(`
        <div class="col-item">${totalOutYards}</div>
        <div class="col-item"></div>
        <div class="out-total col-item">out</div>
        <div class="col-item">36</div>
    `);

}



function buildPlayers(numPlayers) {
    for(let i = 0; i < numPlayers; i++) {
        $(".players").append(`
            <div class="player" id="player${i}">
                <input class="name-input col-item" type="text" onkeyup="addPlayerName(event, this.value, ${i})">
            </div>
        `)
    }
}

function addPlayerName(event, name, i) {
    switch(event.which) {
        case 13:
            if(name == ""){
                break;
            }
            $(`#player${i}`).html("");
            $(`#player${i}`).append(`
                <div class="row-title col-item">${name}</div>
            `);
            $(`#player${i + 1}`).find(".name-input").focus();            
            break;
    }
}

function replaceHeaderName(id) {
    getCourse(id).then(() => {
        $(".head-title").text(selectedCourse.data.name);
    })
}