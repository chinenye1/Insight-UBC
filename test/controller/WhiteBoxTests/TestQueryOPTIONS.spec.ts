// import {IInsightFacade, InsightDatasetKind, InsightResult} from "../../../src/controller/IInsightFacade";
// import {
// 	createInsightResultsArray,
// 	handleColumns,
// 	handleSimpleOrder,
// } from "../../../src/controller/handleQuery/ReturnQuery";
// import InsightFacade from "../../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../../TestUtility";
//
//
// use(chaiAsPromised);
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
// 		it("should create Insight results array from dataset sections given ", function () {
// 			// let columns: any[] = ["courses_dept"];
// 			let id: string = "courses";
// 			let arrToBChanged: any[] = [{Subject: "epse", Avg: 97.09},
// 				{Subject: "math", Avg: 97.25},
// 				{Subject: "math", Avg: 97.25},];
// 			expect(createInsightResultsArray(id, "", arrToBChanged)).to.deep.equal(
// 				[{courses_dept: "epse", courses_avg: 97.09},
// 					{courses_dept: "math", courses_avg: 97.25},
// 					{courses_dept: "math", courses_avg: 97.25},]);
// 		});
//
// 		it("should create Insight results array from dataset, then filter columns", function () {
// 			// let columns: any[] = ["courses_dept"];
// 			let id: string = "courses";
// 			let columns: any[] = ["courses_dept"];
// 			let arrToBChanged: any[] = [{Subject: "epse", Avg: 97.09},
// 				{Subject: "math", Avg: 97.25},
// 				{Subject: "math", Avg: 97.25},];
// 			let insightResults: InsightResult[] = createInsightResultsArray(id, "",arrToBChanged);
// 			// console.log("insightResults: " + JSON.stringify(insightResults));
// 			expect(insightResults).to.deep.equal(
// 				[{courses_dept: "epse", courses_avg: 97.09},
// 					{courses_dept: "math", courses_avg: 97.25},
// 					{courses_dept: "math", courses_avg: 97.25},]);
// 			expect(handleColumns(columns, insightResults, false)).to.deep.equal(
// 				[{courses_dept: "epse"},
// 					{courses_dept: "math"},
// 					{courses_dept: "math"}]);
// 		});
//
// 		it("should only keep selected columns", function () {
// 			let columns: any[] = ["courses_dept"];
// 			let arrToBeFiltered: any[] = [{courses_dept: "epse", courses_avg: 97.09},
// 				{courses_dept: "math", courses_avg: 97.25},
// 				{courses_dept: "math", courses_avg: 97.25},];
// 			expect(handleColumns(columns, arrToBeFiltered, false)).to.deep.equal(
// 				[{courses_dept: "epse"},
// 					{courses_dept: "math"},
// 					{courses_dept: "math"}]);
// 		});
// 		it("should sort the given columns", function () {
// 			let order: string = "courses_avg";
// 			let arrToBeFiltered: any[] = [{courses_dept: "epse", courses_avg: 97.09},
// 				{courses_dept: "math", courses_avg: 100},
// 				{courses_dept: "math", courses_avg: 97.25},];
// 			expect(handleSimpleOrder(order, arrToBeFiltered)).to.deep.equal(
// 				[{courses_dept: "epse", courses_avg: 97.09},
// 					{courses_dept: "math", courses_avg: 97.25},
// 					{courses_dept: "math", courses_avg: 100},]);
// 		});
// 		it("handleOrder should sort strings", function () {
// 			let order: string = "courses_dept";
// 			let arrToBeSorted: any[] = [{courses_dept: "epse"},
// 				{courses_dept: "math"},
// 				{courses_dept: "fmst"}];
// 			expect(handleSimpleOrder(order, arrToBeSorted)).to.deep.equal(
// 				[{courses_dept: "epse"},
// 					{courses_dept: "fmst"},
// 					{courses_dept: "math"}]);
// 		});
// 		it("should sort the returned columns from handleColumns", function () {
// 			let order: string = "courses_dept";
// 			let columns: any[] = ["courses_dept"];
// 			let arrToBeFiltered: any[] = [{courses_dept: "epse", courses_avg: 97.09},
// 				{courses_dept: "zool", courses_avg: 97.25},
// 				{courses_dept: "math", courses_avg: 97.25},];
// 			let arrToBeSorted: any[] = handleColumns(columns, arrToBeFiltered, false);
// 			expect(handleSimpleOrder(order, arrToBeSorted)).to.deep.equal(
// 				[{courses_dept: "epse"},
// 					{courses_dept: "math"},
// 					{courses_dept: "zool"}]);
// 		});
// 		// it("should filter and sort sections given to handleOptions", function () {
// 		// 	let inputJson: any = {
// 		// 		COLUMNS: ["courses_dept"],
// 		// 		ORDER: "courses_dept"
// 		// 	};
// 		// 	let columns: any[] = ["courses_dept"];
// 		// 	let arrToBeFiltered: any[] = [{courses_dept: "epse", courses_avg: 97.09},
// 		// 		{courses_dept: "zool", courses_avg: 97.25},
// 		// 		{courses_dept: "math", courses_avg: 97.25},];
// 		// 	let result = handleOptions(inputJson, arrToBeFiltered);
// 		// 	expect(result).to.deep.equal(
// 		// 		[{courses_dept: "epse"},
// 		// 			{courses_dept: "math"},
// 		// 			{courses_dept: "zool"}]);
// 		// });
//
//
// 	});
// });
