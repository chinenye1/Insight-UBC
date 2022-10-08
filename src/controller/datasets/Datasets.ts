import * as fs from "fs-extra";
import {checkContentIsValidJSON, splitParsableContent} from "./HandleCoursesDataset";
import {InsightDatasetKind, InsightError, NotFoundError} from "../IInsightFacade";
import {checkContentInIndex, checkContentInRooms} from "../validating/ValidateRooms";


export class Datasets {
	// data structure for our datasets map(key=dataset id, value=dataset content)
	private myDatasetMap = new Map<string, string>();
	private recordOfDatasetKind = new Map<string, string>();
	// private myMapForDatasetRooms = new Map<string, any>();
	private numRowsInEachDataset: Map<string, number> = new Map<string, number>(); // Map([["", 0]]);


	// load dataset from disk to answer queries;
	constructor() {
		console.log("Datasets object created");
	}

	/**
	 * @author: CO
	 * @return: the number of rows of valid sections in the dataset given dataset id
	 */
	public getDatasetNumRows(id: string): any {
		return this.numRowsInEachDataset.get(id);
	}
	//
	// public getDatasetKind(id: string): string{
	// 	let result = "";
	// 	if(this.recordOfDatasetKind.get(id) !== undefined){
	// 		result = this.recordOfDatasetKind.get(id);
	// 	}
	// 	return  result;
	// }

	/**
	 * @author: CO
	 * @return: the kind of Dataset that corresponds to the given dataset id
	 */
	public getKindOfDataset(id: string): any {
		return this.recordOfDatasetKind.get(id);
	}

	/**
	 * @author: CO
	 * @return: the list of all datasets currently in myDatasetMap
	 * as a string[]
	 */
	public getListOfAddedDatasetsIds(): string[] {
		// credit: Array.from() gotten from https://stackoverflow.com/a/35341828
		let keys = Array.from(this.myDatasetMap.keys());
		// console.log("these keys were added to the map: " + keys);
		return keys;
	}

	/**
	 * @author: CO
	 * @param id: the id of the dataset to be returned.
	 * @return: all the valid sections in dataset identified, as a JSON object string.
	 */
	public getDataset(id: string): any {
		if (!this.hasValidId(id)) {
			throw new InsightError("Id not valid");
		}
		// let datasetResult = this.myDatasetMap.get(id);
		// credit: or fileReadSync:https://stackoverflow.com/a/57611337
		const file = "./data/" + id + ".json";
		let datasetResult = fs.readFileSync(file,"utf-8");
		if (!datasetResult) {
			throw new NotFoundError("Id not found in query");
		}
		return datasetResult;
	}

	/**
	 * @author: CO
	 * @param id: the id of the dataset to be added.
	 * @param content: the base64 string raw content.
	 * Dataset is added to memory and disk if dataset is valid. Else InsightError is thrown.
	 */
	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<any> {
		if (!this.hasValidId(id) || !this.hasUniqueId(id)) {
			throw new InsightError("Id not valid");
		}
		if (!this.checkValidDatasetKind(kind)) {
			throw new InsightError("Dataset kind not valid");
		}
		if (kind === InsightDatasetKind.Courses) {
			return this.handleDatasetWithCourseKind(id, content);
		} else {
			return this.handleDatasetWithRoomsKind(id, content);
		}
	}

	public handleDatasetWithCourseKind(id: string, content: any): Promise<any> {
		return checkContentIsValidJSON(id, content).then((jsonObjectOfValidSections) => {
			// console.log("have checked content is valid JSON");
			let jsonObjectOfValidSectionsAsString: string = jsonObjectOfValidSections[0];
			// console.log("sections are: " + jsonObjectOfValidSectionsAsString);
			let numRows: number = parseInt(jsonObjectOfValidSections[1], 10);
			this.numRowsInEachDataset.set(id, numRows);
			console.log("inside addDataset numRows is: " + numRows);
			// credit for ensureFileSync function usage: https://github.com/jprichardson/node-fs-extra/tree/master/docs
			// creates the specified file, including the directory it is to be placed in
			// if directories in the path is not already created.
			const file = "./data/" + id + ".json";
			fs.ensureFileSync(file);
			// console.log("have CREATED A FILE");

			// Saves/writes file to the disk
			fs.writeFileSync(file, jsonObjectOfValidSectionsAsString);
			// console.log("have WRITTEN TO DISK");
			// console.log("wrote this to disk: " + jsonObjectOfValidSectionsAsString.toString());
			this.myDatasetMap.set(id, jsonObjectOfValidSectionsAsString);
			this.recordOfDatasetKind.set(id, InsightDatasetKind.Courses);
			// console.log("have added dataset to map: " + this.myDatasetMap.get(id));
		}).catch((e) => {
			// console.log("CAUGHT AN ERROR HERE: " + e);
			throw new InsightError("Dataset is invalid and was not added " + e);
		});
	}

