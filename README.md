# coins-jquery-ui-utilities
[ ![Codeship Status for MRN-Code/coins-jquery-ui-utilities](https://codeship.com/projects/54633760-b3c2-0132-9665-2aa0bd32b09d/status?branch=master)](https://codeship.com/projects/70312)

Common GUI actions and objects, standardized and simplified for constructing jQ UI widget instances

## why
So modals, buttons, datepickers, etc get created through a common interface to yield improved consistency through the FE app.

## interface

### button
All button functions, accessible via `.button.FUNCNAME` accept a common set of options to override the default behavior.

All button functions accept the options hash, and most provide some helpful defaults.  Apply any button options usually fed the jQuery button API to the options hash.  Additional actions supported are:

- `class` ['string'] (default: `'default'`) - a button class to apply. see [btnClasses](#btnclasses)
- `el` [Element] - element to buttonize.  If no element provided, the button config (see `returnConfig`) is returned by default
- `returnConfig` [boolean] - return the button configuration object, vs the button instance
- `closeDialog` [booean] (default: `false`) - If button is fed to a dialog, `buttons: []` array, the button will close the dialog after any `click` function has executed, and after any `action` function(s) have executed.  This will auto-enable click regardless if no `click` is defined.
- `action` [Function | [Function]] - additional action function(s) to be performed on button click.  This will auto-enable click regardless if no `click` is defined.  All actions are run synchronously.

#### btnClasses
String indexed hash of boostrap correllated `className`s.  Available classes are:
`'default'`, `'danger'`, `'info'`, `'primary'`, `'success'`, `'warning'`

See [jquery bootstrap classes](http://jquery-ui-bootstrap.github.io/jquery-ui-bootstrap/components.html).

#### base
All button constructors below utilize `base`.  Can be used directly with above configurations as needed.

#### close
Sugar for a button titled "Close" that will attempt to close a *Dialog* instance on click.

#### delete
Sugar for a red button titled "Delete" that ensures that a `click` or `action` attr is defined.

### dialog

All dialog functions accept the options hash, and most provide some helpful defaults.  Apply any dialog options usually fed the jQuery dialog API to the options hash.  Additional actions supported are:

#### base
All dialog constructors below utilize `base`.  Can be used directly with above configurations as needed.

#### fail
Generates a dialog with a default title of `"Operation Failed"`, a friendly error message, and a red close button.

#### api
[Deprecated] Passed an api error, builds a `fail` dialog with details from the failed API call.  Not recommended for use.

## requirements
This module expects that you have:
    1. underscore or lodash loaded globally
    1. jquery && jQuery UI loaded globally

This is a dated means of dependency management, however, until all COINS tools migrate to a FE DI system, it shall suffice.

## demo
run `npm run demo` and open the posted url!  `demo/index.html` should load with some helpful examples.

## todo
1. Formally deprecate ApiError
