---
title: 'JavaScript 中常见设计模式整理'
description: '梳理单例、工厂、策略、代理、发布-订阅、命令、组合、享元、职责链、装饰者、状态、适配者、观察者等常见设计模式与代码示例。'
pubDate: 'Oct 20 2021'
updatedDate: 'Feb 28 2022'
---

昨天一大佬同学问到我了设计模式有哪些，一时间竟答不出来，其实在平常开发者就经常使用了，因此需要梳理常见设计模式，充分理解和使用。本文使用WebMaker在线演示，WebMaker在线编辑平台让你学习更方便、效率更高！

## 常见设计模式
|设计模式|特点
|-------|-------|
|单例模式|一个类只能构造出唯一实例|
|工厂模式|工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类|
|策略模式|根据不同参数可以命中不同的策略|
|代理模式|代理对象和本体对象具有一致的接口|
|迭代器模式|能获取聚合对象的顺序和元素|
|发布-订阅模式|PubSub|
|命令模式|不同对象间约定好相应的接口|
|组合模式|组合模式在对象间形成一致对待的树形结构|
|模板方法模式|父类中定好执行顺序|
|享元模式|减少创建实例的个数|
|职责链模式|通过请求第一个条件，会持续执行后续的条件，直到返回结果为止|
|中介者模式|对象和对象之间借助第三方中介者进行通信|
|装饰者模式|动态地给函数赋能|
|状态模式|每个状态建立一个类，状态改变会产生不同行为|
|适配者模式|一种数据结构改成另一种数据结构|
|观察者模式|当观察对象发生变化时自动调用相关函数|

