import { Observable, from, merge, scan, timeout } from 'rxjs';

// Create a promsie that resolves after a delay with a value. This could be replaced with any other function returning a Promise
function createPromise(delay, value) {
  return new Promise((resolve) => {
    const id = setTimeout(() => resolve(value), delay)
  })
}

// Create a subscriber that emits a value after a delay
function createProvider(promise,) {
  return new Observable(observer => {
    // We wrap this so we can subscribe to the underlying promise 
    const subscription = from(promise).subscribe(observer)

    // To guarantee we are cleared when unsubscribed
    return () => subscription.unsubscribe()
  })  
}

function start() {
  // Concat three providers that emits one value each after a certain delay
  merge(
    createProvider(createPromise(3000, 3)),
    createProvider(createPromise(500, 1)),
    createProvider(createPromise(1000, 2)),
  )
  // Apply the scan operator to each event. Start with an initial empty array and append new values as they appear
  .pipe(scan((acc, curr) => {
    return [...acc, curr]
  }, []))
  // Subscribe to the events. TODO: we should keep a reference to this subscription so we can cancel when it is relevant
  .subscribe({next: console.log, error: console.error, complete: () => console.log('Done!')})
}

start()