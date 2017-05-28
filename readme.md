# Simple Language
An eductional language to speed learning of logic and automation with sacrifice to convention and syntax.



## Todo
* investigate Set containers
* choose a number system that is more precise than IEEE double floating point precision, here are some candidates:
   - DEC64
   - libdfp
* write a parser/repl
* define default methods
* evaluate chosen number format to determine if words can start with numbers
* consider additional forms of loops
* consider additional forms of conditions, possibly switch/case (but no fall through)
* modules
* define errors
* in JavaScript functions have internal identity by name, but in this language functions dont have names... evaluate if there is a problem with force reliance upon the scope chain for recursion in functions and assigned blocks
* document explicit error states
* Allowing implicit coercion of null to boolean false in expression to eliminate need for some null checks.  This convenience may or may not be a good idea and will need to be revisited in practice.



## Motivation
According to data from multiple sources JavaScript is the most popular language in the world.  Unfortunately, it is rarely formally taught, and most developers cannot adequetely figure it out so as to become competent without significant help.  Worse still is that there are many pitfalls in JavaScript that frequently trip up and slow down seasoned experts without some help from static analysis tools.  Worst of all is that JavaScript has no shortage of controversy and inflated holy wars.

These are all problems that can be solved provided the language were designed with these problems in mind.  Simple Language is designed to be single paradigm with a cleaner syntax.  It will take the best parts of JavaScript and eliminate opportunities for frustration and controversy along the way.



## Design theory
* block scoped and lexical scope natively by default
* garbage collected
* no hoisting
* the only white space are white space characters found in strings and comments
* no inheritance/this/new
* implicit public/private
* no try/catch
* no operator overloading
* no bitwise
* no implied syntax or automatic syntax character insertion.  Syntax is explicit.
* data types are strong/static



## Definition of terms
* **block** - A block is a bag of instructions. Blocks always begin with an opening curly brace and end with a closing curly brace.  Blocks provide scope and references may be declared in any block.
* **expression** - An expression is a bit of code that asks the computer for an opinion, called evaluation.  This could be as simple as comparing one number to another number or checking the length of a string.  Expressions are wrapped in parentheses.
* **method** - A function accessed as the property of a reference.
* **object** - A generic term for any non-primitive data type.
* **property** - A subreferrence accessed through a reference.  Properties are always accessed with square braces.
* **reference** - A named assigned to a primitive or object.
* **statement** - A statement is an action.  It can be as primitive as simply calling a reference, or it can provide a multitude of instructions.  Statements are terminated with semicolons.



## Comments
* block comments - `/* */`
* linear comments - `// //`



## Syntax
### Comparison operators
* `=` equality
* `~` inequality
* `<` less than
* `>` greater than
* `<=>` trichotomy // returns -1, 0, or 1 if respectively: less, equal, or greater //

### Grouping operators
* `(` logical group start
* `)` logical group end
* `{` block start
* `}` block end
* `[` array notation start
* `]` array notation end
* `&` logical and
* `|` logical or

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

### Other operators
* `!` string concatenation
* `\` escape sequence
* `;` statement termination
* `"` string delimiter
* `'` string delimiter

### Words: keywords and references
Words may be comprised of any Unicode character with exception to the following list:

* No white space characters
* case sensitive
* No binary/control characters
* No characters specified in the syntax section
* References cannot be named any of the defined keywords or globals
* None of these specific characters as they are reserved for future use
   - \` (acent)
   - `@` (at symbol)
   - `$` (dollar)
   - `.` (period)



## Data Types
### Definitions
#### Primitives (passed by value)
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
* null - Null only exists to unset a value from a reference. In expressions null values are coerced to a boolean false value so that they can be positively compared to either null or false without explicit need for a null check.  If a reference needs to be evaluated against literal null check the reference's type to ensure it isn't a boolean.

#### Non-primitives (passed by reference)
* function - A bag of instructions that accepts parameters for input and always returns a value, where that value is null by default.
   - Declared by applying a parenthsis grouping prior to a block.
   - `cat: () {console.log("meow");}`
   - Executed when a parethesis grouping follows the function's reference.
   - `cat(); // returns null because the function does not specify a return value //`
   - Without the following parenthesis the reference to the function itself is passed without executing the function.
   - `cat; // returns the actual function //`
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

The types array, hash, map, and set are all iterable.  Except for arrays, the contents of these types reside in the order with which they were added.



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
* null - the length property always returns 0 for null
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

