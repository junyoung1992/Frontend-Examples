var o1 = {name: 'ki'};
var o2 = o1;
console.log(o1, o2, o1 === o2);

o2.name = 'kim';
console.log(o1, o2, o1 === o2);

var o3 = Object.assign({}, o1);
console.log(o1, o3, o1 === o3);

o3.name = 'lee';
console.log(o1, o3, o1 === o3);
