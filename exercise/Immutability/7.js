// freeze 는 값을 수정하는 것을 막음
// const 는 가리키는 값을 다른 것으로 바꾸는 것을 막음

const o1 = {name: 'kim'};
// var o1 = {name: 'kim'};
Object.freeze(o1);
const o2 = {name: 'lee'};
// o1 = o2;
// o1 이 const이기 때문에 에러. var 이면 가능

o1.name = 'park';
console.log(o1, o2);