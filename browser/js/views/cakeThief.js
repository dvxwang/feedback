function cakeGet (arr, target){
	var table =[];
	for (var i=0; i<=arr.length;i++){
		table[i] = new Array(target+1);
	}

	var temp = table[0].length;
	for (var j=0; j<=temp;j++){
		table[0][j]=0;
	}

	temp = table.length
	for (var k=0; k<=temp;j++){
		table[k][0]=0;
	}

	return table;
}

var cakes = [
	{weight: 7,value: 160},
	{weight: 3,value: 90},
	{weight: 2,value: 15}
]

var weight = 20;

console.log(cakeGet(cakes, weight));