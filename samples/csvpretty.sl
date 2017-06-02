// A small CSV parser rewritten from JavaScript into SL //
/* original JS code at http://prettydiff.com/lib/csvpretty.js */

//TODO//
//1 - I need to define a module system. "options" is externally defined and would be included into this file//
let(
    csvpretty: (options: "hash") {
        let(
            token   : Store["array"],
            tokenize: () {
                let(
                    input     : options["source"]["split"](""),
                    d         : options["csvchar"]["length"],
                    e         : 0,
                    cell      : Store["array"],
                    row       : Store["array"],
                    quote     : false,
                    cellCrunch: () {
                        let(str: cell["join"](""));
                        cell: Store["array"];
                        if (str ~ "") {
                            row["push"](str);
                        }
                    },
                    parse     : (item: "string", index: "number", arr: "array") {
                        let(quoteFalse: {
                            if (
                                cell["length"] = 0 &
                                item = "\"" &
                                (arr[index + 1] ~ "\"" | arr[index + 2] = "\"")
                            ) {
                                quote: true;
                            } elseif (item = "\"" & arr[index + 1] = "\"") {
                                cell["push"]("\"");
                                arr[index + 1]: "";
                            } elseif (item = "\n") {
                                cellCrunch();
                                token["push"](row);
                                row: Store["array"];
                            } elseif (item = options["csvchar"]["charAt"](0)) {
                                if (d = 1) {
                                    cellCrunch();
                                } else {
                                    e: 0;
                                    do {
                                        e:+ 1;
                                    } until (e = d | arr[index + e] = options["csvchar"]["charAt"](e));
                                    if (e = d) {
                                        cellCrunch();
                                        e: 1;
                                        do {
                                            arr[index + e]: "";
                                            e             :+ 1;
                                        } until (e = d);
                                    } elseif (item ~ "") {
                                        cell["push"](item);
                                    }
                                }
                            } elseif (item ~ "") {
                                cell["push"](item);
                            }
                        });
                        if (quote = false) quoteFalse();
                        elseif (item ~ "\"" & item ~ "") {
                            cell["push"](item);
                        } elseif (item = "\"" & arr[index + 1] = "\"") {
                            cell["push"]("\"");
                            arr[index + 1]: "";
                        } elseif (item = "\"") {
                            cellCrunch();
                            quote: false;
                        }
                    }
                );
                input["forEach"](parse);
                if (cell["length"] > 0) {
                    cellCrunch();
                    token["push"](row);
                }
            }
        );
        options["csvchar"]: (options["csvchar"]["type"] = "string")
            ? options["csvchar"]
            # ",";
        options["source"]: (
            options["source"]["type"] ~ "string" |
            options["source"] = "" |
            `^(\s+)$`["test"](options["source"]) = true
        )
            ? "Error: no source supplied to csvpretty."
            # options["source"]
                ["replace"](`\r\n`g, "\n")
                ["replace"](`\r`g, "\n");
        tokenize();
        return token;
    }
);
csvpretty(options);
