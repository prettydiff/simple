# Simple Language
An eductional language to speed learning of logic and automation with sacrifice to convention and syntax.

**Status:** Early pre-alpha (experimental)



## Todo
### Priorities
* module system
   - import(list of refs) from "URI";
   - include("URI");
   - export
* interpreter/repl
* choose a number system that is more precise than IEEE double floating point precision, here are some candidates:
   - DEC64
   - libdfp

### Concerns
* investigate Set containers: access, iteration, use cases
* evaluate chosen number format to determine if words can start with numbers
* The return function will terminate a block.  Investigate if this is a problem where a function contains numerous blocks.
* should references be unique to their scope chain
* The parens for function argument declarations are overloaded syntax.  I need to find different characters for those parens.

### Tasks
* document explicit error states
* determine alpha character support in numbers to determine radix and numeric constants
* define default methods
* a random number method, possibly a global Math object with various methods for things like E, PI, min, max



## Motivation
According to data from multiple sources JavaScript is the most popular language in the world.  Unfortunately, it is rarely formally taught, and most developers cannot adequetely figure it out so as to become competent without significant help.  Worse still is that there are many pitfalls in JavaScript that frequently trip up and slow down seasoned experts without help from static analysis tools.  Worst of all is that JavaScript has no shortage of controversy and inflated holy wars.  These are all problems that can be solved provided the language were designed with these problems in mind.

Simple Language is designed to be single paradigm language with syntax that isn't open to confusion.  The goal is to provide a language that is easy for programmers of all levels to understand without sacrifice to performance or expressiveness.



## Execution
A language interpreter will be coming soon.  In the mean time I am writing the first parser in JavaScript.  The actual parser file is API agnostic, but a helper file for reading files and writing a parse table to console is available for execution with Node.js.



## Design theory
* block scoped and lexical scope natively by default
* garbage collected
* no hoisting
* the only white space are white space characters found in strings, comments, and regular expressions
* no inheritance/this/new
* implicit public/private
* no try/catch
* minimize syntax overloading
* no bitwise
* no implied syntax or automatic syntax character insertion.  Syntax is explicit.
* data types are strong/static



## Definition of terms
* **argument** - A value passed into a function.  Same as parameter.
* **block** - A block is a bag of instructions. Blocks always begin with an opening curly brace and end with a closing curly brace.  Blocks provide scope and references may be declared in any block.
* **expression** - An expression is a bit of code that asks the computer for an opinion, called evaluation.  This could be as simple as comparing one number to another number or checking the length of a string.  Expressions are wrapped in parentheses.
* **method** - A function accessed as the property of a reference.
* **object** - A generic term for any non-primitive data type.
* **parameter** - A value passed into a function.  Same as argument.
* **property** - A subreferrence accessed through a reference.  Properties are always accessed with square braces.
* **reference** - A named assigned to a primitive or object.
* **statement** - A statement is an action.  It can be as primitive as simply calling a reference, or it can provide a multitude of instructions.  Statements are terminated with semicolons.



## Comments
* star comments - `/* */`
* slash comments - `// //`

Unclosed comments will not generate a parse error.  The unclosed comment will comment until either the terminating sequence is encountered or at end of file.



## Syntax
### Overloaded characters
* `<>`
   - *Comparison operators* - Most commonly angle braces exist as less than and greater than comparison operators.
   - *Trichotomy operator* - If these characters are present with the equality operator between them they form the trichotomy operator: `<=>`.
   - *Function argument declaration* - If a less than character immediately follows the assignment operator it opens a structure for declaring function operations.  This structure terminates with a greater than character and the following character is expected to be a curly brace. This following block is a function body.

### Comparison operators
* `=` equality
* `~` inequality
* `<` less than
* `>` greater than
* `<=>` trichotomy, returns -1, 0, or 1 if respectively: less, equal, or greater
* `&` logical and
* `|` logical or

### Grouping operators
* `(` logical group start
* `)` logical group end
* `{` block start
* `}` block end
* `[` property start
* `]` property end
* \` regular expression start and end

### Assignment/reference operators
* `:` assignment
* `?` ternary primary 
* `#` ternary secondary (else)
* `,` list separator

