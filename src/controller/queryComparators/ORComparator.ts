import {QueryComparator, QueryComparatorsEnum} from "./QueryComparator";
import {Datasets} from "../datasets/Datasets";
import {
	createInsightResultsArray,
	getSpecificQueryComparator,
	handleBody,
	handleQuery,
	produceResult
} from "../handleQuery/ReturnQuery";
import {ANDComparator} from "./ANDComparator";


export class ORComparator extends QueryComparator {

	private allowedNumOfChildren = 2;

	constructor(instanceOfDatasets: Datasets) {
		super(instanceOfDatasets);
	}

	public filterDataset(datasetID: string, input: any, datasetOfFirstChild: any[]): any[] {
		// console.log("i got into OR");
		let children: any = Object.keys(input.OR);
		// console.log("children: " + JSON.stringify(children));
		let result: any[] = [];
		let result2: any[] = [];
		let firstChild: any;

		if (children[0] === QueryComparatorsEnum.AND || children[0] === QueryComparatorsEnum.OR ||
			children[0] === QueryComparatorsEnum.NOT) {
			firstChild = input.OR;
		} else {
			children = Object.values(input.OR);
			firstChild = children[0];
		}
		result = this.handleChildIsFilter(datasetID, firstChild, datasetOfFirstChild);

		if (children.length === this.allowedNumOfChildren) {
			let secondChild: any = children[1];
			// result = this.handleSecondChild(this, datasetID, secondChild, result, datasetOfFirstChild);
			result2 = this.handleChildIsFilter(datasetID, secondChild, datasetOfFirstChild);
			// credit: https://stackoverflow.com/a/46712822
			result = [...result, ...result2];
		}

		return result;
	}

	public returnInverseResults(datasetID: string, input: any, datasetOfFirstChild: any[]): any[] {
		// console.log("i got into NOT OR");
		let children: any = Object.keys(input.OR);
		// console.log("children: " + JSON.stringify(children));
		let result: any[] = [];
		let firstChild: any;

		if (children[0] === QueryComparatorsEnum.AND || children[0] === QueryComparatorsEnum.OR ||
			children[0] === QueryComparatorsEnum.NOT) {
			firstChild = input.OR;
		} else {
			children = Object.values(input.OR);
			firstChild = children[0];
		}
		let newFirstChild = {NOT: firstChild};
		result = this.handleChildIsFilter(datasetID, newFirstChild, datasetOfFirstChild);

		if (children.length === this.allowedNumOfChildren) {
			let secondChild: any = children[1];
			let newSecondChild = {NOT: secondChild};
			result = this.handleChildIsFilter(datasetID, newSecondChild, result);
		}
		return result;
	}

}
