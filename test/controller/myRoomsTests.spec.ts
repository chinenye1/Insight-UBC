// import {
// 	IInsightFacade, InsightDatasetKind,
// 	InsightResult,
// } from "../../src/controller/IInsightFacade";
// import InsightFacade from "../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../TestUtility";
// import {
// 	checkContentInIndex,
// 	checkContentInRooms,
// 	handGeo
// } from "../../src/controller/validating/ValidateRooms";
// const http = require("http");
//
//
// use(chaiAsPromised);
//
// describe("InsightFacade", function () {
// 	let query: IInsightFacade = new InsightFacade();
// 	let rooms: string;
// 	let url: string = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team593/6398%20University%20Boulevard";
// 	rooms = getContentFromArchives("rooms.zip");
// 	//
// 	// before(function () {
// 	// 	// let myDataset = new Datasets();
// 	// 	rooms = getContentFromArchives("courses.zip");
// 	// 	query = new InsightFacade();
// 	// 	return query.addDataset("courses", rooms, InsightDatasetKind.Courses);
// 	// });
//
// 	// describe("Add Datasets", function () {
// 	// 	// let facade: IInsightFacade;
// 	// 	it("checks for validity of checkWholeQuery", function () {
// 	// 		expect(query.performQuery({
// 	// 			WHERE: {
// 	// 				OR: [
// 	// 					{
// 	// 						AND: [
// 	// 							{
// 	// 								IS: {
// 	// 									courses_dept: "adhe"
// 	// 								}
// 	// 							}
// 	// 						]
// 	// 					},
// 	// 					{
// 	// 						EQ: {
// 	// 							courses_avg: 95
// 	// 						}
// 	// 					}
// 	// 				]
// 	// 			},
// 	// 			OPTIONS: {
// 	// 				COLUMNS: [
// 	// 					"courses_dept",
// 	// 					"courses_id",
// 	// 					"courses_avg",
// 	// 					"maxSeats"
// 	// 				],
// 	// 				ORDER: {
// 	// 					dir: "DOWN",
// 	// 					keys: ["maxSeats"]
// 	// 				}
// 	// 			}
// 	// 		})).to.equal(true);
// 	// 	});
// 	// });
//
// 	// Promise.all(promiseArray).then((fileDatas: string[]) => {
// 	// 	for (let file of fileDatas) {
// 	// 		let parsedHTML: any = parse5.parse(file);
// 	// 		let childNodes: any = parsedHTML.childNodes;
// 	// 		for (let mynode of childNodes) {
// 	// 			console.log("childNode: " + mynode.nodeName);
// 	// 			// console.log("And it's children are: ");
// 	// 			// for (let myNodeChild of mynode.childNodes) {
// 	// 			// 	console.log("myNodeChild: " + myNodeChild.nodeName);
// 	// 			// 	if (myNodeChild.nodeName === "body") {
// 	// 			// 		console.log("found body: " + (myNodeChild.nodeName === "body"));
// 	// 			// 	}
// 	// 			// }
// 	// 			// console.log("parsedHTML.childNodes[0].nodeName: " + parsedHTML.childNodes[0].nodeName);
// 	// 			let nodeToLookFor: string = "body";
// 	// 			let node: any = findSpecificNode(listOfRooms, mynode, nodeToLookFor);
// 	// 			console.log("node that was found: " + node.nodeName);
// 	// 		}
// 	// 	}
// 	// 	return [];
// 	// });
//
// 	describe("validate HTML", function () {
// 		let facade: IInsightFacade;
// 		// it("checks HTML", function () {
// 		// 	expect(checkContentIsValidHTML(rooms));
// 		// });
//
// 		it("checks HTML", function () {
// 			checkContentInIndex(rooms);
// 			expect(checkContentInRooms(rooms));
// 			// let testStr: string;
// 			// return checkContentInIndex(rooms).then(() => {
// 			// 	checkContentInRooms(rooms).then((res) => {
// 			// 		expect(res);
// 			// 	});
// 			// });
// 		});
// 		it("checks HTML2", function () {
// 			expect(handGeo(url));
// 			// let testStr: string;
// 			// return checkContentInIndex(rooms).then(() => {
// 			// 	checkContentInRooms(rooms).then((res) => {
// 			// 		expect(res);
// 			// 	});
// 			// });
// 		});
//
// 	});
// });
//
//
// //  import {
// // 	IInsightFacade,
// // 	InsightDatasetKind,
// // 	InsightError,
// // 	InsightResult,
// // 	NotFoundError,
// // 	ResultTooLargeError
// // } from "../../src/controller/IInsightFacade";
// // import InsightFacade from "../../src/controller/InsightFacade";
// // import {expect, use} from "chai";
// // import chaiAsPromised from "chai-as-promised";
// // import {clearDisk, getContentFromArchives} from "../TestUtility";
// // import {folderTest} from "@ubccpsc310/folder-test";
// // import {getListOfRoomsInBuilding} from "../../src/controller/HandleRoomsDataset";
// // import * as fs from "fs-extra";
// //
// // use(chaiAsPromised);
// //
// // type Input = any;
// // type Output = Promise<InsightResult[]>;
// // type Error = "InsightError" | "ResultTooLargeError";
// //
// // describe("InsightFacade", function () {
// // 	let rooms: string;
// //
// // 	before(function () {
// //
// // 		rooms = fs.readFileSync("test/resources/archives/rooms.zip").toString("base64");
// // 		// rooms = getContentFromArchives("notJson2.zip");
// //
// // 	});
// //
// // 	describe("getting list of rooms", function (){
// // 		it("should list all the rooms in the table of rooms", function (){
// // 			expect(getListOfRoomsInBuilding(rooms));
// // 		});
// // 	});
// // });
