# observable-mixin

> Just observe

Mixin that makes your types observable without exposing emitter.

[![npm version](https://badge.fury.io/js/observable-mixin.svg)](https://www.npmjs.com/package/observable-mixin)
[![Build Status](https://secure.travis-ci.org/ziflex/observable-mixin.svg?branch=master)](http://travis-ci.org/ziflex/observable-mixin)
[![Coverage Status](https://coveralls.io/repos/github/ziflex/observable-mixin/badge.svg?branch=master)](https://coveralls.io/github/ziflex/observable-mixin)

````sh
    npm install --save observable-mixin
````

## Usage

``observable-mixin`` brings 1 method:
- ``subscribe(eventName: String, handler: Function, [once: Boolean]): Function`` returns a function that unsubscribes a given listener

The mixin comes as a factory function i.e. in order to get mixin it needs to invoke exported function.
It is done intentionally in order to be able to pass any kind of implementation of EventEmitter.

````javascript

    import Symbol from 'es6-symbol';
    import composeClass from 'compose-class';
    import ObservableMixin from 'observable-mixin';
    import { EventEmitter } from 'events';

    const FIELDS = {
        emitter: Symbol('emitter'),
        name: Symbol('name')
    };

    const Person = composeClass({
        mixins: [
            ObservableMixin(FIELDS.emitter)
        ],

        constructor(name) {
            this[FIELDS.emitter] = new EventEmitter();
            this[FIELDS.name] = name;
        },

        name(value) {
            if (value) {
                this[FIELDS.name] = value;
                this[FIELDS.emitter].emit('change', 'name', value);
            }

            return this[FIELDS.name];
        }
    });

````

````javascript
import Person from './person';

const person = new Person('Mike Wazowski');

const unsubscribe = person.subscribe('change', (field, value) => {
    console.log('Person\'s', field, 'was changed to', value);
});

person.name('James P. Sullivan'); // Person's name was changed to 'James P. Sullivan'

unsubscribe();

person.name('Randall Boggs'); // Nothing

````

Mixin supports ``once`` subscription:

````javascript
import Person from './person';

const person = new Person('Mike Wazowski');

person.subscribe('change', (field, value) => {
    console.log('Person\'s', field, 'was changed to', value);
}, true);

person.name('James P. Sullivan'); // Person's name was changed to 'James P. Sullivan'

person.name('Randall Boggs'); // Nothing

````
