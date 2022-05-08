# TypeScript基础用法

## 概述

typescript是js的超集，最终将被转换为js代码执行，与js一样都是弱类型的(允许隐式类型转换)。ts有静态类型(编译阶段类型检查)，更严格的语法检查，并完全兼容js语法。

TODO:本笔记知识简略的了解ts，具体使用还需详细学习[参考文档](https://ts.xcatliu.com/introduction/index.html)

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
  * array数组中只能存储同一类型的值，`类型[]`或`Array<类型>`
  * tuple元组是类似于指定长度的数组，但可以存储指定的不同类型，越界添加元素时不会报错，但新元素的类型被限定为指定不同类型的一种
  * enum枚举类型,定义枚举类：`enum Weeks {Sun, Mon, Tue, Wen, Thu, Fri, Sat}`枚举成员会的被赋值为从0开始的数字，使用时`let day: Weeks = Weeks.Sun;`

* 类型断言：告诉编译器变量的类型，语法形式:`(值 as 类型)`或`<类型>值`
  * TODO：完善断言详细规则

* 类型别名可以给类型取一个新名字：`type 新别名 = 类型`，

## 对象类型

### class类|抽象类|接口

```ts
class 类型名1 {
  属性名: 类型;
  public 公共属性: 类型; // 默认值，可在类、子类、实例中修改
  protected 保留属性: 类型; // 仅可以在类、子类中修改
  private 私有属性: 类型; // 仅可以在类中修改
  constructor(参数:类型){this.属性名 = 参数;}
  static 方法名() {}
  static 静态属性: 类型;
  get 私有属性(){return 私有属性;}
  set 私有属性(value: 类型){this.私有属性 = value;}
}
abstract class 抽象类 { // 抽象类只能用于extends继承，不能用来实例化对象
  abstract 抽象方法():void; // 抽象类中定义的抽象方法，子类必须实现该方法
}
class a extends 抽象类 {
  抽象方法(){console.log('')}
}
// 接口类似于抽象类，但所有属性和方法都没有实际值，主要用于定义类的结构
// 接口也与类型别名相似，在一定条件下可以相互替换
interface Person extends 接口1 { // 接口可继承其他接口或类
  name: string;
  readonly weight: number; // 只读属性
  sayHello():void;
  age?:number; // 使用?修饰，可选属性
  [propName: string]: any; // 允许增加任意属性，确定属性和可选属性的类型必须是任意属性类型的子集，接口中只能定义一个任意属性
}
class guy extends 抽象类 implements Person, 接口2 { // 继承抽象类并实现多个接口
  constructor(public name: string){ // 属性声明也可放在构造函数参数上
  }
  sayHello(){console.log(this.name)}
}
```

### 泛型

泛型用于解决定义函数或类时，不确定要使用的数据类型问题，通过`<T>`定义泛型，后即可使用'T'表示该类型，具体类型可在调用时指定，实例：

```ts
function test<T, K>(arg1: T, arg2: K): T {
  return arg1; // 泛型类似于占位符，不一定使用T,K表示
}

test(10, 'a'); // 自动推断
test<number, string>(10, 'a'); // 手动指定

interface MyInter {
  length : number;
}

class MyClass<T extends MyInter>{ // 限制T的类型范围,必须为MyInter的子类
  private key: T;
  constructor(prop: T){
    this.key = prop;
  }
}
```

### 函数

```ts
// 使用？定义了可选参数去后不可出现确定参数，默认参数将被视为可选参数，但不受前一条件约束，rest参数为一数组类型
function fn(确定参数: 类型, 可选参数?: 类型, 默认参数: string = 'name', ...rest: any[]): 返回类型{
}
// 函数表达式, 其中=>符号表示函数定义与es6中的箭头函数不同
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
interface func {
  (arg1: string, arg2: number): boolean; // 接口的方式定义函数形状
}
```

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。
TODO：详细完善重载

## 声明文件
