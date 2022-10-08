import {QueryComparator, QueryComparatorsEnum} from "./QueryComparator";
import {Datasets} from "../datasets/Datasets";
import {getSpecificQueryComparator, produceResult} from "../handleQuery/ReturnQuery";
import {ORComparator} from "./ORComparator";
import {splitParsableContent} from "../datasets/HandleCoursesDataset";


export class EmptyWHEREComparator extends QueryComparator {
	private allowedNumOfChildren = 0;

	constructor(instanceOfDatasets: Datasets) {
		super(instanceOfDatasets);
	}

	public filterDataset(datasetID: string, input: any, datasetOfFirstChild: any[]): any[] {
		// console.log("i got into EmptyWHEREComparator");
		let result: any[] = [];
		let validDatasetSectionsToQueryAsStr = this.fetchDatasetAsJSON(datasetID);
		let splitSections = splitParsableContent(validDatasetSectionsToQueryAsStr);
		splitSections.length = splitSections.length - 1;
		for (let section of splitSections) {
			let parsedSection: any = JSON.parse(section);
			result.push(parsedSection);
		}
		return result;
	}

	public returnInverseResults(datasetID: string, input: any, datasetOfFirstChild: any[]): any[] {
		// console.log("shouldn't be in EmptyWHEREComparator's returnInverseResults method");
		return this.filterDataset(datasetID, input, datasetOfFirstChild);
	}

}
