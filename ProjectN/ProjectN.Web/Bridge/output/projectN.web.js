(function (globals) {
    "use strict";

    Bridge.define('ProjectN.Web.App', {
        statics: {
            config: {
                init: function () {
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                // Simple alert() to confirm it's working
                Bridge.global.alert("Success");
            }
        }
    });
    
    Bridge.init();
})(this);