	public getCombinedValidSections(jsonObjectOfValidSections: any[]): any[] {
		let results: any[] = [];
		for (let elem of jsonObjectOfValidSections){
			for(let building of elem) {
				for (let room of building) {
					results = [...results, ...room];
				}
			}
		}
		return results;
	}

	public combineRoomsInMap(map: any[]): any[] {
		let results: any[] = [];
		for (let elem of map.values()){
			let jsonRoom = "";
			let roomArr: any[] = [];
			for (let room of elem){
				jsonRoom = JSON.stringify(room);
				roomArr.push(jsonRoom);
			}
			results = [...results, ...roomArr];
			results.push(jsonRoom);
		}
		return results;
	}

	public async handleDatasetWithRoomsKind(id: string, content: any): Promise<any> {
		const aMapOfBuildingsRooms = await checkContentInRooms(content);
		// return checkContentInRooms(content).then((aMapOfBuildingsRooms) => {
			// console.log("have checked content is valid JSON");
		try {
			// let jsonObjectOfValidSections = Array.from(aMapOfBuildingsRooms.values());
			let roomsInMap: any[] = this.combineRoomsInMap(aMapOfBuildingsRooms);
			// let combinedValidSections: any[] = this.getCombinedValidSections(jsonObjectOfValidSections);
			let roomsInMapAsJSONStr = roomsInMap.toString();
			// let roomsInMapAsJSONStr = roomsInMap[0];
			// let hTMLDocOfValidSectionsAsString: string = JSON.stringify(roomsInMapAsJSONStr);
			let numRows: number = this.countNumRoomsInMap(aMapOfBuildingsRooms);
			this.numRowsInEachDataset.set(id, numRows);
			// console.log("inside addDataset numRows is: " + numRows);
			// credit for ensureFileSync function usage: https://github.com/jprichardson/node-fs-extra/tree/master/docs
			// creates the specified file, including the directory it is to be placed in
			// if directories in the path is not already created.
			const file = "./data/" + id + ".json";
			fs.ensureFileSync(file);
			// console.log("have CREATED A FILE");

			// Saves/writes file to the disk
			fs.writeFileSync(file, roomsInMapAsJSONStr);
			// console.log("have WRITTEN ROOMS TO DISK");
			this.myDatasetMap.set(id, roomsInMapAsJSONStr);
			this.recordOfDatasetKind.set(id, InsightDatasetKind.Rooms);
		}catch (e){
			return e;
		}
	}

	public countNumRoomsInMap(myMap: Map<any, any>): number{
		let results: number = 0;
		for (let [key,value] of myMap){
			results += value.length;
		}
		return results;
	}


	/**
	 * @author: CO
	 * @param id: the id of the dataset to be deleted.
	 * Dataset is deleted from memory and disk.
	 */
	public deleteDataset(id: string): void {
		// remove dataset from memory
		this.myDatasetMap.delete(id);
		// remove dataset from disk
		let datasetLocation: string = "./project_team593/data/" + id + ".json";
		fs.removeSync(datasetLocation);
	}


	/**
	 * @author: CO
	 * @param kind: the id of the dataset to be returned.
	 * @return boolean: whether the dataset's kind is InsightDatasetKind.Courses.
	 * @throws: InsightError
	 */
	public checkValidDatasetKind(kind: InsightDatasetKind): boolean {
		return (kind === InsightDatasetKind.Courses || kind === InsightDatasetKind.Rooms);
	}

	/**
	 * @author: CO
	 * @param id: the id of the dataset to be returned.
	 * @return boolean: whether the dataset's id meets specifications' requirements
	 * @throws: InsightError
	 */
	public hasValidId(id: string): boolean {
		let idHasUnderscore: boolean = id.includes("_");
		let idHasOnlyWhitespace: boolean = true;
		// credit: https://stackoverflow.com/a/58816644
		// this splits the characters of the id using spread syntax
		const chars = [...id];
		chars.forEach((char, index) => {
			if (!char.match(" ")) {
				idHasOnlyWhitespace = false;
			}
		});
		return !idHasOnlyWhitespace && !idHasUnderscore;
	}

	public hasUniqueId(id: string): boolean{
		return !this.getListOfAddedDatasetsIds().includes(id);
		// if (this.myDatasetMap.get(id) === undefined){
		// 	return true;
		// } else {
		// 	return false;
		// }
	}

}
