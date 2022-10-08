import {InsightError, ResultTooLargeError} from "../IInsightFacade";
import {handleWhere, isQueryValid, queryJsonCanBeParsed} from "./ValidateEBNF";
import {Datasets} from "../datasets/Datasets";
import {getQueryToDatasetKeyMapping} from "../datasets/HandleCoursesDataset";


let myDataset: Datasets = new Datasets();


let id = "courses";
let idFound = "";

let queryWhere: any = "";
let truthArr: string[] = [];
let columnsArr: string[] = [];

const keyTypeMap: Map<string, string> = new Map([
	["dept", "string"],
	["id", "string"],
	["avg", "number"],
	["instructor", "string"],
	["title", "string"],
	["pass", "number"],
	["fail", "number"],
	["audit", "number"],
	["uuid", "string"],
	["year", "number"]
]);

const keyMappings: Map<string, string> = new Map([
	["dept", "Subject"],
	["id", "id"],
	["avg", "Avg"],
	["instructor", "Professor"],
	["title", "Title"],
	["pass", "Pass"],
	["fail", "Fail"],
	["audit", "Audit"],
	["uuid", "Section"],
	["year", "Year"]
]);
const keyMappingsRoom: any[] = ["fullname", "shortname","number","name","address","lat","lon",
	"seats","type","furniture","href"];

export enum Comp {
	AND = "AND",
	OR = "OR",
	LT = "LT",
	GT = "GT",
	EQ = "EQ",
	IS = "IS",
	NOT = "NOT"
}

function handleOptions(fileStr: any): boolean { // takes in JSON object
	idFound = "";

	// const whereSection = fileStr["WHERE"];

	let queryOption: any = fileStr["OPTIONS"];
	// console.log(queryOption);
	let keys: any[] = Object.keys(queryOption);
	// console.log(keys);
	if (keys.length > 0 && keys.includes("COLUMNS")){
		let columns: any[] = queryOption["COLUMNS"];
		// let strColumns: string = columns.toString();
		// let columnSplit: string[] = strColumns.split(",");
		let columnSplit: string[] = columns;
		// console.log("column split: " + columns);
		for (let i in columnSplit) {
			// columnsArr.push(columnSplit[i]);
			let colToStr = columnSplit[i].toString();
			// console.log("colsplit: " + queryOption.COLUMNS);
			if (colToStr.includes("_")) {
				let splitIDAndKey = columnSplit[i].split("_");
				if (!keyIsValid(splitIDAndKey[1])) {
					return false;
				}
				if(idFound === ""){
					// console.log(getID(columnSplit[i].toString()));
					getID(columnSplit[i].toString());
				}
				if (splitIDAndKey[0] === idFound) {
					if (keyMappings.has(splitIDAndKey[1]) || keyMappingsRoom.includes(splitIDAndKey[1])){
						// console.log("in here");
						// console.log("in here2: " + columnSplit[i]);
						columnsArr.push(columnSplit[i]);
					} else {
						return false;
					}
				} else {
					return false;
				}
			}else{
				checkForColumnInTransformations(fileStr, colToStr);
				// return false;
			}
		}
		if(keys.includes("ORDER")){
			return checkOrder(fileStr);
		}
		return true;
	} else {
		return false;
	}
}

// checks if key is one of the valid search keys in rooms / courses datasets
function keyIsValid( mykey: string): boolean{
	return getQueryToDatasetKeyMapping(mykey) !== undefined || keyMappingsRoom.includes(mykey) !== undefined;
}

function checkForColumnInTransformations(fileStr: any, applyKeyToSearchFor: string): any{
	// console.log(applyKeyToSearchFor);
	try{
		// console.log("in transformation checking");
		// console.log(fileStr.TRANSFORMATIONS.APPLY);
		let applyRuleArr: string[] = fileStr.TRANSFORMATIONS.APPLY;
		let applyKeysArr: string[] = [];
		let columnsKeyArr: string[] = fileStr.OPTIONS.COLUMNS;
		let groupKeyArr: string[] = fileStr.TRANSFORMATIONS.GROUP;
		let groupTruthArr: any[] = [];
		// console.log(columnsKeyArr);
		for(let rule of applyRuleArr){
			let applyKey: string = Object.keys(rule)[0];
			// console.log("applykey:" + applyKey);
			applyKeysArr.push(applyKey);
		}
		if(applyKeysArr.includes(applyKeyToSearchFor) === true){
			for(let rule of groupKeyArr){
				groupTruthArr.push(columnsKeyArr.includes(rule));
			}
			if(groupTruthArr.includes(false)){
				// console.log("transFalse1");
				return false;
			}else {
				// console.log("madeitout");
			}
		}else{
			// console.log("transFalse3");
			return false;
		}
	}catch (e){
		// console.log("in false");
		return false;
	}
}

function checkOrder(jsonStr: any): boolean {
	try {
		let queryOption: any = jsonStr["OPTIONS"];
		let order = queryOption["ORDER"];
		let type = typeof order;
		if (type === "string") {
			if (order.length > 0 && columnsArr.includes(order)) {
				return true;
			} else {
				// console.log("object not contained in columns");
				return false;
			}
		} else if (type === "object"){
			let orderKeys = queryOption["ORDER"].keys;
			let noUnderscoreArr = [];
			for (let key of orderKeys){
				if(!key.includes("_")){
					noUnderscoreArr.push(key);
				}
			}
			if (Object.keys(order).includes("dir") && Object.keys(order).includes("keys")){
				if(order["dir"].includes("UP") || order["dir"].includes("DOWN")){
					// console.log(queryOption["ORDER"].keys);
					if (noUnderscoreArr.length > 0 && jsonStr.TRANSFORMATIONS === undefined){
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			// console.log("object is more ethan one object");
			return false;
		}
	} catch (e) {
		// console.log(e);
		return false;
	}
}

function getID(str: any): any {
	try {
		const strID = str.split("_");
		const idFinding = strID[0].replace(":\"", "");
		idFound = idFinding;
		if (myDataset.getListOfAddedDatasetsIds().includes(idFound)) { // idFound === courses
			return idFound;
		}
	} catch (e) {
		// console.log("ID not found in COLUMNS");
		return e;
	}
}

function getDatasetID(): string {
	return idFound;
}


function checkWholeQuery(json: any, datasetInstance: Datasets): any {
	// queryJsonCanBeParsed(json);
	myDataset = datasetInstance;
	// console.log(myDataset);
	if (queryJsonCanBeParsed(json) === true && isQueryValid(json) === true && handleOptions(json) === true){
		return handleWhere(json,myDataset);
	} else {
		throw new InsightError("checkWholeQuery error");
	}
}
export {handleOptions,checkWholeQuery, getDatasetID, idFound, getID};
