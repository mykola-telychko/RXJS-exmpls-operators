import { of, map, first, Observable, interval } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

// https://rxjs.dev/guide/operators

// 1
of(1, 2, 3)
  .pipe(map((x) => x * x))
  .subscribe((v) => console.log(`value: ${v}`));

// 2
of(4, 23, 31, 'str')
  .pipe(
    map((x) => {
      return typeof x != 'string' ? x * x + x : x;
    })
  )
  .subscribe((resultOfPipeMap) => console.log(`2::value: ${resultOfPipeMap}`));

// 3
of(23434, 234, 343)
  .pipe(first())
  .subscribe((v) => console.log(`value first:: ${v}`));

// 4
// function foo1() {
//   return 2;
// }
// function foo2() {
//   return 4;
// }
// function foo3() {
//   return 6;
// }
// const obs = new Observable((subscriber) => {
//   // subscriber.next();
// });
// let obs;
// obs.pipe(foo1(), foo2(), foo3());

// 5

// // const observable = interval(1000 /* number of milliseconds */);

// Exmpl with <interval> from: https://www.learnrxjs.io/learn-rxjs/operators/creation/interval

// emit value in sequence every 1 second
const source = interval(1200);
const example = source.pipe(
  take(5), //take only the first 5 values
  finalize(() => console.log('Sequence complete')) // Execute when the observable completes
);
const subscribe = example.subscribe((val) => console.log(val));
