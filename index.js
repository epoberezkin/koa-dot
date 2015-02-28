var doT = require('dot');


module.exports = function(options) {
    var layout = options.layout === true ? 'layout' : options.layout
        , body = options.body || 'body';
    setInterpolationSymbols(options);
    var templates = doT.process(options);

    return function *views(next) {
        this.render = render;
        yield next;


        function *render(view, state) {
            state = state || this.state;
            var html = templates[view](state);

            if (layout) {
                state[body] = html;
                this.body = templates[layout](state);
            } else
                this.body = html;

            this.type = 'text/html';
        }
    }
}


copy(doT, module.exports); // version, templateSettings, template, compile, process


function setInterpolationSymbols(options) {
    if (options.interpolation) {
        var regexpStringPattern = /^\/(.*)\/([gimy]*)$/;
        var interpolations = {};
        var startSymbol = _regexStr(options.interpolation.start)
            , endSymbol = _regexStr(options.interpolation.end);
        for (var key in doT.templateSettings) {
            var setting = doT.templateSettings[key];
            if (setting instanceof RegExp) {
                var regexStr = setting.toString();
                regexStr = regexStr
                            .replace(/\\\{\\\{/g, startSymbol)
                            .replace(/\\\}\\\}/g, endSymbol);
                interpolations[key] = _toRegExp(regexStr);
            }
        }

        var settings = copy(doT.templateSettings);
        if (options.templateSettings)
            settings = copy(options.templateSettings, settings);
        options.templateSettings = copy(interpolations, settings);
    }


    function _regexStr(str) {
        return str.replace(/([^a-z0-9_])/ig, '\\$1')
    }

    function _toRegExp(str) {
        var rx = str.match(regexpStringPattern);
        if (rx) return new RegExp(rx[1], rx[2]);
    }
}


function copy(o, to) {
    to = to || {};
    for (var key in o) to[key] = o[key];
    return to;
}
