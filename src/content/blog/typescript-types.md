---
title: '换个姿势看 TypeScript！'
description: '复杂的类型操作被社区戏称为类型体操。梳理类型别名与接口、类型收窄、泛型约束、keyof/typeof、索引访问、条件类型、映射类型与模板文字类型。'
pubDate: 'Apr 20 2022'
updatedDate: 'Apr 21 2022'
---

## 前言
很多同学都说自己会`TypeScript`，当我深入问他们有用过联合类型、文字类型、泛型、条件类型、映射类型、模板文字类型吗？他们给我的回答可能是没有。

我还可以换一种问法，有用过`extends`的约束、分配， `keyof` ，`typeof`、索引访问类型吗？

上面的一大串名词可能会让你晕头转向，诚然，我们使用`TypeScirpt`使用比较多的有对象类型、基本类型、使用`interface`定义类型接口和`type`定义类型别名。当我们系统复杂，类型之间也会复杂，但他们之间一定会有某种关系，因此需要类型推导或类型转换，那么所需的知识就是上面的所提及到的。

复杂的类型操作被社区戏称为类型体操。我们在开发当中当然不太可能涉及到很复杂的类型操作，但是简单的类型操作，在近期的工作当中我认为是非常有必要的。

## 如何定义类型的形状

### 使用别名
类型别名的语法。


```typescript
type Point = {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x)
  console.log("The coordinate's y value is " + pt.y)
}

printCoord({ x: 100, y: 100 })
```
### 使用接口
接口声明是命名对象类型的另一种方式。
```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x)
  console.log("The coordinate's y value is " + pt.y)
}

printCoord({ x: 100, y: 100 })
```
### 两者有什么区别
类型别名来为任何类型命名，而不仅仅是对象类型。例如，类型别名可以命名联合类型,但`interface`只能描述一种类型的形状，对于下面这种联合类型以`type`的方式可以起个别名更好的使用。
```typescript
type ID = number | string
```
还有一个区别是`type`不能重复定义类型来添加新属性，而接口是可以的。
```typescript
// An interface can be re-opened
// and new values added:

interface Mammal {
    genus: string
}

interface Mammal {
    breed?: string
}

const animal: Mammal = {
    genus: "1234",
    // Fails because breed has to be a string
    breed: 1
}

type Reptile = {
    genus: string
}

// You cannot add new variables in the same way
type Reptile = {
    breed?: string
}
```
注意的是`interface`可以使用`extends`关键词继承属性，`type`也可以使用交叉点扩展类型，这和上面的**添加新属性**是有本质的区别。

## 类型收窄
一种联合类型传递到函数时，我们需要对类型进行收窄才能操作。

### `typeof` 类型守卫
我们可以使用`typeof`判断其是什么类型，从而做出我们下面的代码正确的选择。
```typescript
function getLen(value: number | string) {
  return typeof value === 'string'? value.length : value
}
```
### 未定义变量收窄
当我们只有一个类型和`undefined`类型，就可以判断是否未定义来进行收窄。
```typescript
function getLen(value?: string) {
  return value ? value.length : 0
}
```
### in关键词收窄
```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```
### instanceof收窄
```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
  } else {
    console.log(x.toUpperCase());
  }
}
```
### 类型谓词
```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## 关于函数
### 命名函数类型
我们可以使用类型别名来命名函数类型。
```typescript
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```
也可以使用`interface`描述函数形状。
```typescript
interface GreetFunction {
  (a: string) => void;
}
```
### 通用函数
通常会编写一个函数，其中输入的类型与输出的类型相关，例如下列的方法，一个返回数组第一个元素的函数。

在 TypeScript 中，当我们想要描述两个值之间的对应关系时，会使用泛型。
```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0]
}
```
### 约束参数类型
我们编写了一些通用函数，可以处理任何类型的值。

有时只能对某个值的子集进行操作。在这种情况下，我们可以使用约束来限制类型参数可以接受的类型。

下面是编写一个返回两个值中较长者的函数。为此，我们需要一个`length`属性。我们通过`extends`将类型参数限制。

这里就是`extends`的第二层作用，约束，上面我们已提到了`extends`的继承作用。
```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
```

### 回调中的可选参数
拥有`typescript`基础的同学都应该知道函数有可选参数的配置，在回调当中，我们比较容易犯的错误，把回调函数设为可选参数。

```typescript
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```
这会导致`typescript`对`index`判断为`number` `undefined`，如下面的代码，会提示类型错误，需要对类型进行收窄，实际上我们的`myForWach`函数对回调是一定提供了`index`参数的。
```typescript
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // Object is possibly 'undefined'.
})
```

## 对象类型的重点

### 索引签名
有时并不提前知道类型属性的所有名称，但知道值的形状。在这些情况下，可以使用索引签名来描述可能值的类型。
```typescript

interface NumberDictionary {
  [index: string]: number;
  length: number; // ok
}

interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

## 从类型创建类型

### 泛型
在 C# 和 Java 等语言中，工具箱中用于创建可重用组件的主要工具之一是泛型，也就是说，能够创建一个可以在多种类型而不是单一类型上工作的组件。这允许用户使用这些组件并使用他们自己的类型。
```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}
```
#### 泛型类
```typescript
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```
#### 泛型也可以约束

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

#### 在泛型约束中使用类型参数
可以声明受另一个类型参数约束的类型参数。例如，想从一个给定名称的对象中获取一个属性，泛型约束确保我们不会意外获取不存在的属性。

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

### `Keyof` 类型运算符
运算符采用keyof对象类型并生成其键的字符串或数字文字联合。例如下面则获取到了` “x” | “y”`的类型。
```typescript
type Point = { x: number; y: number };
type P = keyof Point;
```

### `typeof` 类型运算符
JavaScript 已经有一个typeof可以在表达式上下文中使用的运算符。
```typescript
// Prints "string"
console.log(typeof "Hello world");
```

### 索引访问类型
我们可以使用索引访问类型来查找类型的特定属性。

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
// type Age = number
```
索引类型本身就是一种类型，因此我们可以使用联合类型或其他类型。
```typescript
type I1 = Person["age" | "name"];

// type I1 = string | number

type I2 = Person[keyof Person];

// type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];

// type I3 = string | boolean
```
### 条件类型
条件类型有助于描述输入和输出类型之间的关系。条件类型的形式有点像condition ? trueExpression : falseExpressionJavaScript 中的条件表达式。

```typescript
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;

// type Example1 = number

type Example2 = RegExp extends Animal ? number : string;

// type Example2 = string
```
### 映射类型
当不想重复一种类型的定义时，映射类型建立在索引签名的语法之上，用于声明未提前声明的属性类型。

```typescript
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```
### 模板文字类型
模板文字类型建立在字符串文字类型之上，并且能够通过联合扩展成许多字符串。

它们与JavaScript 中的模板文字字符串具有相同的语法，但用于类型上面。当与具体文字类型一起使用时，模板文字通过连接内容来生成新的字符串文字类型。

```typescript
type World = "world";

type Greeting = `hello ${World}`;

// type Greeting = "hello world"
```
对于模板文字中的每个插值位置，联合是交叉相乘的，当在插值位置使用联合时，类型是可以由每个联合成员表示的每个可能的字符串文字的集合。


```typescript
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;

// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
```
