"use strict";
var me = module.exports;
var button = require('./button.js');
var isObject = require('lodash/lang/isObject');
var extend = require('lodash/object/extend');
var defaults = require('lodash/object/defaults');
var jQuery = require('jquery');

// UI API CRUD term to English term mapping
var actionXHRmap = {
    "GET": 'Fetch',
    "POST": 'Create',
    "PUT": 'Update',
    "DELETE": 'Delete',
    "PATCH": 'Update'
};


/**
 * Returns the English equivalent of XHR action
 * @param  {Objext} xhr
 * @return {String}
 */
var xhrCRUD2English = function (xhr) {
    var action = xhr.action || xhr.method;
    // sometimes xhr's return nested within xhr wrapper
    if (!action && xhr.xhr) {
        xhr = xhr.xhr;
        action = xhr.action || xhr.method;
    }
    var engAction = actionXHRmap[action.toLocaleUpperCase()];
    if (!engAction) {
        throw new Error("Expected standard CRUD/XHR action.  Recieved: " + action);
    }
    return engAction;
};



/**
 * Dialog Definitions
 * Quickly create a jQuery UI dialog with reasonable COINS defaults
 * Defaults to modal mode.  A.l options passed get extended directly
 * into the dialog widget constructor options
 * @param  {Object} options {
 *     body: {String}, // body text
 *     title: {String}, // title text
 *     buttons: {Array}, // Array of button def Objects. see button.close/delete
 * }
 * @return {jQuery}
 */
me.base = function (options) {
    if (!options) {
        throw new Error('dialog requires options');
    }
    var $dia;
    var defaultOpts = {
        modal: true,
        title: 'COINS Message',
        buttons: options.buttons || [
            button.destroy()
        ]
    };
    if (!isObject(options)) {
        throw new TypeError("Expected options object, received: " + options);
    }
    if (!options.body) {
        throw new TypeError("Empty dialog body");
    }
    defaults(options, defaultOpts);
    var template = options.template || '<div title="' + options.title + '">' + options.body + '</div>';
    delete options.template;
    delete options.title;

    $dia = jQuery(template);

    // disable scrolling off-screen in modal mode
    if (options.modal) {
        $dia.on("dialogclose", function(event, ui) {
            window.document.body.style.overflow = 'auto';
        });
        $dia.on("dialogopen", function(event, ui) {
            document.querySelector('.ui-widget-overlay.ui-front').style.position = 'fixed'; // compensate for imperfect jQuery ui theme css
            window.document.body.style.overflow = 'hidden';
        });
    }

    $dia.dialog(options);

    return $dia;
};



/**
 * Standard Dialog with text indicating that an operation has failed
 * @param  {Object} options
 * @return {jQuery}
 */
me.fail = function(options) {
    var msgSuffix = "If the issue persists, please contact COINS support";
    var latestOptions;
    options = options || {};
    if (typeof options === 'string') {
        // pipe string fail msg to options.body
        options = { body: options };
    }
    var defaultOpts = {
        title: "Operation Failed",
        body: "Apologies, the operation attempted was unsuccessful.",
        buttons: [button.destroy({class: 'danger'})]
    };

    defaults(options, defaultOpts);
    options.body = options.body + '<br/><br/>' + msgSuffix;
    return me.base(options);
};



/**
 * Returns a function to auto-spin up an error dialog, dumping the
 * API fail results into the dialog.  Assumes COINS API V1[dialog description]
 * @param  {ApiError} standard response [data, response, xhr]
 * @return {jQuery}
 */
me.fail.api = function(err) {
    var options = {},
        action;
    if (!err || !(err instanceof window.ApiError)) {
        throw new Error('expected error of type ApiError');
    }
    extend(options, err.api);
    action = xhrCRUD2English(err.api.xhr);
    options.title = action + ' Failed';
    options.body = err.api.response.body;
    return me.fail(options);
};
