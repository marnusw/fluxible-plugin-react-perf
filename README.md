fluxible-plugin-react-perf
==========================

A fluxible plugin that runs the [React.Perf tools](https://facebook.github.io/react/docs/perf.html) 
on every `executeAction` and `dispatch`.

```
npm install fluxible-plugin-react-perf 
```

# Usage

Simply plug the Plugin into any app to have it print out the `React.Perf` results after any 
`executeAction` and `dispatch` call depending on the provided configuration options.

Since this functionality will typically not be used continuously the plugin can be disabled
without leaving any overhead by providing `options.enabled = false`. It is often most 
convenient to have the options stored in a central configuration file which can be edited
to turn various options on or off.

```javascript

import FluxibleProfilingPlugin from 'fluxible-plugin-profiling';

fluxible.plug(FluxibleProfilingPlugin({
  enabled: true,
  // Overwrite default options
));

```

# Configuration

Various configuration options are available:

  * **enabled** (`true`): Turn the plugin on or off in its entirety.
  * **verbose** (`true`): Print a notice whenever an action or dispatch starts executing, useful when debugging to see where things fail. 
  * **printActionPayload** (`false`): If `verbose` mode is enabled this will also print the payload provided to all executed actions.
  
  
  * **printActionDuration** (`true`): Print the time elapsed from a call to executeAction until its `done` method is called or `Promise` resolved. 
  * **printDispatchDuration** (`true`): Print the time it takes to execute a `dispatch` from within an action creator.
   

  * **printInclusive** (`true`): Enable/Disable printing the [Perf.printInclusive](https://facebook.github.io/react/docs/perf.html#perf.printinclusivemeasurements) measurements.
  * **printExclusive** (`false`): Enable/Disable printing the [Perf.printExclusive](https://facebook.github.io/react/docs/perf.html#perf.printexclusivemeasurements) measurements.
  * **printWasted** (`true`): Enable/Disable printing the [Perf.printWasted](https://facebook.github.io/react/docs/perf.html#perf.printwastedmeasurements) measurements.
  * **printDOM** (`false`): Enable/Disable printing the [Perf.printDOM](https://facebook.github.io/react/docs/perf.html#perf.printdommeasurements) measurements.

# License

MIT
