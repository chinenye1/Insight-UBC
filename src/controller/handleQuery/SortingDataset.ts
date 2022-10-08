/**
 * @author: CO
 * @param order: order in which the filtered sections should be returned
 * @param filteredSections: the sections to be ordered
 * @return: the filtered section in the specified order. Sorts least to greatest or alphabetically.
 */
function handleSimpleOrder(order: string, filteredSections: any[]): any[] {
	let sectionsToSort: any[] = filteredSections;
	// credit for how to use sort function: https://www.codegrepper.com/code-examples/typescript/typescript+sort+json+array+by+property
	sectionsToSort.sort((a, b) => (a[order] > b[order]) ? 1 : -1);
	return sectionsToSort;
}


function handleOrderingMultipleColumns(orderObject: any, filteredSections: any[]): any[] {
	let sectionsToSort: any[] = filteredSections;
	// credit for how to sort by multiple columns:
	// https://www.codegrepper.com/code-examples/typescript/typescript+sort+json+array+by+property
	let keysToSortBy: string[] = [];
	if(typeof orderObject === "string"){
		return handleSimpleOrder(orderObject,filteredSections);
	} else {
		keysToSortBy = orderObject.keys;
	}
	if (orderObject.dir === "UP") {
		// first sort by the first column
		sectionsToSort.sort((a, b) => (a[keysToSortBy[0]] > b[keysToSortBy[0]]) ? 1 : -1);
		for (let i = 1; i < keysToSortBy.length; i++) {
			sectionsToSort.sort(
				function (a, b) {
					if(a[keysToSortBy[i - 1]] === b[keysToSortBy[i - 1]]){
						return ((b[keysToSortBy[i]] - b[keysToSortBy[i]]) ? 1 : -1);
					}
					return ((a[keysToSortBy[0]] > b[keysToSortBy[0]]) ? 1 : -1);
				});
		}
	} else {
		// first sort by the first column
		sectionsToSort.sort((a, b) => (a[keysToSortBy[0]] < b[keysToSortBy[0]]) ? 1 : -1);
		for (let i = 1; i < keysToSortBy.length; i++) {
			sectionsToSort.sort(
				function (a, b) {
					if(a[keysToSortBy[i - 1]] === b[keysToSortBy[i - 1]]){
						return ((a[keysToSortBy[i]] - b[keysToSortBy[i]]) ? 1 : -1);
					}
					return ((a[keysToSortBy[0]] < b[keysToSortBy[0]]) ? 1 : -1);
				});
		}
	}
	return sectionsToSort;
}


export {handleSimpleOrder, handleOrderingMultipleColumns};
