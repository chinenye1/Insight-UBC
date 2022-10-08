// import {searchForDept,searchForCourse} from "../../src/rest/HandleUserInput";
function createCoursesQuery(dept, id) {
	window.coursesQuery = {
		"WHERE": {
			"AND": [{
				"IS": {
					"courses_dept": dept
				}},
				{
					"IS": {
						"courses_id": id
					}
				}]
		},
		"OPTIONS": {
			"COLUMNS": [
				"courses_dept",
				"overallAvg",
				"overallFail"
			],
			"ORDER": {
				"dir": "UP",
				"keys": [
					"overallAvg"
				]
			}
		},
		"TRANSFORMATIONS": {
			"GROUP": [
				"courses_dept"
			],
			"APPLY": [
				{
					"overallAvg": {
						"AVG": "courses_avg"
					}
				},
				{
					"overallFail": {
						"SUM": "courses_fail"
					}
				}
			]
		}
	};
}
function createDeptQuery(dept) {
	window.deptQuery = {
		"WHERE": {
			"IS": {
				"courses_dept": dept
			}
		},
		"OPTIONS": {
			"COLUMNS": [
				"courses_dept",
				"overallAvg",
				"overallFail"
			],
			"ORDER": {
				"dir": "UP",
				"keys": [
					"overallAvg"
				]
			}
		},
		"TRANSFORMATIONS": {
			"GROUP": [
				"courses_dept"
			],
			"APPLY": [
				{
					"overallAvg": {
						"AVG": "courses_avg"
					}
				},
				{
					"overallFail": {
						"SUM": "courses_fail"
					}
				}
			]
		}
	};
}

let button = document.getElementById("search-button");
button.addEventListener("click", handleClickMe);
let textArea = document.getElementById("search-area");

// credit for how to check if key pressed is 'Enter'
// https://www.techiedelight.com/detect-enter-key-press-javascript/#:~:text=Using%20JavaScript,an%20Enter%20key%20is%20pressed
textArea.addEventListener("keydown", (e) => {
	if (e.code === 'Return' || e.key === 'Enter') {
		// alert("Enter was pressed");
		handleTextArea();
	}
});

function handleClickMe() {
	// alert("Button Clicked!");
	handleTextArea();
}

// send user input to
function handleTextArea() {
	try {
		let userInput = document.querySelector("input").value;
		if (userInput.length > 4) {
			// alert("Enter was pressed");
			return searchForCourse(userInput.toLowerCase());
		} else {
			// alert("Enter was pressed");
			return searchForDept(userInput.toLowerCase());
		}
	} catch (err){
		alert("Invalid Input. Please read the search specifications below and try again!");
	}
}

function searchForDept(dept) {
	// alert("searching for dept " + dept);
	let input = "http://localhost:4321/query";
	createDeptQuery(dept);
	// let previousDivText = "Results found: ";
	// let queryAsStr = JSON.stringify(window.deptQuery);
	// document.getElementById("display-results").innerText = previousDivText + " \n\n"
	// 	+ queryAsStr;
	return handleFetch(input, window.deptQuery).then(r => {
		// alert("handle fetch is done");
	});
}

function searchForCourse(course) {
	// alert("searching for course " + course);
	let input = "http://localhost:4321/query";
	let indexOfUnderscore = course.indexOf(" ");
	let dept = course.substring(0,indexOfUnderscore);
	let id = course.substring(indexOfUnderscore + 1, course.length);
	createCoursesQuery(dept,id);
	// let previousDivText = "Results found: ";
	// let queryAsStr = JSON.stringify(window.coursesQuery);
	// document.getElementById("display-results").innerText = previousDivText + " \n\n"
	// 	+ queryAsStr;
	return handleFetch(input, window.coursesQuery).then(r => {
		// alert("handle fetch is done");
	});
}

// function was inspired by:
// https://developers.google.com/web/updates/2015/03/introduction-to-fetch
async function handleFetch(input, query) {

	// console.log("entered handle fetch")
		const rawResponse = await fetch(input, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(function (response) {
				if (response.status !== 200) {
					// alert('Looks like there was a problem. Status Code: ' +
					// 	response.status);
					alert("Invalid Input. Please read the search specifications below and try again!");
					document.getElementById("display-results").innerText = "No Search Results Found.";
					return response;
				}

				return response.json();
			})
			.then(function (result) {
				// Examine the text in the response
				// let myData = JSON.stringify(result);
				// console.log("result is:" + JSON.stringify(result));
				// alert("Results are: " + JSON.stringify(result));
				if(result.result.length === 0){
					alert("invalid input");
				}
				displayJSONData(result);

				Promise.resolve((result));
			})
			.catch(function (err) {
				console.log('Fetch Error :-S ' + err);
			});
// constructTable(rawResponse.result, document.querySelector("table"));
// 	displayJSONData(rawResponse.result);

}

function displayJSONData(data){
	let dataToDisplay = data.result;
	let keys = Object.keys(dataToDisplay[0]);
	let headers = getHeaders(keys);
	let underline = "_______________________________\n\n";
	let stringToDisplay = printHeaders(headers) + underline;
	for(let result of dataToDisplay){
		let values = Object.values(result);
		stringToDisplay += handleRows(keys,values);
		document.getElementById("display-results").innerText = stringToDisplay;
	}
}

function getHeaders(headers){
	let newHeaders = [];
	for(let header of headers){
		let newItem = header;
		if(header.includes("_")){
			let indexOfUnderscore = header.indexOf("_");
			newItem = header.substring(indexOfUnderscore + 1, header.length);
 		}
		// credit for how to capitalize first letter: https://stackoverflow.com/a/1026087
		newItem = newItem.charAt(0).toUpperCase() + newItem.slice(1);
		newHeaders.push(newItem);
	}
	return newHeaders;
}

function handleRows(keys, values){
	let stringOfRows = "";
	for (let i in values){
		let item = values[i].toString();
		stringOfRows += item + "\t | \t";
	}
	stringOfRows += "\n";
	return stringOfRows;
}

function printHeaders(keys){
	let stringOfHeaders = "";
	for(let header of keys){
		stringOfHeaders += header + "\t | \t";
	}
	stringOfHeaders += "\n";
	return stringOfHeaders;
}


// Todo: check if text match dept or course and if not send alert with error message.
