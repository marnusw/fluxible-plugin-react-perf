fluxible-plugin-react-perf
==========================

A fluxible plugin that runs the [React.Perf tools](https://facebook.github.io/react/docs/perf.html) 
on every `executeAction` and `dispatch`.

```
npm install fluxible-plugin-react-perf 
```

*Note:* This version requires React.js `>0.14.0-rc1`, to use React `0.13.x`, install version `0.1.3` of this plugin.

## Usage

Simply plug the Plugin into any app to have it print out the `React.Perf` results after any 
`executeAction` and `dispatch` call depending on the provided configuration options.

Since this functionality will typically not be used continuously the plugin can be disabled
without leaving any overhead by providing `options.enabled = false`.

```javascript

import ReactPerfPlugin from 'fluxible-plugin-react-perf';

fluxible.plug(ReactPerfPlugin({
  enabled: true,
  // Overwrite default options
));

```

## Configuration Options and Defaults

Globally enable or disable:

  * **enabled** (`false`): Turn the plugin on or off in its entirety.

Enable/disable the various `React.Perf` outputs:
  
  * **printInclusive** (`true`): Enable/Disable printing the [Perf.printInclusive](https://facebook.github.io/react/docs/perf.html#perf.printinclusivemeasurements) measurements.
  * **printExclusive** (`false`): Enable/Disable printing the [Perf.printExclusive](https://facebook.github.io/react/docs/perf.html#perf.printexclusivemeasurements) measurements.
  * **printWasted** (`true`): Enable/Disable printing the [Perf.printWasted](https://facebook.github.io/react/docs/perf.html#perf.printwastedmeasurements) measurements.
  * **printDOM** (`false`): Enable/Disable printing the [Perf.printDOM](https://facebook.github.io/react/docs/perf.html#perf.printdommeasurements) measurements.

Print the duration of the actions and dispatches themselves:

  * **printActionDuration** (`true`): Print the time elapsed from a call to executeAction until its `done` method is called or `Promise` resolved. 
  * **printDispatchDuration** (`true`): Print the time it takes to execute a `dispatch` from within an action creator.

Make the output even more verbose for further debugging:
  
  * **verbose** (`true`): Print a notice whenever an action or dispatch starts executing, useful when debugging to see where things fail. 
  * **printActionPayload** (`false`): If `verbose` mode is enabled this will also print the payload provided to all executed actions.

## License

This software is free to use under the MIT license.
See the [LICENSE file](LICENSE.md) for license text and copyright information.
