/**
 * Extends an object with functions that allow to subscribe to events.
 * @param {Symbol | String} symbolOrKey - Symbol or key in order to get inner event emitter.
 * @return {Object} Mixin.
 */
module.exports = function ObservableMixin(symbolOrKey) {
    return {
        subscribe(event, handler, once = false) {
            if (!once) {
                this[symbolOrKey].addListener(event, handler);
            } else {
                this[symbolOrKey].once(event, handler);
            }

            return () => {
                if (this[symbolOrKey]) {
                    this[symbolOrKey].removeListener(event, handler);
                }
            };
        }
    };
};
