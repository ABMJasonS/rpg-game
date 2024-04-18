/**
 * A signal value that updates all it's `Derived<T>` subscribers
 */
export class Signal<T> {
    private subscribers: Derived<unknown>[] = [];
    private value: T;

    /**
     * Creates a signal
     * @param initialValue Initial value of the signal
     */
    constructor(initialValue: T) {
        this.value = initialValue;
    }

    /**
     * Sets the value of the signal and notify all its subscribers
     * @param value Value to set
     */
    set(value: T) {
        this.value = value;
        this._notifySubscribers();
    }

    /**
     * Changes the value of the signal and notify all its subscribers
     * @param changeFunction The function to change the value
     */
    change(changeFunction: (value: T) => T) {
        this.set(changeFunction(this.value));
    }

    /**
     * Gets the value of the signal
     * @returns The value of the signal
     */
    get(): T {
        return this.value;
    }

    _addSubscriber(subscriber: Derived<unknown>) {
        this.subscribers.push(subscriber)
    }

    _notifySubscribers() {
        for (const subscriber of this.subscribers) {
            subscriber._update();
        }
    }
}

/**
 * A derived value that updates itself when one of it's `Signal<T>` dependencies updates
 */
export class Derived<T> {
    private derivedFunction: () => T;
    private destructor: (() => void) | undefined;
    // @ts-expect-error It is defined, see the this._update() in the constructor
    private value: T;
    dependencies: Signal<unknown>[];

    /**
     * Creates a derived value
     * @param derivedFunction The function of the derived value
     * @param destructor The destructor of the derived value
     * @param dependencies The dependencies of the derived value
     */
    constructor(derivedFunction: () => T, destructor: (() => void) | undefined, dependencies: Signal<unknown>[]) {
        this.derivedFunction = derivedFunction;
        this.destructor = destructor;
        this.dependencies = dependencies;

        for (const dependency of dependencies) {
            dependency._addSubscriber(this)
        }

        this._update();
    }

    _update() {
        if (this.destructor) this.destructor();
        this.value = this.derivedFunction();
    }

    get() {
        return this.value
    }
}