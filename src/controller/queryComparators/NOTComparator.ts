import {QueryComparator} from "./QueryComparator";

export class NOTComparator extends QueryComparator{
	private mydatasetId = "";
	public filterDataset(datasetId: string, input: any, datasetOfFirstChild: any[]): any[] {
		this.mydatasetId = datasetId;
		let keysInObject = Object.keys(input.NOT);
		let filterValue = Object.values(input.NOT);
		let results = this.handleQueryComparators(keysInObject, filterValue, ((a: any, b: any) => (a === b)),
			datasetOfFirstChild);
		return results;
	}

	public returnInverseResults(id: string, input: any,datasetOfFirstChild: any[]): any[] {
		let results = this.filterDataset(this.mydatasetId,input.NOT,datasetOfFirstChild);
		return results;
	}
}
