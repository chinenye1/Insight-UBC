/**
 * @author: CO
 * @description: this file contains all common fields and behaviour of all comparators
 */

import {
	getQueryToDatasetKeyMapping,
	splitParsableContent,
} from "../datasets/HandleCoursesDataset";
import {Datasets} from "../datasets/Datasets";
import {handleBody, handleQuery} from "../handleQuery/ReturnQuery";
import {InsightError} from "../IInsightFacade";

export enum QueryComparatorsEnum {
	AND = "AND",
	OR = "OR",
	LT = "LT",
	GT = "GT",
	EQ = "EQ",
	IS = "IS",
	NOT = "NOT"
}

export abstract class QueryComparator {
	private datasets: Datasets;

	constructor(instanceOfDatasets: Datasets) {
		this.datasets = instanceOfDatasets;
	}

	/**
	 * @param id: id of the dataset to be queried
	 * @param input: part of query which includes the name of this QueryComparator instance
	 * @param datasetOfFirstChild: results gotten from filtering from comparator's first child - if available
	 * @return: results of applying this input to the dataset specified
	 */
	public abstract filterDataset(id: string, input: any, datasetOfFirstChild?: any[]): any[];

	/**
	 * @param id: id of the dataset to be queried
	 * @param input: part of query which includes the name of this QueryComparator instance
	 * @param datasetOfFirstChild: results gotten from filtering from comparator's first child - if available
	 * @return: the opposite results of applying this input to the dataset specified
	 */
	public abstract returnInverseResults(id: string, input: any, datasetOfFirstChild?: any[]): any[];

	/**
	 * @description returns the instance of Datasets class that InsightFacade uses to keep it consistent
	 * @protected
	 */
	protected getInstanceOfDataset(): Datasets {
		return this.datasets;
	}

	/**
	 * @author: CO
	 * @param id: id of the dataset
	 * @return: returns datasets referenced in query
	 */
	protected fetchDatasetAsJSON(id: any): any {
		return this.datasets.getDataset(id);
	}

	/**
	 * @author: CO
	 * @param queryKeyInObject: the part of the query that includes the QueryComparator in question
	 * @param filterValueArr: at index 0 the value of the key to search for in the dataset
	 * @param comparingFunction: function to check compare the datasetKeyValue and the filterValueArr[0]
	 * @param datasetOfFirstChild: results gotten from filtering from comparator's first child
	 * @return: any array of dataset sections filtered based on filterValueArr
	 */
	protected handleQueryComparators(queryKeyInObject: any, filterValueArr: any[], comparingFunction: any,
		datasetOfFirstChild: any[]): any[] {
		let filteredResultsArray: any[] = [];
		let splitStrArr = queryKeyInObject.toString().split("_");
		let idOfDataset: string = splitStrArr[0];
		let queryKey: string = splitStrArr[1];
		let datasetKey: string = queryKey;
		if(idOfDataset !== "rooms") {
			datasetKey = getQueryToDatasetKeyMapping(queryKey);
		}
		let filterValue = filterValueArr[0];
		if (filterValue === "***") {
			throw new InsightError("filter value is ***");
		}
		if (filterValue !== "*" && filterValue !== "**") {
			filteredResultsArray = this.handleFilterValue(filterValue, idOfDataset,
				comparingFunction, datasetOfFirstChild, datasetKey);
		} else {
			filteredResultsArray = this.handleFilterValueContainsOnlyAsterisk(filterValue, idOfDataset,
				comparingFunction, datasetOfFirstChild, datasetKey);
		}
		return filteredResultsArray;
	}

	/**
	 * @param datasetId: id of the dataset from which to get query answers
	 * @param input: a sub-part of the query (contains query relating to the child comparator in question)
	 * @param datasetOfFirstChild: results gotten from filtering from comparator's first child
	 * @return results: any array of dataset sections filtered based on filter identified in input
	 * @protected
	 */
	protected handleChildIsFilter(datasetId: string, input: any, datasetOfFirstChild: any[]): any[] {
		let instanceOfDatasets = this.getInstanceOfDataset();
		let results = handleBody(input, instanceOfDatasets, datasetId, datasetOfFirstChild);
		return results;
	}

