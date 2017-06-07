/* The first attempt at a parser will be in JavaScript with Node, a platform familiar to me. */
/*global console, module*/
(function sl() {
    "use strict";
    var parser = function sl_parser(input) {
        var a = 0,
            c = input.split(""),
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
            reserved = ["break", "const", "delete", "do", "else", "elseif", "if", "let", "null", "return", "Store", "until"],
            error = false,
            parseError = function sl_parseError(message) {
                var eline = [],
                    x     = a + 1;
                if (x < b) {
                    do {
                        x = x + 1;
                    } while (x < b && c[x] !== "\r" && c[x] !== "\n");
                }
                a = a + 1;
                console.log(message);
                console.log("Line: " + line + " Character: " + (a - col));
                console.log(c.slice(col, x).join(""));
                x = a - col;
                do {
                    eline.push("-");
                    x = x - 1;
                } while (x > 0);
                eline.push("^");
                console.log(eline.join(""));
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
                        if (chars.indexOf(c[a]) < 0) {
                            break;
                        }
                        output.push(c[a]);
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
                    } else if (c[a] === "\r" || c[a] === "\n") {
                        line = line + 1;
                        col  = a;
                        if (c[a] === "\r" && c[a] === "\n") {
                            a = a + 1;
                        }
                    }
                    a = a + 1;
                } while (a < b);
                a = a - 1;
                ltoke = output.join("");
                ltype = "number";
                tokenpush();
            },
            operator = function sl_operator() {
                var extranext = "",
                    cline = line,
                    ccol  = col,
                    d     = token.length - 1;
                if (c[a] === ":" && depth[d] !== "let" && depth[d] !== "const" && (next === "+" || next === "-" || next === "*" || next === "/" || next === "^" || next === "%")) {
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
                                if (c[x] === "\r" || c[x] === "\n") {
                                    cline = cline + 1;
                                    ccol  = x;
                                    if (c[x] === "\r" && c[x] === "\n") {
                                        x = x + 1;
                                    }
                                }
                                x = x + 1; 
                            } while (x < b && (/\s/).test(c[x]) === true);
                        }
                        if (c[x] !== "=") {
                            return "<";
                        }
                        x = x + 1;
                        if ((/\s/).test(c[x]) === true) {
                            if (c[x] === "\r" || c[x] === "\n") {
                                cline = cline + 1;
                                ccol  = x;
                                if (c[x] === "\r" && c[x] === "\n") {
                                    x = x + 1;
                                }
                            }
                            do {
                                x = x + 1; 
                            } while (x < b && (/\s/).test(c[x]) === true);
                        }
                        if (c[x] === ">") {
                            a = x;
                            line = cline;
                            col  = ccol;
                            return "<=>";
                        }
                        return "<";
                    }());
                } else {
                    if (types[d] !== "reference" && (c[a] === "+" || c[a] === "-") && ".0123456789".indexOf(next) > -1 && ((depth[d] !== "let" && depth[d] !== "const") || ltoke === ":")) {
                        return number();
                    }
                    ltoke = c[a];
                }
                if (ltoke === ":" && types[d] === "keyword") {
                    parseError("Reference error, use of a reserved word: " + token[d]);
                    return;
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
                        } else if (c[a] === "\r" || c[a] === "\n") {
                            line = line + 1;
                            col  = a;
                            if (c[a] === "\r" && c[a] === "\n") {
                                a = a + 1;
                            }
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
                    chars  = "=~!@#$%^&*()-+,.<>|{}[]:;`?/\"'",
                    x      = 0;
                do {
                    if ((/\s/).test(c[a]) === false) {
                        output.push(c[a]);
                    } else if (c[a] === "\r" || c[a] === "\n") {
                        line = line + 1;
                        col  = a;
                        if (c[a] === "\r" && c[a] === "\n") {
                            a = a + 1;
                        }
                    }
                    a = a + 1;
                } while (a < b && chars.indexOf(c[a]) < 0);
                a = a - 1;
                ltoke = output.join("");
                if (ltoke === "let" || ltoke === "const") {
                    x = token.length - 1;
                    if (types[x] === "comment") {
                        do {
                            x = x - 1;
                        } while (x > -1 && types[x] === "comment");
                    }
                    if (x > -1 && (depth[x] === "global" || token[x] !== "{")) {
                        if (token[x] !== ";" && token[x - 1] !== ")") {
                            parseError("Parse error, let and const are only allowed once at the top of blocks or once in the global scope.");
                            return;
                        }
                        if (token[x] === ";") {
                            if ((ltoke === "let" && depth[x - 1] !== "const") || (ltoke === "const" && depth[x - 1] !== "let")) {
                                parseError("Parse error, let and const are only allowed once at the top of blocks or once in the global scope.");
                                return;
                            }
                        }
                    }
                }
                if (ltoke === "until" && token[token.length - 1] !== "}" && depth[depth.length - 1] !== "do") {
                    parseError("Parse error, keyword 'until' not following a 'do' block.");
                    return;
                }
                if (ltoke !== "until" && token[token.length - 1] === "}" && depth[depth.length - 1] === "do") {
                    parseError("Parse error, 'do' block not followed by word 'until'.");
                    return;
                }
                if (reserved.indexOf(ltoke) > -1) {
                    ltype = "keyword";
                } else {
                    ltype = "reference";
                }
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
                    } else if (ltype === "keyword" || ltype === "reference") {
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
                    if (ltoke === "do") {
                        name = "do";
                    } else {
                        name = "block";
                    }
                }
                deepness.push([token.length, name]);
                ltoke = c[a];
                ltype = "start";
                tokenpush();
            },
            end   = function sl_end() {
                ltoke = c[a];
                ltype = "end";
                if (ltoke === "}") {
                    if (token[deepness[deepness.length - 1][0]] !== "{") {
                        parseError("Parse error, ending character '" + ltoke + "' doesn't match start character '" + token[deepness[deepness.length - 1][0]] + "'.");
                        return;
                    }
                    if (deepness[deepness.length - 1][1] === "do" && next !== "u") {
                        parseError("Parse error, 'do' block does not appear to be followed by keyword 'until'.");
                        return;
                    }
                }
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