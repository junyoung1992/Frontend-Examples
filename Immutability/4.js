function fn(person) {
    person.name = 'lee';
}

var o1 = {name: 'kim'};
fn(o1);
console.log(o1);

function fn2(person) {
    person.name = 'kim';
}

var o2 = Object.assign({}, o1);
fn2(o2)
console.log(o1, o2);

function fn3(person) {
    person = Object.assign({}, person);
    person.name = 'park';
    return person;
}

var o3 = fn3(o1);
console.log(o1, o3);