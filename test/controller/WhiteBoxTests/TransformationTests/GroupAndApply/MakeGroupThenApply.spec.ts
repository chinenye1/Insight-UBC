import {IInsightFacade, InsightDatasetKind} from "../../../../../src/controller/IInsightFacade";
import InsightFacade from "../../../../../src/controller/InsightFacade";
import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import {clearDisk, getContentFromArchives} from "../../../../TestUtility";
import {applyTransformationOnEachGroup, makeGroup} from "../../../../../src/controller/handleQuery/Transformations";
import e from "express";

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

describe("handleORandANDTests", function () {
	let courses: string;
	let datasetID: string;

	before(function () {
		datasetID = "courses";
		courses = getContentFromArchives("notJson2.zip");
	});

	describe("ReturnQueryTests", function () {
		let facade: IInsightFacade;

		beforeEach(function () {
			// clear disk first because facade may have loaded from the disk when instantiated
			clearDisk();
			facade = new InsightFacade();
		});

		it("With dir DOWN - should make CPSC and BIOC groups then apply transformation", function () {
			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
				let columns: any[] = ["courses_dept", "overallAvg", "courses_avg"];
				let query = {
					WHERE: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
					OPTIONS: {
						COLUMNS: columns,
						ORDER: {
							dir: "DOWN",
							keys: ["courses_avg"]
						},
					},
					TRANSFORMATIONS: {
						GROUP: ["courses_dept"],
						APPLY: [{
							overallAvg: {
								AVG: "courses_avg"
							}
						}]
					}
				};
				return facade.performQuery(query).then((results) => {
					let expectedResults: any[] = [{courses_dept: "bioc", overallAvg: 88.94},
						{courses_dept: "cpsc", overallAvg: 88.58}];
					expect(results).to.deep.equal(expectedResults);
				});
			});
		});


		it("With dir UP - should make CPSC and BIOC groups then apply transformation", function () {
			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
				let columns: any[] = ["courses_dept", "courses_avg", "overallAvg"];
				let query = {
					WHERE: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
					OPTIONS: {
						COLUMNS: columns,
						ORDER: {
							dir: "UP",
							keys: ["courses_avg"]
						},
					},
					TRANSFORMATIONS: {
						GROUP: ["courses_dept"],
						APPLY: [{
							overallAvg: {
								AVG: "courses_avg"
							}
						}]
					}
				};
				return facade.performQuery(query).then((results) => {
					let expectedResults: any[] = [{courses_dept: "cpsc", overallAvg: 88.58},
						{courses_dept: "bioc", overallAvg: 88.94},];
					expect(results).to.deep.equal(expectedResults);
				});
			});
		});

		it("should make CPSC and BIOC groups then apply transformation", function () {
			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
				let columns: any[] = ["courses_dept", "courses_avg", "overallAvg"];
				let query = {
					WHERE: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
					OPTIONS: {COLUMNS: columns, ORDER: "courses_avg"},
					TRANSFORMATIONS: {
						GROUP: ["courses_dept"],
						APPLY: [{
							overallAvg: {
								AVG: "courses_avg"
							}
						}]
					}
				};
				return facade.performQuery(query).then((results) => {
					let expectedResults: any[] = [{courses_dept: "bioc", overallAvg: 88.94},
						{courses_dept: "cpsc", overallAvg: 88.58}];
					expect(results).to.deep.equal(expectedResults);
				});
			});
		});

	});
});
