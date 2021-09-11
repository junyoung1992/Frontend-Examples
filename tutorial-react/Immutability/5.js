var score = [1, 2, 3];
score.push(4);
console.log(score);

var score2 = score.concat(5);
console.log(score, score2);
// 원본을 immutable 하게 유지할 수 있음

var a = score;
var b = score;
score.push(6);
console.log(score, score2, a, b);