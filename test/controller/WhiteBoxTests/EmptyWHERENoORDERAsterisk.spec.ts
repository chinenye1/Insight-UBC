// import {
// 	IInsightFacade,
// 	InsightDatasetKind,
// 	InsightResult, NotFoundError,
// 	ResultTooLargeError
// } from "../../../src/controller/IInsightFacade";
// import InsightFacade from "../../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../../TestUtility";
// import {applyTransformationOnEachGroup, makeGroup} from "../../../src/controller/handleQuery/Transformations";
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
// 		// courses = getContentFromArchives("courses.zip");
//
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
// 		it("No WHERE - should return result too large Error", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {},
// 					OPTIONS: {
// 						COLUMNS: columns,
// 						ORDER: "courses_avg"
// 					}
// 				};
// 				return facade.performQuery(query)
// 					.then(() => {
// 						throw new ResultTooLargeError("WHERE is empty in MakeGroupTests.spec.ts");
// 					}).catch((err) => {
// 						expect(err).to.be.instanceof(ResultTooLargeError);
// 					});
// 			});
// 		});
//
// 		it("No - ORDER should make CPSC and BIOC groups", function () {
// 			return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 				let columns: any[] = ["courses_dept", "courses_avg"];
// 				let query = {
// 					WHERE: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
// 					OPTIONS: {
// 						COLUMNS: columns
// 					}
// 				};
// 				return facade.performQuery(query).then((results) => {
// 					expect(results).to.have.deep.members(getAllResults());
// 					expect(results).to.have.same.length(getAllResults().length);
// 				});
// 			});
// 		});
//
// 	});
// });
