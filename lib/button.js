"use strict";
var button = module.exports;
var _ = window._;
var jQuery = window.jQuery;

/**
 * Execute a series of user provided action(s), available to them
 * in the helper utilities
 * @param  {*} actions   null|Object (with action property)|Function||Array[Function]
 * @return {undefined}
 */
var execAction = function(actions) {
    if (!actions) { return; }
    actions = actions.action || actions;
    if (!_.isArray(actions)) { actions = [actions]; }
    _.each(actions, function applyActions(action) {
        if (_.isFunction(action)) { return action(); }
        throw new TypeError('action not a function');
    });
};



button.btnClasses = {
    "default": 'btn-default button-default ui-button-default',
    "danger": 'btn-danger button-danger ui-button-danger',
    "info": 'btn-info button-info ui-button-info',
    "primary": 'btn-primary button-primary ui-button-primary',
    "success": 'btn-success button-success ui-button-success',
    "warning": 'btn-warning button-warning ui-button-warning'
};



// Button Definitions


/**
 * Base jQuery button generator
 * @param  {object} options
 * @return {object|jQuery}
 */
button.base = function(options) {
    if (!options) {
        throw new Error("options must defined for jquery ui button");
    }
    var $el;
    var el = options.el;
    var click = options.click;
    var action = options.action;
    var returnConfig = options.returnConfig;
    var closeDialog = options.closeDialog;
    var destroyDialog = options.destroyDialog;
    var wrappedClick;

    if (destroyDialog) {
        // force close handlers to execute prior to destruction
        closeDialog = true;
    }

    // purge all supported configs that belong to jquu, not button module
    delete options.closeDialog;
    delete options.destroyDialog;
    delete options.returnConfig;
    delete options.action;
    delete options.el;
    delete options.click;

    // retain original click func, but overwrite with extended version
    options.click = function() {
        if (click) { click(); }
        if (action) { execAction(action); }
        if (closeDialog) { jQuery(this).dialog("close"); }
        if (destroyDialog) { jQuery(this).dialog("destroy"); }
    };
    options.class = (options.class && button.btnClasses[options.class]) ?
        button.btnClasses[options.class] : button.btnClasses["default"];


    if (el) {
        el.className += options.class;
        delete options.class;
        $el = jQuery(el);
    }

    if (returnConfig || !el) {
        return options;
    }

    $el = $el.button(options);
    $el.on('click', options.click);
    return $el;
};



/**
 * Closes the dialog
 * @param  {jQuery} dialogInstance    dialog instance
 * @param  {Object} see `base` options
 * @return {Object}
 */
button.close = function(options) {
    options = options || {};
    options.closeDialog = options.closeDialog === false ? false : true;
    options.text = options.text || 'Close';
    return button.base(options);
};



/**
 * Destroys the dialog
 * @param  {jQuery} dialogInstance    dialog instance
 * @param  {Object} see `close` options
 * @return {Object}
 */
button.destroy = function(options) {
    options = options || {};
    options.destroyDialog = options.destroyDialog === false ? false : true;
    return button.close(options);
};



/**
 * Short-hand for button.close() with delete text.  Expects delete
 * functionality to be specified in `click` or `action` property
 * @param  {Object} options
 * @return {Object}
 */
button.delete = function(options) {
    options = options || {};
    var deleteOps = {};
    deleteOps.text = "Delete";
    deleteOps.class = "danger";
    if (!options.click && !options.action) {
        throw new Error('requested delete button, but no delete action specified');
    }
    deleteOps = _.extend(deleteOps, options);
    return button.base(deleteOps);
};
