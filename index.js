/**
 * Copyright 2015, Marnus Weststrate
 * Licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict';
/*global performance*/
var React = require('react/addons');


/**
 * @class ReactPerfPlugin
 *
 * A fluxible plugin that runs the React.Perf tools on every `executeAction` and `dispatch`.
 * Use the options parameter to configure the React profiling. Defaults are given below.
 *
 * @param {Object} [options] :: {
 *   enabled: false,
 *   verbose: true,
 *   printActionDuration: true,
 *   printActionPayload: false,
 *   printDispatchDuration: true,
 *   printInclusive: true,
 *   printExclusive: false,
 *   printWasted: true,
 *   printDOM: false
 * }
 * @returns {Object} The ReactPerfPlugin instance.
 */
module.exports = function fluxibleProfilingPlugin(options) {

  var Perf = React.addons.Perf;
  var currentTime;

  var opts = React.__spread({
    enabled: false,
    verbose: true,
    printActionDuration: true,
    printActionPayload: false,
    printDispatchDuration: true,
    printInclusive: true,
    printExclusive: false,
    printWasted: true,
    printDOM: false
  }, options || {});

  if (typeof performance != 'undefined') {
    // In supporting browsers
    currentTime = performance.now.bind(performance);
  }
  else {
    // On the Node.js server
    currentTime = Date.now.bind(Date);
    // Printing tables is not supported
    opts = React.__spread(opts, {
      printInclusive: false,
      printExclusive: false,
      printWasted: false,
      printDOM: false
    });
  }


  /**
   * @class FluxibleProfilingPlugin
   */
  return {
    name: 'FluxibleProfilingPlugin',
    /**
     * Called to plug the FluxContext.
     * @method plugContext
     * @returns {Object}
     */
    plugContext: function() {
      return {
        /**
         * Replaces the executeAction function on the context with the proxied version to handle profiling.
         *
         * @param {Object} componentContext
         */
        plugComponentContext: function(componentContext) {
          if (opts.enabled) {
            componentContext.executeAction
              = executeProfiledAction.bind(componentContext, componentContext.executeAction, 'Component');
          }
        },
        /**
         * Replaces the executeAction function on the context with the proxied version to handle profiling.
         *
         * @param {Object} actionContext
         */
        plugActionContext: function(actionContext) {
          if (opts.enabled) {
            actionContext.executeAction
              = executeProfiledAction.bind(actionContext, actionContext.executeAction, 'Action');
            actionContext.dispatch = dispatchProfiled.bind(actionContext, actionContext.dispatch);
          }
        }
      };
    }
  };

  function executeProfiledAction(executeAction, sourceType, action, payload, done) {
    if (opts.verbose) {
      console.log('---------');
      console.log('EXECUTING', action.name, 'ACTION from a', sourceType);
      if (opts.printActionPayload) {
        console.log(payload);
      }
    }

    var startTime = currentTime();

    if (!done) {
      var result = executeAction(action, payload);
      if (result) {
        result.then(printActionDuration.bind(null, action.name, startTime));
      }
      return result;
    }

    executeAction(action, payload, function() {
      printActionDuration(action.name, startTime);
      done.apply(null, arguments);
    });
  }

  function dispatchProfiled(dispatch, eventName, payload) {
    if (opts.verbose) {
      console.log('Dispatching:', eventName);
    }

    var startTime = currentTime();
    Perf.start();

    dispatch(eventName, payload);

    Perf.stop();
    printReactMeasurements(eventName, startTime);
  }

  function printActionDuration(actionName, startTime) {
    if (opts.printActionDuration) {
      console.log('FINISHED executing', actionName + ', duration:', msSince(startTime));
      consoleBlankLine();
    }
  }

  function printReactMeasurements(eventName, startTime) {
    if (opts.printInclusive) {
      console.log('Inclusive Rendering Time');
      Perf.printInclusive();
      consoleBlankLine();
    }

    if (opts.printExclusive) {
      console.log('Exclusive Rendering Time');
      Perf.printExclusive();
      consoleBlankLine();
    }

    if (opts.printWasted) {
      console.log('Wasted Renders');
      Perf.printWasted();
      consoleBlankLine();
    }

    if (opts.printDOM) {
      console.log('DOM Manipulations');
      Perf.printDOM();
      consoleBlankLine();
    }

    if (opts.printDispatchDuration) {
      console.log('DISPATCHED', eventName, 'in:', msSince(startTime));
      consoleBlankLine();
    }
  }

  function msSince(start) {
    return (Math.round((currentTime() - start) * 100) / 100) + ' ms';
  }

  function consoleBlankLine() {
    if (opts.verbose) {
      console.log('');
    }
  }

};
