Server Side Dijit
===

Middleware plugin for Connect that renders dijit widget templates, which are normally rendered client-side, on the server. 
Returned pages are modified to include the generated server-side templates inline, with a client-side JavaScript plugin 
to hook up the templates to the widget.

Running the demo
--

Run the following command line to start a test application, demonstrating a variety of widgets rendered
on the server side. 

    $ export DOJO_SOURCE=/path/to/dojo-release-1.8.0-src
    $ npm start 

Once the server has started, visit...
http://localhost:3000

How to use
--

Using this middleware plugin in your own application requires the use of the middleware plugin
alongside a custom client-side JavaScript mixin.

The Connect plugin takes a single configuration parameter, *dojo*, which denotes the location of top level
directory containing the The Dojo Toolkit source (version 1.8).

### Configure middleware and use with Connect server
    var connect = require('connect'),
        server_side = require('server_side_dijit');

    var app = connect()
       .use(server_side({dojo: './path_to_dojo_1.8'}))
       .use(connect.static('./my_html_files'))
       .listen(3000);

Every requested HTML page will be scanned for declaratively defined widgets, *data-dojo-type*, 
that also include the declarative mixin command, *data-dojo-mixin*, for the custom JavaScript library, *server_side/_TemplatedWidget*. 

### Configure AMD loader with client-side library path
    var dojoConfig = {
        paths: {
            server_side: "/public/js/server_side"
        },
        async: true
     };

Custom JavaScript library to assist server-side rendering is provided under *public/js/server_side* in the module source directory.

### Use client-side mixin to denote widgets for server rendering
    <div data-dojo-type="dijit/CalendarLite" data-dojo-mixins="server_side/_TemplatedMixin"></div>

These widgets are instantiated in the server side environment and their rendered template injected into the returned 
page. On the client-side, the mixin modifies widget construct to stop templated widgets from trying to 
do the client-side rendering and simply hooking up the template node that are already present.

Requirements
--

* The Dojo Toolkit (version 1.8) source distribution available locally.
