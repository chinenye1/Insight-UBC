import * as fs from "fs-extra";
import JSZip, {JSZipObject} from "jszip";
import {InsightError, InsightResult} from "../IInsightFacade";
import parse5 from "parse5";
import http from "http";

const persistDir = "./data";
let promise1: any[] = [];
let p1: any;
let tbody: any[] = [];
let trArr: any[] = [];
let tdArr: any[] = [];
let tdArr2: string[] = [];

let buildingArr: any[] = [];
let headArr: any[] = [];
let tbody2: any[] = [];
let trArr2: any[] = [];
let roomList: any[] = [];
let linkArr: any[] = [];
let buildName: any[] = [];
let sectionArr: any[] = [];
let fullName: any = "";
let address: any = "";
let roomExistsArr: any[] = [];
let geo: any = "";

const mapOfBuildingsRooms: Map<any, any> = new Map([]);


function checkDatasetHasResultsDir(relativePath: string) {
	if (relativePath.split("/")[0] !== "rooms") { // split the string with / and take first item in array
		return false;
	} else {
		return true;
	}
}

async function checkContentInRooms(content: string): Promise<any> {
	let listOfRooms: string[] = [];
	let zip = new JSZip();
	let promiseArray2: any[] = [];
	let aRelativePath = "";
	const check = await checkContentInIndex(content);
	const thisZip = await zip.loadAsync(content, {base64: true});
	thisZip.forEach(function (relativePath, fileContent) {
		if (!relativePath.includes("index.htm") && checkDatasetHasResultsDir(relativePath)) {
			if (fileContent.dir !== true) {
				promiseArray2.push(fileContent.async("string"));
				aRelativePath = relativePath;
			}
		}
	});
	const fileDatas = await Promise.all(promiseArray2);
	for (let file of fileDatas) {
		let parsedHTML: any = parse5.parse(file);
		buildingArr.push(parsedHTML);
	}
	for await (let el of buildingArr) {
		clearArrays2();
		let childNodes1: any = el.childNodes;
		findFileName(childNodes1);
		for (let mynode of childNodes1) {
			let nodeToLookFor: string = "tbody";
			let node = findSpecificNode(listOfRooms, mynode, nodeToLookFor);
			if (node != null) {
				tbody2.push(node);
			}
		}
		tbody2Handle();
		findMoreInfo(childNodes1);
		let modifyAddress = address.replaceAll(" ","%20");
		let getGeoLink = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team";
		let link =  getGeoLink + "593/" + modifyAddress;
		const geo1 = await handGeo(link);
		geo = geo1;
		for (let el3 in trArr2) {
			let roomEl = roomContentStringer(trArr2[el3]);
			roomList.push(roomEl);
		}
		if (tdArr2.includes(buildName[0]) && roomExistsArr.length > 0) {
			mapOfBuildingsRooms.set(buildName[0], roomList);
		}
	}
	// console.log(mapOfBuildingsRooms);
	clearArrays();
	return mapOfBuildingsRooms;
}

function clearArrays2(){
	tbody2 = [];
	trArr2 = [];
	roomList = [];
	roomExistsArr = [];
}

function clearArrays(){
	tbody = [];
	trArr = [];
	tdArr = [];
	tdArr2 = [];
	buildingArr = [];
	headArr = [];
	tbody2 = [];
	trArr2 = [];
	roomList = [];
	linkArr = [];
	buildName = [];
	sectionArr = [];
	fullName = "";
	address = "";
	roomExistsArr = [];
	geo = "";
}

function tbody2Handle(): any {
	let listOfRooms: string[] = [];
	for (let el2 in tbody2) {
		let tbody2Child = tbody2[el2].childNodes;
		for (let mynode2 in tbody2Child) {
			let nodeToLookFor2: string = "tr";
			let node2 = findSpecificNode(listOfRooms, tbody2Child[mynode2], nodeToLookFor2);
			if (node2 != null) {
				trArr2.push(node2);
			}
		}
	}
}

function findMoreInfo(childNodes1: any): any{
	sectionArr = [];
	fullName = "";
	address = "";
	let listOfRooms: string[] = [];
	for (let mynode of childNodes1) {
		let nodeToLookFor: string = "h1";
		let node = findSpecificNode(listOfRooms, mynode, nodeToLookFor);
		if (node != null){
			sectionArr.push(node.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1].childNodes[1]);
		}
	}
	for (let el of sectionArr) {
		let insightResults: InsightResult = {};
		fullName = el.childNodes[1].childNodes[0].childNodes[0].value;
		insightResults["fullName"] = fullName;
		address = el.childNodes[3].childNodes[0].childNodes[0].value;
		insightResults["address"] = address;
		return insightResults;
	}

}

function findFileName(childNodes1: any): any {
	headArr = [];
	linkArr = [];
	buildName = [];
	let listOfRooms: string[] = [];
	for (let mynode of childNodes1) {
		let nodeToLookFor: string = "head";
		let node = findSpecificNode(listOfRooms, mynode, nodeToLookFor);
		if (node != null) {
			headArr.push(node);
		}
	}
	for (let el in headArr) {
		let headChild = headArr[el].childNodes;
		for (let myNode in headChild) {
			if (headChild[myNode].nodeName === "link" && linkArr.length < 2) {
				linkArr.push(headChild[myNode]);
			}
		}
	}
	buildName.push(linkArr[1].attrs[1].value);
}

