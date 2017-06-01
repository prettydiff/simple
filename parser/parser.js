/* The first attempt at a parser will be in JavaScript with Node, a platform familiar to me. */
(function sl() {
    "use strict";
    var a = 0,
        c = process.argv[2].split(""),
        b = c.length,
        token = [],
        types = [],
        depth = [],
        begin = [],
        deepness = [[0, "global"]],
        next  = "",
        ltoke = "",
        ltype = "",
        esc   = function sl_esc(x) {
            var y = x;
            do {
                y = y - 1;
            } while (y > -1 && c[y] === "\\");
            if ((y - x) % 2 === 1) {
                return true;
            }
            return false;
        },
        tokenpush = function sl_tokenpush() {
            token.push(ltoke);
            types.push(ltype);
            begin.push(deepness[deepness.length - 1][0]);
            depth.push(deepness[deepness.length - 1][1]);
        },
        white = function sl_white() {
            var x = a;
            if ((/\s/).test(c[a]) === false) {
                if ((/\s/).test(c[a + 1]) === false) {
                    next = c[a + 1];
                } else {
                    do {
                        x = x + 1;
                    } while ((/\s/).test(c[x]) === true && x < b);
                    next = c[x];
                }
                return c[a];
            }
            do {
                a = a + 1;
            } while ((/\s/).test(c[a]) === true && a < b);
            do {
                x = x + 1;
            } while ((/\s/).test(c[x]) === true && x < b);
            next = c[x];
            return c[a];
        },
        operator = function sl_operator() {
            if (c[a] === ":" && (next === "+" || next === "-" || next === "*" || next === "/" || next === "^" || next === "%")) {
                ltoke === ":" + next;
                a = a + 1;
                if (c[a] !== next) {
                    white();
                    a = a + 1;
                }
            } else if (c[a] === "<" && next === "=") {
                ltoke = (function sl_operator_trichotomy() {
                    var x = a + 1;
                    if ((/\s/).test(c[x]) === true) {
                        do {
                            x = x + 1; 
                        } while (x < b && (/\s/).test(c[x]) === true);
                    }
                    if (c[x] !== "=") {
                        return "<";
                    }
                    x = x + 1;
                    if ((/\s/).test(c[x]) === true) {
                        do {
                            x = x + 1; 
                        } while (x < b && (/\s/).test(c[x]) === true);
                    }
                    if (c[x] === ">") {
                        a = x;
                        return "<=>";
                    }
                    return "<";
                }());
            } else {
                ltoke = c[a];
            }
            tokenpush();
        },
        generic = function sl_generic(ending) {
            var x = a,
                output = [];
            do {
                output.push(c[x]);
                if (x > a && c[x] === ending.charAt(0)) {
                    if (c[x - 1] !== "\\" || (c[x - 1] === "\\" && esc(x) === false) {
                        if (ending.length === 1) {
                            break;
                        }
                        if (c[x + 1] === ending.charAt(1)) {
                            x = x + 1;
                            output.push(c[x]);
                            break;
                        }
                    }
                }
                x = x + 1;
            } while (x < b);
            a = x;
            ltoke = output.join("");
            tokenpush();
        };
    do {
        white(false);
        if (c[a] === "\"" || c[a] === "'") {
            ltype = "string";
            generic(c[a]);
        } else if (c[a] === "/" && (next === "*" || next === "/")) {
            ltype = "comment";
            generic(next + "/");
        } else if ("<>=~&|:?#+-*/^%!".indexOf(c[a]) > -1) {
            ltype = "operator";
            operator();
        }
        a = a + 1;
    } while (a < b);
    console.log(token);
    return {
        token: token,
        types: types,
        depth: depth,
        begin: begin
    }
}());