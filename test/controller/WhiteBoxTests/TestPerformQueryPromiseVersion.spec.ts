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
//
// use(chaiAsPromised);
//
// describe("InsightFacade", function () {
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
// 		it("should add sections that meet LT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept"];
// 					let query = {
// 						WHERE: {LT: {courses_avg: 90}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(query).then((results) => {
// 						expect(results).to.deep.equal([{courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "cpsc"},
// 							{courses_dept: "cpsc"}, {courses_dept: "cpsc"}, {courses_dept: "cpsc"}]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet NOT LT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let isQuery = {
// 						WHERE: {NOT: {LT: {courses_avg: 86.65}}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal([
// 							{courses_avg: 86.65, courses_dept: "bioc"},
// 							{courses_avg: 86.65, courses_dept: "bioc"},
// 							{courses_avg: 88.17, courses_dept: "bioc"},
// 							{courses_avg: 88.17, courses_dept: "bioc"},
// 							{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.68, courses_dept: "cpsc"},
// 							{courses_avg: 88.68, courses_dept: "cpsc"},
// 							{courses_avg: 89.31, courses_dept: "bioc"},
// 							{courses_avg: 89.31, courses_dept: "bioc"},
// 							{courses_avg: 90.25, courses_dept: "bioc"},
// 							{courses_avg: 90.25, courses_dept: "bioc"},
// 							{courses_avg: 90.33, courses_dept: "bioc"},
// 							{courses_avg: 90.33, courses_dept: "bioc"},
// 						]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet NOT GT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let isQuery = {
// 						WHERE: {NOT: {GT: {courses_avg: 86.65}}},
// 						OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_dept"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal([{courses_avg: 86.65, courses_dept: "bioc"},
// 							{courses_avg: 86.65, courses_dept: "bioc"}
// 						]);
// 					});
// 				});
// 			});
// 		it("should add sections that meet GT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept"];
// 					let isQuery = {
// 						WHERE: {GT: {courses_avg: 86.65}}, OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_dept"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal([{courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "cpsc"}, {courses_dept: "cpsc"}, {courses_dept: "cpsc"},
// 							{courses_dept: "cpsc"}]);
// 					});
// 				});
// 			});
// 		it("should add sections that meet NOT EQ criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let isQuery = {
// 						WHERE: {NOT: {EQ: {courses_avg: 86.65}}}, OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal([
// 							{courses_avg: 88.17, courses_dept: "bioc"},
// 							{courses_avg: 88.17, courses_dept: "bioc"},
// 							{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.68, courses_dept: "cpsc"},
// 							{courses_avg: 88.68, courses_dept: "cpsc"},
// 							{courses_avg: 89.31, courses_dept: "bioc"},
// 							{courses_avg: 89.31, courses_dept: "bioc"},
// 							{courses_avg: 90.25, courses_dept: "bioc"},
// 							{courses_avg: 90.25, courses_dept: "bioc"},
// 							{courses_avg: 90.33, courses_dept: "bioc"},
// 							{courses_avg: 90.33, courses_dept: "bioc"}
// 						]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet EQ - Promise criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "temp"];
// 					let isQuery = {
// 						WHERE: {EQ: {courses_avg: 86.65}}, OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_dept"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal(
// 							[{courses_dept: "bioc"}, {courses_dept: "bioc"}]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet IS - promise criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					// expect(handleIS(isQuery));
// 					let columns: any[] = ["courses_dept"];
// 					let isQuery = {
// 						WHERE: {IS: {courses_dept: "bioc"}}, OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_dept"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal(
// 							[{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 								{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 								{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 								{courses_dept: "bioc"}]);
// 					});
//
// 				});
// 			});
//
// 		it("should add sections that meet NOT IS - promise  criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					// expect(handleIS(isQuery));
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let isQuery = {
// 						WHERE: {NOT: {IS: {courses_dept: "bioc"}}}, OPTIONS: {
// 							COLUMNS: columns,
// 							ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal([
// 							{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.68, courses_dept: "cpsc"},
// 							{courses_avg: 88.68, courses_dept: "cpsc"}
//
// 						]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet NOT (NOT IS) criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept"];
// 					let isQuery = {
// 						WHERE: {NOT: {NOT: {IS: {courses_dept: "bioc"}}}}, OPTIONS: {
// 							COLUMNS: columns, ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal(
// 							[{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 								{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 								{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 								{courses_dept: "bioc"}]);
// 					});
// 				});
// 			});
//
// 		it("should add sections that meet NOT( NOT (NOT IS)) IS - promise criteria to the filteredResultsArray",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let isQuery = {
// 						WHERE: {NOT: {NOT: {NOT: {IS: {courses_dept: "bioc"}}}}},
// 						OPTIONS: {
// 							COLUMNS: columns, ORDER: "courses_avg"
// 						}
// 					};
// 					return facade.performQuery(isQuery).then((results) => {
// 						expect(results).to.deep.equal([{courses_avg: 88.47, courses_dept: "cpsc"},
// 							{courses_avg: 88.47, courses_dept: "cpsc"}, {
// 								courses_avg: 88.68,
// 								courses_dept: "cpsc"
// 							},
// 							{courses_avg: 88.68, courses_dept: "cpsc"}]);
// 					});
// 				});
// 			});
// 	});
// });
