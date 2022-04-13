import { Observable, merge, scan } from 'rxjs';

// Create a subscriber that emits a value after a delay
function createProvider(delay, value) {
  return new Observable((subscriber) => {
    const id = setTimeout(() => {
      subscriber.next(value)
      subscriber.complete()
    }, delay)    

    // To guarantee we are cleared when unsubscribed
    return () => {
      clearTimeout(id)
    }
  })  
}

function start() {
  // Concat three providers that emits one value each after a certain delay
  merge(
    createProvider(3000, 3),
    createProvider(1000, 1),
    createProvider(2000, 2),
  )
  // Apply the scan operator to each event. Start with an initial empty array and append new values as they appear
  .pipe(scan((acc, curr) => {
    return [...acc, curr]
  }, []))
  .subscribe({next: console.log, error: console.error, complete: () => console.log('Done!')})
}

start()