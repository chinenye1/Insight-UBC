// import {
// 	IInsightFacade,
// 	InsightDatasetKind,
// 	InsightError,
// 	InsightResult,
// 	NotFoundError,
// 	ResultTooLargeError
// } from "../../src/controller/IInsightFacade";
// import InsightFacade from "../../src/controller/InsightFacade";
// import {expect, use} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {clearDisk, getContentFromArchives} from "../TestUtility";
// import {folderTest} from "@ubccpsc310/folder-test";
//
// use(chaiAsPromised);
//
// type Input = any;
// type Output = Promise<InsightResult[]>;
// type Error = "InsightError" | "ResultTooLargeError";
//
// describe("InsightFacade", function () {
// 	let rooms: string;
//
// 	before(function () {
//
// 		rooms = getContentFromArchives("rooms.zip");
// 		// rooms = getContentFromArchives("notJson2.zip");
//
// 	});
//
// 	describe("performQuery", function () {
// 		let query: IInsightFacade = new InsightFacade();
//
// 		before(function () {
// 			// clear disk first because facade may have loaded from the disk from other tests
// 			clearDisk();
// 			query = new InsightFacade();
// 			return query.addDataset("rooms", rooms, InsightDatasetKind.Rooms);
// 		});
//
// 		// Assert value equals expected
// 		function assertResult(actual: any, expected: Awaited<Output>): void {
// 			expect(actual).to.deep.equal(expected);
// 		}
//
// 		// Assert actual error is of expected type
// 		function assertError(actual: any, expected: Error): void {
// 			if (expected === "InsightError") {
// 				expect(actual).to.be.an.instanceOf(InsightError);
// 			} else {
// 				expect(actual).to.be.an.instanceOf(ResultTooLargeError);
// 			}
// 		}
//
// 		folderTest<Input, Output, Error>(
// 			"performQuery Dynamic tests",
// 			(input: Input): Output => {
// 				return query.performQuery(input);
// 			},
// 			"./test/resources/queries-rooms", // Jan26 - DL changed from 'json' to 'queries'
// 			{
// 				assertOnResult: assertResult,
// 				assertOnError: assertError,
// 			}
// 		);
// 	});
//
// 	describe("Remove Datasets", function () {
// 		let facade: IInsightFacade;
//
// 		beforeEach(function () {
// 			// clear disk first because facade may have loaded from the disk when instantiated
// 			clearDisk();
// 			facade = new InsightFacade();
// 		});
//
// 		it("should error if removing dataset with valid id when no dataset added", function () {
// 			return facade.removeDataset(" rooms")
// 				.then(() => {
// 					throw new NotFoundError("removeDataset called when no dataset added");
// 				}).catch((err) => {
// 					expect(err).to.be.instanceof(NotFoundError);
// 				});
// 		});
//
// 		it(	"should not remove a dataset with no id provided, when valid dataset added", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then(() => {
// 					return facade.removeDataset("")
// 						.then((id) => {
// 							expect(id).to.equal("");
// 							throw new InsightError("no id was provided to remove a dataset");
// 						}).catch((err) => {
// 							expect(err).to.be.instanceof(InsightError);
// 						});
// 				});
//
// 		});
//
// 		it("should error if removing dataset with underscore in id when no dataset added", function () {
// 			return facade.removeDataset("courses_1")
// 				.then(() => {
// 					throw new InsightError("removeDataset called with dataset id containing an underscore");
// 				}).catch((err) => {
// 					expect(err).to.be.instanceof(InsightError);
// 				});
// 		});
//
// 		it("should error if removing dataset given id with only whitespace characters when no dataset added",
// 			function () {
// 				return facade.removeDataset("  ")
// 					.then(() => {
// 						throw new InsightError("removeDataset called with only whitespace characters in id");
// 					}).catch((err) => {
// 						expect(err).to.be.instanceof(InsightError);
// 					});
// 			});
//
// 		it("should error if removing dataset with underscore in id when a dataset exists", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((ids) => {
// 					expect(ids).to.be.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					return facade.removeDataset("courses_");
// 				})
// 				.then(() => {
// 					throw new InsightError("Can't remove dataset given invalid id");
// 				})
// 				.catch((err) => {
// 					expect(err).to.be.instanceof(InsightError);
// 				});
// 		});
//
// 		it("should error if removing dataset given id with only whitespace characters when a dataset exists",
// 			function () {
// 				return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 					.then((ids) => {
// 						expect(ids).to.be.instanceof(Array);
// 						expect(ids).to.have.length(1);
// 						return facade.removeDataset("  ");
// 					})
// 					.then(() => {
// 						throw new InsightError("Can't remove dataset given invalid id");
// 					})
// 					.catch((err) => {
// 						expect(err).to.be.instanceof(InsightError);
// 					});
// 			});
//
// 		it("should error if removing dataset with valid id that doesn't exist", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((ids) => {
// 					expect(ids).to.be.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					return facade.removeDataset("courses1");
// 				})
// 				.then(() => {
// 					throw new NotFoundError("Can't dataset with given id");
// 				})
// 				.catch((err) => {
// 					expect(err).to.be.instanceof(NotFoundError);
// 				});
// 		});
//
// 		// manually test this one by returning "rooms"
// 		it("should remove one dataset given valid id", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((ids) => {
// 					expect(ids).to.be.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					expect(ids).to.deep.equal(["rooms"]);
// 					return facade.removeDataset("rooms");
// 				}).then((id) => {
// 					expect(id).to.equal("rooms");
// 				});
// 		});
//
// 		it("should remove multiple valid datasets", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((ids) => {
// 					expect(ids).to.be.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					expect(ids[0]).to.equal("rooms");
// 					return facade.addDataset("courses2", rooms, InsightDatasetKind.Rooms);
// 				}).then((ids2) => {
// 					expect(ids2).to.be.instanceof(Array);
// 					expect(ids2).to.have.length(2);
// 					expect(ids2).to.contain("rooms");
// 					expect(ids2).to.contain("courses2");
// 					return facade.removeDataset("rooms");
// 				}).then((id) => {
// 					expect(id).to.equal("rooms");
// 					return facade.removeDataset("courses2");
// 				}).then((id2) => {
// 					expect(id2).to.equal("courses2");
// 				});
//
// 		});
//
// 		it("should add, then remove, then add, then remove valid datasets", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((ids) => {
// 					expect(ids).to.be.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					expect(ids[0]).to.equal("rooms");
// 					return facade.removeDataset("rooms");
// 				}).then((id) => {
// 					expect(id).to.equal("rooms");
// 					return facade.addDataset("courses2", rooms, InsightDatasetKind.Rooms);
// 				}).then((ids) => {
// 					expect(ids).to.be.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					expect(ids[0]).to.equal("courses2");
// 					return facade.removeDataset("courses2");
// 				}).then((id) => {
// 					expect(id).to.equal("courses2");
// 				});
// 		});
// 	});
//
// 	describe("Add Datasets", function () {
// 		let facade: IInsightFacade;
//
// 		beforeEach(function () {
// 			// clear disk first because facade may have loaded from the disk when instantiated
// 			clearDisk();
// 			facade = new InsightFacade();
// 		});
//
// 		it("should not add a dataset with no id provided", async function () {
// 			try {
// 				let ids = await facade.addDataset("", rooms, InsightDatasetKind.Rooms);
// 				expect(ids).to.be.empty;
// 			} catch (err) {
// 				expect(err).to.be.instanceof(InsightError);
// 			}
// 		});
//
//
// 		it("should add a valid Dataset", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((insightDatasetId) => {
// 					expect(insightDatasetId).to.be.an.instanceof(Array);
// 					expect(insightDatasetId).to.have.length(1);
// 					expect(insightDatasetId).to.deep.equal(["rooms"]);
// 				});
// 		});
//
// 		// it("should not add a dataset with valid id, and InsightDatasetKind.Rooms", async function () {
// 		// 	try {
// 		// 		let ids = await facade.addDataset("rooms", rooms, InsightDatasetKind.Courses);
// 		// 		expect(ids).to.be.empty;
// 		// 	} catch (err) {
// 		// 		expect(err).to.be.instanceof(InsightError);
// 		// 	}
// 		//
// 		// });
//
// 		it("should add multiple valid datasets", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then(() => {
// 					return facade.addDataset("rooms-2", rooms, InsightDatasetKind.Rooms)
// 						.then((ids) => {
// 							expect(ids).to.be.an.instanceof(Array);
// 							expect(ids).to.have.length(2);
// 							expect(ids[0]).to.deep.equal("rooms");
// 							expect(ids[1]).to.deep.equal("rooms-2");
// 						});
// 				});
// 		});
//
// 		it("should not add a Dataset with underscore in id and reject with an InsightError", async function () {
// 			// const result = facade.addDataset("courses_", rooms, InsightDatasetKind.Rooms);
// 			// return expect(result).to.eventually.be.instanceof(InsightError);
// 			try {
// 				await facade.addDataset("courses_", rooms, InsightDatasetKind.Rooms);
// 			} catch (err) {
// 				expect(err).to.be.instanceof(InsightError);
// 			}
// 		});
//
// 		it("should add a valid dataset then reject an invalid one", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((datasetIDs) => {
// 					expect(datasetIDs).to.be.an.instanceof(Array);
// 					expect(datasetIDs).to.have.length(1);
// 					expect(datasetIDs[0]).to.deep.equal("rooms");
// 					return facade.addDataset("courses_1", rooms, InsightDatasetKind.Rooms);
// 				}).then(() => {
// 					throw new InsightError("dataset id contains an underscore");
// 				}).catch((err) => {
// 					expect(err).to.be.instanceof(InsightError);
// 				});
// 		});
//
// 		it("should not add a Dataset with only whitespace characters and reject with an InsightError",
// 			async function () {
// 				// Original test: edited by CO 1/31/2022 - test now more robust
// 				// const result = facade.addDataset(" ", rooms, InsightDatasetKind.Rooms);
// 				// return expect(result).eventually.to.be.rejectedWith(InsightError);
// 				try {
// 					let result = await facade.addDataset("  ", rooms, InsightDatasetKind.Rooms);
// 					expect(result).to.be.deep.equal([]);
// 					// console.log("results: " + result + " is deep equal to expected: " + []);
// 				} catch (err) {
// 					expect(err).to.be.instanceOf(InsightError);
// 					// console.log("caught the error");
// 				}
// 			});
//
// 		it("should not add two datasets with same id and reject with an InsightError", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((ids) => {
// 					expect(ids).to.be.an.instanceof(Array);
// 					expect(ids).to.have.length(1);
// 					expect(ids[0]).to.deep.equal("rooms");
// 					return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 						.then((myIds) => {
// 							expect(myIds).to.be.an.instanceof(Array);
// 							expect(myIds).to.have.length(1);
// 							throw new InsightError("dataset id is duplicated");
// 						})
// 						.catch((err) => {
// 							expect(err).to.be.instanceof(InsightError);
// 						});
// 				}).catch((err) => {
// 					expect(err).to.be.instanceof(InsightError);
// 				});
// 		});
//
// 	// 	// thank you question @128
// 	// 	it("should reject add because invalid dataset, data not in json format", async function () { // Jan26 -DL added this test
// 	// 		let notJson: string;
// 	// 		notJson = getContentFromArchives("notJson.zip");
// 	// 		try {
// 	// 			await facade.addDataset("notJson", notJson, InsightDatasetKind.Rooms);
// 	// 			expect.fail("Should throw InsightError");
// 	// 		} catch (err) {
// 	// 			expect(err).to.be.instanceOf(InsightError);
// 	// 		}
// 	// 	});
// 	//
// 	// 	it("should reject add because invalid dataset, data not in zip format", async function () { // Jan26 -DL added this test
// 	// 		let notZip: string;
// 	// 		notZip = getContentFromArchives("notZip");
// 	// 		try {
// 	// 			await facade.addDataset("notZip", notZip, InsightDatasetKind.Rooms);
// 	// 			expect.fail("Should throw InsightError");
// 	// 		} catch (err) {
// 	// 			expect(err).to.be.instanceOf(InsightError);
// 	// 		}
// 	// 	});
// 	});
//
// 	describe("List Datasets", function () {
// 		let facade: IInsightFacade;
//
// 		beforeEach(function () {
// 			// clear disk first because facade may have loaded from the disk when instantiated
// 			clearDisk();
// 			facade = new InsightFacade();
// 		});
//
// 		it("should list no datasets", function () {
// 			// returns a promise so attach a then to it to get the results from that promise
// 			// insightDatasets is actually the results from the promise
// 			// we return this promise so that mocha waits for the promise to settle before moving on
// 			return facade.listDatasets().then((insightDatasets) => {
// 				expect(insightDatasets).to.be.an.instanceof(Array);
// 				expect(insightDatasets).to.have.length(0);
//
// 				//     //using chai-as-promised
// 				// const futureInsightDatasets = facade.listDatasets();
// 				// // we return the asynchronous result to let mocha know to wait for the results
// 				// return expect(futureInsightDatasets).to.eventually.deep.equal([]);
// 			});
// 		});
//
// 		it("should list one dataset", function () {
// 			// 1. add a dataset
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then((addedIds) => {
// 					return facade.listDatasets();
// 				})      // 2. list datasets again
// 				.then((insightDatasets) => {
// 					expect(insightDatasets).to.deep.equal([{
// 						id: "rooms",
// 						kind: InsightDatasetKind.Rooms,
// 						numRows: 364,
// 					}]);
// 					/**
// 					 * expect(insightDatasets).to.be.an.instanceof(Array);
// 					 * expect(insightDatasets).to.have.length(1);
// 					 * // take the first elem of the array out and compare it
// 					 * const [insData] = insightDatasets;
// 					 *expect(insData).to.have.property("id");
// 					 * expect(insData.id).to.equal("rooms");
// 					 */
// 					// or expect(insightDatasets).to.deep.equal([{
// 					// id: "rooms"
// 					// kind: InsightDatasetKind.Rooms,
// 					// numRows: 64612
// 					// }]);
// 				});
// 		});
//
// 		it("should list multiple datasets", function () {
// 			return facade.addDataset("rooms", rooms, InsightDatasetKind.Rooms)
// 				.then(() => {
// 					return facade.addDataset("rooms-2", rooms, InsightDatasetKind.Rooms);
// 				})
// 				.then(() => {
// 					return facade.listDatasets();
// 				})
// 				.then((insightDatasets) => {
// 					expect(insightDatasets).to.be.an.instanceof(Array);
// 					expect(insightDatasets).to.have.length(2);
// 					let insightDatasetRooms =
// 						insightDatasets.find((dataset) => dataset.id === "rooms");
// 					expect(insightDatasetRooms).to.exist;
// 					expect(insightDatasetRooms).to.deep.equal({
// 						id: "rooms",
// 						kind: InsightDatasetKind.Rooms,
// 						numRows: 364,
// 					});
// 					insightDatasetRooms = insightDatasets.find((dataset) => dataset.id === "rooms-2");
// 					expect(insightDatasetRooms).to.exist;
// 					expect(insightDatasetRooms).to.deep.equal({
// 						id: "rooms-2",
// 						kind: InsightDatasetKind.Rooms,
// 						numRows: 364,
// 					});
// 				});
// 		});
// 		// .then((insightDatasets) => {
// 		//     const expectedDatasets: InsightDataset[] = [
// 		//         {
// 		//             id: "rooms",
// 		//             kind: InsightDatasetKind.Rooms,
// 		//             numRows: 64612,
// 		//         },
// 		//         {
// 		//             id: "rooms-2",
// 		//             kind: InsightDatasetKind.Rooms,
// 		//             numRows: 64612,
// 		//         }
// 		//     ]
// 		//     expect(insightDatasets).to.deep.equal(expectedDatasets);
// 		// });
//
// 	});
// });
