define(["dijit/registry", "dojo/_base/lang", "dijit/main"], function (registry, lang, dijit) {
    // Monkey-patch registry to allow reseting.

    return lang.mixin(registry, {
        _widgetTypeCtr: {
        },

        getUniqueId: function(/*String*/widgetType){
			// summary:
			//		Generates a unique id for a given widgetType

			var id;
			do{
				id = widgetType + "_" +
					(widgetType in this._widgetTypeCtr ?
						++this._widgetTypeCtr[widgetType] : this._widgetTypeCtr[widgetType] = 0);
			}while(this._hash[id]);
			return dijit._scopeName == "dijit" ? id : dijit._scopeName + "_" + id; // String
		},

        reset: function () {
            this._widgetTypeCtr = {};

            for(var prop in this._hash) {
                delete this._hash[prop];
            }
        }
    });
});
