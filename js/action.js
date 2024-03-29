let myCourses;
let selectedCourse;
let count = 0;
let teeType;

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
                    <button class="btn btn-dark build-card-btn" onclick="buildInitialCard(${theCourse.id})">Build Scorecard</button>
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



// Scorecard Page
function buildInitialCard(id) {
    let numPlayers = $(`#${id}`).find(".num-players-select").val();

    buildScorecard(id, numPlayers)
}

function buildScorecard(id, numPlayers) {
    if(count == 0){
        teeType = $(`#${id}`).find(".tee-type-select").val();
    }
    count++;

    if(teeType == "empty" || numPlayers == "empty"){
        $(`#${id}`).find(".empty-select-alert").slideDown();
        return;
    }

    $(".content").html("");
    $(".content").append(`
        <div class="scorecard-header">
            <button class="add-player-btn btn btn-dark" onclick="addPlayer(${id}, ${numPlayers})">Add Player</button>
            <div class="end-message"></div>
        </div>
        <div class="card-cont">
            <div class="scorecard">
                <div class="row-titles">
                    <div class="row-title col-item">
                        <div class="col-item-text">HOLE</div>
                    </div>
                    <div class="row-title col-item tee-title ${teeType}">
                        <div class="col-item-text">${teeType}</div>
                    </div>
                    <div class="row-title col-item">
                        <div class="col-item-text">Handicap</div>                
                    </div>
                    <div class="players"></div>
                    <div class="row-title col-item par">
                        <div class="col-item-text">Par</div>                
                    </div>
                </div>
            </div>
        </div>
    `); 

    replaceHeaderName(id);

    buildCol(id, numPlayers, teeType);

    buildPlayers(numPlayers);

}



//Build Scorecard Functions
function buildCol(id, numPlayers, teeType) {
    getCourse(id).then(() => {

        for(let i = 0; i < selectedCourse.data.holes.length; i++) {
            if(i == 9) {
                $(".scorecard").append(`
                    <div class="column out-col">
                        <div class="out-title col-item">
                            <div class="col-item-text">OUT</div>
                        </div>
                    </div>
                `);
                $(".scorecard").append(`
                    <div class="column initials-col">
                        <div class="initials-title">
                            <div class="initials-text">I</div>
                            <div class="initials-text">N</div>
                            <div class="initials-text">I</div>
                            <div class="initials-text">T</div>
                            <div class="initials-text">I</div>
                            <div class="initials-text">A</div>
                            <div class="initials-text">L</div>
                            <div class="initials-text">S</div>
                        </div>
                        <div class="player-initials"></div>
                    </div>
                `);
                buildMidColItems(selectedCourse, numPlayers, teeType);
            }

            $(".scorecard").append(`
                <div class="column" id="col${i}">
                    <div class="hole-num col-item">
                        <div class="col-item-text">${i + 1}</div>
                    </div>
                </div
            `)
            buildColItems(selectedCourse, i, numPlayers, teeType);
        }

        $(".scorecard").append(`
            <div class="column in-col">
                <div class="in-title col-item">
                    <div class="col-item-text">IN</div>                  
                </div>
            </div>       
            <div class="column total-col">
                <div class="total-title col-item">
                    <div class="col-item-text">TOT</div>                  
                </div>
            </div>       
        `);
        buildEndColItems(selectedCourse, numPlayers, teeType);
    })
}

function buildColItems(selectedCourse, colNum, numPlayers, teeType) {
    let theHole = selectedCourse.data.holes[colNum].teeBoxes[0];

    $(`#col${colNum}`).append(`
        <div class="tee-yards col-item ${teeType}">
            <div class="col-item-text">${theHole.yards}</div>           
        </div>
        <div class="hcp col-item">
            <div class="col-item-text">${theHole.hcp}</div>        
        </div>
        <div class="score-input"></div>
        <div class="par col-item">
            <div class="col-item-text">${theHole.par}</div>     
        </div>
    `);

    for(let i = 0; i < numPlayers; i++) {
        $(`#col${colNum}`).find(".score-input").append(`
            <div class="score">
                <input type="text" class="score-input col-item score${i}" id="col${colNum}p${i}" onchange="addScore(this.value, ${colNum}, ${i})" placeholder="" maxlength="2">
            </div>
        `)
    }
}

function buildMidColItems(selectedCourse, numPlayers, teeType) {
    let totalOutYards = 0;
    for(let i = 0; i < 9; i++) {
        let theHole = selectedCourse.data.holes[i].teeBoxes[0];
        totalOutYards += theHole.yards;
    }

    $(".out-col").append(`
        <div class="col-item ${teeType}">
            <div class="col-item-text">${totalOutYards}</div>        
        </div>
        <div class="col-item"></div>
        <div class="out-total"></div>
        <div class="col-item par">
            <div class="col-item-text">36</div>                
        </div>
    `);

    for(let i = 0; i < numPlayers; i++) {
        $(".out-total").append(`
            <div class="col-item">
                <div class="col-item-text" id="p${i}OutScore">0</div>                
            </div>
        `);
        $(".player-initials").append(`
            <div class="initials-cont">
                <input type="text" class="initials-input" placeholder="GA" onkeyup="addPlayerInitials(event, this.value, ${i})">                
            </div>
        `);
    }
    $(".player-initials").append(`
            <div class="initials-empty par"></div>
    `);
}

