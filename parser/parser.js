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
            lengt = [],
            chain = [],
            claim = [],
            scope = [],
            scopes = [],
            argstore = {},
            deepness = [[0, "global"]],
            next  = "",
            ltoke = "",
            ltype = "",
            ops   = "<>=~&|:?#+-*/^%!",
            line  = 1,
            col   = 0,
            len   = -1,
            unterm = [0, 0],
            reserved = ["break", "const", "delete", "do", "else", "elseif", "false", "if", "let", "null", "return", "Store", "true", "until"],
            error = false,
            parseError = function sl_parseError(message) {
                var eline = [],
                    x     = a + 1,
                    code  = "",
                    count = "";
                if (x < b) {
                    do {
                        x = x + 1;
                    } while (x < b && c[x] !== "\r" && c[x] !== "\n");
                }
                a = a + 1;
                console.log("");
                console.log(message);
                code = c.slice(col, x).join("");
                code = code.replace(/\r/g, "\n").replace(/^(\n+)/, "").split("\n")[0];
                console.log(code);
                x = a - col;
                if (x > code.length) {
                    x = code.length;
                    count = "Line: " + line + " Character: " + x;
                } else {
                    count = "Line: " + line + " Character: " + (a - col);
                }
                do {
                    eline.push("-");
                    x = x - 1;
                } while (x > 0);
                eline.push("^");
                console.log(eline.join(""));
                console.log(count);
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
                len = len + 1;
                token.push(ltoke);
                types.push(ltype);
                begin.push(deepness[deepness.length - 1][0]);
                depth.push(deepness[deepness.length - 1][1]);
                if (ltoke === "{" || len < 1) {
                    scopes.push(len);
                    claim.push(-1);
                    (function sl_tokenpush_chains() {
                        var chains = [],
                            x = 0,
                            y = scopes.length;
                        do {
                            chains.push(scopes[x]);
                            x = x + 1;
                        } while (x < y);
                        chain.push(chains);
                    }());
                    scope.push({
                        "const" : [],
                        "let"   : []
                    });
                    if (token[len - 1] === ">") {
                        (function so_tokenpush_arguments() {
                            var args = Object.keys(argstore[begin[len - 1]]),
                                x = 0,
                                y = args.length;
                            do {
                                scope[len].let.push(args[x]);
                                claim[argstore[begin[len - 1]][args[x]]] = len;
                                x = x + 1;
                            } while (x < y);
                            delete argstore[begin[len - 1]];
                        }());
                    }
                } else if (ltoke === "<" && ltype === "start") {
                    argstore[len] = {};
                    chain.push([]);
                    scope.push({});
                    claim.push(-1);
                } else {
                    if (ltoke === "}") {
                        scopes.pop();
                    }
                    chain.push([]);
                    scope.push({});
                    if (ltype === "reference") {
                        if (depth[len] === "let" || depth[len] === "const") {
                            claim.push(scopes[scopes.length - 1]);
                        } else if (depth[len] !== "arguments") {
                            (function sl_tokenpush_claims() {
                                var x = scopes.length - 1;
                                do {
                                    if (scope[scopes[x]].let.indexOf(ltoke) > -1 || scope[scopes[x]].const.indexOf(ltoke) > -1) {
                                        return claim.push(scopes[x]);
                                    }
                                    x = x - 1;
                                } while (x > -1);
                            parseError("Undeclared reference: " + ltoke);
                            }());
                        } else {
                            claim.push(-1);
                        }
                    } else {
                        claim.push(-1);
                    }
                }
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
                        return parseError("Improper use of arithmetic operator: " + c[a]);
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
                                return parseError("Malformed number, extra period: " + c[a]);
                            }
                            period = true;
                        }
                        if (c[a] === "+" || c[a] === "-") {
                            return parseError("Improper use of arithmetic operator: " + c[a]);
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
                    ccol  = col;
                if (c[a] === ":" && depth[len] !== "let" && depth[len] !== "const" && (next === "+" || next === "-" || next === "*" || next === "/" || next === "^" || next === "%")) {
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
                    if (types[len] !== "reference" && (c[a] === "+" || c[a] === "-") && ".0123456789".indexOf(next) > -1 && ((depth[len] !== "let" && depth[len] !== "const") || ltoke === ":")) {
                        return number();
                    }
                    ltoke = c[a];
                }
                if (ltoke === ":") {
                    if (types[len] === "keyword") {
                        return parseError("Reference error, use of a reserved word: " + token[len]);
                    }
                    if (types[len] === "reference") {
                        if (depth[len] === "let" || depth[len] === "const") {
                            scope[begin[begin[len] - 1]][depth[len]].push(token[len]);
                        } else if (depth[len] === "arguments") {
                            argstore[begin[len]][token[len]] = len;
                        }
                    }
                }
                ltype = "operator";
                tokenpush();
            },
            generic = function sl_generic(ending) {
                var x = a,
                    output = [],
                    reg    = "gmiuy",
                    sline  = line;
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
                    if (c[x] === "\r" || c[x] === "\n") {
                        if (unterm[0] === 0 && c.slice(col, x).join("").split(ending).length > 2) {
                            unterm = [col, line];
                        }
                        line = line + 1;
                        col  = x;
                        if (c[x] === "\r" && c[x + 1] === "\n") {
                            x = x + 1;
                        }
                    }
                    x = x + 1;
                } while (x < b);
                if (x === b) {
                    line = sline;
                    col  = a;
                    parseError("Unterminated " + ltype + ".");
                    if (unterm[0] > 0) {
                        line = unterm[1];
                        col  = unterm[0];
                        parseError("Problem could originate from line: " + unterm[1]);
                    }
                    return;
                }
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
                    x = len;
                    if (types[x] === "comment") {
                        do {
                            x = x - 1;
                        } while (x > -1 && types[x] === "comment");
                    }
                    if (x > -1 && (depth[x] === "global" || token[x] !== "{")) {
                        if (token[x] !== ";" && token[x - 1] !== ")") {
                            return parseError("Parse error, let and const are only allowed once at the top of blocks or once in the global scope.");
                        }
                        if (token[x] === ";") {
                            if ((ltoke === "let" && depth[x - 1] !== "const") || (ltoke === "const" && depth[x - 1] !== "let")) {
                                return parseError("Parse error, let and const are only allowed once at the top of blocks or once in the global scope.");
                            }
                        }
                    }
                }
                if (ltoke === "until" && token[len] !== "}" && depth[len] !== "do") {
                    return parseError("Parse error, keyword 'until' not following a 'do' block.");
                }
                if (ltoke !== "until" && token[len] === "}" && depth[len] === "do") {
                    return parseError("Parse error, 'do' block not followed by word 'until'.");
                }
                if (reserved.indexOf(ltoke) > -1) {
                    if (ltoke === "true" || ltoke === "false") {
                        ltype = "boolean";
                    } else {
                        ltype = "keyword";
                    }
                } else {
                    ltype = "reference";
                }
                tokenpush();
                /*x = token.length - 1;
                if (token[begin[x]] === "(" && token[begin[x] - 1] === ":") {
                    if (token[x - 1] !== "," && x > begin[x] + 1) {
                        a = a - 1;
                        return parseError("Parse error, either a single reference or comma separated references as declarations of function arguments, but instead saw: " + token[x - 1]);
                    }
                    if (ltype === "keyword") {
                        return parseError("Parse error, expected a reference assignment to a string in function argument position but instead saw a reserved word " + token[x]);
                    }
                    white();
                    if (next !== ":") {
                        a = a - 1;
                        return parseError("Parse error, expected an assignment to a string for function arguments but instead saw: " + next);
                    }
                    ltoke = ":";
                    ltype = "operator";
                    a = a + 1;
                    tokenpush();
                    white();
                    if (next !== "\"" && next !== "'") {
                        a = a - 1;
                        return parseError("Parse error, expected an assignment to a string for function arguments but instead saw: " + next);
                    }
                }*/
            },
            start = function sl_start() {
                var hint  = token[[begin[len]] - 1],
                    name  = "";
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
                } else if (c[a] === "<") {
                    name = "arguments";
                } else if (ltoke === ")" && c[a] === "{") {
                    if (hint === "if" || hint === "elseif") {
                        name = "if";
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
                        return parseError("Parse error, ending character '" + ltoke + "' doesn't match start character '" + token[deepness[deepness.length - 1][0]] + "'.");
                    }
                    if (deepness[deepness.length - 1][1] === "do" && next !== "u") {
                        return parseError("Parse error, 'do' block does not appear to be followed by keyword 'until'.");
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
            } else if (c[a] === "(" || c[a] === "[" || c[a] === "{" || (c[a] === "<" && ltoke === ":")) {
                start();
            } else if (c[a] === ")" || c[a] === "]" || c[a] === "}" || (c[a] === ">" && depth[len] === "arguments")) {
                end();
            } else if (ops.indexOf(c[a]) > -1) {
                operator();
            } else if (c[a] === "," || c[a] === ";") {
                ltype = "separator";
                ltoke = c[a];
                tokenpush();
            } else if ("+-.0123456789".indexOf(c[a]) > -1) {
                number();
            } else {
                word();
            }
            a = a + 1;
        } while (a < b);
        return {
            // * token - parsed code
            // * types - parsed token category (not data type)
            // * depth - the code structure in which the token resides
            // * begin - token index of "depth" start
            // * claim - where in the scope chain a reference is declared, only populated on references
            // * chain - index list of scope chain, only populated "{" tokens
            // * scope - references declared to the local block, only populated "{" tokens
            token: token,
            types: types,
            depth: depth,
            begin: begin,
            claim: claim,
            chain: chain,
            scope: scope
        };
    };
    if (typeof module === "object") {
        module.exports = function commonjs_parser(x) {
            return parser(x);
        };
    }
}());