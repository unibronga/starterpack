import './style/scss/style.scss';
import '.././babel.config.json';
import { Observable } from 'rxjs';

const source = Observable.create((observer) => {
    let count = 0;

    console.log('Observable created');

    const timer = setInterval(() => {
        console.log('observer = ', observer.next(count))
        observer.next(count);
        count++;
    }, 1000);

    return () => {
        console.log('Observable destroyed');
        clearInterval(timer);
    }
});


const subscription = source.subscribe(
    val => console.log('next:', val),
    err => console.error('error:', err),
    () => console.log('completed')
);

// не забываем отписаваться
setTimeout(() => subscription.unsubscribe(), 4500);





