/* The first attempt at a parser will be in JavaScript with Node, a platform familiar to me. */
/*jslint node:true*/
(function sl() {
    "use strict";
    var parser = function sl_parser(input) {
        var a = 0,
            c = (typeof input === "string")
                ? input.split("")
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
            ops   = "<>=~&|:?#+-*/^%!",
            line  = 1,
            col   = 0,
            error = false,
            parseError = function sl_parseError(message) {
                a = a + 1;
                console.log(message);
                console.log("Line: " + line + " Character: " + (a - col));
                console.log(c.slice(col, a).join(""));
                error = true;
            },
            esc   = function sl_esc(x) {
                var y = x;
                if (c[x - 1] !== "\\") {
                    return true;
                }
                do {
                    y = y - 1;
                } while (y > -1 && c[y] === "\\");
                if ((x - y) % 2 === 1) {
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
                var x = a,
                    y = 0;
                if ((/\s/).test(c[a]) === false) {
                    if ((/\s/).test(c[a + 1]) === false) {
                        next = c[a + 1];
                    } else {
                        do {
                            x = x + 1;
                        } while ((/\s/).test(c[x]) === true && x < b);
                        next = c[x];
                    }
                    return x;
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
                return x;
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
                        return;
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
                    output = [],
                    reg    = "gmiuy";
                do {
                    output.push(c[x]);
                    if (x > a && c[x] === ending.charAt(0)) {
                        if (c[x - 1] !== "\\" || (c[x - 1] === "\\" && esc(x - 1) === false)) {
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
                white();
                if (ltype === "regex" && reg.indexOf(next) > -1) {
                    a = a + 1;
                    do {
                        if (ops.indexOf(c[a]) > -1 || c[a] === "," || c[a] === ";" || c[a] === "[") {
                            break;
                        }
                        if ((/\s/).test(c[a]) === false) {
                            if (reg.indexOf(c[a]) < 0) {
                                parseError("Extraneous characters following a regular expression: " + c[a]);
                                return;
                            }
                            output.push(c[a]);
                            reg = reg.replace(c[a], "");
                        }
                        a = a + 1;
                    } while (a < b && reg !== "");
                    a = a - 1;
                }
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
                    if (ltoke === "until" || ltoke === "let" || ltoke === "const") {
                        name = ltoke;
                    } else if (ltoke === "if" || ltoke === "elseif" || ltoke === "until") {
                        name = "condition";
                    } else if (ltype === "word") {
                        name = "method";
                    } else {
                        name = "paren";
                    }
                } else if (c[a] === "[") {
                    name = "property";
                } else if (ltoke === ")" && c[a] === "{") {
                    if (hint === "if" || hint === "elseif") {
                        name = "if";
                    } else if (hint === ":") {
                        name = "function";
                    } else {
                        name = "block";
                    }
                } else {
                    name = "block";
                }
                deepness.push([token.length, name]);
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
                return {};
            }
            white();
            if (a === b) {
                break;
            }
            if (c[a] === "\"" || c[a] === "'") {
                ltype = "string";
                generic(c[a]);
            } else if (c[a] === "/" && (next === "*" || next === "/")) {
                ltype = "comment";
                generic(next + "/");
            } else if (c[a] === "`") {
                ltype = "regex";
                generic("`");
            } else if (ops.indexOf(c[a]) > -1) {
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
        return {
            token: token,
            types: types,
            depth: depth,
            begin: begin
        };
    };
    if (typeof module === "object") {
        module.exports = function commonjs_parser(x) {
            return parser(x);
        };
    }
}());