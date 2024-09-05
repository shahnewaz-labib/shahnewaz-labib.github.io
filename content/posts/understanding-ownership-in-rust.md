+++
title = "Understanding Ownership in Rust"
date = "2024-08-06"

[taxonomies]
tags=["rust", "memory management", "ownership", "borrowing"]

[extra]
repo_view = true
+++

# Introduction

Different languages have different ways of managing memory.
In C, we have to manually allocate and deallocate memory.
In Java, we have a `garbage collector (GC)` that automatically deallocates memory.

Rust has a unique approach to memory management called ownership that guarantees memory safety without a GC.

# Prerequisites

Rust values behave differently based on whether they are `stack-allocated` or `heap-allocated`.
We need to understand the difference between the two to understand ownership in Rust.

## Stack

- Stack is a LIFO (Last in, First out) data structure that stores values in a fixed order.
- The data we push to the stack has to have a known, fixed size at compile time.
- It is more organized and has less overhead as we know exactly where to push to and pop from.
- This makes stack allocation faster than heap allocation.
- The function call stack is an example of a stack data structure.
- The function context is pushed to the stack when a function is called and popped when the function returns.

## Heap

- Heap is less organized than stack.
- It is a pool of memory that can grow dynamically.
- At compile time, we don't know the size of the data we will push to the heap.
- At runtime, necessary amount of memory is requested and the
- Memory allocator -
  - finds a suitable place in the heap,
  - marks it as used
  - performs some bookkeeping
  - returns a pointer to the allocated memory.
- Because of this overhead, heap allocation is slower than stack allocation.

There's this beautiful article [here](https://samwho.dev/memory-allocation/) about this.

## Code Example

```rust
let x = 5; // known, fixed size: stored on stack
let y = x;

let s1 = String::from("Hello"); // mutable, dynamic: stored on heap
let s2 = s1;
```

# Ownership

The copy operation in the stack is a shallow copy. The value is copied to a new location in memory.

Why?
Because doing so is really fast as we know the size and the location to store the value.

The copy operation in the heap results in both `s1` and `s2` pointing to the same memory location.

<img src="/posts/s1-s2-memory-diagram.png" alt="s1 s2 memory diagram" width="400"/>

Why? Because copying the data in the heap is expensive and we don't want to duplicate the data.

But what happens when `s1` goes out of scope? The memory is deallocated and `s2` is left with a `dangling pointer`.

This is where ownership comes into play.
When the move operation happens, the ownership of the memory is transferred to the new variable.
So, when `s1` goes out of scope, it doesn't deallocate the memory and `s2` is still valid. After the move operation, we can't use `s1` anymore.
Memory deallocation is now dependent on whether `s2` is in scope or not.

This is the essense of ownership in Rust.

# Ownership Rules

1. Each value in Rust has a variable that is its owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is dropped.

The compiler enforces these rules at compile time.
The program wouldn't compile if we violate these rules.
This guarantees memory safety without a garbage collector.

# Ownership can be Transferred

Ownership can be transferred by moving the value to a new variable.
After the move operation, the old variable is no longer valid.

```rust
fn main() {
    let s3 = takes_and_gives_back(s2);
}
fn takes_and_gives_back(a_string: String) -> String {
    a_string
}
```

# Ownership can be Borrowed

We can borrow a value without transferring ownership.
We can borrow a value as immutable or mutable.

We can have multiple immutable borrows but only one mutable borrow at a time.

```rust
fn main() {
    let s1 = String::from("Hello");
    let len = calculate_length(&s1);
}
fn calculate_length(s: &String) -> usize {
    s.len()
}
```

# Deep Copy instead of Move

We can clone a value to create a deep copy.
The cloned value is a separate copy and has its own memory.

```rust
fn main() {
    let s1 = String::from("Hello");
    let s2 = s1.clone();
}
```

# Conclusion

This is a high-level overview of ownership in Rust, a note to self.

Of course, these are oversimplified explanations.
The Rust book has a more detailed explanation of ownership.

# References

1. [The Rust Programming Language](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