### Arithmetic operators
* `+` addition
* `-` subtraction
* `*` multiplication
* `/` division
* `^` exponentiation
* `%` modulo

### Arithmetic assignment operators
* `:+` addition assignment (increment)
* `:-` subtraction assingment (decrement)
* `:*` multiplication assignment
* `:/` division assignment
* `:^` exponentiation assignment
* `:%` modulo assignment

### Other reserved characters
* `!` string concatenation
* `\` escape sequence
* `;` statement termination
* `"` string delimiter
* `'` string delimiter
* `.` number decimal separator (only available in number data types)

### Unicode Character Entities
Unicode character entities are only available within strings.

* `\uXXXX` where X represents a hexadecimal digit 0-9 or a-f, for example `\u039b` would evaluate to Greek capital Lambda.  This 4 character entity form a single byte Unicode code point is specified.
* `\u{XXXXX}` where X represents a hexadecimal digit 0-9 or a-f.  This 5 character entity evaluates to a double byte Unicode character.  `\u{220a3}` is identical to `\ud848\udca3`

An incomplete Unicode character entity will generate an error.

### Recognized White Space Characters
* `\u0009` - tab
* `\u000a` - line feed (LF)
* `\u000c` - form feed (FF)
* `\u000d` - carriage return (CR)
* `\u0020` - space
* `\u00a0` - no-break space
* `\u1680` - ogham space mark
* `\u180e` - mongolian vowel separator
* `\u2000` - en quad
* `\u2001` - em quad
* `\u2002` - en space
* `\u2003` - em space
* `\u2004` - three-per-em space
* `\u2005` - four-per-em space
* `\u2006` - six-per-em space
* `\u2007` - figure space
* `\u2008` - punctuation space
* `\u2009` - thin space
* `\u200a` - hair space
* `\u2028` - line separator
* `\u2029` - paragraph separator
* `\u202f` - narrow no-break space
* `\u205f` - medium mathematical space
* `\u2b7f` - vertical tab
* `\u3000` - ideographic space
* `\ufeff` - zero-width non-breaking space

Please note that non-visible white space characters that exist as gramatic constructs to bind or separate words are deliberately excluded from this list: \u200b, \u200c, \u200d, \u2060, \u2063.

### Words: keywords and references
Words may be comprised of any Unicode character with exception to the following list:

* No white space characters
* case sensitive
* No binary/control characters
* No characters specified in the syntax section
* References cannot be named any of the defined keywords or globals
* None of these specific characters as they are reserved for future use
   - `@` (at symbol)
   - `$` (dollar)



## Data Types
### Definitions
#### Primitives (passed by value)
It should be noted that null values exist in this language, but are not a data type. Null can be assigned to a reference, but not within a *let* or *const* function.  The point of null is to unset a value from a reference by instead providing something that is both neutral and useless.  An assignment of null will not cause an error and will not change the reference's *type* property.  Attempting to access or execute any property of a reference with a null value will cause an error.

* string - Strings are delimited by single and double quote characters and store a raw sequence of text characters. Strings may contain any manner of white space and span across multiple lines.
   - "cat"
   - 'dog'
   - "bird\\"s"
   - 'book"s'
* number - This language features a single number type based upon chosen number format.
   - 0
   - 12345678
   - -23
   - -123.45678912
* boolean - true or false
* regex - JavaScript style regular expressions.

#### Non-primitives (passed by reference)
* function - A bag of instructions that accepts parameters for input and always returns a value, where that value is the function itself by default if the return function isn't specified.
   - Declared by applying a angle brace delimiters between assignment and a block.
   - `cat: <> {console.log("meow");}`
   - Executed when a parethesis grouping follows the function's reference.
   - `cat(); // returns the actual function because a return value isn't specific and executes its instructions //`
   - Without the following parenthesis the reference to the function itself is passed without executing the function.
   - `cat; // returns the actual function without executing its instructions //`
   - Provide the return function to specify output for the function.
   - `cat: <x:"number"> {return(x + 1)}; cat(3); // returns 4`
