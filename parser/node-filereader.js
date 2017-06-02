(function fs() {
    "use strict";
    var node = {
            fs: require("fs"),
            path: require("path")
        },
        parser = require("." + node.path.sep + "parser");
    node.fs.readFile(process.argv[2], "utf8", function (err, data) {
        if (err !== null) {
            return console.log(err);
        }
        console.log(parser(data));
    });
}());