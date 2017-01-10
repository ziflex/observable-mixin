/* eslint-disable no-unused-expressions, import/no-extraneous-dependencies */
import { expect } from 'chai';
import sinon from 'sinon';
import composeClass from 'compose-class';
import { EventEmitter } from 'events';
import ObservableMixin from '../src/index';

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

it('should subscribe', () => {
    const onChange = sinon.spy();
    const person = new Person('Mike Wazowski');

    person.subscribe('change', onChange);

    person.name('James P. Sullivan');
    person.name('Randall Boggs');

    expect(onChange.callCount).to.equal(2);
});

it('should subscribe once', () => {
    const onChange = sinon.spy();
    const person = new Person('Mike Wazowski');

    person.subscribe('change', onChange, true);

    person.name('James P. Sullivan');
    person.name('Randall Boggs');

    expect(onChange.callCount).to.equal(1);
});

it('should unsubscribe', () => {
    const onChange = sinon.spy();
    const person = new Person('Mike Wazowski');

    const unsubscribe = person.subscribe('change', onChange, true);

    person.name('James P. Sullivan');
    unsubscribe();
    person.name('Randall Boggs');

    expect(onChange.callCount).to.equal(1);
});
