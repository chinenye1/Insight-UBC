import {
	IInsightFacade,
	InsightDatasetKind,
	InsightResult, NotFoundError,
	ResultTooLargeError
} from "../../../../../src/controller/IInsightFacade";
import InsightFacade from "../../../../../src/controller/InsightFacade";
import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import {clearDisk, getContentFromArchives} from "../../../../TestUtility";
import {applyTransformationOnEachGroup, makeGroup} from "../../../../../src/controller/handleQuery/Transformations";
import e from "express";
import {
	createInsightResultsArray,
	handleBody,
	handleOptions
} from "../../../../../src/controller/handleQuery/ReturnQuery";
import {Datasets} from "../../../../../src/controller/datasets/Datasets";

use(chaiAsPromised);

function getOnlyCPSCResults() {
	return [
		{courses_avg: 88.47, courses_dept: "cpsc"},
		{courses_avg: 88.47, courses_dept: "cpsc"},
		{courses_avg: 88.68, courses_dept: "cpsc"},
		{courses_avg: 88.68, courses_dept: "cpsc"}
	];
}

function getAllResults() {
	return [
		{courses_avg: 86.65, courses_dept: "bioc"},
		{courses_avg: 86.65, courses_dept: "bioc"},
		{courses_avg: 88.17, courses_dept: "bioc"},
		{courses_avg: 88.17, courses_dept: "bioc"},
		{courses_avg: 88.47, courses_dept: "cpsc"},
		{courses_avg: 88.47, courses_dept: "cpsc"},
		{courses_avg: 88.68, courses_dept: "cpsc"},
		{courses_avg: 88.68, courses_dept: "cpsc"},
		{courses_avg: 89.31, courses_dept: "bioc"},
		{courses_avg: 89.31, courses_dept: "bioc"},
		{courses_avg: 90.25, courses_dept: "bioc"},
		{courses_avg: 90.25, courses_dept: "bioc"},
		{courses_avg: 90.33, courses_dept: "bioc"},
		{courses_avg: 90.33, courses_dept: "bioc"},
	];
}

function getOnlyBioResults() {
	return [{courses_avg: 86.65, courses_dept: "bioc"},
		{courses_avg: 86.65, courses_dept: "bioc"}, {
			courses_avg: 88.17,
			courses_dept: "bioc"
		},
		{courses_avg: 88.17, courses_dept: "bioc"}, {
			courses_avg: 89.31,
			courses_dept: "bioc"
		},
		{courses_avg: 89.31, courses_dept: "bioc"}, {
			courses_avg: 90.25,
			courses_dept: "bioc"
		},
		{courses_avg: 90.25, courses_dept: "bioc"}, {
			courses_avg: 90.33,
			courses_dept: "bioc"
		},
		{courses_avg: 90.33, courses_dept: "bioc"}];
}

describe("Grouping Tests", function () {
	let courses: string;
	let datasetID: string;

	before(function () {
		datasetID = "courses";
		// courses = getContentFromArchives("notJson2.zip");
		courses = getContentFromArchives("courses.zip");

	});

	describe("Make Group Tests", function () {
		let facade: IInsightFacade;

		beforeEach(function () {
			// clear disk first because facade may have loaded from the disk when instantiated
			clearDisk();
			facade = new InsightFacade();
		});

		// it("should make CPSC and BIOC groups with Perform Query", function () {
		// 	return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
		// 		let columns: any[] = ["courses_dept", "courses_avg"];
		// 		let query = {
		// 			WHERE: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
		// 			OPTIONS: {
		// 				COLUMNS: columns,
		// 				ORDER: "courses_avg"
		// 			}
		// 		};
		// 		return facade.performQuery(query).then((results) => {
		// 			expect(results).to.deep.equal(getAllResults());
		// 			let expectedResults = [getOnlyBioResults(), getOnlyCPSCResults()];
		// 			let keysToGroupBy: any[] = ["courses_dept"];
		// 			// let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
		// 			let makeGroupResults: any[] = makeGroup(results, keysToGroupBy);
		// 			// console.log("makeGroupResults: " + JSON.stringify(makeGroupResults));
		//
		// 			expect(makeGroupResults).to.deep.equal(expectedResults);
		// 		});
		// 	});
		// });

		it("should make CPSC and BIOC groups", function () {
			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
				let columns: any[] = ["courses_dept", "courses_avg"];
				let query = {
					WHERE: {},
					OPTIONS: {
						COLUMNS: columns,
						ORDER: "courses_avg"
					}
				};
				let arrToBeFiltered = handleBody(query.WHERE, new Datasets(), datasetID, []);
				// console.log("arrToBeFiltered: " + JSON.stringify(arrToBeFiltered));
				let arrToBeFilteredAsInsightResultsArr = createInsightResultsArray(datasetID,
					InsightDatasetKind.Courses, arrToBeFiltered);
				let expectedResults = [getOnlyBioResults(), getOnlyCPSCResults()];
				let keysToGroupBy: any[] = ["courses_dept"];
				// let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
				arrToBeFilteredAsInsightResultsArr = handleOptions(query.OPTIONS, arrToBeFilteredAsInsightResultsArr,
					true);
				let makeGroupResults: any = makeGroup(arrToBeFilteredAsInsightResultsArr, keysToGroupBy);
				// console.log("makeGroupResults: " + JSON.stringify(makeGroupResults));
				let mapValues = Object.values(makeGroupResults);
				expect(mapValues).to.deep.equal(expectedResults);
			});
		});
	});
});
