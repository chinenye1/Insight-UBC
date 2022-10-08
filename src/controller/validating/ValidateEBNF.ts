import {InsightError, ResultTooLargeError} from "../IInsightFacade";
import {Datasets} from "../datasets/Datasets";
import {idFound} from "./ValidateEBNF2";

const persistDir = "./data";

let id = "courses";

let queryWhere: any = "";
let truthArr: string[] = [];
let columnsArr: string[] = [];
let myDataset: Datasets;


const keyTypeMap: Map<string, string> = new Map([
	["dept", "string"], ["id", "string"], ["avg", "number"], ["instructor", "string"],
	["title", "string"], ["pass", "number"], ["fail", "number"],
	["audit", "number"], ["uuid", "string"], ["year", "number"],
	["fullname", "string"], ["shortname", "string"], ["number", "string"],
	["name", "string"], ["address", "string"], ["lat", "number"],
	["lot", "number"], ["seats", "number"], ["type", "string"],
	["furniture", "string"], ["href", "string"]
]);

const keyMappings: Map<string, string> = new Map([
	["dept", ""],
	["id", "id"],
	["avg", "Avg"],
	["instructor", "Professor"],
	["title", "Title"],
	["pass", "Pass"],
	["fail", "Fail"],
	["audit", "Audit"],
	["uuid", "Section"],
	["year", "Year"],
]);

export enum Comp {
	AND = "AND",
	OR = "OR",
	LT = "LT",
	GT = "GT",
	EQ = "EQ",
	IS = "IS",
	NOT = "NOT"
}

const keyMappingsRoom: any[] = ["fullname", "shortname","number","name","address","lat","lon",
	"seats","type","furniture","href"];

const keyTypeMapRoom: Map<string, string> = new Map([
	["fullname", "string"],
	["shortname", "string"],
	["number", "string"],
	["name", "string"],
	["address", "string"],
	["lat", "number"],
	["lot", "number"],
	["seats", "number"],
	["type", "string"],
	["furniture", "string"],
	["href", "string"],
]);


// helper function to help me JSON.parse() each file's string and skips invalid JSON's
function queryJsonCanBeParsed(fileStr: JSON): boolean {
	try {
		// console.log(JSON.parse(fileStr));
		const jsonStr = JSON.stringify(fileStr);
		JSON.parse(jsonStr);
		return true;
	} catch (err) {
		// console.log("this file will be skipped because not json");
		return false;
	}
}

function isQueryValid(fileStr: JSON): boolean {
	const json = fileStr;
	const keys = Object.keys(json);
	// console.log(keys);
	if(keys[0] === "WHERE" && keys[1] === "OPTIONS") {
		return true;
		// } else if (keys[2] !== "TRANSFORMATIONS"){
		// 	if(applyKeyPresentInOrder(json["OPTIONS"].ORDER.keys)){
		//
		// 	}
		// }
	} else {
		// console.log("isQueryValid error");
		return false;
	}
}

function handleWhere(fileStr: any, datasetInstance: Datasets): any {
	try {
		myDataset = datasetInstance;
		// if (Object.values(fileStr["WHERE"]).length === 0){
		// 	console.log(numRowsInEachDataset.get(idFound.toString()))
		// 	if((numRowsInEachDataset?): numRowsInEachDataset.get(idFound.toString()) > 5000) {
		// 		throw new ResultTooLargeError("WHERE is empty and greater than 5000");
		// 	}
		// }
		if(Object.values(fileStr["WHERE"]).length === 0 || Object.values(fileStr["WHERE"]).length === 1) { // added the case if WHERE is length 0
			queryWhere = fileStr["WHERE"];
			let keys: any[] = Object.keys(queryWhere);
			handleKeys(keys);
			// console.log(truthArr);
			if (truthArr.includes("false")) {
				// console.log("should throw error here");
				throw new InsightError("something is invalid in handleWhere helper functions");
			} else {
				// console.log("success");
				return true;
			}
		} else {
			throw new InsightError("WHERE issue");
		}
	} catch (e) {
		throw new InsightError("handleWhere general error");
	}
}
function handleKeys(keys: any[]): any {
	if(keys[0] === "OR") {
		let getOR = queryWhere["OR"];
		handleANDOR(getOR);
	}
	if(keys[0] === "AND") {
		let getAND = queryWhere["AND"];
		handleANDOR(getAND);
		// handleOR()
	}
	if(keys[0] === "GT") {
		let getGT = queryWhere["GT"];
		handleGT(getGT);
		// handleOR()
	}
	if(keys[0] === "LT") {
		let getLT = queryWhere["LT"];
		handleGT(getLT);
		// handleOR()
	}
	if(keys[0] === "EQ") {
		let getEQ = queryWhere["EQ"];
		handleGT(getEQ);
		// handleOR()
	}
	if(keys[0] === "IS") {
		let getIS = queryWhere["IS"];
		handleIS(getIS);
		// handleOR()
	}
	if(keys[0] === "NOT") {
		let getNOT = queryWhere["NOT"];
		handleNOT(getNOT);
		// handleOR()
	}

}

