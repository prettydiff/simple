(function fs() {
    "use strict";
    var node = {
            fs: require("fs"),
            path: require("path")
        },
        parser = require("." + node.path.sep + "parser");
    node.fs.readFile(process.argv[2], "utf8", function (err, filedata) {
        var output = [],
            formatted = [],
            longest = [],
            longestv = [],
            keys = [],
            debug = (process.argv.indexOf("--debug") > 0),
            str  = "",
            a = 0,
            b = 0,
            c = 0,
            d = 0,
            len = 0;
        if (err !== null) {
            return console.log(err);
        }
        output = parser(filedata);
        keys = Object.keys(output);
        if (keys.length < 1) {
            return;
        }
        len = output[keys[0]].length;
        c = keys.length;
        do {
            longest.push(0);
            longestv.push("");
            a = a + 1;
        } while (a < c);
        a = 0;
        do {
            formatted.push([]);
            b = 0;
            do {
                str = output[keys[b]][a].toString();
                formatted[a].push(str);
                if (str.length > longest[b]) {
                    longest[b] = str.length;
                    longestv[b] = str;
                }
                b = b + 1;
            } while (b < c);
            a = a + 1;
        } while (a < len);
        a = 0;
        do {
            b = 0;
            do {
                d = formatted[a][b].length;
                if (b < 1) {
                    d = d +
                        (formatted[a][b].split("\\(?!(\w))").length - 1);
                }
                if (d < longest[b]) {
                    do {
                        if (b < c - 1) {
                            formatted[a][b] = formatted[a][b] + " ";
                        } else {
                            formatted[a][b] = " " + formatted[a][b];
                        }
                        d = d + 1;
                    } while (d < longest[b]);
                }
                b = b + 1;
            } while (b < c);
            if (debug === false) {
                console.log(formatted[a].join(" "));
            }
            a = a + 1;
        } while (a < len);
    });
}());