	/**
	 * @param filterValue: the query inputString
	 * @param idOfDataset: id of the dataset from which to get query answers
	 * @param comparingFunction: function to use to compare filterValue to datasetValues based on QueryComparator instance
	 * @param datasetOfFirstChild: results gotten from filtering from comparator's first child
	 * @param datasetKey: dataset key from which to retrieve value to compare against filterValue
	 * @return filteredResultsArray: the resulting array from filtering dataset
	 * @private
	 */
	private handleFilterValue(filterValue: any, idOfDataset: string, comparingFunction: any,
		datasetOfFirstChild: any[], datasetKey: string): any[] {
		let filteredResultsArray: any[] = [];
		let myFilterValue: string | RegExp = filterValue;

		if(typeof filterValue === "string" && filterValue.includes("*")){
			myFilterValue = this.handleWildcardsAsRegex(filterValue);

		}
		if (datasetOfFirstChild.length === 0) {
			let validDatasetSectionsToQueryAsStr = this.fetchDatasetAsJSON(idOfDataset);
			let splitSections = splitParsableContent(validDatasetSectionsToQueryAsStr);
			splitSections.length = splitSections.length - 1;
			for (let section of splitSections) {
				let parsedSection: any = JSON.parse(section);
				let datasetKeyValue: string = parsedSection[datasetKey.toString()];
				let meetsCriteria = comparingFunction(datasetKeyValue, myFilterValue);
				if (meetsCriteria) {
					filteredResultsArray.push(parsedSection);
				}
			}
		} else {
			let splitSections = datasetOfFirstChild;
			for (let section of splitSections) {
				// let parsedSection: any = JSON.parse(section);
				let datasetKeyValue: string = section[datasetKey.toString()];
				let meetsCriteria = comparingFunction(datasetKeyValue, filterValue);
				if (meetsCriteria) {
					filteredResultsArray.push(section);
				}
			}
		}
		return filteredResultsArray;
	}

	/**
	 * @param filterValue: the query inputString
	 * @return regPattern: pattern of which to match datasetValues
	 * @description: translates the asterisk in filterValue into a regex pattern
	 * @private
	 */
	private handleWildcardsAsRegex(filterValue: string): RegExp{
		// how to use regex patterns credit goes to TA Michele and the links below
		// https://levelup.gitconnected.com/indiana-jones-and-the-universal-way-to-search-for-text-1901990f53ae and
		// https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285
		let asteriskAtBeginning = filterValue[0] === "*";
		let asteriskAtEnd = filterValue[filterValue.length - 1] === "*";
		let regPattern: RegExp = /a/;
		filterValue = this.removeAsteriskIfPresentInValue(filterValue);
		if (asteriskAtBeginning && asteriskAtEnd) {
			regPattern = new RegExp("(\\d|\\w)*" + filterValue + "(\\d|\\w)*");
		} else if (asteriskAtEnd) {
			regPattern = new RegExp( "^" + filterValue + "(\\d|\\w)*");
		} else if (asteriskAtBeginning) {
			regPattern =  new RegExp("(\\d|\\w)*" + filterValue + "$");
		} else {
			throw new InsightError("asterisk found in middle of inputString");
		}
		return regPattern;
	}

	/**
	 * @param filterValue: the query inputString
	 * @param idOfDataset: id of the dataset from which to get query answers
	 * @param comparingFunction: function to use to compare filterValue to datasetValues based on QueryComparator instance
	 * @param datasetOfFirstChild: results gotten from filtering from comparator's first child
	 * @param datasetKey: dataset key from which to retrieve value to compare against filterValue
	 * @return filteredResultsArray: the resulting array from filtering dataset
	 * @description: returns all dataset sections after parsing each of them
	 * @private
	 */
	private handleFilterValueContainsOnlyAsterisk(filterValue: string, idOfDataset: string, comparingFunction: any,
		datasetOfFirstChild: any[], datasetKey: string): any[] {
		let filteredResultsArray: any[] = [];
		if (datasetOfFirstChild.length === 0) {
			let validDatasetSectionsToQueryAsStr = this.fetchDatasetAsJSON(idOfDataset);
			let splitSections = splitParsableContent(validDatasetSectionsToQueryAsStr);
			splitSections.length = splitSections.length - 1;
			for (let section of splitSections) {
				let parsedSection: any = JSON.parse(section);
				filteredResultsArray.push(parsedSection);
			}
		} else {
			let splitSections = datasetOfFirstChild;
			for (let section of splitSections) {
				filteredResultsArray.push(section);
			}
		}
		return filteredResultsArray;
	}

	/**
	 * @param filterValue: inputString in query
	 * @return: returns filterValue without any asterisks
	 * @description: removes every asterisk from string
	 * @private
	 */
	private removeAsteriskIfPresentInValue(filterValue: any): string {
		let value: any = filterValue;
		if (typeof value === "string") {
			while (value.includes("*")) {
				// console.log("value looks like this: " + value);
				// credit for how to remove a character from a string: https://stackoverflow.com/a/9932996
				let indexOfAsterisk = value.indexOf("*");
				let strAsArr = value.split("");
				strAsArr.splice(indexOfAsterisk, 1);
				value = strAsArr.join("");
			}
		}

		return value;
	}


}
