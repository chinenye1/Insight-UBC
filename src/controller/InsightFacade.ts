import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	NotFoundError, ResultTooLargeError
} from "./IInsightFacade";
import {Datasets} from "./datasets/Datasets";
import {handleQuery} from "./handleQuery/ReturnQuery";
import {checkWholeQuery, getDatasetID} from "./validating/ValidateEBNF2";


/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	// private myDatasets: Datasets = DatasetInstanceHolder.datasets;
	private myDatasets: Datasets = new Datasets();

	constructor() {
		console.log("InsightFacadeImpl::init()");
	}

	public getInsightFacadeDatasetInstance(): any {
		return this.myDatasets;
	}

	/**
	 * @authors: CO, DL
	 * @param kind: the id of the dataset to be returned.
	 * @return Promise<string[]>: string[] is the list of currently added datasets.
	 * @description: as specified in IInsightFacade.ts
	 */
	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		let arrayOfIds: string[];
		return this.myDatasets.addDataset(id, content, kind).then(() => {
			arrayOfIds = this.myDatasets.getListOfAddedDatasetsIds();
			return Promise.resolve(arrayOfIds);
		}).catch((e) => {
			return Promise.reject(new InsightError("Invalid Dataset"));
		});
	}

	/**
	 * @author: CO
	 * @param id: the id of the dataset to be returned.
	 * @return Promise<string>: string is id of removed dataset
	 * @description: as specified in IInsightFacade.ts
	 * @throws: InsightError and NotFoundError;
	 */
	public removeDataset(id: string): Promise<string> {
		try {
			if (!this.myDatasets.hasValidId(id)) {
				throw new InsightError("Can't remove invalid ID");
			}
		} catch (e) {
			return Promise.reject(new InsightError("Cannot remove dataset with invalid id"));
		}
		let listOfIdsInDatasetMap: string[] = this.myDatasets.getListOfAddedDatasetsIds();
		if (listOfIdsInDatasetMap.includes(id)) {
			this.myDatasets.deleteDataset(id);
			return Promise.resolve(id);
		} else {
			return Promise.reject(new NotFoundError("Id given has not yet been added."));
		}
	}

	public performQuery(query: unknown): Promise<InsightResult[]> {
		try {

			// todo: WEIRD: IT SEEMS LIKE IT WANTS A LOCAL INSTANCE OF MY DATASET ---- WHY??


			// console.log("got into perform query" + query);
			// let queryAsJSONStr: any = JSON.stringify(query);
			// console.log("queryAsJSONStr: " + queryAsJSONStr);


			let queryInput: any = query as any;
			// let queryAsJSONStr: string = "";
			// if (typeof queryInput === "string"){
			// 	queryAsJSONStr = queryInput;
			// } else {

			let queryAsJSONStr: any = JSON.stringify(queryInput);

			// David's master function
			checkWholeQuery(queryInput, this.myDatasets);
			let datasetId = getDatasetID(); // temp; will be gotten from David's validated query
			// let datasetId = "courses";
			// let datasetId = "rooms";
			let datasetKind = this.myDatasets.getKindOfDataset(datasetId);
			let results: any[] = handleQuery( datasetId, datasetKind, queryAsJSONStr, this.myDatasets, []);
			if(results.length > 5000){
				return Promise.reject(new ResultTooLargeError("ResultTooLargeError error in performQuery"));
			}
			return Promise.resolve(results);
			// return Promise.resolve([{test: "got into perform query"}]);

		} catch (e: any) {
			return Promise.reject(new InsightError("insight error in performQuery " + e));
		}
	}


	public listDatasets(): Promise<InsightDataset[]> {
		let retValue: InsightDataset[] = [];
		let listOfAddedDatasets = this.myDatasets.getListOfAddedDatasetsIds();
		let myDatasetsClass = this.myDatasets;
		for (let id of listOfAddedDatasets) {
			let insightDatasetsClass = new class implements InsightDataset {
				public id: string = id;
				public kind: InsightDatasetKind = myDatasetsClass.getKindOfDataset(id);
				public numRows: number = myDatasetsClass.getDatasetNumRows(id);
			}();
			retValue.push(insightDatasetsClass);
		}
		return Promise.resolve(retValue);
	}
}
