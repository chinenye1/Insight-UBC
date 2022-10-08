// TODO:

/**
 * @author: CO
 * @description: this file contains all functions required to compute
 * and return the queried results
 */

import {getDatasetToQueryKeyMapping} from "../datasets/HandleCoursesDataset";
import {InsightResult} from "../IInsightFacade";
import {Datasets} from "../datasets/Datasets";
import {QueryComparator, QueryComparatorsEnum} from "../queryComparators/QueryComparator";
import {ISComparator} from "../queryComparators/ISComparator";
import {NOTComparator} from "../queryComparators/NOTComparator";
import {EQComparator} from "../queryComparators/EQComparator";
import {GTComparator} from "../queryComparators/GTComparator";
import {LTComparator} from "../queryComparators/LTComparator";
import {ANDComparator} from "../queryComparators/ANDComparator";
import {ORComparator} from "../queryComparators/ORComparator";
import {applyTransformationOnEachGroup, makeGroup, isSameGroup} from "./Transformations";
import {handleOrderingMultipleColumns, handleSimpleOrder} from "./SortingDataset";
import {EmptyWHEREComparator} from "../queryComparators/EmptyWHEREComparator";

const queryResultsArray: any[] = [];
const datasets: Datasets = new Datasets();
const datasetId: string = "";
const overallTypeKeys: string[] = [];

/**
 * @author: CO
 * @param input: raw query as given by user; to be handled and results returned
 * @return: final query results
 */
function handleQuery(id: string, datasetKind: string, query: any, instanceOfDatasets: Datasets,
	datasetOfFirstChild?: any[]):
	InsightResult[] {
	let obj = JSON.parse(query);
	// console.log("obj: " + obj);
	// console.log("obj.WHERE: " + JSON.stringify(obj.WHERE));
	// console.log("obj.OPTIONS: " + JSON.stringify(obj.OPTIONS));
	let arrToBeFiltered = [];
	let finalResults: InsightResult[] = [];
	arrToBeFiltered = handleBody(obj.WHERE, instanceOfDatasets, id, datasetOfFirstChild);
	// console.log("arrToBeFiltered: " + JSON.stringify(arrToBeFiltered));
	let arrToBeFilteredAsInsightResultsArr = createInsightResultsArray(id, datasetKind, arrToBeFiltered);
	// console.log("arrToBeFilteredAsInsightResultsArr: " + JSON.stringify(arrToBeFilteredAsInsightResultsArr));
	if(obj.TRANSFORMATIONS){
		let keysToGroupBy = (obj.TRANSFORMATIONS).GROUP;
		let groups = makeGroup(arrToBeFilteredAsInsightResultsArr, keysToGroupBy);
		let transformationsInQuery: string = JSON.stringify(obj.TRANSFORMATIONS.APPLY) ;
		// console.log("transformationsInQuery: " + transformationsInQuery);
		finalResults = applyTransformationOnEachGroup(groups, transformationsInQuery, keysToGroupBy);
		finalResults = handleOptions(obj.OPTIONS, finalResults, true);
		finalResults = handleOrderingMultipleColumns((obj.OPTIONS).ORDER, finalResults);
	} else {
		if(datasetKind === "rooms") {
			arrToBeFilteredAsInsightResultsArr = removeDuplicatesInArray(arrToBeFilteredAsInsightResultsArr);
		}
		let filteredResults = handleOptions(obj.OPTIONS, arrToBeFilteredAsInsightResultsArr, false);
		finalResults = filteredResults;
	}
	return finalResults;
}

function removeDuplicatesInArray(input: any[]): any[] {
	let result: any[] = input;
	// get the keys from any one of the sections in the array
	let keysToGroupBy: any[] = Object.keys(input[0]);
	for (let i = 0; i < input.length - 1; i++) {
		for (let j = i + 1; j < input.length; j++) {
			if (isSameGroup(result[i], result[j], keysToGroupBy)) {
				result.splice(j,1);
			}
		}
	}
	return result;
}