function  handleANDOR(sectionArr: any[]): any{
	try {
		if (sectionArr.length > 0 && sectionArr.length <= 2) {
			for (let i in sectionArr) {
				if(Object.keys(sectionArr[i]).length !== 0) {
					queryWhere = sectionArr[i];
					let keys = Object.keys(sectionArr[i]);
					truthArr.push("true");
					handleKeys(keys);
				} else {
					throw new InsightError("handleANDOR object in ANDOR is empty");
				}
			}
		} else {
			// truthArr.push("false");
			// console.log("OR should have 1-2 filters");
			throw new InsightError("handleANDOR error");
		}
	} catch (e) {
		// truthArr.push("false");
		// console.log("hanleANDOR error");
		throw new InsightError("handleANDOR error" + e);
		// throw new InsightError("OR invalid");
	}
}

function  handleNOT(sectionArr: any): any{
	try {
		if(Object.values(sectionArr).length !== 0) {
			queryWhere = sectionArr;
			let keys = Object.keys(sectionArr);
			truthArr.push("true");
			handleKeys(keys);
		} else{
			// truthArr.push("false");
			// console.log("handleNOT error");
			throw new InsightError("handleNOT error");
		}
	} catch (e) {
		// truthArr.push("false");
		// console.log("handleNOT error");
		throw new InsightError("handleNOT error");
		// throw new InsightError("NOT invalid");
	}
}

function  handleGT(sectionArr: string[]): any{
	try {
		if (Object.values(sectionArr).length !== 0){
			for (let i in sectionArr) {
				if (typeof sectionArr[i] !== "string") {
					let key = Object.keys(sectionArr);
					// console.log();
					if(checkKeys(key) === true) {
						const keyToStr = key.toString();
						const keySplit = keyToStr.split("_");
						if(keyTypeMap.get(keySplit[1]) !== "string"){
							truthArr.push("true");
						} else {
							// truthArr.push("false");
							// console.log("handleGT problem");
							throw new InsightError("handleGT error");
						}
					} else {
						// truthArr.push("false");
						// console.log("this key/leaf is invalid");
						throw new InsightError("handleGT error");
					}
				} else {
					// truthArr.push("false");
					// console.log("the type is incorrect for MComparater");
					throw new InsightError("handleGT error");
				}
			}
		} else {
			// console.log("handleGT problem");
			throw new InsightError("handleGT error");
		}
	} catch (e) {
		// console.log("handleGT problem");
		throw new InsightError("handleGT error");
	}
}

function  handleIS(sectionArr: string[]): any{
	try {
		if (Object.values(sectionArr).length !== 0){
			for (let i in sectionArr) {
				if (typeof sectionArr[i] === "string") {
					// console.log("in HandleIS rn");
					let key = Object.keys(sectionArr);
					let value = Object.values(sectionArr).toString();
					if(checkKeys(key) === true) {
						const keyToStr = key.toString();
						const keySplit = keyToStr.split("_");
						// console.log("keysplit type= " + keySplit[1]);
						if(keyTypeMap.get(keySplit[1]) === "string"){ // / fix this
							truthArr.push("true");
						} else {
							// console.log("number key type expected");
							throw new InsightError("handleIS error1");
						}
					} else {
						// console.log("this key/leaf is invalid");
						throw new InsightError("handleIS error2");
					}
				} else {
					// console.log("the type is incorrect for MComparater");
					throw new InsightError("handleIS error3");
				}
			}
		} else {
			// console.log("handleIS error");
			throw new InsightError("handleIS error");
		}
	} catch (e) {
		// console.log("handleIS error");
		throw new InsightError("handleIS error");
	}
}

function checkKeys(key: any): any {
	try {
		const keyToStr = key.toString();
		const keySplit = keyToStr.split("_");
		if ((keySplit[0] === idFound && keyMappings.has(keySplit[1])) || keyMappingsRoom.includes(keySplit[1])){
			truthArr.push("true");
			return true;
		} else {
			// console.log("checkKeys error");
			throw new InsightError("Key is invalid");
		}
	} catch (e) {
		// console.log("checkKeys error");
		throw new InsightError("Key is invalid");
	}
}

export {handleWhere, isQueryValid, queryJsonCanBeParsed};
