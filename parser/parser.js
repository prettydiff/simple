/* The first attempt at a parser will be in JavaScript with Node, a platform familiar to me. */
/*jslint node:true*/
(function sl() {
    "use strict";
    var parser = function sl_parser(input) {
        var a = 0,
            c = (typeof input === "string")
                ? input
                : process.argv[2].split(""),
            b = c.length,
            token = [],
            types = [],
            depth = [],
            begin = [],
            deepness = [[0, "global"]],
            next  = "",
            ltoke = "",
            ltype = "",
            line  = 1,
            col   = 0,
            error = false,
            parseError = function sl_parseError(message) {
                console.log(message);
                console.log("Line: " + line + " Character: " + (a - col));
                error = true;
            },
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
                    if (c[a] === "\n" || c[a] === "\r") {
                        line = line + 1;
                        col  = a;
                        if (c[a] === "\r" && c[a] === "\n") {
                            a = a + 1;
                        }
                    }
                    a = a + 1;
                } while ((/\s/).test(c[a]) === true && a < b);
                x = a;
                do {
                    x = x + 1;
                } while ((/\s/).test(c[x]) === true && x < b);
                next = c[x];
                return c[a];
            },
            number = function sl_number() {
                var output = [],
                    chars  = ".0123456789",
                    period = false;
                if (c[a] === "+" || c[a] === "-") {
                    if (chars.indexOf(next) > -1) {
                        output.push(c[a]);
                        a = a + 1;
                    } else {
                        parseError("Improper use of arithmetic operator: " + c[a]);
                    }
                }
                do {
                    if ((/\s/).test(c[a]) === false) {
                        output.push(c[a]);
                    }
                    if (c[a] === ".") {
                        if (period === true) {
                            parseError("Malformed number, extra period: " + c[a]);
                            return;
                        }
                        period = true;
                    }
                    if (c[a] === "+" || c[a] === "-") {
                        parseError("Improper use of arithmetic operator: " + c[a]);
                        return;
                    }
                    a = a + 1;
                } while (a < b && chars.indexOf(c[a]) > -1);
                a = a - 1;
                ltoke = output.join("");
                ltype = "number";
                tokenpush();
            },
            operator = function sl_operator() {
                var extranext = "";
                if (c[a] === ":" && (next === "+" || next === "-" || next === "*" || next === "/" || next === "^" || next === "%")) {
                    ltoke = ":" + next;
                    a = a + 1;
                    extranext = a;
                    if (c[a] !== next) {
                        white();
                        if (".0123456789".indexOf(next) > -1) {
                            ltoke = ":";
                            a = extranext;
                        }
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
                    if ((c[a] === "+" || c[a] === "-") && ".0123456789".indexOf(next) > -1) {
                        return number();
                    }
                    ltoke = c[a];
                }
                ltype = "operator";
                tokenpush();
            },
            generic = function sl_generic(ending) {
                var x = a,
                    output = [];
                do {
                    output.push(c[x]);
                    if (x > a && c[x] === ending.charAt(0)) {
                        if (c[x - 1] !== "\\" || (c[x - 1] === "\\" && esc(x) === false)) {
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
            },
            word  = function sl_word() {
                var output = [],
                    chars  = "=~!@#$%^&*()-+,.<>|{}[]:;`?/\"'";
                do {
                    if ((/\s/).test(c[a]) === false) {
                        output.push(c[a]);
                    }
                    a = a + 1;
                } while (a < b && chars.indexOf(c[a]) < 0);
                a = a - 1;
                ltoke = output.join("");
                ltype = "word";
                tokenpush();
            },
            start = function sl_start() {
                var hint = token[[begin[begin.length - 1]] - 1],
                    name = "";
                if (c[a] === "(") {
                    if (ltoke === "until") {
                        name = "until";
                    } else {
                        name = "paren";
                    }
                } else if (c[a] === "[") {
                    name = "property";
                } else {
                    if (hint === "if") {
                        name = "if";
                    } else if (hint === ":") {
                        name = "function";
                    } else {
                        name = "block";
                    }
                }
                deepness.push([a, name]);
                ltoke = c[a];
                ltype = "start";
                tokenpush();
            },
            end   = function sl_end() {
                ltoke = c[a];
                ltype = "end";
                tokenpush();
                deepness.pop();
            };
        do {
            if (error === true) {
                return;
            }
            white(false);
            if (c[a] === "\"" || c[a] === "'") {
                ltype = "string";
                generic(c[a]);
            } else if (c[a] === "/" && (next === "*" || next === "/")) {
                ltype = "comment";
                generic(next + "/");
            } else if ("<>=~&|:?#+-*/^%!".indexOf(c[a]) > -1) {
                operator();
            } else if (c[a] === "," || c[a] === ";") {
                ltype = "separator";
                ltoke = c[a];
                tokenpush();
            } else if (c[a] === "(" || c[a] === "[" || c[a] === "{") {
                start();
            } else if (c[a] === ")" || c[a] === "]" || c[a] === "}") {
                end();
            } else if ("+-.0123456789".indexOf(c[a]) > -1) {
                number();
            } else {
                word();
            }
            a = a + 1;
        } while (a < b);
        return (function sl_formatOutput() {
            var output = [],
                x = 0,
                len = token.length;
            do {
                output.push([token[x], types[x], depth[x], begin[x]]);
                x = x + 1;
            } while (x < len);
            return output;
        }());
        /*return {
            token: token,
            types: types,
            depth: depth,
            begin: begin
        };*/
    };
    if (typeof module === "object") {
        module.exports = function commonjs_parser(x) {
            return parser(x);
        };
    }
}());