/**
 * @author: CO
 * @param id: id of the dataset
 * @param arrToBeConverted: array to be made to an insightDataset[]
 * @return: the insightDataset[] created from the arrToBeConverted given.
 */
function createInsightResultsArray(id: string, datasetKind: string, arrToBeConverted: any[]): any[] {
	let insightResults: InsightResult[] = [];
	let idAndUnderscore: string = "";
	let keyValue: string | number = "";
	for (let section of arrToBeConverted) {
		let sectionKeys = Object.keys(section);
		let insightResult: InsightResult = {};
		for (let key of sectionKeys) {
			let queryKeyMapping = getDatasetToQueryKeyMapping(key);
			if (datasetKind !== "rooms" && queryKeyMapping) {
				idAndUnderscore = id + "_" + queryKeyMapping;
				keyValue = section[key];
				// bracket notation instantiates a new key
				insightResult[idAndUnderscore] = keyValue;
			} else {
				idAndUnderscore = id + "_" + key;
				keyValue = section[key];
				// bracket notation instantiates a new key
				insightResult[idAndUnderscore] = keyValue;
			}
		}
		insightResults.push(insightResult);
	}
	return insightResults;
}

/**
 * @author: CO
 * @param  input: content passed in as the value for WHERE
 * @return: any array of all sections in the identified dataset that meet the filter's criteria
 */
function handleBody(input: any, instanceOfDatasets: Datasets, myDatasetId: string, datasetOfFirstChild?: any[]): any[] {
	return handleKey(input, instanceOfDatasets, myDatasetId, datasetOfFirstChild);
}

/**
 * @author: CO
 * @param  input: content passed in as the value for WHERE
 * @return: any array of all sections in the identified dataset that meet the filter's criteria
 * @description: handles the reccursive calls and calls the appropriate function if neccessary.
 */
function handleKey(input: any, instanceOfDatasets: Datasets, myDatasetId: string, datasetOfFirstChild?: any[]): any[] {
	// console.log("handleKey input: " + JSON.stringify(input));
	let results: any[] = [];
	let keys = Object.keys(input);
	if(keys.length !== 0){
		for (let key of keys) {
			let instanceOfSpecificQueryComparator = getSpecificQueryComparator(key, instanceOfDatasets);
			let notFlag: number = 0;
			results = produceResult(myDatasetId, instanceOfSpecificQueryComparator, input, notFlag, instanceOfDatasets,
				datasetOfFirstChild);
			// queryComparatorFunctionTable(key, input, instanceOfSpecificQueryComparator);
		}
	} else {
		let instanceOfSpecificQueryComparator = getSpecificQueryComparator("", instanceOfDatasets);
		let notFlag: number = 0;
		results = produceResult(myDatasetId, instanceOfSpecificQueryComparator, input, notFlag, instanceOfDatasets,
			datasetOfFirstChild);
	}
	return results;
}

function getSpecificQueryComparator(key: any, instanceOfDatasets: Datasets): QueryComparator {
	let instance: any;
	switch (key) {
		case QueryComparatorsEnum.AND: {
			instance = new ANDComparator(instanceOfDatasets);
			break;
		}
		case QueryComparatorsEnum.OR: {
			instance = new ORComparator(instanceOfDatasets);
			break;
		}
		case QueryComparatorsEnum.IS: {
			instance = new ISComparator(instanceOfDatasets);
			break;
		}
		case QueryComparatorsEnum.EQ: {
			instance = new EQComparator(instanceOfDatasets);
			break;
		}
		case QueryComparatorsEnum.NOT: {
			instance = new NOTComparator(instanceOfDatasets);
			break;
		}
		case QueryComparatorsEnum.GT: {
			instance = new GTComparator(instanceOfDatasets);
			break;
		}
		case QueryComparatorsEnum.LT: {
			instance = new LTComparator(instanceOfDatasets);
			break;
		}
		default:
			instance = new EmptyWHEREComparator(instanceOfDatasets);
	}
	return instance;
}

