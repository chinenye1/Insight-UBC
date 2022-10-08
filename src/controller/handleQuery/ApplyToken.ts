import Decimal from "decimal.js";

// credit: written as directed by c2 spec
function handleAVG(group: any[], keyToSearchFor: string): number{
	let total = new Decimal(0);
	let avg = 0;
	for (let section of group){
		let quantity = section[keyToSearchFor];
		let decValue = new Decimal(quantity);
		total = total.add(decValue);
	}
	avg = total.toNumber() / group.length;
	return Number(avg.toFixed(2));
}

// credit: written as directed by c2 spec
function handleSum(group: any[], keyToSearchFor: string): number{
	let sum = 0;
	for (let section of group){
		let quantity = section[keyToSearchFor];
		sum += quantity;
	}
	sum = Number(sum.toFixed(2));
	return sum;
}

function handleCount(group: any[], keyToSearchFor: string): number{
	let setOfUniqueOccurrences: Set<number> = new Set<number>();
	for (let section of group){
		let quantity = section[keyToSearchFor];
		setOfUniqueOccurrences.add(quantity);
	}
	return setOfUniqueOccurrences.size;
}

function handleMax(group: any[], keyToSearchFor: string): number{
	let max = Number.MIN_VALUE;
	for (let section of group){
		let quantity = section[keyToSearchFor];
		if(quantity >= max){
			max = quantity;
		}
	}
	return max;
}

function handleMin (group: any[], keyToSearchFor: string): number{
	let min = Number.MAX_VALUE;
	for (let section of group){
		let quantity = section[keyToSearchFor];
		if(quantity <= min){
			min = quantity;
		}
	}
	return min;
}

export {handleAVG, handleMax, handleCount, handleMin, handleSum};
