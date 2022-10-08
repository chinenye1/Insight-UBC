// import {
// 	IInsightFacade, InsightDatasetKind,
//
// 	InsightResult,
//
// } from "../../../src/controller/IInsightFacade";
// import InsightFacade from "../../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../../TestUtility";
// import {Datasets} from "../../../src/controller/datasets/Datasets";
// import {checkWholeQuery, handleOptions} from "../../../src/controller/validating/ValidateEBNF2";
// import {performance} from "perf_hooks";
// import {
// 	checkContentInIndex,
// 	checkContentInRooms
// } from "../../../src/controller/validating/ValidateRooms";
//
//
// use(chaiAsPromised);
//
// describe("InsightFacade", function () {
// 	let query: IInsightFacade = new InsightFacade();
// 	let rooms: string;
// 	rooms = getContentFromArchives("rooms.zip");
//
//
// 	describe("validate HTML", function () {
// 		let facade: IInsightFacade;
// 		// it("checks HTML", function () {
// 		// 	expect(checkContentIsValidHTML(rooms));
// 		// });
//
// 		it("checks HTML", async function () {
// 			await checkContentInIndex(rooms);
// 			await checkContentInRooms(rooms);
// 		});
// 	});
// });
