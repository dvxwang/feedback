var denom = [1,5,10,20];
var target = 27;
var memoObj = {};
var solutions = [];

function getType(arr, num, solArr){
	// console.log("New loop: ", arr)
	// console.log("New loop: ", num)
	// console.log("New loop: ", solArr)
	// console.log("New loop: ", solutions)

	if (num===0) {
		solutions.push(solArr);
		return true;
	}

	for (var i=arr.length-1; i>=0; i--){
		if (num-arr[i]>=0){

			var newSubDenom = arr.indexOf(arr[i])+1;
			var newDenom = arr.slice(0,newSubDenom);

			getType(newDenom,num-arr[i], solArr.concat(arr[i]));
		}
	}
}

getType(denom, target, []);
console.log("Answer: ", solutions.length);
console.log("Solutions: ", solutions);

