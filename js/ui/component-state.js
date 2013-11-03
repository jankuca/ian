goog.provide('ian.ui.ComponentState');


/**
 * @constructor
 */
ian.ui.ComponentState = function () {
};


/**
 * Computes a difference between the current state (`this`) and the passed in
 * one creating a new state object. The returned object has indices of the
 * state keys that changed.
 * @param {!ian.ui.ComponentState} new_state The new state.
 * @return {!ian.ui.ComponentState} The difference between the states.
 */
ian.ui.ComponentState.prototype.getDifference = function (new_state) {
  var old_state = this;
  var diff = new ian.ui.ComponentState();

  goog.object.forEach(new_state, function (value, state_key) {
    if (new_state.hasOwnProperty(state_key)) {
      if (state_key in old_state) {
        if (!old_state[state_key] && new_state[state_key]) {
          diff[state_key] = true;
        } else if (old_state[state_key] && !new_state[state_key]) {
          diff[state_key] = false;
        }
      } else {
        diff[state_key] = new_state[state_key];
      }
    }
  });

  goog.object.forEach(old_state, function (value, state_key) {
    if (old_state.hasOwnProperty(state_key) && !(state_key in diff)) {
      if (state_key in new_state) {
        if (!old_state[state_key] && new_state[state_key]) {
          diff[state_key] = true;
        } else if (old_state[state_key] && !new_state[state_key]) {
          diff[state_key] = false;
        }
      } else {
        diff[state_key] = false;
      }
    }
  });

  return diff;
};
