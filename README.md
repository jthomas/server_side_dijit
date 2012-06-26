Experimenting with rendering dijit widgets on the server-side, using NodeJS, Express and JSDOM. 

Run the following command line to start the application: 

$ node app.js

All files in the "./public" directory are automatically made available at http://localhost:3000
Any HTML pages requested are parsed before returning, looking for declarative widgets in the page
which contain the "dojo-dojo-mixins='server_side/_TemplatedWidget'" reference. These widgets are 
instantiated in the server side environment and their rendered template is injected into the returning 
page.

On the client-side, the mixin modifies widget construct to stop templated widgets from trying to 
do the local rendering, instead simply hooking up the template that's already present.
