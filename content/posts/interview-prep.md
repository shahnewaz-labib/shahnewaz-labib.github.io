+++
title = "Interview prep notes"
date = "2024-07-29"

[taxonomies]
tags=["interview"]

[extra]
repo_view = true
+++

# Intro

Things I prepared in 1 day for an interview for a specific company. Not organized. At all.
Strategy: Put everything in one place. CTRL+F when needed.

# OOP

A programming paradigm where the programming logics are encapsulated within classes, which can then be instantiated as `objects`.
These objects can contain `data` and `methods` that work on these `data`.

This makes the code more **redable**, **reusable** and **maintainable**.

Concepts of OOP consist of but not limited to:

1. Abstration
2. Encapsulation
3. Inheritance
4. Polymorphism

## Abstraction

Through abstraction, only the necessary details about the object is shown to the user, hiding the unnecessary details.

A real life example:

```
Man hit accelerator in car. Car move.
Man hit brake. Car stop.
Man don't know how it works, just that it works.
```

In programming, this can be achieved by using classes and objects.

```cpp
class Car {
    public:
        void accelerate();
        void brake();
};
```

## Encapsulation

This property ensures that each class has control over the visibility of its data and methods.

```cpp
class Car {
    private:
        int speed;              // only accessible to this class
    protected:
        int fuel;               // only accessible to this class and
                                // all the derived classes
    public:
        void accelerate();      // accessible to all
        void brake();
        void setSpeed(int s) {
            speed = s;
        }
        int getSpeed() {
            return speed;
        }
};
```

## Inheritance

This allows a class to inherit the features of another class.

Perks:

1. Reusability (Write code once, use multiple times)
2. Maintainability (Change once, reflect everywhere)

```cpp
class Vehicle {
    public:
        void start();
        void stop();
};

class Car : public Vehicle {
    public:
        void accelerate();
        void brake();
};
```

## Polymorphism

This allows the programmer to define a general class of action and it is the compiler’s job to select the specific
action as it applies to each situation.

Common types of polymorphism:

1. Overloading (Same fn name, different signature)
2. Overriding (Same fn name and signature, different implementation)

Can be both for methods and operators.

```cpp
class OverloadingExample {
    static int add(int a, int b) {
        return a + b;
    }
    static int add(int a, int b, int c) {
        return a + b + c;
    }
};

// Overriding Example
class Animal {
    void eat() {
        cout << "eating...\n";
    }
};

class Dog : public Animal {
    void eat() {
        cout << "eating bread...\n";
    }
};

```

## Diamond inheritence problem

- This arises when a class inherits from two classes that share a common base class.
- Results in diamond shaped hierarchy.
- Compiler become uncertain about which superclass's attributes to prioritize.

![Diamond Inheritance problem diagram 1](/posts/Diamond_inheritance.svg)
![Diamond Inheritance problem diagram 2](/posts/diamond-inheritance-2.png)

To prevent:

1. Virtual inheritance (**Ensures only 1 instance of Base A**)

```cpp
class B : virtual public A
```