function produceResult(myDatasetId: string, comparator: QueryComparator, input: any, flagForNot: number,
	instanceOfDatasets: Datasets, datasetOfFirstChild?: any[]):
	any[] {
	let result: any[] = [];
	let NOTCount: number = flagForNot;
	if (comparator instanceof NOTComparator) {
		let keysInObject = Object.keys(input.NOT);
		NOTCount++;
		let instanceOfSpecificQueryComparator = getSpecificQueryComparator(keysInObject[0], instanceOfDatasets);
		result = produceResult(myDatasetId, instanceOfSpecificQueryComparator, input.NOT, NOTCount, instanceOfDatasets,
			datasetOfFirstChild);

	} else {
		if (NOTCount % 2 === 0) {
			result = comparator.filterDataset(myDatasetId,input,datasetOfFirstChild);
		} else {
			result = comparator.returnInverseResults(myDatasetId,input,datasetOfFirstChild);

		}
	}
	return result;
}

/**
 * @author: CO
 * @param input: JSON object of the columns and in which order query results should be returned
 * @param filteredSections: the sections already filtered from WHERE
 * @return: the filtered sections in specified order, with only the specified columns included.
 */
function handleOptions(input: any, arrToBeFiltered: any[], transformationsPresent: boolean): any[] {
	let allColumnsNeeded = handleColumns(input.COLUMNS, arrToBeFiltered,transformationsPresent);
	let allColumnsNeededInOrder: any[] = allColumnsNeeded;
	if(input.ORDER){
		if(typeof input.ORDER === "string"){
			allColumnsNeededInOrder = handleSimpleOrder(input.ORDER, allColumnsNeeded);
		} else {
			allColumnsNeededInOrder = handleOrderingMultipleColumns(input.ORDER, allColumnsNeeded);
		}
	}
	return allColumnsNeededInOrder;
}

function extractAndSaveApplyKeys(wantedColumns: string[], revisedWantedColumns: string[]) {
	for (let columns in wantedColumns) {
		if (!columns.includes("_")) {
			overallTypeKeys.push(columns);
			// deletes that entry in the array
			// credit:https://stackoverflow.com/a/15295806
			const index = revisedWantedColumns.indexOf(columns, 0);
			if (index > -1) {
				revisedWantedColumns.splice(index, 1);
			}
		}

	}
}

/**
 * @author: CO
 * @param wantedColumns: array of specified columns in the original query
 * @param filteredSections: sections that have already been filtered in the body of the query
 * @return: only the specified sections of the filteredSections originally received.
 */
function handleColumns(wantedColumns: string[], filteredSections: any[], transformationsPresent: boolean): any[] {
	let onlyWantedColumnsKept: any[] = filteredSections;
	// console.log("onlyWantedColumnsKept: " + onlyWantedColumnsKept);
	// console.log("All sections keys: " + Object.keys(onlyWantedColumnsKept));
	let revisedWantedColumns: string[] = wantedColumns;
	if(!transformationsPresent) {
		extractAndSaveApplyKeys(wantedColumns, revisedWantedColumns);
	}
	for (let section of onlyWantedColumnsKept) {
		let queryKeysArr: string[] = Object.keys(section);
		// console.log("section: " + JSON.stringify(section));
		let countIndex = 0;
		for (let el of queryKeysArr) {
			if (!revisedWantedColumns.includes(el)) {
				// credit: https://stackoverflow.com/a/17817166
				delete section[el];
			}
			countIndex++;
		}
	}
	// console.log("onlyWantedColumnsKept: " + JSON.stringify(onlyWantedColumnsKept));
	return onlyWantedColumnsKept;
}

export {handleSimpleOrder, handleColumns, handleOptions, handleKey, createInsightResultsArray, handleQuery, handleBody,
	getSpecificQueryComparator, produceResult};
