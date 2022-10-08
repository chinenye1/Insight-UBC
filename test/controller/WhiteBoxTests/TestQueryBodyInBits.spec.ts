// import {IInsightFacade, InsightDatasetKind, InsightResult} from "../../../src/controller/IInsightFacade";
// import {
// 	createInsightResultsArray,
// 	handleColumns,
// 	handleKey
// } from "../../../src/controller/ReturnQuery";
// import InsightFacade from "../../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../../TestUtility";
//
//
// use(chaiAsPromised);
//
// type Input = any;
// type Output = Promise<InsightResult[]>;
// type Error = "InsightError" | "ResultTooLargeError";
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
// 					let isQuery = {LT: {courses_avg: 90}};
// 					let columns: any[] = ["courses_dept", "temp"];
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					expect([{courses_dept: "cpsc"}, {courses_dept: "cpsc"}, {courses_dept: "cpsc"},
// 						{courses_dept: "cpsc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 						{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 						{courses_dept: "bioc"}]).to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
//
// 		it("should add sections that meet NOT LT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {NOT: {LT: {courses_avg: 86.65}}};
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					expect([{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"},
// 						{courses_avg: 86.65, courses_dept: "bioc"},
// 						{courses_avg: 86.65, courses_dept: "bioc"},
// 						{courses_avg: 88.17, courses_dept: "bioc"},
// 						{courses_avg: 88.17, courses_dept: "bioc"},
// 						{courses_avg: 90.33, courses_dept: "bioc"},
// 						{courses_avg: 90.33, courses_dept: "bioc"},
// 						{courses_avg: 90.25, courses_dept: "bioc"},
// 						{courses_avg: 90.25, courses_dept: "bioc"},
// 						{courses_avg: 89.31, courses_dept: "bioc"},
// 						{courses_avg: 89.31, courses_dept: "bioc"}
// 					]).to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
//
// 		it("should add sections that meet NOT GT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {NOT: {GT: {courses_avg: 86.65}}};
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					expect([{courses_avg: 86.65, courses_dept: "bioc"},
// 						{courses_avg: 86.65, courses_dept: "bioc"}
// 					]).to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
// 		it("should add sections that meet GT criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {GT: {courses_avg: 86.65}};
// 					let columns: any[] = ["courses_dept", "`temp`"];
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					expect([{courses_dept: "cpsc"}, {courses_dept: "cpsc"}, {courses_dept: "cpsc"},
// 						{courses_dept: "cpsc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 						{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 						{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"}])
// 						.to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
//
// 		it("should add sections that meet NOT EQ criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {NOT: {EQ: {courses_avg: 86.65}}};
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					expect([{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"},
// 						{courses_avg: 88.17, courses_dept: "bioc"},
// 						{courses_avg: 88.17, courses_dept: "bioc"},
// 						{courses_avg: 90.33, courses_dept: "bioc"},
// 						{courses_avg: 90.33, courses_dept: "bioc"},
// 						{courses_avg: 90.25, courses_dept: "bioc"},
// 						{courses_avg: 90.25, courses_dept: "bioc"},
// 						{courses_avg: 89.31, courses_dept: "bioc"},
// 						{courses_avg: 89.31, courses_dept: "bioc"}
// 					]).to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
//
// 		it("should add sections that meet EQ criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {EQ: {courses_avg: 86.65}};
// 					let columns: any[] = ["courses_dept", "temp"];
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					expect(handleColumns(columns, arrToBeFiltered)).to.deep.equal(
// 						[{courses_dept: "bioc"}, {courses_dept: "bioc"}]);
// 				});
// 			});
//
// 		it("should add sections that meet NOT IS criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {NOT: {IS: {courses_dept: "bioc"}}};
// 					// expect(handleIS(isQuery));
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					console.log("columns: " + columns);
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					console.log("TEST - arrToBeFiltered: " + JSON.stringify(arrToBeFiltered));
// 					expect([{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"}
// 					]).to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
//
// 		it("should add sections that meet IS criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {IS: {courses_dept: "bioc"}};
// 					// expect(handleIS(isQuery));
// 					let columns: any[] = ["courses_dept"];
// 					console.log("columns: " + columns);
// 					let arrToBeChanged: any[] = handleQuery(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					console.log("TEST - arrToBeFiltered: " + JSON.stringify(arrToBeFiltered));
// 					expect(handleColumns(columns, arrToBeFiltered)).to.deep.equal(
// 						[{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}]);
// 				});
// 			});
//
// 		it("should add sections that meet NOT (NOT IS) criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {NOT: {NOT: {IS: {courses_dept: "bioc"}}}};
// 					// expect(handleIS(isQuery));
// 					let columns: any[] = ["courses_dept"];
// 					console.log("columns: " + columns);
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					console.log("TEST - arrToBeFiltered: " + JSON.stringify(arrToBeFiltered));
// 					expect(handleColumns(columns, arrToBeFiltered)).to.deep.equal(
// 						[{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}, {courses_dept: "bioc"}, {courses_dept: "bioc"},
// 							{courses_dept: "bioc"}]);
// 				});
// 			});
//
// 		it("should add sections that meet NOT( NOT (NOT IS)) IS criteria to the filteredResultsArray, and keep columns",
// 			function () {
// 				return facade.addDataset(datasetID, courses, InsightDatasetKind.Courses).then(() => {
// 					let isQuery = {NOT: {NOT: {NOT: {IS: {courses_dept: "bioc"}}}}};
// 					// expect(handleIS(isQuery));
// 					let columns: any[] = ["courses_dept", "courses_avg"];
// 					console.log("columns: " + columns);
// 					let arrToBeChanged: any[] = handleKey(isQuery);
// 					let arrToBeFiltered: any[] = createInsightResultsArray(datasetID, arrToBeChanged);
// 					console.log("TEST - arrToBeFiltered: " + JSON.stringify(arrToBeFiltered));
// 					expect([{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.47, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"},
// 						{courses_avg: 88.68, courses_dept: "cpsc"}
// 					]).to.deep.equal(handleColumns(columns, arrToBeFiltered));
// 				});
// 			});
// 	});
// });
