# TypeScript基础用法

## 概述

typescript是js的超集，最终将被转换为js代码执行，与js一样都是弱类型的(允许隐式类型转换)。ts有静态类型(编译阶段类型检查)，更严格的语法检查，并完全兼容js语法。

PS: 本文基于es6+的语法基础上简单记录ts的独特之处，阅读需要掌握一定的es6+的知识  
官方文档[ts中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)|[ts英文文档handbook](https://www.typescriptlang.org/docs/handbook/intro.html)  
一些不错的第三方教程[参考文档](https://ts.xcatliu.com/introduction/index.html)  

## 开发环境搭建

ts同样依赖nodejs开发环境，使用`npm i -g typescript`安装ts编译器，通过tsc命令对ts文件进行编译  
工程开发中使用webpack结合typescript和ts-loader进行开发

### 编译选型

使用ts项目的目录下通常有tsconfig.json配置文件，常见配置如下：

```json
{
  "include":["src/**/*", "指定编译文件所在目录"],
  "exclude":["排除编译目录"],
  "extends":"指定要继承的配置文件",
  "files":["指定要编译的ts文件(主要用于零散的ts文件)"],
  "compilerOptions":{
    "target":"ES6", // 编译目标版本
    "lib":["DOM","ES6",], // 指定目标环境所包含的库
    "module":"UMD", // 指定编译后代码的模块化系统CommonJS,UMD,ES2020等
    "outDir":"dist", // 编译后文件输出目录
    "outFile":"dist/app.js", // 将所有代码合并到一个js文件中
    "rootDir":"./src", // 指定代码根目录
    "allowJs":false, // 是否对js文件进行编译
    "checkJs":false, // 是否对js文件进行检查
    "removeComments":false, // 是否移除注释
    "noEmit":false, // 是否不对代码进行编译
    "sourceMap":false, // 是否生成sourceMap
    "strict":true, // 是否开启所有严格检查
    "strictNullChecks":true, // 是否严格空值检查
    "noEmitOnError":false, // 是否在有错误的情况下不进行编译
  }
}
```

在使用webpack打包工具时，除tsconfig.json文件外，还需要在webpack.config.js文件中添加ts-loader

```js
module.exports = {
  module: {
    rules: [
      { // 简单配置
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  }
}
```

## 基本类型

ts中声明类型时需要指明变量类型，一旦指定变量类型，则该该变量不能存储其他类型的值

```typescript
let 变量: 类型; // 变量类型声明
let 变量 = 值; // 根据值自动推断变量类型
let 变量: 类型 = 值; // 声明类型并赋值
let 变量 = [0, 1, null]; // 自动推断为number或null联合类型的数组
```

常见的类型有：  
  |  类型   |       例子        |              描述              |
  | :-----: | :---------------: | :----------------------------: |
  | number  |    1, -33, 2.5    |         任意数字，支持其他进制  |
  | string  | 'hi', "hi", `hi`  |           任意字符串           |
  | boolean |    true、false    |       布尔值true或false        |
  | 字面量   |      其本身       |  限制变量的值就是该字面量的值     |
  |   any   |         *         |            任意类型           |
  | unknown |         *         |         类型安全的any         |
  |  void   | 空值（undefined） |     没有值（或undefined）       |
  |  never  |      没有值       |          不能是任何值           |
  | object  |  {name:'孙悟空'}  |          任意的JS对象           |
  |  array  |      [1,2,3]      |           任意JS数组          |
  |  tuple  |       [4,5]       | 元素，TS新增类型，固定长度数组   |
  |  enum   |    enum{A, B}     |       枚举，TS中新增类型       |
  |  bigint |    100n           |       es6中引入的大数字       |
  |  null   |    null           | null与undefined不同是两种类型，但都是所有类型的子类型 |
  | undefined |    undefined   |       同null       |

* 字面量指定类型

```typescript
let color: 'red' | 'blue' | 'black'; // color仅能取指定的三种颜色
let num: 1 | 2 | 3 | 4 | 5; // num仅能取所列出的整数
let unionType: string | number; // unionType可取string或number类型
```

* any/unknown/void/never
  * any会关闭ts的类型检查，若将any变量赋值给其他变量，则会导致其他变量的类型失效，失去ts的意义，尽量避免使用any
  * void无任何类型，修饰函数时表示，无返回值或返回undefined，修饰变量时，变量只能取null，undefined和其他void类型变量
  * unknown 安全版本的any，unknown类型变量能够接收任何类型的值，但不能将unknown赋给any、unknown之外的变量，unknown类型不可执行方法，但any可以
  * never永远不存在的值的类型，如函数中报错未运行完成，也就不存在返回值；死循环函数也不存在返回值，因此函数声明时返回类型可声明为never，另外never,null,undefined可以赋给任何类型
* array/tuple/enum
  * array数组中只能存储同一类型的值，类型声明：`类型[]`或`Array<类型>`
  * tuple元组是类似于指定长度的数组，但可以存储指定的不同类型，越界添加元素时不会报错，但新元素的类型被限定为指定不同类型中的一种(联合类型)
  * enum枚举类型,定义枚举类：`enum Weeks {Sun, Mon, Tue, Wen, Thu, Fri, Sat}`枚举成员会的被赋值为从0开始的数字，使用时`let day: Weeks = Weeks.Sun;`

* 类型断言：告诉编译器变量的类型，语法形式:`(值 as 类型)`或`<类型>值`
  * TODO：完善断言详细规则

* 类型别名可以给类型取一个新名字：`type 新别名 = 类型`，

PS:所有类型表示均以小写开头，区别于以大写开头的

### 枚举enum

枚举通常被用来限定该枚举的取值范围，如星期，固定的颜色等，最为类型名限定变量仅能取其成员，常见的枚举类型有：

* 数字枚举

```ts
// 若未初始化，则从0开始初始化，即相应的枚举成员值对应数字
enum Direction {
  Up = 1, // Up被初始化为1,其余成员在其前方成员基础上+1
  Down,
  Left,
  Right
}
// 数字枚举有反向映射，字符串枚举没有
console.log(Direction[1]); // 输出: 'Up'
```

* 字符串枚举

```ts
enum Direction { // 字符串枚举每个成员必须被初始化
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

异构枚举：混合了数字和字符串的成员(不推荐)  
除了使用字符串、数字对成员进行初始化外，还可使用对之前的常量枚举成员的引用，常量表达式(返回常量的表达式，求值后为NaN或/Infinity除外)进行初始化  
枚举在运行时是真正存在的对应，即可以按照其字面量值的类型进行运算  

### 类型兼容性

类型兼容性将影响赋值，一些主要类型的兼容性如下：  

* 结构类型(普通对象类类型)中：具有相同结构的类型是相互兼容的，“精确”的类型的变量更够赋值给“不那么精确”的变量，反过来不行。即“ts总是倾向于忽略一些变量”  
* 函数类型的兼容性也遵循着类似的原则，对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名，确保在所有的地方可调用  
* 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。  
* 类的私有和保护成员会影响兼容性  

### 高级类型

* 交叉类型：将多个类型合并为一个类型，如`Person & Serializable & Loggable`同时具有这三种类型的成员，类似于混入mixins  
* 联合类型：多个类型的或关系`number | string | boolean`表示一个值可以是三种类型中的一种

在使用联合类型是，如果确切知道变量所属类型，可使用断言、函数返回`var is typename`类型谓词、`typeof var === typename`、`var instanceof typename`的方式进行类型保护，明确变量类型  

null和undefined是所有类型的子类，因此可以赋值给任何类型，可以使用上述类型保护排除，也可以使用后缀`!`，如`var!`方式排除null和undefined

## 对象类型

### class类|抽象类|接口

```ts
class 类型名1 extends 基础类型 { // 从基础类型进行继承(可选)
  属性名: 类型;
  public 公共属性: 类型; // 默认值，可在类、子类、实例中修改(外部读写)
  protected 保留属性: 类型; // 仅可以在类、子类中修改
  private 私有属性: 类型; // 仅可以在类中修改
  constructor(参数:类型){
    super(参数); // 执行父类构造函数，可传入参数，构造器中的super代表父类构造函数，与方法中的super不同。继承时必须调用super()执行基类构造函数
    this.属性名 = 参数;
  }
  static 方法名() {}
  static 静态属性: 类型;
  get 私有属性(){return 私有属性;}
  set 私有属性(value: 类型){this.私有属性 = value;}
  sayHi(){ // 方法，可复写父类中的方法
    super.sayHi(); // 在方法中使用super代表父类
  }
}
abstract class 抽象类 { // 抽象类只能用于extends继承，不能用来实例化对象
  abstract 抽象方法():void; // 抽象类中定义的抽象方法，子类必须实现该方法
}
class a extends 抽象类 {
  抽象方法(){console.log('')}
}
// 抽象类中可以有实现细节
// 接口类似于抽象类，但所有属性和方法都没有实际值，主要用于定义类的结构
// 接口也与类型别名相似，在一定条件下可以相互替换
interface Person extends 接口1 { // 接口可继承其他接口或类
  name: string;
  readonly weight: number; // 只读属性, 当做属性使用时使用readonly, 当使用变量时使用const。只读属性必须在声明或构造函数中初始化
  sayHello():void;
  age?:number; // 使用?修饰，可选属性
  [propName: string]: any; // 允许增加任意属性，确定属性和可选属性的类型必须是任意属性类型的子集，接口中只能定义一个任意属性
  
  (source:string):boolean; // 接口的方式表示函数类型，参数名可以不同，但类型必须相同

  // ts支持两种索引签名：字符串和数字
  [index:number]:null; // 数字索引的返回值类型必须时字符串索引值返回类型的子类
  [index:string]:string // 此例中null是string的子类，同时这样定义后声明的其他字面量属性必须时string的子类，如：
  name:number // error
}
class guy extends 抽象类 implements Person, 接口2 { // 继承抽象类并实现多个接口
// 此处接口实现仅针对实例部分进行了类型检查
  constructor(public name: string){ // 属性声明也可放在构造函数参数上
  }
  sayHello(){console.log(this.name)}
}

// 接口也可以继承一个类类型，此时它仅继承类的成员，不包括其实现
interface BadGuy extends guy {}
```

声明了一个类，也相当于定于了一个类的实例类型

### 泛型

泛型用于解决定义函数或类时，不确定要使用的数据类型问题，通过`<T>`定义泛型，后即可使用'T'表示该类型，具体类型可在调用时指定，实例：

```ts
function test<T, K>(arg1: T, arg2: K): T {
  return arg1; // 泛型类似于占位符，不一定使用T,K表示
}

test(10, 'a'); // 自动推断
test<number, string>(10, 'a'); // 手动指定

interface MyInter<T> {
  length : number;
  (arg: T):T; // 泛型方法
}

class MyClass<T extends MyInter>{ // 限制T的类型范围,必须为MyInter的子类,此例中T具有了length属性
  private key: T;
  constructor(prop: T){
    this.key = prop;
  }
  keyAdd:(x:T) => T;
}
```

### 函数

```ts
// 使用？定义了可选参数去后不可出现确定参数，默认参数将被视为可选参数，但不受前一条件约束，rest参数为一数组类型
// 可选参数与默认参数共享参数类型
function fn(确定参数: 类型, 可选参数?: 类型, 默认参数: string = 'name', ...rest: any[]): 返回类型{
}
// 函数表达式, 其中=>符号表示函数定义与es6中的箭头函数不同
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
interface func {
  (arg1: string, arg2: number): boolean; // 接口的方式定义函数形状
}
function foo(this:void) {}; // 可以为this显式指定一个参数，此时this必须出现在参数列表的最前方
// 在回调函数中也可以指定其他类型便于ts进行类型检查
```

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。  
根据传入参数类型的不同做不同的处理，如:

```ts
function pickCard(x:object):number; // 重载1
function pickCard(x:number):object; // 重载2
function pickCard(x):any { // 函数具体实现逻辑
  if(typeof x === 'object') console.log('handle object');
  if(typeof x === 'number') console.log('handle number');
}
// pickCard调用时，查找重载列表，从上到下匹配，所以最精确的定义放在前面
```

## 类型别名

前面简单提到了类型别名type和类型断言

## 声明文件
