var o1 = {name: 'kim', score: [1, 2]};
Object.freeze(o1);
o1.name = 'lee';
o1.city = 'seoul;'
console.log(o1);

// 객체의 프로퍼티가 객체라면 freeze가 수정을 막을 수 없음
o1.score.push(3);
console.log(o1);

Object.freeze(o1.score);
o1.score.push(3);   // freeze 된 배열에 push 하므로 에러 발생
console.log(o1);