Reference: [stackoverflow](https://stackoverflow.com/questions/2659116/how-does-virtual-inheritance-solve-the-diamond-multiple-inheritance-ambiguit)

2. Favor composition over inheritance
3. Avoid deep inheritance hierarchies
4. Bridge pattern

## Virtual function

- Member fn declared in base class, **_optionally_** overriden by a derived class.
- Fn resolving is done at runtime.
- Mainly used to achieve `Runtime Polymorphism`.
- Cannot be `static`.
- Can have _virtual destructor_ but not _virtual constructor_.

```cpp
class base {
  public:
    virtual void print() {
        cout << "print base class\n";
    }

    void show() {
        cout << "show base class\n";
    }
};

class derived : public base {
  public:
    void print() {
        cout << "print derived class\n";
    }

    void show() {
        cout << "show derived class\n";
    }
};

int main() {
    base *bptr;
    derived d;
    bptr = &d;

    // Virtual function, binded at runtime
    bptr->print(); // output: print derived class

    // Non-virtual function, binded at compile time
    bptr->show(); // output: show base class
}
```

## Pure Virtual Function (Abstract Function)

- Virtual Functions that **_has_** to be overriden.

```cpp
class Test {
    public:
	// Pure Virtual Function
	virtual void show() = 0;
};
```

## Abstract Classes

- Classes that have at least one `Pure Virtual Function`.

## Friend Functions

- Fn that has access of private members without being a member.
- Essentially, **_enhances_** encapsulation by enabling _selective_ access to members.

```cpp
class Test {
    int n, d;

  public:
    // declare a friend of Test
    friend int isfactor(Test ob);
};

int isfactor(Test ob) {
    if (!(ob.n % ob.d)) return 1;
    else return 0;
}
```

having friend functions at namespace scope is useful because
it allows you to make overload sets.
An overload set is just the name for all the overloads of a particular function name.

For example,
`std::to_string` is an overload set because there are multiple functions with that name.

Overload sets are a really useful concept because
they allow you to write generic code that can act on a lot of different types,
even if those types are completely unrelated.

For example,
`std::vector` and `std::list` don’t inherit from each other or from a base class,
but it’s easy to write templated functions that work on either of them
because they share a common interface in terms of how they can be used.

Reference: [stackoverflow](https://stackoverflow.com/questions/55583842/member-function-vs-friend-functions-why-one-and-not-the-other)

## Strongly coupled, Loosely coupled code

- **High coupling**: modules are closely connected, changes in one module may affect other modules.
- **Low coupling**: modules are independent, changes in one module have little impact on other modules

# OOP vs FP

| Thing          | Object Oriented Programming                                                                             | Functional Programming                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Core**       | Models entities using objects                                                                           | Emphasizes the use of fn and mutable data                                     |
| **Components** | Classes, Objects                                                                                        | Functions and expresssions                                                    |
| **State**      | State is stored in objects                                                                              | State is immutable                                                            |
| **Usage**      | complex systems, multiple entities, interactions. Encapsulate data and behavior into reusable component | Pure calculations, simple input & output. Avoid side effects or state changes |

FP example in `Rust`:

```rust
let nums = [1, 2, 3, 4, 5, 6];
let sum = nums
            .iter()
            .filter(|&n| n % 2 == 0)
            .map(|n| n * 2)
            .sum();

assert_eq!(sum, 20);
```

# Design Patterns

# Problem solving

### Delete a leaf node with value 'x' in a tree

### 1-n numbers in an array, 1 missing, 1 duplicate, find them

### Reverse a string given a string pointer

```cpp
void r(char *str) {
    int L = 0, R = strlen(str) - 1;
    while (L < R) {
        char t = *(str + L);
        *(str + L) = *(str + R);
        *(str + R) = t;
        L++, R--;
    }
}
```

### implement q with 2 stacks

### datatype:

- sizes of data

  - int = 8 bytes
  - float = 4 bytes
  - double = 8 bytes
  - long = 8 bytes
  - long long = 8 bytes

- how are floating point numbers represented
  - float = -1^(sign) \* num \* 2^p
  - stored in 32 bits by allocating 1 bit for sign, 8 bits for exponent and 23 bits for mantissa
- float vs double
  - double has twice the precision of float
  - double has more bits to represent p, so more accuracy
  - double is stored in 64 bits by allocating 1 bit for sign, 11 bits for exponent and 52 bits for mantissa
- instead use
  - fraction class to use int for all calculations
  - kahan's summation algorithm

### File IO

```cpp
ifstream in ;   // input
ofstream out ;  // output
fstream io ;    // input and output

ofstream myfile ("example.txt");
if (!myfile.is_open()) {
    cout << "Unable to open file";
    exit(1);
}
myfile << "This is a line.\n";
myfile.close();

```

- What if I don't `file.close()`?
  - file will be closed by their destructor anyway
  - but only when it goes out of scope
  - not explicitely closing the files can lead to many files being open at the same time
  - and that can lead to memory leaks

# Dynamic Memory Allocation (DMA)

### heap vs stack

- Dynamically allocated memory goes to `Heap`
- Non-static and local variables go to `Stack`
- C: `malloc()`, `calloc()`, `realloc()`, `free()`
- C++: `new`, `delete`

### `malloc()`

1. Not type safe.
2. Required to cast the return from `void*`.

```cpp
struct foo {
  double d[5];
};

int main() {
  foo *f1 = malloc(1); // error, no cast
  foo *f2 = static_cast<foo*>(malloc(sizeof(foo)));
  foo *f3 = static_cast<foo*>(malloc(1)); // No error, bad
}
```

3. On fail, returns `NULL`.
4. Not good for generics.

### `new`

1. Type safe.
2. Returns specific type, no casting required.

```cpp
char *p = new char[1024];
delete p; // WRONG
delete[] p;

int *p_scalar = new int(5);  // Does not create 5 elements, but initializes to 5
int *p_array  = new int[5];  // Creates 5 elements
```

3. On fail, returns `bad_alloc`.
4. No reallocation function available.

### `malloc()` vs `new`

| new                                       | malloc()                           |
| ----------------------------------------- | ---------------------------------- |
| Calls constructor                         | Doesn't                            |
| Returns exact data type                   | Returns void\*                     |
| Type safe                                 | Not type safe at all               |
| Size calculated by compiler               | Calculated manually                |
| On fail, throws **`bad_alloc`** exception | On fail, returns **`NULL`**        |
| No reallocation                           | Reallocation using **`realloc()`** |

### `delete` vs `free`

| delete           | free    |
| ---------------- | ------- |
| Calls destructor | Doesn't |

Resources:

1. [https://samwho.dev/memory-allocation/](https://samwho.dev/memory-allocation/)

### pointer:

    heap e point kortese, oitake abar stack ke point korte parbo kina

### class obj er sathe pointers kemne ki

# Casting

- Convert on datatype to another.

4 Types of casting in C++:

1. **static_cast**

- between related types (same inheritance hierarchy)
- no runtime checks
- no safety checks
- no overhead
- can be used for implicit conversions

```cpp
int i = 10;
double d = static_cast<double>(i);
```

2. **dynamic_cast**

- between polymorphic types
- runtime checks

```cpp
class Animal {
  public:
    virtual void speak() const {
        cout << "Animal speaks." << endl;
    }
};

class Dog : public Animal {
  public:
    void speak() const override {
        cout << "Dog barks." << endl;
    }
};

class Cat : public Animal {
  public:
    void speak() const override {
        cout << "Cat meows." << endl;
    }
};

Animal* animalPtr = new Dog();
Dog* dogPtr = dynamic_cast<Dog*>(animalPtr); // Downcasting
Cat* catPtr = dynamic_cast<Cat*>(animalPtr); // Casting to another derived class
```

3. **const_cast**

- Used to modify the const qualifier of a variable.
- Allows to temporarily remove the constancy and make modifications.
- Can lead to undefined behavior.

```cpp
const int number = 5;
// Pointer to a const int
const int *ptr = &number;

// int* nonConstPtr = ptr; if we use this
// instead of without using const_cast
// we will get error of invalid conversion
int *nonConstPtr = const_cast<int *>(ptr);
*nonConstPtr = 10;

cout << *nonConstPtr << "\n";   // 10
cout << number << "\n";         // 5, idk when is this cast is helpful
```

4. **reinterpret_cast**

- Between any two type of pointer
- No checks at all

```cpp
int number = 10;
// Store the address of number in numberPointer
int *numberPointer = &number;

// Reinterpreting the pointer as a char pointer
char *charPointer = reinterpret_cast<char *>(numberPointer);
```

### Tell me about yourself

- I'm Md. Shahnewaz Siddique.
- I completed my undergrad from Islamic University of Technology in Computer Science and Engineering.
- During my 4 years of undergrad, I tried to explore different domains of CS.
- I was involved in competitive programming, with 160+ online contests and 1.5k+ solved problems.
- I explored the domain of cyber security, participated and won awards in a few national and international CTFs.
- I participated in hackathons as well, winning the 2nd place in the recent one that I did.
- I am interested in robotics as well. I am a founding member of Project Aero, the drone wing of IUT Robotics Society.
- I was an intern for Bindulogic where I worked as a fullstack engineer and built a business facing SMS campaign platform.
- Last but not the least, I have done my thesis in NLP where I worked on bangla language.
  <!---->
  <!-- ### asked about projects -->
  <!---->
  <!-- ### asked about github -->
  <!---->
  <!-- ### How should we remember you -->
  <!---->
  <!-- ### what do you expect from us -->
  <!---->
  <!-- ### expected salary -->
  <!---->
  <!-- ### cc bepare ki jano -->
  <!---->
  <!-- ### cc er manush bepare ki jano -->
