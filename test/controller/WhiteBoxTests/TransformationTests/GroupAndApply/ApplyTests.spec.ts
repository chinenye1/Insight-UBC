// import {IInsightFacade, InsightDatasetKind, InsightResult} from "../../../../../src/controller/IInsightFacade";
// import InsightFacade from "../../../../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../../../../TestUtility";
// import {applyTransformationOnEachGroup} from "../../../../../src/controller/handleQuery/Transformations";
// import e from "express";
//
// use(chaiAsPromised);
//
// function getOnlyCPSCResults() {
// 	return [
// 		{courses_avg: 88.47, courses_dept: "cpsc"},
// 		{courses_avg: 88.47, courses_dept: "cpsc"},
// 		{courses_avg: 88.68, courses_dept: "cpsc"},
// 		{courses_avg: 88.68, courses_dept: "cpsc"}
// 	];
// }
//
// function getAllResults() {
// 	return [
// 		{courses_avg: 86.65, courses_dept: "bioc"},
// 		{courses_avg: 86.65, courses_dept: "bioc"},
// 		{courses_avg: 88.17, courses_dept: "bioc"},
// 		{courses_avg: 88.17, courses_dept: "bioc"},
// 		{courses_avg: 88.47, courses_dept: "cpsc"},
// 		{courses_avg: 88.47, courses_dept: "cpsc"},
// 		{courses_avg: 88.68, courses_dept: "cpsc"},
// 		{courses_avg: 88.68, courses_dept: "cpsc"},
// 		{courses_avg: 89.31, courses_dept: "bioc"},
// 		{courses_avg: 89.31, courses_dept: "bioc"},
// 		{courses_avg: 90.25, courses_dept: "bioc"},
// 		{courses_avg: 90.25, courses_dept: "bioc"},
// 		{courses_avg: 90.33, courses_dept: "bioc"},
// 		{courses_avg: 90.33, courses_dept: "bioc"},
// 	];
// }
//
// function getOnlyBioResults() {
// 	return [{courses_avg: 86.65, courses_dept: "bioc"},
// 		{courses_avg: 86.65, courses_dept: "bioc"}, {
// 			courses_avg: 88.17,
// 			courses_dept: "bioc"
// 		},
// 		{courses_avg: 88.17, courses_dept: "bioc"}, {
// 			courses_avg: 89.31,
// 			courses_dept: "bioc"
// 		},
// 		{courses_avg: 89.31, courses_dept: "bioc"}, {
// 			courses_avg: 90.25,
// 			courses_dept: "bioc"
// 		},
// 		{courses_avg: 90.25, courses_dept: "bioc"}, {
// 			courses_avg: 90.33,
// 			courses_dept: "bioc"
// 		},
// 		{courses_avg: 90.33, courses_dept: "bioc"}];
// }
//
// describe("handleORandANDTests", function () {
// 	let courses: string;
// 	let datasetID: string;
//
// 	before(function () {
// 		datasetID = "courses";
// 		courses = getContentFromArchives("notJson2.zip");
// 	});
//
// 	describe("ReturnQueryTests", function () {
// 		let facade: IInsightFacade;
//
// 		beforeEach(function () {
// 			// clear disk first because facade may have loaded from the disk when instantiated
// 			clearDisk();
// 			facade = new InsightFacade();
// 		});
//
// 		it("return the count of the groups", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {NOT: {AND: [{IS: {courses_dept: "bioc"}}]}},
// 					OPTIONS: {
// 						COLUMNS: columns,
// 						ORDER: "courses_avg"
// 					}
// 				};
// 				return facade.performQuery(query).then((results) => {
// 					expect(results).to.deep.equal(getOnlyCPSCResults());
// 					let expectedResults = [{overallCount: 2}];
// 					let transformationsInQuery: any[] = [{overallCount: {COUNT: "courses_avg"}}];
// 					let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
//
// 					expect(applyTransformationOnEachGroup([results], queryAsJSONStr, []))
// 						.to.deep.equal(expectedResults);
// 				});
// 			});
// 		});
//
// 		it("return the min of the groups", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {NOT: {AND: [{IS: {courses_dept: "bioc"}}]}},
// 					OPTIONS: {
// 						COLUMNS: columns,
// 						ORDER: "courses_avg"
// 					}
// 				};
// 				return facade.performQuery(query).then((results) => {
// 					expect(results).to.deep.equal(getOnlyCPSCResults());
// 					let expectedResults = [{overallMin: 88.47}];
// 					let transformationsInQuery: any[] = [{overallMin: {MIN: "courses_avg"}}];
// 					let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
//
// 					expect(applyTransformationOnEachGroup([results], queryAsJSONStr, []))
// 						.to.deep.equal(expectedResults);
// 				});
// 			});
// 		});
//
// 		it("return the max of the groups", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {NOT: {AND: [{IS: {courses_dept: "bioc"}}]}},
// 					OPTIONS: {
// 						COLUMNS: columns,
// 						ORDER: "courses_avg"
// 					}
// 				};
// 				return facade.performQuery(query).then((results) => {
// 					expect(results).to.deep.equal(getOnlyCPSCResults());
// 					let expectedResults = [{overallMax: 88.68}];
// 					let transformationsInQuery: any[] = [{overallMax: {MAX: "courses_avg"}}];
// 					let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
//
// 					expect(applyTransformationOnEachGroup([results], queryAsJSONStr, []))
// 						.to.deep.equal(expectedResults);
// 				});
// 			});
// 		});
//
// 		it("return the sum of the groups", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {NOT: {AND: [{IS: {courses_dept: "bioc"}}]}},
// 					OPTIONS: {
// 						COLUMNS: columns,
// 						ORDER: "courses_avg"
// 					}
// 				};
// 				return facade.performQuery(query).then((results) => {
// 					expect(results).to.deep.equal(getOnlyCPSCResults());
// 					let expectedResults = [{overallSum: 354.3}];
// 					let transformationsInQuery: any[] = [{overallSum: {SUM: "courses_avg"}}];
// 					let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
//
// 					expect(applyTransformationOnEachGroup([results], queryAsJSONStr, []))
// 						.to.deep.equal(expectedResults);
// 				});
// 			});
// 		});
//
// 		it("return the average of the groups", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {NOT: {AND: [{IS: {courses_dept: "bioc"}}]}},
// 					OPTIONS: {
// 						COLUMNS: columns,
// 						ORDER: "courses_avg"
// 					}
// 				};
// 				return facade.performQuery(query).then((results) => {
// 					expect(results).to.deep.equal(getOnlyCPSCResults());
// 					let expectedResults = [{overallAvg: 88.58}];
// 					let transformationsInQuery: any[] = [{
//
// 						overallAvg: {
//
// 							AVG: "courses_avg"
//
// 						}
//
// 					}];
// 					let queryAsJSONStr: any = JSON.stringify(transformationsInQuery);
//
// 					expect(applyTransformationOnEachGroup([results], queryAsJSONStr, []))
// 						.to.deep.equal(expectedResults);
// 				});
// 			});
// 		});
//
// 	});
// });