function roomContentStringer(roomContent: any): InsightResult{
	let insightResults: InsightResult = {};
	let nodeStr0 =  roomContent.childNodes[1].childNodes[1].childNodes[0].value.toString().trim();
	insightResults["number"] = nodeStr0;
	let nodeStr1 = parseInt(roomContent.childNodes[3].childNodes[0].value.toString().trim(),10);
	insightResults["seats"] = nodeStr1;
	let nodeStr2 = roomContent.childNodes[5].childNodes[0].value.toString().trim();
	insightResults["furniture"] = nodeStr2;
	let nodeStr3 = roomContent.childNodes[7].childNodes[0].value.toString().trim();
	insightResults["type"] = nodeStr3;
	let nodeStr4 = roomContent.childNodes[1].childNodes[1].attrs[0].value.toString();
	insightResults["href"] = nodeStr4;
	insightResults["fullname"] = fullName;
	insightResults["address"] = address;
	insightResults["lat"] = Number(JSON.stringify(geo.lat));
	insightResults["lon"] = Number(JSON.stringify(geo.lon));
	let nodeStr5 = nodeStr4.split("/").slice(-1)[0].replace("-","_");
	insightResults["name"] = nodeStr5;
	insightResults["shortname"] = nodeStr5.split("_")[0];
	roomExistsArr.push(nodeStr0);
	return insightResults;
}


function checkContentInIndex(content: string): Promise<string[]> {
	let listOfRooms: string[] = [];
	let zip = new JSZip();
	let promiseArray: any[] = [];
	let aRelativePath = "";

	return zip.loadAsync(content, {base64: true})
		.then(function (thisZip) {
			thisZip.forEach(function (relativePath, fileContent) {
				if (relativePath.includes("index.htm")) {
					promiseArray.push(fileContent.async("string"));
					aRelativePath = relativePath;
				}
			});
			Promise.all(promiseArray).then((fileDatas: string[]) => {
				let parsedHTML: any = parse5.parse(fileDatas[0]);
				let childNodes: any = parsedHTML.childNodes;
				for (let mynode of childNodes) {
					let nodeToLookFor: string = "tbody";
					let node = findSpecificNode(listOfRooms, mynode, nodeToLookFor);
					if (node !== null) {
						tbody.push(node);
					}
				}
				let childNode2 = tbody[0].childNodes;
				for (let myNode2 of childNode2) {
					let nodeToLookFor2: string = "tr";
					let node2 = findSpecificNode(listOfRooms, myNode2, nodeToLookFor2);
					if (node2 !== null) {
						trArr.push(node2);
					}
				}
				for (let index in trArr) {
					tdArr.push(trArr[index].childNodes[3].childNodes[0]);
				} // https://www.techiedelight.com/remove-whitespaces-string-javascript/#:~:text=Using%20Split()%20with%20Join()%20method&text=Download%20Run%20Code-,To%20remove%20all%20whitespace%20characters,string%2C%20use%20%5Cs%20instead.&text=That's%20all%20about%20removing%20all%20whitespace%20from%20a%20string%20in%20JavaScript.
				clearSpaces(tdArr);
				return [];
			});
			return listOfRooms;
		});
}

function handGeo(url: string): Promise<any> {
	return new Promise((resolve,reject) =>{
		http.get(url, (res) => {
			res.setEncoding("utf8");
			let rawData = "";
			res.on("data", (chunk) => {
				rawData += chunk;
			});
			res.on("end", () => {
				try {
					const parsedData = JSON.parse(rawData);
					return resolve(parsedData);
				} catch (e: any) {
					return reject(e);
				}
			});
		}).on("error", (e) => {
			return reject(e);
		});
	});
}

function clearSpaces(strArr: string[]): any { // https://www.techiedelight.com/remove-whitespaces-string-javascript/#:~:text=Using%20Split()%20with%20Join()%20method&text=Download%20Run%20Code-,To%20remove%20all%20whitespace%20characters,string%2C%20use%20%5Cs%20instead.&text=That's%20all%20about%20removing%20all%20whitespace%20from%20a%20string%20in%20JavaScript.
	for (let el in strArr) {
		const str = tdArr[el].value.toString();
		let strReplace = str.replace(/\n/g, "");
		let building = strReplace.replace(/ /g, "");
		tdArr2.push(building);
	}
}

// credit - tree traversal strategy gotten from: https://stackoverflow.com/questions/38967039/finding-a-specific-element-in-an-arbitrary-tree
function findSpecificNode(listOfRooms: string[], rootNode: any, nodeName: string): any {
	if (rootNode.nodeName === nodeName) {
		return rootNode;
	}
	let countIndex: number = 0;
	let childNodes: any = rootNode.childNodes;
	if (rootNode.childNodes === undefined) {
		return null;
	}
	for (let node of childNodes) {
		let foundNode: any = findSpecificNode(listOfRooms, node, nodeName);
		if (foundNode !== null) {
			return foundNode;
		}
		countIndex++;
	}
	return null;
}

export {
	checkContentInIndex, checkContentInRooms, mapOfBuildingsRooms
};
