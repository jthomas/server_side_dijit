define(["dojo/_base/declare", "dijit/_WidgetBase"], function (declare, _WidgetBase) {
    return declare(null, {

        stopParser: true,

        buildRendering: function(){
            //
            //
			// summary:
			//		Construct the UI for this widget from a template, setting this.domNode.
			// tags:
			//		protected

/*			if(!this.templateString){
				this.templateString = cache(this.templatePath, {sanitize: true});
			}

			// Lookup cached version of template, and download to cache if it
			// isn't there already.  Returns either a DomNode or a string, depending on
			// whether or not the template contains ${foo} replacement parameters.
			var cached = _TemplatedMixin.getCachedTemplate(this.templateString, this._skipNodeCache, this.ownerDocument);

			var node;
			if(lang.isString(cached)){
				node = domConstruct.toDom(this._stringRepl(cached), this.ownerDocument);
				if(node.nodeType != 1){
					// Flag common problems such as templates with multiple top level nodes (nodeType == 11)
					throw new Error("Invalid template: " + cached);
				}
			}else{
				// if it's a node, all we have to do is clone it
				node = cached.cloneNode(true);
			}
            */
			
            var node = this.srcNodeRef;

            node.removeAttribute("data-dojo-type");

			// Call down to _Widget.buildRendering() to get base classes assigned
			// TODO: change the baseClass assignment to _setBaseClassAttr
		//	this.inherited(arguments);
            _WidgetBase.prototype.buildRendering.call(this);

            // FIX ME: We don't want to descend into inner template widgets.
			// recurse through the node, looking for, and attaching to, our
			// attachment points and events, which should be defined on the template node.
			this._attachTemplateNodes(node, function(n,p){ return n.getAttribute(p); });

			this._beforeFillContent();		// hook for _WidgetsInTemplateMixin

            // Nodes already have been copied in rendered template... don't need to do anything else.
	        // 		this._fillContent(this.srcNodeRef);
		},

        // Ensure this function doesn't descend into container nodes of the rendered
        // templates of child widgets. With client-side rendering all the child nodes from
        // the root would be traversed as child widgets haven't been instantiated. In our case,
        // those templates are already availabe.
        _attachTemplateNodes: function(rootNode, getAttrFunc) {
            if (rootNode instanceof Array) {
                return this.inherited(arguments);
            }

            // DFS to find nodes which don't have an associated dojo-type, don't descend
            // into children of these.
            var current = rootNode.firstChild, nodes = []; 

            while(current && current !== rootNode) {
                // Ignore any nodes that are declarative widgets or text nodes.
                if (current.nodeType === 3 || getAttrFunc(current, "data-dojo-type")) {
                    current = current.nextSibling || current.parentNode;
                    continue;
                }

                // If we've not seen this before, add it to the node list 
                // and try to move to child nodes first, other falling back to siblings
                // and then parent.
                if (nodes.indexOf(current) === -1) {
                    nodes.push(current);
                    current = current.firstChild || current.nextSibling || current.parentNode;
                // Node has been seen, previously descended to a child. Just move to next sibling 
                } else {
                    current = current.nextSibling || current.parentNode;
                }
            }

            this.inherited(arguments, [nodes, getAttrFunc]);
        }
    });
});
