import {handleAVG, handleCount, handleMax, handleMin, handleSum} from "./ApplyToken";
import {InsightResult} from "../IInsightFacade";

enum TransformationTokens {
	MAX = "MAX",
	MIN = "MIN",
	AVG = "AVG",
	COUNT = "COUNT",
	SUM = "SUM"
}

// credit: TAs helped me design this function from useful hints about maps and the type of key to use
function makeGroup(resultsToGroup: InsightResult[], keysToGroupBy: string[]): Map<string, InsightResult[]> {
	let sectionsToProcess: InsightResult[] = resultsToGroup;
	let groupsMade: Map<string, InsightResult[]> = new Map<string, InsightResult[]>();
	// stringify the column values in each section. use the concatenated str as the key in the map
	let valuesOfKeysToGroupByAsStr: string = getValuesFromSection(sectionsToProcess[0], keysToGroupBy);
	groupsMade.set(valuesOfKeysToGroupByAsStr, []);
	for (let section of sectionsToProcess) {
		// let valuesOfKeysToGroupByAsStr: string = getValuesFromSection(section, keysToGroupBy);
		valuesOfKeysToGroupByAsStr = getValuesFromSection(section, keysToGroupBy);
		let keyOfSameGroup: string = checkIfKeyInMap(groupsMade, section, valuesOfKeysToGroupByAsStr);
		let group = groupsMade.get(keyOfSameGroup);
		if (group !== undefined) {
			let newValueForKey = group.concat([section]);
			groupsMade.set(keyOfSameGroup, newValueForKey);
		} else {
			let newGroupKey: string = valuesOfKeysToGroupByAsStr;
			groupsMade.set(newGroupKey, [section]);
		}
	}
	return groupsMade;
}

function getValuesFromSection(section: InsightResult, keysToGroupBy: any): string {
	let strResult = "";
	for (let key of keysToGroupBy) {
		strResult = strResult + (section[key].toString());
	}
	return strResult;
}

function checkIfKeyInMap(myMap: Map<string, InsightResult[]>, section: InsightResult, strToCheck: string): string {
	if (myMap.has(strToCheck)) {
		return strToCheck;
	}
	return "";
}


// function makeGroup(resultsToGroup: InsightResult[], keysToGroupBy: string[]): Map<number, InsightResult[]> {
// 	let sectionsToProcess: InsightResult[] = resultsToGroup;
// 	let groupsMade: Map<number, InsightResult[]> = new Map<number, InsightResult[]>();
//
// 	// stringify the column values in each section. use the concatenated str as the key in the map
// 	groupsMade.set(0,[]);
// 	let newGroupKey: number = 0;
// 	for (let section of sectionsToProcess) {
// 		let keyOfSameGroup: number = checkIfKeyInMap(groupsMade,section,keysToGroupBy);
//
// 		if (keyOfSameGroup > -1) {
// 			let group = groupsMade.get(keyOfSameGroup);
// 			if(group !== undefined){
// 				let newValueForKey = group.concat([section]);
// 				groupsMade.set(keyOfSameGroup, newValueForKey);
// 			}
// 		} else {
// 			groupsMade.set(newGroupKey, [section]);
// 			newGroupKey++;
// 		}
// 	}
// 	return groupsMade;
// }
//
// function checkIfKeyInMap(myMap: Map<number, InsightResult[]>, section: InsightResult,
// 	keysToGroupBy: string[]): number{
// 	let sameGroup = false;
// 	for(let [key,value] of myMap.entries()){
// 		if(isSameGroup(value[0],section,keysToGroupBy)){
// 			sameGroup = true;
// 			return key;
// 		} else {
// 			sameGroup = false;
// 		}
// 		// if(sameGroup){
// 		// 	return key;
// 		// }
// 	}
// 	return -1;
// }

function isSameGroup(groupA: InsightResult, groupB: InsightResult, keysToGroupBy: string[]): boolean {
	let result = true;
	if (groupA === undefined || groupB === undefined) {
		return false;
	}
	for (let key of keysToGroupBy) {
		let groupAValue: string | number = groupA[key];
		let groupBValue: string | number = groupB[key];
		if (groupAValue === groupBValue) {
			result &&= true;
		} else {
			result &&= false;
		}
	}
	return result;
}

function applyTransformationOnEachGroup(groups: Map<string|number, InsightResult[]>, transformationsInQuery: string,
	keysToGroupBy: string[]):
	InsightResult[] {
	let transformationsToApply: any[][] = [];
	let transformation: any = Object.values(JSON.parse(transformationsInQuery));
	for (let transformationObject of transformation) {
		let keyForOverall: string = Object.keys(transformationObject)[0];
		let applyTokenQueryKeyPair: any = Object.values(transformationObject)[0];
		let applyToken: string = Object.keys(applyTokenQueryKeyPair)[0];
		let queryKey: any = Object.values(applyTokenQueryKeyPair)[0];
		transformationsToApply.push([applyToken, queryKey, keyForOverall]);
	}

	// let mySet:  Set<InsightResult> = new Set<InsightResult>();
	let results: InsightResult[] = [];
	let myInsightResult: InsightResult = {};
	// credit for iterating through map: https://stackoverflow.com/a/50232058
	for (let [key, value] of groups.entries()) {
		// if(JSON.stringify(myInsightResult) === "{}") {
		myInsightResult = getInsightResultForGroups(value, keysToGroupBy);
		// }
		for (let aTransformation of transformationsToApply) {
			myInsightResult = (applyTransformation(value, aTransformation[0], aTransformation[1], aTransformation[2],
				keysToGroupBy, myInsightResult));
		}
		// mySet.add(myInsightResult);
		results.push(myInsightResult);
	}
	// return Array.from(mySet);
	return results;
}

function applyTransformation(group: InsightResult[], applyToken: string, queryKey: any, keyForOverall: string,
	keysToGroupBy: string[], tempResult: InsightResult):
	InsightResult {
	let result: number = 0;
	let insightResult: InsightResult = tempResult;
	switch (applyToken) {
		case TransformationTokens.AVG:
			// insightResult["overallAvg"] = handleAVG(group, queryKey);
			// result = handleAVG(group, queryKey);
			insightResult[keyForOverall] = handleAVG(group, queryKey);
			// console.log("AVG: " + result);
			break;
		case TransformationTokens.MAX:
			// insightResult["overallMax"] = handleMax(group, queryKey);
			insightResult[keyForOverall] = handleMax(group, queryKey);
			break;
		case TransformationTokens.MIN:
			// insightResult["overallMin"] = handleMin(group, queryKey);
			insightResult[keyForOverall] = handleMin(group, queryKey);
			break;
		case TransformationTokens.SUM:
			// insightResult["overallSum"] = handleSum(group, queryKey);
			insightResult[keyForOverall] = handleSum(group, queryKey);
			break;
		case TransformationTokens.COUNT:
			// insightResult["overallCount"] = handleCount(group, queryKey);
			insightResult[keyForOverall] = handleCount(group, queryKey);
			break;
	}
	return insightResult;
}

function getInsightResultForGroups(group: any[], keysToGroupBy: string[]): InsightResult {
	let insightResult: InsightResult = {};
	let sectionInGroup: any = group[0];
	for (let key of keysToGroupBy) {
		insightResult[key] = sectionInGroup[key];
	}
	return insightResult;
}


export {applyTransformationOnEachGroup, makeGroup, isSameGroup};

