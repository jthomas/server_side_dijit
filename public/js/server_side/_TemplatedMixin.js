define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin"], function (declare, _WidgetBase, _TemplatedMixin) {

    var old = _TemplatedMixin.prototype.buildRendering;
        
    _TemplatedMixin.prototype.buildRendering = function () {
        if (!this.serverSide) {
            return old.call(this);
        }

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
    };



    return declare(null, {

        serverSide: true,

        stopParser: true,
        
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