* **break** - Terminates and exits a loop.
* **const** - A function implicitly available to every block and function for declaration of references that cannot be reassigned to a different value.
* **do** - A basic loop.  The `do` keyword is required followed by a block followed by the `until` keyword followed by parenthesis group wrapping an expression.
   - `do myBlock until (x = 5);`
* **else** - An alternate block of execution when other branches in a chain of `if` and `elseif` (if present) conditions evaluate to false.
   -  `if (x > 1) myBlock else otherBlock;`
* **elseif** - An alternate branch in a chain of conditions.  Requires a fully formed `if` statement and 0 or more fully formed `elseif` statements then the `elseif` keyword followed by a parenthesis grouping containing an expression and finally a block to execute.
   - `if (x > 1) myBlock elseif (x < 0) negativeBlock else otherBlock;`
* **if** - Basic condition.  Requires the keyword `if` followed by a parenthesis grouping containing an expression, which is then followed by a block to execute if the condition evaluates to true.
   - `if (x > 1) myBlock;`
   - `if (x > 1) {myBoolean: true;}`
* **let** - A function implicitly available to every block and function for declaration of references that can be reassigned to a different value of the same data type.
* **null** - A global reserved reference to the null data type.
* **return** - Terminates and exits a block.  In the case of a function a statement starting with the return keyword is the value returned from the function.
* **Store** - The global utility allowing data containers and features upon them.
* **until** - Part of a `do`/`until` loop separating the loop's block from its breaking expression.



## Loops
* `do`/`until` - A loop that executes repetive logic and breaks only when its `until` expression evaluates to false or when a `break` keyword is executed.
   - `do myBlock until (x = 5);`
* foreach - Arrays, hashes, maps, and sets can be iteracted using the Store's foreach method.  The foreach method traverses every item in the iteration once from beginning to end without deviation or early termination.
   - `Store["foreach"](myArray)`



## Conditions
* `if`/`elseif`/`else` - A form of logic branching based upon evaluation of one or more expressions optionally followed by a default.
   - `if (x > 1) myBlock;`
   - `if (x > 1) {myBoolean: true;}`
   - `if (x > 1) myBlock elseif (x < 0) negativeBlock else otherBlock;`
   - `if (x > 1) myBlock else otherBlock;`



## Standard methods
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
   - Does not take any arguments.
   - Returns a boolean
   - `"1234"["numeric"](); // returns true //`
   - `"doggy"["numeric"](); // returns false //`
* **split** - Creates an array by dividing a target string on a supplied substring.
   - Takes a string as input.
   - Returns an array.
   - `"a"["split"]("b"); // returns ["a"] //`
   - `"abcbc"["split"]("b"); // returns ["a", "c", "c"] //`
* **upperCase** - Returns a new string composed of all uppercase characters.
   - Does not take any arguments.
   - Returns a new string.
   - `"A Boy And His Car"["upperCase"](); // returns "A BOY AND HIS CAR"`



## Custom Data Types
Simple Language provideds a method *modifyType* on the Store hash for creating custom data types.  This method has special access to write a custom value to the read only *type* property on a reference.  This method takes two arguments: a reference to modify and a string for the new type value.  Any string is allowed except for the names of the standard types.  This means that once a reference is converted to a custom type it cannot be reverted back to a standard type.

Perhaps the most direct means is to define a function that creates a reference from a base type, extends that reference in a uniform way, and returns this reference.  Here is an example of creating a type named *shortString*:
```
let(
    shortString: (value) {
        Store["modifyType"](value, "shortString");
        return value["slice"](0, 3);
    },
    myTinyString: shortString("abracadabra")
);
```

The function that creates a custom type may be created anywhere, such as the local function created in the example above.  Sometimes a standard location is preferred for cleaner organization of code.  In this case it could be wise to store this capability in the global Store hash as in this example:
```
Store["shortString"]: (value) {
    Store["modifyType"](value, "shortString");
    return value["slice"](0, 3);
};
let(
    myTinyString: Store["shortString"]("abracadabra")
);
```



## Error states
This is an incomplete list of things that will throw an error in this language.

### Type errors
* Reassign a value to a referrence of a different data type
* Access a property of a referrence with a null value
* Perform arithmetic on non-number data types
* Attempt to execute any data type as a function/block if they are not functions or blocks.
* Pass a standard type name into the second argument on the *Store["modifyType"]* method.

### Reference errors
* Attempt to create a reference with a reserved name from the keywords and global reference list.
* Access a reference that is not declared in the scope chain
* Any attempt to overwrite or reassign a standard property of the *Store* hash.