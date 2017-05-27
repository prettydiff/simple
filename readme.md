# Simple Language
An eductional language to speed learning of logic and automation with sacrifice to convention and syntax.

## Todo
* investigate Set containers
* need to define data types and type extension
* apply DEC64 for number type
* how to identify data type if reference is assigned to null



## Design theory
* native lexical scoped by block
* garbage collected
* no hoisting
* the only white space are white space characters found in strings
* no inheritance/this/new
* implicit public/private
* no try/catch
* no operator overloading
* no bitwise
* data types are strong/static



## Comments
* block comments - /* */
* linear comments - // //



## Operators
### Comparison operators:
* = equality
* ~ inequality
* < less than
* \> greater than
* <=> trichotomy // returns -1, 0, or 1 if respectively: less, equal, or greater

### Grouping operators:
* ( logical group start
* ) logical group end
* { block start
* } block end
* [ array notation start
* ] array notation end
* & logical and
* | logical or
* ; statement termination

### Assignment/reference operators:
* : assignment
* ? ternary
* | ternary else
* . object property
* , list separator

### Arithmetic operators:
* + addition
* - subtraction
* * multiplication
* / division
* ^ exponentiation
* % modulo

### Other operators:
* ! string concatenation
* \ escape sequence



## Data Types
### Definitions
#### Primitives (passed by value)
* string - Strings are delimited by single and double quote characters and store a raw sequence of text characters.
   - "cat"
   - 'dog'
   - "bird\"s"
   - 'book"s'
* number - This language features a single number type based upon DEC64.
   - 0
   - 12345678
   - -23
   - -123.45678912
* boolean - true or false
* regex - JavaScript style regular expressions
* null - only exists to unset a value from a reference

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
* block - A bag of instructions that always returns null. The block code is the literal value.
   - Declared by assignment to a block, similar to a function but without the preceeding parenthesis.
   - `animals: {code instructions go in here;}`
   - Executed when a parethesis grouping follows the block's reference.
   - `animal(); // executes the code in the block and always returns null //`
   - Without the following parenthesis the reference to the block itself (the code) is passed without executing the instructions in the block.
   - `animal; // returns the block itself //`

The types array, hash, map, and set are all iterable.  Except for arrays, the contents of these types reside in the order with which they were added.


## Declarations
Word tokens in this language are either keywords declared by the language or references declared by a user. Undeclared words will throw an error. All references must be declared.

### Scope
References are globally scoped if declared outside a block or scoped to the block in which they are declared. Child blocks have access to read and write to references declared in containing blocks. Containing blocks cannot access references declared in child/descendant blocks.

### let and const
References are declared using the `let` and `const` functions. These functions may only be executed once per block, as the explicit interface to an implicit property of the block, but may contain many comma separated assignments. These functions are optional and may occur in any order, but must occur as the first statements of a block or global space. The const function is nearly identical to the let function, except the values declared by const will throw an error if reassigned a value.

### Default values and data types
All references are declared as a word assigned to a value.  The value may be of any supported data type except null.  Null data types will not be allowed as a default type and will throw an error when such conditions occur.  This assignment determines the reference's default value and data type. The data type of the value is written to a read only property of the reference named `type`. 

### Univeral data properties
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
