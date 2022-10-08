import * as parse5 from "parse5";
import JSZip from "jszip";
import {InsightDatasetKind, InsightError} from "../IInsightFacade";
import {fail} from "assert";

const persistDir = "./data";

const datasetToQueryKeyMappings: Map<string, string> = new Map([
	["Subject", "dept"],
	["Course", "id"],
	["Avg", "avg"],
	["Professor", "instructor"],
	["Title", "title"],
	["Pass", "pass"],
	["Fail", "fail"],
	["Audit", "audit"],
	["Section", "uuid"],
	["Year", "year"]
]);

const queryToDatasetKeyMappings: Map<string, string> = new Map([
	["dept", "Subject"],
	["id", "Course"],
	["avg", "Avg"],
	["instructor", "Professor"],
	["title", "Title"],
	["pass", "Pass"],
	["fail", "Fail"],
	["audit", "Audit"],
	["uuid", "Section"],
	["year", "Year"]
]);

const validCoursesKeys: string[] = ["Subject", "id", "Avg", "Professor", "Title", "Pass", "Fail", "Audit", "Section",
	"Year"];

const validRoomsKeys: string[] = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type",
	"furniture", "href"];
const validSections: string[] = [];
const commaRemovedArray: string[] = [];
const numRowsInEachDataset: Map<string, number> = new Map<string, number>(); // Map([["", 0]]);

// key mapping function
function getQueryToDatasetKeyMapping(key: string): any {
	let result = queryToDatasetKeyMappings.get(key);
	return result;
}

function getDatasetToQueryKeyMapping(key: string): any {
	let result = datasetToQueryKeyMappings.get(key);
	return result;
}


function checkDatasetHasRootNodeDir(relativePath: string, zipObject: JSZip, kind: InsightDatasetKind) {
	// console.log(relativePath); // courses/CPSC123
	// console.log(relativePath.split("/")); // ['courses','CPSC123']
	if (kind === InsightDatasetKind.Courses) {
		if (relativePath.split("/")[0] !== "courses") { // split the string with / and take first item in array
			// console.log("courses directory not found");
			throw new InsightError("courses Dir not found");
		}
	} else {
		if (relativePath.split("/")[0] !== "rooms") { // split the string with / and take first item in array
			// console.log("rooms directory not found");
			throw new InsightError("rooms Dir not found");
		}
	}
}

// https://stackoverflow.com/questions/65281900/how-to-read-specific-value-from-json-in-an-archived-file-using-javascript-and
// the above link helped me understand how JSON.parse works and how it takes the output of filename.async('string') (which is just string)
function checkContentIsValidJSON(id: string, content: string): Promise<string[]> {
	let arrSections: string[] = [];
	validSections.length = 0;
	let promiseArray: any[] = [];
	return new Promise(function (resolve, reject) {
		let jsonObjectOfValidSections: any = "";
		let zip = new JSZip();
		return zip.loadAsync(content, {base64: true})
			// TODO: IT DOESN'T SEEM TO GET PAST LINE 82. why?
			.then(function (thisZip) {
				thisZip.forEach(function (relativePath, fileContent) {
					checkDatasetHasRootNodeDir(relativePath, zip, InsightDatasetKind.Courses);
					promiseArray.push(fileContent.async("string"));
				});
				Promise.all(promiseArray).then((fileDatas: string[]) => {
					for (let file of fileDatas) {
						if (jsonCanBeParsed(file)) {
							// console.log((fileData)); // if jsonParser(fileData) succeeds
							let parseableContentSplit = splitParsableContent(file);  // parseable content split by closing curly bracket
							arrSections = checkAllKeysExist(id, parseableContentSplit, InsightDatasetKind.Courses);
						}
					}
					// console.log("arrSec.length before resolve is: " + arrSections.length);
					jsonObjectOfValidSections = "{\"result\":[" + arrSections.toString() + "],\"rank\":0}";
					return resolve([jsonObjectOfValidSections, ("" + arrSections.length)]); // Valid Json files parsed, Invalid Json files skipped;
				});
			}).catch(function (err) {
				// console.log("this is not a valid JSON" + err);
				reject(new InsightError("this is not a valid JSON " + err));
			});
	});
}


// helper function to help me JSON.parse() each file's string and skips invalid JSON's
function jsonCanBeParsed(fileStr: string): boolean {
	try {
		// console.log(JSON.parse(fileStr));
		JSON.parse(fileStr);
		return true;
	} catch (err) {
		return false;
	}
}

// stackoverflow.com/questions/4416425/how-to-split-string-with-some-separator-but-without-removing-that-separator-in-j
// the above function helped with /(?<=})/ to help include the closing bracket
function splitParsableContent(parsable: string): string[] {
	commaRemovedArray.length = 0;
	let frontRemoved = parsable.replace("{\"result\":[", "");
	let splitStr = frontRemoved.split(/(?<=})/);
	for (let el of splitStr) {
		if (el.charAt(0) === ",") {
			let element = el.slice(1);
			commaRemovedArray.push(element);
		} else {
			commaRemovedArray.push(el);
		}
	}
	return commaRemovedArray;
}

// makes sure that each valid section selected contains all the queriable keys for Rooms and Courses
function checkAllKeysExist(id: string, splitContent: string[], kind: InsightDatasetKind): string[] {
	let keys: string[] = [];
	if (kind === InsightDatasetKind.Courses) {
		keys = validCoursesKeys;
	} else {
		keys = validRoomsKeys;
	}
	for (let el of splitContent) {
		let truthFlag: boolean = true;
		for (let key of keys) {
			if (!el.includes(key)) {
				truthFlag = false;
			}
		}
		if (truthFlag) {
			validSections.push(el);
		}
	}
	return validSections;
}

function makeHTMLJSONStr(): string{
	return "";
}


export {
	checkContentIsValidJSON,
	getQueryToDatasetKeyMapping, getDatasetToQueryKeyMapping, splitParsableContent
};
