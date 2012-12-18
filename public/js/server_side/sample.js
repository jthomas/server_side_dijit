define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", 
        "dojo/text!./sample.html", "dijit/form/Button"],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            click: function () {
                console.log("Clicked...");
            }
        });
    }
);