## 在线演示
[WebMaker在线编辑 - JavaScript常见设计模式例子](https://codeshare2.diyxi.top/#/editor?id=111)

## 模式解释
### 1. 单例模式
#### 单例模式两个条件
* 确保只有一个实例
* 可以全局访问

```javascript
const singleton = function(name) {
  this.name = name
  this.instance = null
}

singleton.prototype.getName = function() {
  console.log(this.name)
}

singleton.getInstance = function(name) {
  if (!this.instance) { // 关键语句
    this.instance = new singleton(name)
  }
  return this.instance
}

// test
const a = singleton.getInstance('a') // 通过 getInstance 来获取实例
const b = singleton.getInstance('b')
console.log(a === b)
```
#### 实践

实现弹框的一种做法是先创建好弹框, 然后使之隐藏, 这样子的话会浪费部分不必要的 DOM 开销, 我们可以在需要弹框的时候再进行创建, 同时结合单例模式实现只有一个实例, 从而节省部分 DOM 开销。

### 2. 工厂模式

工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。
```javascript
class Product {
    constructor(name) {
        this.name = name
    }
    init() {
        console.log('init')
    }
    fun() {
        console.log('fun')
    }
}

class Factory {
    create(name) {
        return new Product(name)
    }
}

// use
let factory = new Factory()
let p = factory.create('p1')
p.init()
p.fun()


```
#### 实践

```javascript
var employee1 = new Object();
employee1.position = "Front end engineer";
employee1.tool = "I love vscode.";
employee1.introduction = function () {
    console.log("I am a " + this.position + ", and " + this.tool);
}
var employee2 = new Object();
employee2.position = "UI designer";
employee2.tool = "I love photoshop.";
employee2.introduction = function () {
    console.log("I am a " + this.position + ", and " + this.tool);
}
employee1.introduction();//I am a Front end engineer, and I love vscode.
employee2.introduction();//I am a UI designer, and I love photoshop.
```
在上边这个例子中，我们定义了两个employee，一个是Front End Engineer，另一个是UI designer，他们都有position属性和tool属性，也都有introduction方法。如果我们需要创建很多个类似employee的对象呢，那我们就需要重复很多类似的代码。

```javascript
function Employee(type) {
    var employee;
    if (type == "programmer") {
        employee = new Programmer();
    } else if (type == "designer") {
        employee = new Designer();
    }
    employee.introduction = function () {
        console.log("I am a " + this.position + ", and " + this.tool);
    }
    return employee;

}

function Programmer() {
    this.position = "Front end engineer";
    this.tool = "I love vscode.";
}
function Designer() {
    this.position = "UI designer";
    this.tool = "I love photoshop.";
}

var employee1 = Employee("programmer");
employee1.introduction();//I am a Front end engineer, and I love vscode.
var employee2 = Employee("designer");
employee2.introduction();//I am a UI designer, and I love photoshop.
```
在上边这段代码中，我们将employee的初始化分别放到了Programmer()和Designer()中实现。这其实就是一个简单工厂模式的例子，Employee是一个工厂，可以根据传入的type的不同，创建不同的employee，每个employee有自己的职位和使用的工具，每个employee都可以介绍自己的这些信息。


曾经我们熟悉的JQuery的$()就是一个工厂函数，它根据传入参数的不同创建元素或者去寻找上下文中的元素，创建成相应的jQuery对象。

```javascript
class jQuery {
    constructor(selector) {
        super(selector)
    }
    add() {

    }
  // 此处省略若干API
}

window.$ = function(selector) {
    return new jQuery(selector)
}
```

### 3. 策略模式

根据不同参数可以命中不同的策略。

#### 实践

观察如下获取年终奖的 demo, 根据不同的参数（level）获得不同策略方法(规则), 这是策略模式在 JS 比较经典的运用之一。

```javascript
const strategy = {
  'S': function(salary) {
    return salary * 4
  },
  'A': function(salary) {
    return salary * 3
  },
  'B': function(salary) {
    return salary * 2
  }
}

const calculateBonus = function(level, salary) {
  return strategy[level](salary)
}

calculateBonus('A', 10000) // 30000

```
策略模式的使用常常隐藏在高阶函数中, 稍微变换下上述 demo 的形式如下, 可以发现我们平时已经在使用它了, 恭喜我们又掌握了一种设计模式。
```javascript
const S = function(salary) {
  return salary * 4
}

const A = function(salary) {
  return salary * 3
}

const B = function(salary) {
  return salary * 2
}

const calculateBonus = function(func, salary) {
  return func(salary)
}

calculateBonus(A, 10000) // 30000

```
优点：能减少大量的 if 语句，复用性好。

### 4. 代理模式
是为一个对象提供一个代用品或占位符，以便控制对它的访问。

情景: 小明追女生 A
- 非代理模式: 小明 =花=> 女生 A
- 代理模式: 小明 =花=> 让女生 A 的好友 B 帮忙 =花=> 女生 A

#### 虚拟代理实现图片预加载

下面这段代码运用代理模式来实现图片预加载, 可以看到通过代理模式巧妙地将创建图片与预加载逻辑分离, 并且在未来如果不需要预加载, 只要改成请求本体代替请求代理对象就行。

```javascript
const myImage = (function() {
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})()

const proxyImage = (function() {
  const img = new Image()
  img.onload = function() { // http 图片加载完毕后才会执行
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('loading.jpg') // 本地 loading 图片
      img.src = src
    }
  }
})()

proxyImage.setSrc('http://loaded.jpg')

```

在开发时候不要先去猜测是否需要使用代理模式, 如果发现直接使用某个对象不方便时, 再来优化不迟。

#### 缓存代理实现乘积计算

```javascript
const mult = function() {
  let a = 1
  for (let i = 0, l; l = arguments[i++];) {
    a = a * l
  }
  return a
}

const proxyMult = (function() {
  const cache = {}
  return function() {
    const tag = Array.prototype.join.call(arguments, ',')
    if (cache[tag]) {
      return cache[tag]
    }
    cache[tag] = mult.apply(this, arguments)
    return cache[tag]
  }
})()

proxyMult(1, 2, 3, 4) // 24
```

### 5. 迭代器模式
提供一种方法顺序一个聚合对象中各个元素，而又不暴露该对象的内部表示。

```javascript
class Iterator {
    constructor(conatiner) {
        this.list = conatiner.list
        this.index = 0
    }
    next() {
        if (this.hasNext()) {
            return this.list[this.index++]
        }
        return null
    }
    hasNext() {
        if (this.index >= this.list.length) {
            return false
        }
        return true
    }
}

class Container {
    constructor(list) {
        this.list = list
    }
    getIterator() {
        return new Iterator(this)
    }
}

// 测试代码
let container = new Container([1, 2, 3, 4, 5])
let iterator = container.getIterator()
while(iterator.hasNext()) {
  console.log(iterator.next())
}
```

### 6. 发布-订阅模式

#### 简单的发布订阅事件
```javascript
class Event {
  constructor () {}
  // 首先定义一个事件容器，用来装事件数组（因为订阅者可以是多个）
  handlers = {}

  // 事件添加方法，参数有事件名和事件方法
  addEventListener (type, handler) {
    // 首先判断handlers内有没有type事件容器，没有则创建一个新数组容器
    if (!(type in this.handlers)) {
      this.handlers[type] = []
    }
    // 将事件存入
    this.handlers[type].push(handler)
  }

  // 触发事件两个参数（事件名，参数）
  dispatchEvent (type, ...params) {
    // 若没有注册该事件则抛出错误
    if (!(type in this.handlers)) {
      return new Error('未注册该事件')
    }
    // 便利触发
    this.handlers[type].forEach(handler => {
      handler(...params)
    })
  }

  // 事件移除参数（事件名，删除的事件，若无第二个参数则删除该事件的订阅和发布）
  removeEventListener (type, handler) {
      // 无效事件抛出
      if (!(type in this.handlers)) {
        return new Error('无效事件')
      }
      if (!handler) {
        // 直接移除事件
        delete this.handlers[type]
      } else {
        const idx = this.handlers[type].findIndex(ele => ele === handler)
        // 抛出异常事件
        if (idx === undefined) {
          return new Error('无该绑定事件')
        }
        // 移除事件
        this.handlers[type].splice(idx, 1)
        if (this.handlers[type].length === 0) {
          delete this.handlers[type]
        }
      }
    }
}
```

发布者，订阅者和处理中心。. 这里处理中心相当于报刊办事大厅。. 发布者相当与某个杂志负责人，他来中心这注册一个的杂志，而订阅者相当于用户，我在中心订阅了这分杂志。. 每当发布者发布了一期杂志，办事大厅就会通知订阅者来拿新杂志。

#### Vue 中的实现

```javascript
function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
        var this$1 = this;

        var vm = this;
        // event 为数组时，循环执行 $on
        if (Array.isArray(event)) {
            for (var i = 0, l = event.length; i < l; i++) {
                this$1.$on(event[i], fn);
            }
        } else {
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true;
            }
        }
        return vm
    };

    Vue.prototype.$once = function (event, fn) {
        var vm = this;
        // 先绑定，后删除
        function on () {
            vm.$off(event, on);
            fn.apply(vm, arguments);
        }
        on.fn = fn;
        vm.$on(event, on);
        return vm
    };

    Vue.prototype.$off = function (event, fn) {
        var this$1 = this;

        var vm = this;
        // all，若没有传参数，清空所有订阅
        if (!arguments.length) {
            vm._events = Object.create(null);
            return vm
        }
        // array of events，events 为数组时，循环执行 $off
        if (Array.isArray(event)) {
            for (var i = 0, l = event.length; i < l; i++) {
                this$1.$off(event[i], fn);
            }
            return vm
        }
        // specific event
        var cbs = vm._events[event];
        if (!cbs) {
            // 没有 cbs 直接 return this
            return vm
        }
        if (!fn) {
            // 若没有 handler，清空 event 对应的缓存列表
            vm._events[event] = null;
            return vm
        }
        if (fn) {
            // specific handler，删除相应的 handler
            var cb;
            var i$1 = cbs.length;
            while (i$1--) {
                cb = cbs[i$1];
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i$1, 1);
                    break
                }
            }
        }
        return vm
    };

    Vue.prototype.$emit = function (event) {
        var vm = this;
        {
            // 传入的 event 区分大小写，若不一致，有提示
            var lowerCaseEvent = event.toLowerCase();
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(
                    "Event \"" + lowerCaseEvent + "\" is emitted in component " +
                    (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                    "Note that HTML attributes are case-insensitive and you cannot use " +
                    "v-on to listen to camelCase events when using in-DOM templates. " +
                    "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
                );
            }
        }
        var cbs = vm._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            // 只取回调函数，不取 event
            var args = toArray(arguments, 1);
            for (var i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(vm, args);
                } catch (e) {
                    handleError(e, vm, ("event handler for \"" + event + "\""));
                }
            }
        }
        return vm
    };
}

/***
   * Convert an Array-like object to a real Array.
   */
function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
          ret[i] = list[i + start];
    }
    return ret
}
```

### 7. 命令模式

命令模式与策略模式有些类似, 在 JavaScript 中它们都是隐式的。不是很重要。

命令模式在 JavaScript 中也比较简单, 下面代码中对按钮和命令进行了抽离, 因此可以复杂项目中可以使用命令模式将界面的代码和功能的代码交付给不同的人去写。

#### 实践

```javascript
const setCommand = function(button, command) {
  button.onClick = function() {
    command.excute()
  }
}

// --------------------  上面的界面逻辑由A完成, 下面的由B完成

const menu = {
  updateMenu: function() {
    console.log('更新菜单')
  },
}

const UpdateCommand = function(receive) {
  return {
    excute: receive.updateMenu,
  }
}

const updateCommand = UpdateCommand(menu) // 创建命令

const button1 = document.getElementById('button1')
setCommand(button1, updateCommand)

```

### 8. 组合模式

#### demo1 - 宏命令

1. 煮咖啡
2. 打开电视、打开音响
3. 打开空调、打开电脑

一次性完成以上操作。

```javascript
const MacroCommand = function() {
  return {
    lists: [],
    add: function(task) {
      this.lists.push(task)
    },
    excute: function() { // ①: 组合对象调用这里的 excute,
      for (let i = 0; i < this.lists.length; i++) {
        this.lists[i].excute()
      }
    },
  }
}

const command1 = MacroCommand() // 基本对象

command1.add({
  excute: () => console.log('煮咖啡') // ②: 基本对象调用这里的 excute,
})

const command2 = MacroCommand() // 组合对象

command2.add({
  excute: () => console.log('打开电视')
})

command2.add({
  excute: () => console.log('打开音响')
})

const command3 = MacroCommand()

command3.add({
  excute: () => console.log('打开空调')
})

command3.add({
  excute: () => console.log('打开电脑')
})

const macroCommand = MacroCommand()
macroCommand.add(command1)
macroCommand.add(command2)
macroCommand.add(command3)

macroCommand.excute()

// 煮咖啡
// 打开电视
// 打开音响
// 打开空调
// 打开电脑

```

#### demo2 —— 扫描文件夹

扫描文件夹时, 文件夹下面可以是另一个文件夹也可以为文件, 我们希望统一对待这些文件夹和文件, 这种情形适合使用组合模式。

```javascript
const Folder = function(folder) {
  this.folder = folder
  this.lists = []
}

Folder.prototype.add = function(resource) {
  this.lists.push(resource)
}

Folder.prototype.scan = function() {
  console.log('开始扫描文件夹: ', this.folder)
  for (let i = 0, folder; folder = this.lists[i++];) {
    folder.scan()
  }
}

const File = function(file) {
  this.file = file
}

File.prototype.add = function() {
  throw Error('文件下不能添加其它文件夹或文件')
}

File.prototype.scan = function() {
  console.log('开始扫描文件: ', this.file)
}

const folder = new Folder('根文件夹')
const folder1 = new Folder('JS')
const folder2 = new Folder('life')

const file1 = new File('深入React技术栈.pdf')
const file2 = new File('JavaScript权威指南.pdf')
const file3 = new File('小王子.pdf')

folder1.add(file1)
folder1.add(file2)

folder2.add(file3)

folder.add(folder1)
folder.add(folder2)

folder.scan()

// 开始扫描文件夹:  根文件夹
// 开始扫描文件夹:  JS
// 开始扫描文件:  深入React技术栈.pdf
// 开始扫描文件:  JavaScript权威指南.pdf
// 开始扫描文件夹:  life
// 开始扫描文件:  小王子.pdf

```

### 9. 模板方法模式

在继承的基础上, 在父类中定义好执行的算法。

来对比下泡茶和泡咖啡过程中的异同

| 步骤 | 泡茶 | 泡咖啡 |
| :-: | :-: | :-: |
|1|烧开水|烧开水|
|2|浸泡茶叶|冲泡咖啡|
|3|倒入杯子|倒入杯子|
|4|加柠檬|加糖|

#### 实践

```javascript
const Drinks = function() {}

Drinks.prototype.firstStep = function() {
  console.log('烧开水')
}

Drinks.prototype.secondStep = function() {}

Drinks.prototype.thirdStep = function() {
  console.log('倒入杯子')
}

Drinks.prototype.fourthStep = function() {}

Drinks.prototype.init = function() { // 模板方法模式核心: 在父类上定义好执行算法
  this.firstStep()
  this.secondStep()
  this.thirdStep()
  this.fourthStep()
}

const Tea = function() {}

Tea.prototype = new Drinks

Tea.prototype.secondStep = function() {
  console.log('浸泡茶叶')
}

Tea.prototype.fourthStep = function() {
  console.log('加柠檬')
}

const Coffee = function() {}

Coffee.prototype = new Drinks

Coffee.prototype.secondStep = function() {
  console.log('冲泡咖啡')
}

Coffee.prototype.fourthStep = function() {
  console.log('加糖')
}

const tea = new Tea()
tea.init()

// 烧开水
// 浸泡茶叶
// 倒入杯子
// 加柠檬

const coffee = new Coffee()
coffee.init()

// 烧开水
// 冲泡咖啡
// 倒入杯子
// 加糖

```

### 10. 享元模式

享元模式是一种优化程序性能的模式, 本质为减少对象创建的个数。

以下情况可以使用享元模式:

1. 有大量相似的对象, 占用了大量内存
2. 对象中大部分状态可以抽离为外部状态

#### 实践
某商家有 50 种男款内衣和 50 种款女款内衣, 要展示它们
方案一: 造 50 个塑料男模和 50 个塑料女模, 让他们穿上展示, 代码如下:

```javascript
const Model = function(gender, underwear) {
  this.gender = gender
  this.underwear = underwear
}

Model.prototype.takephoto = function() {
  console.log(`${this.gender}穿着${this.underwear}`)
}

for (let i = 1; i < 51; i++) {
  const maleModel = new Model('male', `第${i}款衣服`)
  maleModel.takephoto()
}

for (let i = 1; i < 51; i++) {
  const female = new Model('female', `第${i}款衣服`)
  female.takephoto()
}

```
方案二: 造 1 个塑料男模特 1 个塑料女模特, 分别试穿 50 款内衣

```javascript
const Model = function(gender) {
  this.gender = gender
}

Model.prototype.takephoto = function() {
  console.log(`${this.sex}穿着${this.underwear}`)
}

const maleModel = new Model('male')
const femaleModel = new Model('female')

for (let i = 1; i < 51; i++) {
  maleModel.underwear = `第${i}款衣服`
  maleModel.takephoto()
}

for (let i = 1; i < 51; i++) {
  femaleModel.underwear = `第${i}款衣服`
  femaleModel.takephoto()
}

```

对比发现: 方案一创建了 100 个对象, 方案二只创建了 2 个对象, 在该 demo 中, gender(性别) 是内部对象, underwear(穿着) 是外部对象。

### 11. 职责链模式

职责链模式: 类似多米诺骨牌, 通过请求第一个条件, 会持续执行后续的条件, 直到返回结果为止。

#### DEMO1

场景: 某电商针对已付过定金的用户有优惠政策, 在正式购买后, 已经支付过 500 元定金的用户会收到 100 元的优惠券, 200 元定金的用户可以收到 50 元优惠券, 没有支付过定金的用户只能正常购买。

```javascript
// orderType: 表示订单类型, 1: 500 元定金用户；2: 200 元定金用户；3: 普通购买用户
// pay: 表示用户是否已经支付定金, true: 已支付；false: 未支付
// stock: 表示当前用于普通购买的手机库存数量, 已支付过定金的用户不受此限制

const order = function( orderType, pay, stock ) {
  if ( orderType === 1 ) {
    if ( pay === true ) {
      console.log('500 元定金预购, 得到 100 元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买, 无优惠券')
      } else {
        console.log('库存不够, 无法购买')
      }
    }
  } else if ( orderType === 2 ) {
    if ( pay === true ) {
      console.log('200 元定金预购, 得到 50 元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买, 无优惠券')
      } else {
        console.log('库存不够, 无法购买')
      }
    }
  } else if ( orderType === 3 ) {
    if (stock > 0) {
        console.log('普通购买, 无优惠券')
    } else {
      console.log('库存不够, 无法购买')
    }
  }
}

order( 3, true, 500 ) // 普通购买, 无优惠券

```
#### 改进1

下面用职责链模式改造代码:

```javascript
const order500 = function(orderType, pay, stock) {
  if ( orderType === 1 && pay === true ) {
    console.log('500 元定金预购, 得到 100 元优惠券')
  } else {
    order200(orderType, pay, stock)
  }
}

const order200 = function(orderType, pay, stock) {
  if ( orderType === 2 && pay === true ) {
    console.log('200 元定金预购, 得到 50 元优惠券')
  } else {
    orderCommon(orderType, pay, stock)
  }
}

const orderCommon = function(orderType, pay, stock) {
  if ((orderType === 3 || !pay) && stock > 0) {
    console.log('普通购买, 无优惠券')
  } else {
    console.log('库存不够, 无法购买')
  }
}

order500(3, true, 500) // 普通购买, 无优惠券

```

#### 改进2

改造后可以发现代码相对清晰了, 但是链路代码和业务代码依然耦合在一起, 进一步优化:

```javascript
// 业务代码
const order500 = function(orderType, pay, stock) {
  if ( orderType === 1 && pay === true ) {
    console.log('500 元定金预购, 得到 100 元优惠券')
  } else {
    return 'nextSuccess'
  }
}

const order200 = function(orderType, pay, stock) {
  if ( orderType === 2 && pay === true ) {
    console.log('200 元定金预购, 得到 50 元优惠券')
  } else {
    return 'nextSuccess'
  }
}

const orderCommon = function(orderType, pay, stock) {
  if ((orderType === 3 || !pay) && stock > 0) {
    console.log('普通购买, 无优惠券')
  } else {
    console.log('库存不够, 无法购买')
  }
}

// 链路代码
const chain = function(fn) {
  this.fn = fn
  this.sucessor = null
}

chain.prototype.setNext = function(sucessor) {
  this.sucessor = sucessor
}

chain.prototype.init = function() {
  const result = this.fn.apply(this, arguments)
  if (result === 'nextSuccess') {
    this.sucessor.init.apply(this.sucessor, arguments)
  }
}

const order500New = new chain(order500)
const order200New = new chain(order200)
const orderCommonNew = new chain(orderCommon)

order500New.setNext(order200New)
order200New.setNext(orderCommonNew)

order500New.init( 3, true, 500 ) // 普通购买, 无优惠券

```

### 12. 中介者模式

中介者模式: 对象和对象之间借助第三方中介者进行通信。

#### 实践
一场测试结束后, 公布结果: 告知解答出题目的人挑战成功, 否则挑战失败。

```javascript
const player = function(name) {
  this.name = name
  playerMiddle.add(name)
}

player.prototype.win = function() {
  playerMiddle.win(this.name)
}

player.prototype.lose = function() {
  playerMiddle.lose(this.name)
}

const playerMiddle = (function() { // 将就用下这个 demo, 这个函数当成中介者
  const players = []
  const winArr = []
  const loseArr = []
  return {
    add: function(name) {
      players.push(name)
    },
    win: function(name) {
      winArr.push(name)
      if (winArr.length + loseArr.length === players.length) {
        this.show()
      }
    },
    lose: function(name) {
      loseArr.push(name)
      if (winArr.length + loseArr.length === players.length) {
        this.show()
      }
    },
    show: function() {
      for (let winner of winArr) {
        console.log(winner + '挑战成功;')
      }
      for (let loser of loseArr) {
        console.log(loser + '挑战失败;')
      }
    },
  }
}())

const a = new player('A 选手')
const b = new player('B 选手')
const c = new player('C 选手')

a.win()
b.win()
c.lose()

// A 选手挑战成功;
// B 选手挑战成功;
// C 选手挑战失败;

```

### 13. 装饰者模式

生活中的例子: 天气冷了, 就添加衣服来保暖；天气热了, 就将外套脱下；这个例子很形象地含盖了装饰器的神韵, 随着天气的冷暖变化, 衣服可以动态的穿上脱下。

```javascript
let wear = function() {
  console.log('穿上第一件衣服')
}

const _wear1 = wear

wear = function() {
  _wear1()
  console.log('穿上第二件衣服')
}

const _wear2 = wear

wear = function() {
  _wear2()
  console.log('穿上第三件衣服')
}

wear()

// 穿上第一件衣服
// 穿上第二件衣服
// 穿上第三件衣服

```

#### AOP 装饰函数

```javascript
Function.prototype.before = function( beforefn ) {
    var _self = this  // 保存原函数引用
    return function() { // 返回包含原函数和新函数的“代理”函数
    beforefn.apply( this, arguments ) // 执行新函数，修正this
    return _self.apply( this, arguments ) // 执行原函数
    }
}

Function.prototype.after = function( afterfn ) {
    var _self = this
    return function() {
    var ret = _self.apply( this, arguments )
    afterfn.apply( this, arguments )
    return ret
    }
}

var func = function() {
    console.log(2)
}

func = func.before(function() {
    console.log(1)
}).after(function() {
    console.log(3)
})

func()

```
#### 改进
上面例子会污染原生函数, 可以做点通变
```javascript
const after = function(fn, afterFn) {
  return function() {
    fn.apply(this, arguments)
    afterFn.apply(this, arguments)
  }
}

const wear = after(after(wear1, wear2), wear3)
wear()

```

### 14. 状态模式

状态模式: 将事物内部的每个状态分别封装成类, 内部状态改变会产生不同行为。

优点: 用对象代替字符串记录当前状态, 状态易维护

缺点: 需编写大量状态类对象

#### 实践

某某牌电灯, 按一下按钮打开弱光, 按两下按钮打开强光, 按三下按钮关闭灯光。

```javascript
// 将状态封装成不同类
const weakLight = function(light) {
  this.light = light
}

weakLight.prototype.press = function() {
  console.log('打开强光')
  this.light.setState(this.light.strongLight)
}

const strongLight = function(light) {
  this.light = light
}

strongLight.prototype.press = function() {
  console.log('关灯')
  this.light.setState(this.light.offLight)
}

const offLight = function(light) {
  this.light = light
}

offLight.prototype.press = function() {
  console.log('打开弱光')
  this.light.setState(this.light.weakLight)
}

const Light = function() {
  this.weakLight = new weakLight(this)
  this.strongLight = new strongLight(this)
  this.offLight = new offLight(this)
  this.currentState = this.offLight          // 初始状态
}

Light.prototype.init = function() {
  const btn = document.createElement('button')
  btn.innerHTML = '按钮'
  document.body.append(btn)
  const self = this
  btn.addEventListener('click', function() {
    self.currentState.press()
  })
}

Light.prototype.setState = function(state) { // 改变当前状态
  this.currentState = state
}

const light = new Light()
light.init()

// 打开弱光
// 打开强光
// 关灯

```

### 15. 适配者模式

适配者模式: 主要用于解决两个接口之间不匹配的问题。

#### 实践

```javascript
// 老接口
const zhejiangCityOld = (function() {
  return [
    {
      name: 'hangzhou',
      id: 11,
    },
    {
      name: 'jinhua',
      id: 12
    }
  ]
}())

console.log(getZhejiangCityOld())

// 新接口希望是下面形式
{
  hangzhou: 11,
  jinhua: 12,
}

// 这时候就可采用适配者模式
const adaptor = (function(oldCity) {
  const obj = {}
  for (let city of zhejiangCityOld) {
    obj[city.name] = city.id
  }
  return obj
}())

```

### 16. 观察者模式

应用场景:
场景: 当观察的数据对象发生变化时, 自动调用相应函数。比如 vue 的双向绑定

#### 双向绑定
使用 Object.defineProperty(obj, props, descriptor) 实现观察者模式, 其也是 vue 双向绑定 的核心, 示例如下(当改变 obj 中的 value 的时候, 自动调用相应相关函数)。

```javascript
var obj = {
  data: { list: [] },
}

Object.defineProperty(obj, 'list', {
  get() {
    return this.data['list']
  },
  set(val) {
    console.log('值被更改了')
    this.data['list'] = val
  }
})
```

Proxy/Reflect 是 ES6 引入的新特性, 也可以使用其完成观察者模式
```javascript
var obj = {
  value: 0
}

var proxy = new Proxy(obj, {
  set: function(target, key, value, receiver) { // {value: 0}  "value"  1  Proxy {value: 0}
    console.log('调用相应函数')
    Reflect.set(target, key, value, receiver)
  }
})

proxy.value = 1 // 调用相应函数
```

