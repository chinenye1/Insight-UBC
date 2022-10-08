// import {IInsightFacade, InsightDatasetKind, InsightResult} from "../../../src/controller/IInsightFacade";
// import {
// 	createInsightResultsArray,
// 	handleColumns,
// 	handleKey
// } from "../../../src/controller/handleQuery/ReturnQuery";
// import InsightFacade from "../../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../../TestUtility";
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
// describe("handleORndANDTests", function () {
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
// 		// Todo: test AND (2 kids) OR (1 kid)
// 		// Todo: test OR (2 kids) AND (1 kid)
// 		it("should add sections that meet NOT OR(single) OR (double) AND (double child) each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {
// 							NOT: {
// 								OR: {
// 									AND: [{AND: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
// 										{IS: {courses_dept: "cpsc"}}]
// 								}
// 							}
// 						},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal(getOnlyBioResults());
// 					});
// 				});
// 			});
// 		it("should add sections that meet NOT OR(single) OR(double) AND (double child) each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {
// 							NOT: {
// 								OR: {
// 									OR: [{AND: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]},
// 										{IS: {courses_dept: "cpsc"}}]
// 								}
// 							}
// 						},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal(getOnlyBioResults());
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet NOT OR OR(single) AND (double child) each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {NOT: {OR: {OR: {AND: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]}}}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal(getAllResults());
// 					});
// 				});
// 			});
// 		it("should add sections that meet NOT OR (single) AND (single)AND (double child) each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {NOT: {OR: {AND: {AND: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]}}}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal(getAllResults());
// 					});
// 				});
// 			});
// 		it("should add sections that meet NOT OR (single) AND (double child) each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {NOT: {OR: {AND: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]}}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal(getAllResults());
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet NOT AND (single) OR (double child)",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {NOT: {AND: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]}}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal([]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet AND OR each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {AND: {OR: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal(getAllResults());
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet OR AND each with single children",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let query = {
// 						WHERE: {OR: {AND: [{IS: {courses_dept: "cpsc"}}, {IS: {courses_dept: "bioc"}}]}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal([]);
// 					});
// 				});
// 			});
// 	});
// });