function buildEndColItems(selectedCourse, numPlayers, teeType) {
    let totalInYards = 0;
    for(let i = 8; i < 18; i++) {
        let theHole = selectedCourse.data.holes[i].teeBoxes[0];
        totalInYards += theHole.yards;
    }

    $(".in-col").append(`
        <div class="col-item ${teeType}">
            <div class="col-item-text">${totalInYards}</div>        
        </div>
        <div class="col-item"></div>
        <div class="in-total"></div>
        <div class="col-item par">
            <div class="col-item-text">36</div>                
        </div>
    `);

    for(let i = 0; i < numPlayers; i++) {
        $(".in-total").append(`
            <div class="col-item">
                <div class="col-item-text" id="p${i}InScore">0</div>                
            </div>
        `);
    }


    let totalYards = 0;
    for(let i = 0; i < 18; i++) {
        let theHole = selectedCourse.data.holes[i].teeBoxes[0];
        totalYards += theHole.yards;
    }

    $(".total-col").append(`
        <div class="col-item ${teeType}">
            <div class="col-item-text">${totalYards}</div>        
        </div>
        <div class="col-item"></div>
        <div class="overall-total"></div>
        <div class="col-item par">
            <div class="col-item-text">72</div>                
        </div>
    `);

    for(let i = 0; i < numPlayers; i++) {
        $(".overall-total").append(`
            <div class="col-item">
                <div class="col-item-text" id="p${i}TotalScore">0</div>                
            </div>
        `);
    }
}



// Player Functions
function buildPlayers(numPlayers) {
    for(let i = 0; i < numPlayers; i++) {
        $(".players").append(`
            <div class="player" id="player${i}">
                <input class="name-input col-item" type="text" placeholder="Add Player Name" onchange="addPlayerName(this.value, ${i}, ${numPlayers})">
            </div>
        `)
    }
}

function addPlayerName(name, i, numPlayers) {
    if(i > 0) {
        let nameArray = [];
        for(let j = 0; j < numPlayers; j++){
            let theName = $(`#player${j}`).find(".player-name").text();
            nameArray.push(theName);
        }
        if(name == "" || nameArray.includes(name)) {
            $(`#player${i}`).find(".name-input").css("background-color", "#dc3545");
            return;
        }
    }
    
    $(`#player${i}`).html("");
    $(`#player${i}`).append(`
        <div class="row-title col-item">
            <div class="col-item-text player-name">${name}</div>           
        </div>
    `);
    $(`#player${i + 1}`).find(".name-input").focus();
}

function addPlayer(id, numPlayers) {
    numPlayers++;
    $(".players").append(`
        <div class="player" id="player${numPlayers}">
            <input class="name-input col-item" type="text" placeholder="Add Player Name" onchange="addPlayerName(this.value, ${numPlayers}, ${numPlayers})">
        </div>
    `);

    $(".content").html("");
    buildScorecard(id, numPlayers);
}



// Scoring Functions
function addScore(score, colNum, player) {
    if(score == "" || isNaN(Number(score))){
        score = 0;
    }
    $(`#col${colNum}p${player}`).val(score);
    setAllScores(player);
    $(`#col${colNum}`).find(`.score${player + 1}`).focus();
}

function setAllScores(player) {
    let outScore = 0;
    let inScore = 0;
    let totalScore = 0;
    for(let i = 0; i < 18; i++) {
        let theScore = $(`#col${i}p${player}`).val();
        theScore = Number(theScore);

        if(i < 9) {
            outScore += theScore;
        }
        else if(i >= 9) {
            inScore += theScore;
        }

        totalScore += theScore;

        $(`#p${player}OutScore`).text(outScore);
        $(`#p${player}InScore`).text(inScore);
        $(`#p${player}TotalScore`).text(totalScore);

    }

    if($(`#col${17}p${player}`).val() > 0) {
        let theName = $(`#player${player}`).find(".player-name").text();

        if(theName == ""){
            theName = "BLANK NAMED PERSON";
        }

        $(".end-message").html("");

        let courseScore = totalScore - 72;
        if(courseScore > 0){
            $(".end-message").append(`
                <div class="end-msg-text bad-msg">Ouch!  ${theName} got +${courseScore} overall!  Might need some more practice!</div>
            `)
        }
        else if(courseScore < 0){
            $(".end-message").append(`
                <div class="end-msg-text good-msg">Is that Tiger Woods I see?!  ${theName} got ${courseScore} overall!  We'll see ${theName} at the Masters!</div>
            `)            
        } 
        else {
            $(".end-message").append(`
                <div class="end-msg-text neutral-msg">Perfectly on par.  ${theName} got +${courseScore} overall.  Nothing to write home about.</div>
            `)
        }
    }
}



// Misc Functions
function replaceHeaderName(id) {
    getCourse(id).then(() => {
        $(".head-title").text(selectedCourse.data.name);
    })
}