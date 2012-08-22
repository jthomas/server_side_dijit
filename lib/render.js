var jsdom = require("jsdom").jsdom,
    document = jsdom("<html></html>"),
    window = document.createWindow();

module.exports = function (packages) {
    // Fix window objects in global scope.
    global.document = document;
    global.navigator = window.navigator;
    global.window = window;

    var amd_packages = Object.keys(packages).map(function (key) {
        return { name: key, location: packages[key] };
    });

    // Deliberately create global "dojoConfig" variable.
    dojoConfig = {
        packages: amd_packages,
        // _WidgetsInTemplateMixin call parser directly to instantiate children. 
        // We need it to use our custom parser so use AMD-remapping magic!
        aliases: [["dojo/parser", "server_side/parser"]],
        deps: ["server_side/parser", "dojo/has", "dojo/_base/window", "server_side/registry"]
    };

    require(packages.dojo + "/dojo.js");

    // Once Dojo has been evalulated, require & define methods 
    // from AMD API as exposed as properties on "global" object.

    var has = global.require("dojo/has"),
        win = global.require("dojo/_base/window"),
        registry = global.require("server_side/registry"),
        parser = global.require("server_side/parser");

    // Now we need to manually fix a few things to make Dojo 
    // simulate running in a browser.

    // Manually add event listener test as this was only included in 
    // the "host-browser" profile.
    has.add("dom-addeventlistener", !!document.addEventListener);
    has.add("dom-attributes-explicit", true);

    // Fix global property to point to "window" 
    win.global = window;

    return function (source) {
        // Clear any previously rendered widgets from registry,
        // simulate fresh page load.
        registry.reset();

        // Overwrite finished document contents
        // with new source and run parser over the DOM.
        document.write(source);
        parser.parse(document);

        return document.innerHTML;
    };
};
