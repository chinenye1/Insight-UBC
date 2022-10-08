import {QueryComparator, QueryComparatorsEnum} from "./QueryComparator";
import {Datasets} from "../datasets/Datasets";
import {getSpecificQueryComparator, produceResult} from "../handleQuery/ReturnQuery";
import {ORComparator} from "./ORComparator";


export class ANDComparator extends QueryComparator {
	private allowedNumOfChildren = 2;

	constructor(instanceOfDatasets: Datasets) {
		super(instanceOfDatasets);
	}

	public filterDataset(datasetID: string, input: any, datasetOfFirstChild: any[]): any[] {
		// console.log("i got into AND");
		let children: any = Object.keys(input.AND);
		// console.log("children: " + JSON.stringify(children));
		let result: any[] = [];
		let firstChild: any;

		if (children[0] === QueryComparatorsEnum.AND || children[0] === QueryComparatorsEnum.OR ||
			children[0] === QueryComparatorsEnum.NOT) {
			firstChild = input.AND;
		} else {
			children = Object.values(input.AND);
			firstChild = children[0];
		}
		result = this.handleChildIsFilter(datasetID, firstChild, datasetOfFirstChild);

		if (children.length === this.allowedNumOfChildren) {
			let secondChild: any = children[1];
			result = this.handleChildIsFilter(datasetID, secondChild, result);
		}
		return result;

	}

	public returnInverseResults(datasetID: string, input: any, datasetOfFirstChild: any[]): any[] {
		// console.log("i got into NOT AND");
		let children: any = Object.keys(input.AND);
		// console.log("children: " + JSON.stringify(children));
		let result: any[] = [];
		let result2: any[] = [];
		let firstChild: any;

		if (children[0] === QueryComparatorsEnum.AND || children[0] === QueryComparatorsEnum.OR ||
			children[0] === QueryComparatorsEnum.NOT) {
			firstChild = input.AND;
		} else {
			children = Object.values(input.AND);
			firstChild = children[0];
		}

		let newFirstChild = {NOT: firstChild};
		result = this.handleChildIsFilter(datasetID, newFirstChild, datasetOfFirstChild);

		if (children.length === this.allowedNumOfChildren) {
			let secondChild: any = children[1];
			let newSecondChild = {NOT: secondChild};
			result2 = this.handleChildIsFilter(datasetID, newSecondChild, datasetOfFirstChild);
			// credit: https://stackoverflow.com/a/46712822
			result = [...result, ...result2];
		}
		return result;
	}

}
