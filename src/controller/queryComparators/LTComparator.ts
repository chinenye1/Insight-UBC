import {QueryComparator} from "./QueryComparator";
import {Datasets} from "../datasets/Datasets";

export class LTComparator extends QueryComparator{

	constructor(instanceOfDatasets: Datasets) {
		super(instanceOfDatasets);
	}

	public filterDataset(datasetId: string, input: any,datasetOfFirstChild: any[]): any[] {
		let keysInObject = Object.keys(input.LT);
		let filterValue = Object.values(input.LT);
		let results = this.handleQueryComparators(keysInObject, filterValue, ((a: any, b: any) => (a < b)),
			datasetOfFirstChild);
		return results;
	}

	public returnInverseResults(id: string, input: any,datasetOfFirstChild: any[]): any[] {
		let keysInObject = Object.keys(input.LT);
		let filterValue = Object.values(input.LT);
		let results = this.handleQueryComparators(keysInObject, filterValue, ((a: any, b: any) => !(a < b)),
			datasetOfFirstChild);
		return results;
	}
}