* array - A list of dynamic length where keys are 0 based incrementing integers and values are of any data type. Every index must have a value.  Sparse arrays will throw an error.
   - Declared by use of the global Store hash's array property.
   - `animals: Store.array("cat", "dog", "parrot")`
   - Indexes are accessed by use of square braces upon the reference.
   - `animals[0]; // returns "cat" //`
* hash - A key/value store where the keys are of type "string" and the values are of any data type.
   - Declared by use of the global Store hash's hash property.
   - `animals: Store.hash("cat": "meow", "dog": "bark", "parrot": "squawk")`
   - Properties are accessed by use of square braces upon the reference.
   - `animals["cat"]; // returns "meow" //`
* map - A key/value store where the keys are of any data type and the values are of any data type.
   - Declared by use of the global Store hash's map property.
   - `animals: Store.map(myHashj: "sounds")`
   - Properties are accessed by square braces where a reference, number or string is passed in.
   - `animals[myHash] // returns "sounds" //` 
* set - An iterable container of items where each item is unique and of any data type.
   - Declared by use of the global Store hash's set property.
   - `animals: Store.set(myFunction)`
   - Items in a set return the item of reference or null in the case where item is reference but not present in the set.
   - `animals[myFunction] // returns myFunction //`
   - `animals[myCat] // returns null //`
* block - A bag of instructions that always returns itself. The block code is the literal value.
   - Declared by assignment to a block, similar to a function but without the preceeding parenthesis.
   - `animals: {code instructions go in here;}`
   - Executed when a parethesis grouping follows the block's reference.
   - `animal(); // executes the code in the block and always returns null //`
   - Without the following parenthesis the reference to the block itself (the code) is passed without executing the instructions in the block.
   - `animal; // returns the block itself //`

The types array, hash, map, and set are all iterable.  Except for arrays, the contents of these types reside in the order with which they were added.  Type checking is ignored for assignments to values in the storage types, so that a value of a different data type can assigned to an existing key.

### Function Arguments
The function data type is unique in that this is the only data type that receives input into locally created referrences called *arguments* or *parameters*.  When these arguments are declared they must be assigned to a string value representing a data type.  The absence of this assignment will cause a parse error.  Any value is permitted for this string, including an empty string, to avoid a parse error.  The referrence or value submitted to the function in position of this argument must match the assigned data type or a type error will be thrown.  Here are some examples:

```
let(myFunction: <source: "string", index: "number"> {
    return();
});
myFunction("a big long string", 1234); // good //
myFunction(12, 1234); // type error, because the first argument expects a value who's type property is value "string" //
```

```
let(myFunction: <source: "myCustomType", index: "number"> {
    return();
});
myFunction("a big long string", 1234); // type error, //
// because the first argument will have a type property value of "string", //
// but a custom subtype is expected with value of "myCustomType" //
```

```
let(myFunction: <source, index> {
    return();
});
// parse error, a function is declared with arguments, //
// but the arguments are not assigned a data type //
```



## Declarations
Word tokens in this language are either keywords declared by the language or references declared by a user. Undeclared words will throw an error. All references must be declared, and must be declared before they are referrenced.

### Scope
References are globally scoped if declared outside a block or scoped to the block in which they are declared. Child blocks have access to read and write to references declared in containing blocks. Containing blocks cannot access references declared in child/descendant blocks.

### let and const
References are declared using the `let` and `const` functions. These functions may only be executed once per block, as the explicit interface to an implicit property of the block, but may contain many comma separated assignments. These functions are optional and may occur in any order, but must occur as the first statements of a block or global space. The const function is nearly identical to the let function, except the values declared by const will throw an error if reassigned a value.

### Default values and data types
All references are declared as a word assigned to a value.  The value may be of any supported data type except null.  Null data types will not be allowed as a default type and will throw an error when such conditions occur.  This assignment determines the reference's default value and data type. The data type of the value is written to a read only property of the reference named `type`. 

### Universal data properties
All references have a type and length propery, of which both are read only. The length property offers a different meaning depending upon the data type and is calculated upon request.  Here is a description of the meaning of `length` by `type` value:

* string - the character length of the string value
* number - the character length of the value if coerced to a string
* boolean - the length property always returns 1 for booleans
* regex - the character length of the value if coerced to a string
* function - the string length of the function if coerced to a string
* array - the number of indexes in the array
* hash - the number of key/value pairs
* map - the number of key/value pairs
* set - the number of items in the set
* block - the string length of the block if coerced to a string

