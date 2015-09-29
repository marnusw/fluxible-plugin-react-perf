/**
 * Copyright 2015, Marnus Weststrate
 * Licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict';
/*global performance*/
var Perf = require('react-addons-perf');
var objectAssign = require('react/lib/Object.assign');


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

  var currentTime;

  var opts = objectAssign({
    enabled: false,
    verbose: true,
    printActionDuration: true,
    printActionPayload: false,
    printDispatchDuration: true,
    printInclusive: true,
    printExclusive: false,
    printWasted: true,
    printDOM: false
  }, options);

  if (typeof performance != 'undefined') {
    // In supporting browsers
    currentTime = performance.now.bind(performance);
  }
  else {
    // On the Node.js server
    currentTime = Date.now.bind(Date);
    // Printing tables is not supported
    opts = objectAssign(opts, {
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
            var fluxibleExecuteAction = componentContext.executeAction;

            componentContext.executeAction = function executeVerboseAction(action, payload) {
              if (opts.verbose) {
                console.log('---------');
                console.log('EXECUTING', action.name, 'ACTION from a Component');
              }
              return fluxibleExecuteAction.call(componentContext, action, payload);
            };
          }
        },
        /**
         * Replaces the executeAction function on the context with the proxied version to handle profiling.
         *
         * @param {Object} actionContext
         */
        plugActionContext: function(actionContext) {
          if (opts.enabled) {
            var fluxibleExecuteAction = actionContext.executeAction;
            var fluxibleDispatch = actionContext.dispatch;


            actionContext.executeAction = function executeProfiledAction(action, payload, callback) {
              if (opts.verbose) {
                console.log('---------');
                console.log('EXECUTING', action.name, 'ACTION from an Action');
                if (opts.printActionPayload) {
                  console.log(payload);
                }
              }

              return fluxibleExecuteAction.call(actionContext, action, payload, callback)
                .then(printActionDuration.bind(null, action.name, currentTime()));
            };


            actionContext.dispatch = function dispatchProfiled(eventName, payload) {
              if (opts.verbose) {
                console.log('Dispatching:', eventName);
              }

              var startTime = currentTime();
              Perf.start();

              fluxibleDispatch.call(actionContext, eventName, payload);

              Perf.stop();
              printReactMeasurements(eventName, startTime);
            };
          }
        }
      };
    }
  };

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
