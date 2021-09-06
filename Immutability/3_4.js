var o1 = {name: 'ki', score: [1, 2]};
var o2 = Object.assign({}, o1);
console.log(o1, o2, o1 === o2, o1.score === o2.score);

o2.score.push(3);
console.log(o1, o2, o1 === o2, o1.score === o2.score);

var o3 = Object.assign({}, o1);
o3.score = o1.score.concat();
console.log(o1, o3, o1 === o3, o1.score === o3.score);

o3.score.push(4);
console.log(o1, o3, o1 === o3, o1.score === o3.score);