Please note that values comprised of a string length include escape sequences (`\`), or switches in the case of regex, as a counted character.  White space characters are not considered in this count unless the type is "string".

### Example of a declaration
```
if (y = 3) {
    let(cat: "meow", kittens: 0, instructions: {
        console["log"]("Hello");
        console["log"](" world");
    });
    cat["type"]; // "string" //
    cat["length"] // 4 //
    kittens["type"] // "number" //
    kittens["length"] // 1 //
    instructions["type"] // "block" //
    instructions["length"]; // 45 //
}
```



## Keywords and globals
The words in this list cannot be used as names of references

* **break** - Terminates and exits a do/until loop.
* **const** - A function implicitly available to every block and function for declaration of references where those references cannot be reassigned to a different value.
* **delete** - A keyword that separates keys from the parent storage object.  The deleted key will be available for garbage collection, as well as any assigned value, and can no longer be accessed.  In the case of arrays all following indexes shift down to fill the missing gap. Attempting to use *delete* on a property defined by this language standard will throw an error.  
* **do** - A basic loop.  The `do` keyword is required followed by a block followed by the `until` keyword followed by parenthesis group wrapping an expression.
   - `do myBlock() until (x = 5);`
* **else** - An alternate block of execution when other branches in a chain of `if` and `elseif` (if present) conditions evaluate to false.
   -  `if (x > 1) myBlock() else otherBlock();`
* **elseif** - An alternate branch in a chain of conditions.  Requires a fully formed `if` statement and 0 or more fully formed `elseif` statements then the `elseif` keyword followed by a parenthesis grouping containing an expression and finally a block to execute.
   - `if (x > 1) myBlock() elseif (x < 0) negativeBlock() else otherBlock();`
* **if** - Basic condition.  Requires the keyword `if` followed by a parenthesis grouping containing an expression, which is then followed by a block to execute if the condition evaluates to true.
   - `if (x > 1) myBlock();`
   - `if (x > 1) {myBoolean: true;}`
* **let** - A function implicitly available to every block and function for declaration of references where those references can be reassigned to a different value of the same data type.
* **null** - A global reserved reference to a null value.
* **return** - A function that terminates and exits a block.  In the case where the block is a function a single value or any type may be passed into the return function, which is the function's returned value.  For blocks that aren't functions the value passed into the return function is ignored.
   - `return(myValue);`
* **Store** - The global utility allowing data containers and features upon them.
* **until** - Part of a `do`/`until` loop separating the loop's block from its breaking expression.



## Store hash methods
Store is a predefined globally scoped hash provided by the language.  It contains several standard properties.  Any attempt to reassign these standard properties will throw an error.

* **array** - A method for creating a new array type object.
* **hash** - A method for creating a new hash type object.
* **length** - A read only number indicating the number of keys assigned to the Store hash.
* **map** - A method for creating a new map type object.
* **modifyType** - A method for converting the type property of a reference to a custom value. All *type* properties of references are read only, and so a special reference is required to write a new non-standard value.  This method requires two arguments: a reference or literal of any data type to modify and secondly a string indicating the new type value. 
* **set** - A method cor creating a new set type object.
* **type** - A read only string with a value of "hash".



## Loops
* `do`/`until` - A loop that executes repetive logic and breaks only when its `until` expression evaluates to false or when a `break` keyword is executed.
   - `do myBlock() until (x = 5);`
* foreach - Arrays, hashes, maps, and sets can be iteracted using the Store's foreach method.  The foreach method traverses every item in the iteration once from beginning to end without deviation or early termination.
   - `myStorage["foreach"](functionReference)`



## Conditions
* `if`/`elseif`/`else` - A form of logic branching based upon evaluation of one or more expressions optionally followed by a default.
   - `if (x > 1) myBlock();`
   - `if (x > 1) {myBoolean: true;}`
   - `if (x > 1) myBlock() elseif (x < 0) negativeBlock() else otherBlock();`
   - `if (x > 1) myBlock() else otherBlock();`



## Standard methods
### Numbers
* **abs** - Absolute value.
   - No input is accepted.
   - Returns a number.
   - `-1234.5678["abs"](); // returns 1234.5678 //`
* **ceiling** - Rounds a non-integer to the next higher integer.
   - No input is accepted.
   - Returns a number.
   - `1234.1687["ceiling"](); // returns 1235 //`
   - `1234["ceiling"](); // returns 1234 //`
* **floor** - Converts a number into an integer without any rounding.
   - No input is accepted.
   - Returns a number.
   - `1234.5687["floor"](); // returns 1234 //`
* **integer** - Determines if the number is an integer and returns a boolean.
   - No input is accepted.
   - Returns a number.
   - `1234["integer"](); // returns true //`
   - `1234.4567["integer"](); // returns false //`
   - `-1234["integer"](); // returns true//`
* **round** - Rounds a number.
   - Optionally takes a number to determine how many digits to the right of the decimal the number should be rounded.  This arugment is ignored if the target number is an integer.  If the number is greater than the decimal precision of the target number then the original number is returned.  This argument defaults to 0.
   - Returns a number.
   - `1234.5678["round"](); // returns 1235 //`
   - `1234.5678["round"](2); // returns 1234.57 //`
   - `1234.5678["round"](6); // returns 1234.5678 //`
* **precision** - Cuts a number down to the specified number of digits. Similar to the round method, but the final digit isn't rounded.
   - Optionally takes a number to determine the number of digits to preserve to the right of the decimal.  If the argument is absent a value of 0 is used to produce an integer. If the supplied number is greater than the number of digits to the right of the decimal the original number is returned.
   - Returns a number.
   - `1234.5678["precision"](2); // returns 1234.56 //`
   - `1234.5678["precision"](6); // returns 1234.5678 //`
   - `1234.5678["precision"](); // returns 1234 //`

### Storage types (arrays, hashes, maps, and sets)
* **concat** - Combines a specified store into a target store, but both stores must be of the same data type.
   - Takes a store as input.
   - Modifies the target store in place and returns the target store.  If the store type is array the target store will contain all of the specified store's properties added after the target store's original properties in the order provided by myOtherMap.  For other data types keys and properties are overwritten if a key exists in both stores and is otherwise added to the end of the target store.
   - `myMap["concat"](myOtherMap); // returns myMap will all of myOtherMap's properties //`
* **forEach** - Traverses every item in the store once from beginning to end without deviation or early termination and executes the item at the given index through a provided function.
   - Takes a function as input.
   - Returns the target store.
   - `mySet["forEach"](functionReference); // returns mySet //`

### Strings
* **charAt** - Grab a string character at a given index of the string.
   - Takes a number as input.
   - Returns a string character.
   - Returns -1 if an invalid index is supplied.
   - `"abc"["charAt"](1); //returns "b" //`
* **charPointAt** - Provides a number indicating the code point in Unicode for a character at the given index of a string.
   - Takes a number as input.
   - Returns a number.
   - Returns -1 if an invalid index is supplied.
   - `"𐃿"["codePointAt"](0); // returns 65791 //`
* **count** - Counts how many times a substring resides in the target.
   - Takes a string as input.
   - Returns a number.
   - `"a cat glances upon a star in a dark sky"["count"]("a"); // returns 7 //`
* **includes** - Returns a boolean if a substring resides in the target string.
   - Takes a string as input.
   - Returns a boolean.
   - `"a cat sleeps all day"["indexOf"]("cat"); // returns true //`
   - `"a cat sleeps all day"["indexOf"]("boat"); // returns false //`
* **indexOf** - Returns a number indicating the character index where a substring first resides in the target string when searching from left to right.
   - Takes a string as input.
   - Returns a number.
   - Returns -1 if the substring is not present in the target string.
   - `"a cat sleeps all day with another cat"["indexOf"]("cat"); // returns 2 //`
* **lastIndexOf** - Returns a number indicating the character index where a substring first resides in the target string when searching from right to left.
   - Takes a string as input.
   - Returns a number.
   - Returns -1 if the substring is not present in the target string.
   - `"a cat sleeps all day with another cat"["indexOf"]("cat"); // returns 34 //`
* **lowerCase** - Returns a new string composed of all lowercase characters.
   - Does not take any arguments.
   - Returns a new string.
   - `"A Boy And His Car"["lowerCase"](); // returns "a boy and his car" //`
* **numeric** - Determines if the string value resembles a number in the chosen number format.
   - No input is accepted.
   - Returns a boolean.
   - `"1234"["numeric"](); // returns true //`
   - `"doggy"["numeric"](); // returns false //`
* **parseNumber** - Produces a number from a numeric string.  If the string is not numeric it returns 0.
   - No input is accepted.
   - Returns a number.
   - `"1234"["parseNumber"](); // returns 1234 //`
   - `"123a5"["parseNumber"](); // returns 0 //`
* **replace** - Allows part of a string to be mutated based upon a regular expression match and a substring.
   - Takes a regular expression and string as input.
   - Returns a new string.
   - `"cat is very odd."["replace"](/very/g, "crazy"); // returns "cat is crazy odd." //`
* **slice** - Returns a fragment of the target string based upon character indexes.
   - Takes a number as input for starting index, and optionally a second number as ending index.
   - Returns a new string.
   - `"my fig tree smells very sweet"["slice"](7); // returns "tree smells very sweet" //`
   - `"my fig tree smells very sweet"["slice"](7, 11); // returns "tree" //`
* **split** - Creates an array by dividing a target string on a supplied substring.
   - Takes a string as input.
   - Returns an array.
   - `"a"["split"]("b"); // returns ["a"] //`
   - `"abcbc"["split"]("b"); // returns ["a", "c", "c"] //`
* **upperCase** - Returns a new string composed of all uppercase characters.
   - Does not take any arguments.
   - Returns a new string.
   - `"A Boy And His Car"["upperCase"](); // returns "A BOY AND HIS CAR" //`



## Custom Data Types
Simple Language provideds a method *modifyType* on the Store hash for creating custom data types.  This method has special access to write a custom value to the read only *type* property on a reference.  This method takes two arguments: a function and a string for the new type name.  Any string is allowed except for the names of the existing types whether they are standard types or custom types.  The return value of the function, in the first argument, is the base model for the new type.  The new type value will be available as a property of the global Store hash.
```
Store["modifyType"]((){
    let(myFunction: <sample: "string"> {
        return sample.slice(0, 3);
    });
    return myFunction;
}, "short string factory");
```

To declare a reference as a custom type simply assign it to the custom type name as a property of the Store object:
```
let(
    reference: Store["my Custom Type"]
);
```

Type creation may occur at any level of the scope chain, but remains lexically bound to the scope where it is created like any reference.  This means a custom type declared in a child block will not be available to the parent block, but it will be available to all child and descendant scopes.



## Error states
This is an incomplete list of things that will throw an error in this language.

### Type errors
* Reassign a value to a referrence of a different data type
* Access a property of a referrence with a null value
* Access a reference or property that doesn't exist
* Perform arithmetic on non-number data types
* Attempt to execute any data type as a function/block if they are not functions or blocks.
* Pass a standard type name into the second argument on the *Store["modifyType"]* method.
* Pass the incorrect data type into a function.  The data type passeed in must match the type assigned to the function's argument

### Reference errors
* Attempt to create a reference with a reserved name from the keywords and global reference list.
* Access a reference that is not declared in the scope chain
* Any attempt to overwrite or reassign a standard property of the *Store* hash.
* Any attempt to create a string property onto a data container of names "length" or "type" as these are reserved by the language.
* Using *delete* on a standard property name.

### Parse errors
* Arguments are declared on a function without assignment to a string.
* Malformed number.  A number is composed of only one or more numeric digits and a single period. A number may be preceeded by a `+` or `-` character.
* Arithmetic and comparison operators must occur between values or between a parenthesis group of values either by literal numbers or by reference.
* Using the `?` and not using a `#`, or the opposite, within the same grouping.  A ternary statement requires use of both syntax characters.
* The `:`, `?`, and `#` characters expect to be followed by a reference, literal value, or a parenthesis grouping.
* A `do` loop without an `until` keyword.
* An `until` used without association to a `do` loop.
* Conditions expect to follow the form: keyword, parenthetical grouping, and block.
* An unterminated string or regular expression