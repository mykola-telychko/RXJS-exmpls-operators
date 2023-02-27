import {
  of,
  map,
  first,
  Observable,
  Observer,
  fromEvent,
  interval,
} from 'rxjs';
import { take, finalize, concatAll } from 'rxjs/operators';

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

// 6 // ???
// const fileObservable = urlObservable.pipe(
let urlObservable = new Observable((subscriber) => {
  subscriber.next('hello');
  subscriber.next('world');
  subscriber.next('url');
});

const fileObservable = urlObservable.pipe(
  // map((url) => http.get(url)),
  map((url) => {
    return 'http.get(url) ' + url;
  }),
  concatAll()
);

let stream = fileObservable.subscribe((val) => console.log(val));

// b)
// const clicks = fromEvent(document, 'click');
// const higherOrder = clicks.pipe(map(() => interval(1000).pipe(take(4))));
// const firstOrder = higherOrder.pipe(concatAll());
// firstOrder.subscribe((x) => console.log(x));

// Results in the following:
// (results are not concurrent)
// For every click on the "document" it will emit values 0 to 3 spaced
// on a 1000ms interval
// one click = 1000ms-> 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3

// 7
// how use that ? custom operator
function discardOddDoubleEven() {
  return pipe(
    filter((v) => !(v % 2)),
    map((v) => v + v)
  );
}

// 8 // Dalay fn
// import { Observable, of } from 'rxjs';

function delay<T>(delayInMillis: number) {
  return (observable: Observable<T>) =>
    new Observable<T>((subscriber) => {
      // this function will be called each time this
      // Observable is subscribed to.
      const allTimerIDs = new Set();
      let hasCompleted = false;
      const subscription = observable.subscribe({
        next(value) {
          // Start a timer to delay the next value
          // from being pushed.
          const timerID = setTimeout(() => {
            subscriber.next(value);
            // after we push the value, we need to clean up the timer timerID
            allTimerIDs.delete(timerID);
            // If the source has completed, and there are no more timers running,
            // we can complete the resulting observable.
            if (hasCompleted && allTimerIDs.size === 0) {
              subscriber.complete();
            }
          }, delayInMillis);

          allTimerIDs.add(timerID);
        },
        error(err) {
          // We need to make sure we're propagating our errors through.
          subscriber.error(err);
        },
        complete() {
          hasCompleted = true;
          // If we still have timers running, we don't want to complete yet.
          if (allTimerIDs.size === 0) {
            subscriber.complete();
          }
        },
      });

      // Return the finalization logic. This will be invoked when
      // the result errors, completes, or is unsubscribed.
      return () => {
        subscription.unsubscribe();
        // Clean up our timers.
        for (const timerID of allTimerIDs) {
          clearTimeout(timerID);
        }
      };
    });
}

// Try it out!
of(1, 2, 3).pipe(delay(1000)).subscribe(console.log);
