import {QueryComparator} from "./QueryComparator";
import {Datasets} from "../datasets/Datasets";

export class ISComparator extends QueryComparator {

	constructor(instanceOfDatasets: Datasets) {
		super(instanceOfDatasets);
	}

	public filterDataset(datasetId: string, input: any, datasetOfFirstChild: any[]): any[] {
		let keysInObject = Object.keys(input.IS);
		let filterValue: string[] = Object.values(input.IS);
		let results: any[] = [];
		// Todo: check the logi in this if-statement
		if(filterValue[0] === ""){
			results = this.handleQueryComparators(keysInObject, filterValue, ((a: any, b: any) => (a === b)),
				datasetOfFirstChild);
		} else {
			results = this.handleQueryComparators(keysInObject, filterValue, ((a: any, b: any) => (a.match(b))),
				datasetOfFirstChild);
		}
		return results;
	}

	public returnInverseResults(id: string, input: any, datasetOfFirstChild: any[]): any[] {
		let keysInObject = Object.keys(input.IS);
		let filterValue = Object.values(input.IS);
		let results = this.handleQueryComparators(keysInObject, filterValue, ((a: any, b: any) => !(a.match(b))),
			datasetOfFirstChild);
		return results;
	}
}
