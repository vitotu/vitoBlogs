# JavaScript高级程序设计读书笔记

## javaScript简介  

javaScript(JS)，一个完整的js通常包含ECMAScript(核心)、DOM(文档对象模型)、BOM(浏览器对象模型)三部分  

### ECMAScript  

ECMAScript定义了语法,类型,语句,关键字,保留字,操作符,对象等标准,该语言标准与浏览器无关,其解释器可以是node,Adobe Flash,web浏览器等  
ECMAScript的不同版本又称版次,较为又影响力的版本有2009年发布的第5版(简称ES5)和2015年发布的第6版ECMAScript 2015(简称ES2015也称ES6).该标准每年发布一次,自ES2015开始后续版本也有相应的ES2016(ES7),ES2017(ES8)...等称呼  
  
### DOM模型  

DOM是针对XML但经过拓展并用于HTML的应用程序接口,DOM把整个页面映射为一个多层节点结构.  
DOM1级由DOM核心和DOM HTML两个模块组成,核心规定如何映射给予XML的文档结构,DOM HTML在核心的基础上添加了许多扩展  
DOM2级在1级的基础上引入了DOM视图(跟踪不同的文档，如应用css前和后)，DOM事件，DOM样式，DOM遍历和范围  
DOM3级则进一步引入了DOM加载和保存，并新增了验证文档的方法  
  
### BOM模型  

浏览器对象模型BOM，用于控制浏览器显示的页面以外的部分，如弹出新窗口等  
  
## 在html中使用JavaScript  

### `<script>`元素  

`<script>`元素有6个属性:async可选,表示应异步立即下载该脚本;charset可选,表示src属性指定代码的字符集;defer可选,表示脚本可以被延迟到文档完全解析再执行;language已废弃;src可选,外部代码链接;type可选,language的替代属性,默认值为text/javascript.  
`<script>`标签中添加了defer延后执行脚本，并仅对外部脚本生效  
async异步脚本一定会在load事件前执行  
在没有设置defer或async属性时解释器在执行完`<script>`中的内容之前页面中其余内容不会被加载或显示,因此标签通常被放置在文档末尾,若src属性被指定,则标签内内联代码会被忽略  
  
### 文档模式  

文档模式发展至今有：混杂模式、标准模式、准标准模式。如果文档开始处未进行声明浏览器默认开启混杂模式，  
h5的文档声明`<!DOCTYPE html>`使标准模式，对于准标准模式通常使用transitional或frameset文档类型来触发  
  
## 基本概念  

var和let的区别：  
let 无变量提升(存在死区)，块级作用域，不可重复声明

ES有5种基础数据类型Undefined，Null，Boolean，Number，String和1种复杂类型Object。  
typeof操作符可以根据变量的不同类型返回undefined，boolean,string,number,object(对象或null),function  

### 数据类型  

#### Number类型  

可以保存多种类型的数值，浮点数最高精度为17位小数，Number在数值没有小数时会自动转换为整数；
Number可以保存的最大数和最小数分别为Number.MIN_VALUE,Number.MAX_VALUE.若超出范围数值会被转换为Infinity，也可通过函数isFinite()判断数值是否是有穷。  
NaN非数值，涉及NaN的操作都会返回NaN，判断是否为NaN使用isNaN()函数，不能转换为数值的对象将返回false  
Number(),parseInt(),parseFloat(),3个函数用于把非数值转换为数值,Number()可用于任何数据类型,另外两个输入仅限字符串.Number输入null时输出为0,输入为undefined时输出为NaN  

#### 值得注意的语句  

with语句，示例：  

```javaScript  
with(location) {  
  var qs = search.substring(1);  
  var hostName = hostname;  
  var url = href;  
}  
```  

with包裹的代码中变量的共同前缀location可以省略  
switch语句每个case都需要break才能跳出  

#### 函数  

函数的参数在内部是通过一个数组来表示，通过arguments对象可以访问这个参数数组。  
js中没有重载，若定义两个名字相同的函数则该名字属于后定义的函数  
  
## 变量、作用域和内存问题  

变量的复制及函数参数传值均为按值复制，对于基本数据类型相当于创建了一个新的值赋给新的变量，对于引用类型相当于创建一个新的引用，赋给新的变量，新旧变量指向的仍然为同一对象  
引用类型变量的识别可以借助其原型链使用instanceof来进行判断  
若初始化变量时没有使用var声明，则该该变量会被添加到全局环境中  
给变量赋值null解除引用，通常用于全局变量  
  
## 引用类型  

使用字面量表示法时不会调用构造函数  
在instanceof Array失效时可以使用Array.isArray()来判断变量是否是数组  
array 的concat的方法若没有传入任何参数则会返回数组的副本(TODO:深拷贝，浅拷贝)  
  
### RegExp类型  

`var expression = / pattern / flags;`用于创建一个正则表达式  
flags可以取g(全局模式,发现第一个匹配项后不会停止匹配),i(不区分大小写的模式),m(多行模式)三种值中的一个或多个;  
也可使用`new RegExp("pattern", "flags")`构造正则表达式,由于这种方式的pattern是字符串形式不需要以`/*/`形式包裹,对元字符需要进行双重转义,如`\\[`表示[等  
RegExp实例具有global,ignoreCase,multiline三个属性为boolean值分别表示是否设置了g,i,m的flags；lastIndex属性,整数表示开始搜索下一个匹配项的字符起始位置,source正则表达式的字符串表示  
exec('targetString')方法,传入要应用正则的targetString,返回值包含匹配项数组(若不匹配则为null),index(匹配项的索引位置),input(输入字符串)的对象.  
js的正则表达式不支持条件匹配,并集交集类,后向查找等模式  
  
### function类型  

function类型有length和prototype属性分别表示接受命名参数的个数，及其原型属性，此外还有apply，call方法可以用来传入作用域(this,window等对象)和参数，bind用于绑定作用域并返回绑定了作用域的新函数  

### 基本包装类型  
  
### 单体内置对象  

#### global对象  

不属于其他对象的属性和方法,该属性和方法最终都属于global对象;  
encodeURI()和encodeURIComponent()方法分别对整个url的空格进行编码和对url分段的特殊字符进行全编码,与之对应的方法还有decodeURI()和decodeURIComponent().  
eval()方法可将传入的字符串转换为js脚本执行,同时该脚本将作为eval执行环境的一部分,可以使用环境中的变量也可以被环境调用,但在eval中定义的函数或变量不会被提升.  
除undefined,NaN,Infinity外,大多数引用类型的构造函数也都是global的属性.  
web浏览器通常将global作为window对象的一部分实现,因此全局作用域内声明的变量和函数都成了window对象的属性,也就是说node环境中也有上述全局变量和函数,与web中的window对象有相同的全局属性也有不同的地方.  

#### Math对象  

Math对象的属性通常是数学计算中常用到的一些特殊值如Math.E,Math.LN10,Math.LN2,Math.LOG2E,Math.LOG10E,Math.PI,Math.SQRT1_1,Math.SQRT2;  
min(),max()方法可以接受任意多个数值参数,返回其中最小或最大的值,若想应用与数组可以使用apply()方法,如`Math.max.apply(Math, arrays)`  
Math.ceil()向上舍入,Math.floor()向下舍入,Math.round()四舍五入  
Math.random()方法返回0-1之间的一个随机数,其他范围的随机数需要结合其他的数学函数进行计算构造  
Math对象还有很多的方法,具体方法及用于可以上MDN查找  
  
## 面向对象的程序设计  

### 属性类型  

数据属性有四个描述其行为的特性:

+ Configurable表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，默认为true  
+ Enumerable能否通过`for in`循环返回属性,默认为true  
+ Writable能否修改属性值,默认为true  
+ Value对应属性的数据值,从此位置进行读写,默认为undefined  
  
要改变属性的默认特性需要使用Object.defineProperty()方法如:  

```JavaScript  
var person = {}  
Object.defineProperty(person, "name", {  
  writable:false,  
  value: 'nigl'  
})  
alert(person.name); // nigl  
person.name = 'greg';  
alert(person.name); // nigl  
```  

对于Configurable其设置为false后，除Writable外其他三个特性均不能被配置;  
此外仅调用Object.definProperty()方法时,Configurable,Enumerable,Writable特性的默认值均为false  

#### 访问器属性  

访问器不含数据项,包含一对getter,setter函数(非必须),该属性有四个特性:  

+ Configurable类似属性的特性  
+ Enumerable类似属性的特性  
+ Get读取属性时调用的函数，默认为undefined  
+ Set写入属性时调用的函数，默认为undefined  
  
访问器属性必须通过Object。defineProperty()来定义,如:  

```JavaScript  
var book = {  
  _year : 2004,  
  edition: 1  
};  
Object.defineProperty(book, "year", {  
  get: function(){  
    return this._year;  
  },  
  set: function(newValue){  
    if(newValue > 2004){  
      this._year = newValue;  
      this.edition += newValue - 2004;  
    }  
  }  
})  
book.year = 2005;  
alter(book.edition) // 2  
```  

使用Object.defineProperties()方法可以一次性定义多个属性  
Object.getOwnPropertyDescriptor()方法可用于读取属性的特性,configurable等  
  
### 创建对象  

工厂模式,传入参数,在函数内创建对象,并给对象赋予属性和方法,最后返回创建好的对象  
构造函数模式,在函数中给调用作用域绑定属性和方法,使用`new somefunction()`的方式进行调用,相当于以下4个步骤:  

1. 创建一个对象  
2. 将构造函数的作用域赋给新对象(此时this指向了这个新对象)  
3. 执行构造函数中的代码(添加属性和方法)  
4. 返回新对象  
  
> 当构造函数作为普通函数调用时,其属性和方法会绑定到调用方的作用域  
构造函数模式没有公共共享的方法,没每个实例之间的相同方法实际上时不同的是方法对象  
  
原型模式  
> 每创建一个函数都会有一个prototype属性,将共享的属性和方法添加到prototype指向的对象中即可实现在不同的实例中共享  
在默认情况下所有的原型对象都会获取一个constructor属性指向构造函数本身,实例化产生的对象与构造函数没有直接关系,但可以通过prototype.constructor访问到构造函数.  
访问实例的属性会以实例到prototype对象的顺序进行搜索,也就是说实例定义同名属性不会覆盖prototype的属性,但会阻止访问prototype的属性,在实例中无法直接更改prototype的属性,删除实例的属性后prototype对应的同名属性就又可以访问了  
通过`hasOwnProperty()`方法检测属性来自对象还是原型  
`alert('name' in person); // ture`in用于判断属性是否在对象中存在(无论时对象还是原型中都返回true)  
使用字面量对象覆写prototype时,会导致已创建的对象与现有的原型断开连接  
原型模式若共享了引用属性,则在某一实例中修改了引用属性会共享至其他实例中  
  
组合使用构造函数和原型模式是最广泛的创建自定义类型的方法：  

```JavaScript  
function Person(name){  
  // 在构造函数中定义实例的属性和方法  
  this.name = name;  
  this.friends = {'shell', 'java'};  
}  
Person.prototype = {  
  // 在原型中定义共享的属性和方法  
  constructor: Person,  
  sayName: function(){  
    alert(this.name);  
  }  
}  
```  

动态原型模式整合构造函数和原型模式，仅在第一次调用构造函数时初始化原型：  

```JavaScript  
function Person(name){  
  this.name = name;  
  // 初次初始化原型,此处不可用字面量对象覆写原型  
  if (typeof this.sayName != "function"){  
    Person.prototype.sayName = function(){  
      alert(this.name);  
    };  
  }  
}  
  
```  

寄生构造函数模式：工厂模式和构造函数模式的结合  
稳妥构造函数模式：与寄生构造函数模式类似不使用new操作符创建对象，没有公共属性，不引用this的对象，适合用于安全的环境中  
  
### 继承  

#### 原型链继承  

子类指定原型时，使用父类的实例从而继承父类的属性和方法  
子类在需要覆盖父类方法或属性时，添加相关属性或方法的代码需要在指定原型之前  
若原型中存在引用类型，则该引用类型将被所有实例共享，且某一实例中修改了该引用类型将在影响其他实例;另外在创建子类实例时不能向超类构造函数中传递参数  

#### 借用构造函数  

在子类构造函数中调用父类构造函数, 如:  

```JavaScript  
function SubType(){  
  // 继承SuperType  
  SuperType.call(this);  
}  
```  

借用构造函数的优势在于可以通过子类构造函数向父类构造函数中传递参数  
该模式存在公共方法无法复用等问题,因此用的很少  

#### 组合继承  

组合原型链和借用构造函数两种方式的继承  
父类构造函数仅定义属性,父类原型用于定义方法.子类的构造函数中使用借用构造函数模式继承父类定义的属性,子类的原型中使用原型链继承实例化父类,这种方式融合了原型链和借用构造函数的优点是一种常用的继承模式  

#### 原型式继承  

这种模式通过一个对象来创建另一个对象，通过给函数中传入父类,在函数中创建临时函数,并浅拷贝父类绑定到临时函数中,返回临时函数的一个实例来创建对象  
ES5中提供了`var anotherObject = Object.create(parentClass, {newProperty:newProperty});`函数用于原型式继承,参数传入父类和想要添加的新属性对象(可选参数)  

#### 寄生式继承  

寄生式继承与原型式继承类似，不同之处在于寄生式继承在函数内部通过调用其他函数基于传入对象创建一个新的对象。  
寄生式继承不能做到函数复用，通常用于非自定义的类型和构造函数。  

#### 寄生组合式继承  

组合继承会调用两次父类构造函数，造成子类实例中和子类原型中都有一组从父类继承的相同的属性。  
寄生组合式继承，通过借用构造函数来继承属性，原型链的混成形式来继承方法，其基本模式如下：  

```JavaScript  
function inheritPrototype(subType, superType) {  
  var prototype = object(superType.prototype); // 创建父类原型的副本  
  prototype.contructor = subType; // 修复contructor指针  
  subType.prototype = prototype;  // 替换子类的原型  
}  
```  

通过上述模式完成子类继承父类的原型,避免了创建多余的属性.  
> 使用的最多的继承模式式组合式继承,而寄生组合式继承式最理想的继承模式  
  
## 函数表达式  

在function关键字后跟指定的函数名的定义方式时函数声明，这种方式有函数声明提升效果  
若关键字后无指定的函数名则为匿名函数，是函数表达式方式，这种方式无函数声明提升效果  

### 递归  

在递归函数中调用函数自身时需要使用arguments.callee()代替函数名，在严格模式下不能访问arguments.callee时需要使用命名函数表达式来实现：  

```JavaScript  
var factorial = function f(num) {  
  if(num <= 1){  
    return 1;  
  }else {  
    return num * f(num -1);  
  }  
}  
```  
  
### 闭包  

在函数中定义另一个匿名函数，匿名函数中引用父级函数中的属性，最后返回匿名函数；这种嵌套引用作用域的方式叫做闭包.  
闭包引用了外部函数的作用域，因此当匿名函数返回时，外部函数的作用域仍然没有被销毁  
闭包中保存的仅为外部函数作用域的引用，当外部函数作用域持续变换时，闭包中的相关变量也会跟着变化，如：  

```JavaScript  
function createFunction(){  
  var result = new Array();  
  for(var i=0; i< 10;i++){  
    result[i] = function(){  
      return i;  
    }  
  }  
  return result;  
}  
```  

因为匿名函数引用的都是同一个变量i，所以函数数组调用时所有的函数都将返回10，解决此类方法可以在函数数组赋值时套一层立即执行函数。  
关于this对象，闭包的匿名函数中引用外部函数的this或arguments对象，通常需要在外部函数中对this和arguments对象保存仅另一对象中，如`let that = this`然后再引用对应的that对象才行.  
闭包可能会产生一些循环引用的问题,特别是当外部函数中包含DOM对象时,容易发生严重的内存泄露问题因此尽量在使用完DOM对象后将其置为null  

### 模仿块级作用域  

JavaScript中没有块级作用域，使用立即执行函数可模仿块级作用域:  

```JavaScript  
(function(){  
  // 块级作用域  
})(); //立即调用  
```  

### 私有变量  

JavaScript中没有私有成员的概念，但任何在函数中定义的变量都可以认为时私有变量，闭包中有权访问私有变量或私有方法的公共方法成为特权方法  
> 构造函数模式  

```JavaScript  
function Person(name){  
  this.getName = function(){  
    return name;  
  };  
  this.setName = fucntion(value){  
    name = value;  
  };  
}  
var person = new Person('nichilas');  
alert(person.getName()); // nichilas  
person.setName('greg');  
alert(person.getName()); // greg  
```  

> 原型模式  
原型模式中没有对Person进行声明，初始化未经声明的变量，总是会创建一个全局变量  
这种方式创建静态私有变量会因为原型而增进代码复用  

```JavaScript  
(function(){  
  var name = '';  
  Person = function(value){  
    name = value;  
  };  
  Person.prototype.getName = function(){  
    return name;  
  }  
  Person.prototype.setName = function(value){  
    name = value;  
  };  
})();  
var person1 = new Person('nicholas');  
alert(person1.getName()); // nicholas  
person1.setName('gerg');  
alert(person1.getName()); //greg  
  
var person2 = new Person('michael');  
alert(person1.getName()); //michael  
alert(person2.getName()); //michael  
```  
  
> 模块模式  
模块模式是为单例创建私有变量和特权方法  

```JavaScript  
var application = function() {  
  var components = new Array();  
  components.push(new BaseComponents());  
  return {  
    getComponentCount: function(){  
      return components.length;  
    },  
    registerComponent: function(component){  
      if(typeof component == 'object'){  
        components.push(component);  
      }  
    }  
  };  
}();  
```  

> 增强模块模式  

```JavaScript  
var application = function() {  
  var components = new Array();  
  components.push(new BaseComponents());  
  var app = new BaseComponent();  
  app.getComponentCount = function(){  
    return components.length;  
  };  
  app.registerComponent = function(component){  
    if(typeof component == 'object'){  
      components.push(component);  
    }  
  }  
  return app;  
}();  
```  
  
## BOM  

### window对象  

在浏览器中window对象既是js访问浏览窗口的一个接口,又是一个global对象  
在全局作用域中定义的变量,函数都会自动挂载到window对象上;全局变量不能通过delete来删除;可以通过window对象的属性来判断某全局变量是否存在  

#### 窗口关系及框架  

若页面中包含框架(frame元素)并且保存在frames集合中,则可通过索引值访问各框架中的window对象,如:  

```HTML  
<html>  
  <head>  
    <title>example</title>  
  </head>  
  <body>  
    <frameset rows='160, *'>  
      <frame src='frame.htm' name='topFrame'/>  
      <frameset cols='50%, 50%'>  
        <frame src='frame1.htm', name='leftFrame'/>  
        <frame src='frame2.htm', name='rightFrame'/>  
      </frameset>  
    </frameset>  
  </body>  
</html>  
```  

对应各部分frame引用方法:  
  
<table border='1'>  
 <tr>  
     <td colspan='2'>window.frames[0]<br>  
        window.frames['topFrame']<br>top.frames[0]<br>top.frames['topFrame']<br>frames[0]<br>frames['topFrame']  
        </td>  
</tr>  
  <tr>  
      <td>window.frames[1]<br>window.frames['leftFrame']<br>top.frames[1]<br>top.frames['leftFrame']<br>frames[1]<br>frames['leftFrame']</td>  
   <td>window.frames[2]<br>window.frames['rightFrame']<br>top.frames[2]<br>top.frames['rightFrame']<br>frames[2]<br>frames['rightFrame']</td>  
     </tr>  
</table>  
  
top始终指向最外层框架,  
window对象始终是代码当前所在的frame的window,  
而parent对象始终指向当前框架的直接上层框架，  
在没有外层框架的情况下parent直接等于top。  
另外还有self对象相当于window对象的别名  
  
#### 窗口位置  

在IE,Opera中window对象有screenLeft,screenTop属性分别标识窗口相对屏幕左边和上边的距离,在firefox中则是screenX和screenY两个属性,而chrome,Safari两组属性都支持  
这两组属性在不同的浏览器中表现不同,不能精确的获取窗口的位置  
moveTo()和moveBy()方法分别时移动窗口到x,y位置和移动窗口x,y距离  
  
#### 窗口大小  

在IE9+,Safari,FireFox中window.outerWidth,window.outerHeight返回浏览器窗口本身的尺寸(包含标签栏,导航栏等),window.innerWidth,window.innerHeight返回页面视图容器(viewport)大小.  
在chrome中这两组属性返回的都是页面视图容器大小.  
document.documentElement.clientWidth,document.documentElement.clientHeight和document.body.clientWidth,document.body.clientWidth中也保存了视口信息, 对于IE6前一组在标准模式下有效,后一组用于混杂模式,chrome中则都可以用.  
实际使用中要获取视口大小,优先使用window属性  
另外和窗口位置一样,窗口大小也有resizeTo(),resizeBy()方法  
  
#### 导航和打开窗口  

window.open(url, target, feature, bool)方法可以导航到一指定的url,target是窗口或框架的名称,此外也有一些特殊名称_self,_parent,_top,_blank; 若弹出窗口为新建窗口,则feature参数生效,用于指定窗口特性(大小,位置,是否展示工具,地址,状态栏等)  
该方法返回新窗口的引用, 该引用与其他的window对象相似,此外该引用有一个指针opener指向打开它的原始窗口,若不需要与原窗口进行通信可将该属性置空null.  
由于弹窗被广告商滥用众多浏览器对弹窗功能进行了限制,上述功能不一定全部都能使用  
  
#### 间歇调用和超时调用  
  
```javascript  
// 超时调用  
let timeoutId = setTimeout(function() {  
alert('timeout')  
}, 1000);  
clearTimeout(timeoutId);  
// 间歇调用  
let intervalId = null  
function a(){  
   clearInterval(intervalId);  
}  
intervalId = setInterval(a, 500);  
```  
  
#### 系统对话框  

alter(msg)向用户显示信息;confirm(msg)让用户确认的弹框,返回值为true或false;prompt(msg, default)提示框,用户可通过文本输入域输入文本,default为文本输入域默认值,返回用户输入的文本或null;  
以上对话框都是同步显示的,即弹出对话框时代码会暂停运行.  
window.print(),window.find()对话框则时异步的  
  
### location对象  

window.location和document.location指向的是同一个对象  
location对象主要包含如下属性:hash,host,hostname,href,pathname,port,protocol,search,分别对应当前页面url的不同部分.  
通过location.search获取到的查询字符串参数需要进行解析,修改除hash外的属性,页面都会以新的url重载,此外也可通过location.assign(url)方法直接重定向到新的url,最后通过location.reload()可重载当前页面,传入true时,强制从服务器重载当前页面.  
  
### navigator对象  

navigator对象主要用于识别客户端浏览器,该对象提供了浏览器名称,版次,浏览器所在系统平台等信息  

#### 检测插件  

在非IE浏览器中navigator.plugins数组存储了插件信息,数组中每个item包含name,description,filename,length.  
而IE中检测插件的唯一方式就是使用专有的ActiveXObject类型,尝试创建一个特定的插件实例  

#### 注册处理程序  

Firefox2为navigator对象新增了registerContentHandler()和registerProtocolHandler()方法,  
注册处理程序就为像使用桌面应用程序一样默认使用这些在线应用程序提供了一种方式.  
  
### screen对象  

screen对象基本上只用来表明客户端的能力,其中包括浏览器窗口外部的显示器的信息,如像素宽度和高度等。  
  
### history对象  

history对象保存着用户上网的历史记录,history对象与window对相关联因此每个标签或框架都有自己的history对象.  
用法:  

```JavaScript  
history.go(-1); // 后退一页  
history.go(1); // 前进一页  
history.go(2); // 前进2页  
history.go('wrox.com'); // 跳转到最近的wrox.com页面  
history.back(); // 后退一页  
history.forward(); // 前进一页  
history.length //保存历史记录的数量属性  
```  
  
## 客户端检测  

各浏览器客户端不尽相同,面对不一致问题,需要使用客户端检测.不到万不得已,就不要使用客户端检测  

### 能力检测  

对于不一致的功能实现，需要进行能力检测，检测对象或方法是否符合要求.但不可根据能力检测推断出浏览器类型  

### 怪癖检测  

怪癖检测(quirks detection)的目标是识别浏览器的特殊行为，浏览器存在什么缺陷（bug）  

### 用户代理检测  

用户代理检测通过检测用户代理字符串(navigator.userAgent)来确定实际使用的浏览器  
  
> 识别呈现引擎比识别浏览器名称和版本号更重要,主流五大呈现引擎有IE、Gecko、WebKit、KHTML 和 Opera。  
使用window.opera检测Opera引擎，然后根据检测navigator.userAgent中AppleWebKit字样检测webkit引擎，然后根据KHTML或/Konqueror字样检测KHTML,再通过Gecko字样检测Gecko引擎，最后通过MSIE判断IE引擎  
  
通过navigator.platform字段识别客户端所在平台,其取值可能有Win32, Win64, MacPPC,MacIntel,X11, Linux i686等  
对于windows平台的版本信息可以用用户代理字段中取  
  
用户代理检测是客户端检测的最后一个选择,能力检测和怪癖检测应该优先考虑  
  
由于浏览器间存在差别,通常需要根据不同浏览器的能力分别编写不同的代码。  
  
## DOM  

### 节点层次  

所有页面标记则表现为一个以特定节点为根节点的树形结构,在html页面中`<html>`为文档元素,而xml中任务元素都有可能成为文档元素  

#### node类型  

所有的节点都继承自node,每个节点都有一个 nodeType 属性,用于表明节点的类型,其值用12个数值常量来表示:  
Node.ELEMENT_NODE(1); Node.ATTRIBUTE_NODE(2); Node.TEXT_NODE(3); Node.CDATA_SECTION_NODE(4); Node.ENTITY_REFERENCE_NODE(5); Node.ENTITY_NODE(6); Node.PROCESSING_INSTRUCTION_NODE(7); Node.COMMENT_NODE(8); Node.DOCUMENT_NODE(9); Node.DOCUMENT_TYPE_NODE(10); Node.DOCUMENT_FRAGMENT_NODE(11); Node.NOTATION_NODE(12)  
此外节点还有nodeName和nodeValue属性  
每个节点中都有一个childNodes属性,指向了一个NodeList对象,NodeList对象是一种类数组对象,DOM结构的变化能够自动的反映在NodeList对象上  
  
节点关系类属性有childNodes, parentNode, previousSibling(前一个节点), 和nextSibling(后一个节点), firstChild, lastChild, hasChildNodes(), ownerDocument(根节点).  
操作节点的方法有appendChild(), insertBefore(), replaceChild(), removeChild()  
cloneNode() 传入true时可用于深拷贝一个节点,即复制节点及其子节点.复制后的副本节点没有指定父节点,需要使用其他方法插入到文档中  
  
#### Document类型  

Document类型表示文档，在浏览器中document对象时window对象的一个属性，可以当做全局对象来访问  

1. document对象的子节点可以是DocumentType，Element，ProcessingInstruction或Comment，其documentElement属性始终指向`<html>`元素,其body属性则指向`<body>`元素,另外与`<html>`元素为同一级别的注释可能也会被解析为节点  
2. document对象还有title,URL,domain,referrer属性,其中title和domain可以被修改  
3. document提供了getElementById(),getElementsByTagName(),getElementsByName()方法  
4. document对象有一些特殊的集合,anchors所有带name特性的`<a>`元素;forms所有的`<form>`元素;images所有的`<image>`元素;links所有带href的`<a>`元素  
5. document的implementation属性提供了document实现了那些功能的信息,对于特殊功能或属性需要进行一致性检测(是否存在及能力测试)  
6. document对象可以将输出流写入到网页中,通过write(),writeln(),open(),close()四个方法实现,其中write()和writeln()方法通常在DOM加载过程中调用,可将传入字符串格式的html代码作为元素插入页面中,若在DOM加载完成后调用该方法,则插入的元素将会覆盖原有页面.  
  
#### Element类型  

Element类型用于表现xml或html元素，通过nodeName和tagName可以访问到元素的标签名  

1. 每个html元素中都有标准特性,id,title,lang,dir(语言方向),className(与class对应),这些属性都可读可写  
2. 操作特性的方法有getAttribute(),setAttribute(),removeAttribute()；getAttribute()方法可以访问到标准特性和自定义特性,但在访问style和onclick这样的属性时返回的均为字符串  
3. setAttribute()可用于替换或创建属性,但:  

```JavaScript  
div.mycolor = "somecolor";  
alert(div.getAttribute('mycolor')); // null (IE除外)  
```  

像上例直接设置属性,该属性不会自动变成元素的特性  
4. attributes属性包含一个NamedNodeMap,元素的每个特性都由一个Attr节点表示,并包含在该对象中,NamedNodeMap有下列方法getNamedItem(name),removeNamedItem(name),setNamedItem(node),item(pos)返回pos处的节点.其中removeNamedItem和removeAttribute效果相同.attributes通常用于遍历元素的属性  
5. document.createElement()传入标签名可以创建一个新元素,返回该元素的引用.创建后的元素需要插入到DOM中才能被显示,插入后对元素的修改将立即体现在页面上  
  
#### Text类型  

Text类型的文本节点包含的纯文本中可以有html转义后的字符但不能包含html代码，通过nodeValue或data属性可以访问或修改文本  
document.createTextNode()方法用于创建一个文本节点  
在Text文本节点的父节点上调用normalize()方法,可将所有文本子节点合并成一个节点  
与之相分文本节点提供了splitText()方法用于将文本节点拆分  
  
#### Comment类型  

注释在DOM中是通过Comment类型来表示的,Comment与Text类型类似,可以通过document.createComment()来创建  
  
#### CDATASection类型  

CDATASection类型只针对基于XML的文档,表示的是CDATA区域.  

#### DocumentType类型  

DocumentType类型在Web浏览器中并不常用,仅有Firefox、Safari和Opera支持它,含着与文档的doctype有关的所有信息  

#### DocumentFragment类型  

DocumentFragment文档片段在文档中没有对应的标记,是一种轻量级文档,通常当做仓库来使用,添加到DOM中的节点会被从DocumentFragment中移除,反之一样,但其本身不会被添加到DOM中  
  
#### Attr类型  

元素的特性在DOM中以Attr类型来表示.尽管它们也是节点,但特性却不被认为是DOM文档树的一部分。  
使用document.createAttribute()并传入特性的名称可以创建新的特性节点  
  
### DOM 操作技术  

#### 动态脚本  

是在页面加载时不存在,但将来的某一时刻通过修改DOM动态添加的脚本,如:  

```JavaScript  
function loadScript(url){  
   var script = document.createElement("script");  
   script.type = "text/javascript";  
   script.src = url;  
   document.body.appendChild(script);  
}  
```  

#### 动态样式  

与动态脚本类似，示例：  

```JavaScript  
function loadStyles(url){  
   var link = document.createElement("link");  
   link.rel = "stylesheet";  
   link.type = "text/css";  
   link.href = url;  
   var head = document.getElementsByTagName("head")[0];  
   head.appendChild(link);  
}  
```  
  
#### 操作表格  

由于表格结构复杂,DOM添加了一些属性和方法caption,tBodies,tFoot,tHead等用于简化DOM创建修改表格的过程  

#### 使用NodeList  

NodeList, NamedNodeMap,HTMLCollection这三个集合都是随DOM动态更新的.所有NodeList对象都是在访问 DOM文档时实时运行的查询,应该尽量减少访问NodeList的次数.  
如下示例代码将导致无限循环,因为divs取得的HTMLCollection是动态的,每次查询divs.length都会获得新的值:  

```JavaScript  
var divs = document.getElementsByTagName("div"),  
    i,  
    div;  
for (i=0; i < divs.length; i++){  
    div = document.createElement("div");  
    document.body.appendChild(div);  
}  
```  

代码可改为  

```JavaScript  
var divs = document.getElementsByTagName("div"),  
    i,  
    len,  
    div;  
for (i=0, len=divs.length; i < len; i++){  
    div = document.createElement("div");  
    document.body.appendChild(div);  
}  
```  

即可避免无限循环.  
  
## DOM扩展  

### 选择符API  

#### querySelector()方法  

querySelector()方法接收一个 CSS 选择符,返回调用对象后代中与该模式匹配的第一个元素,如果没有找到匹  
配的元素,返回 null。  

```JavaScript  
//取得类为"selected"的第一个元素  
var selected = document.querySelector(".selected");  
```  

#### querySelectorAll()方法  

与querySelector()方法一样,但返回一个NodeList实例  
  
#### matchesSelector()方法  

如果调用元素与该选择符匹配,返回true;否则,返回false  
  
### 元素遍历  

对于元素间的空格, 会返回文本节点，因此定义了一组不含文本节点的属性：  
childElementCount,firstElementChild,lastElementChild,previousElementSibling,nextElementSibling.  

### HTML5  

#### 与类相关的扩充  

+ getElementsByClassName()方法,传入一个或多个类名,返回匹配到的NodeList,如:  
`var allCurrentUsernames = document.getElementsByClassName("username current");`  
+ classList属性,className属性返回字符串不易操作,新增的classList属性对象,访问方式与集合类似.还定义了如下示例方法:  

  ```JavaScript  
  //添加"current"类  
  div.classList.add("current");  
  // 返回bool是否包含'bd'类  
  div.classList.contains("bd");  
  //删除"disabled"类  
  div.classList.remove("disabled");  
  //切换"user"类,存在则删除,否则添加  
  div.classList.toggle("user");  
  ```  

#### 焦点管理  

document.activeElement属性始终会引用DOM中当前获得了焦点的元素;document.hasFocus()方法,这个方法用于确定文档是否获得了焦点。  

#### HTMLDocument的变化  

readyState属性,取值loading,表示正在加载文档;complete,已经加载完文档。  
compatMode属性,在标准模式下,值为"CSS1Compat",而在混杂模式下,为"BackCompat"。  
head属性,引用了`<head>`元素  

#### 字符集属性  

charset 属性表示文档中实际使用的字符集;defaultCharset文档中的默认字符集  

#### 自定义数据属性  

HTML5规定可以为元素添加非标准的属性,但要添加前缀data-; 元素的dataset属性来访问自定义属性的值,如:  

```JavaScript  
//取得自定义属性的值  
var appId = div.dataset.appId; // 对应自定义属性在标签中的名称为data-appId  
var myName = div.dataset.myname; // 对应自定义属性在标签中的名称为data-myname  
```  

#### 插入标记  

innerHTML属性返回调用元素的所有子节点(包括元素、注释和文本节点)对应的HTML标记(html字符串),通过设置属性可以插入html字符串标记  
outerHTML属性返回调用它的元素及所有子节点的HTML标签,也可以设置html字符串标记  
insertAdjacentHTML()方法,接受两个参数,插入位置和要插入的HTML文本,位置取值可以为:beforebegin(在前面插入一个兄弟元素),afterbegin(插入第一个子元素),beforeend(插入最后一个子元素),afterend(在后面插入一个兄弟元素)  
以上三个属性相较于DOM操作在一次性插入很多节点上有性能优势  

#### scrollIntoView()方法  

scrollIntoView()可以在所有HTML元素上调用,通过滚动浏览器窗口或某个容器元素,调用  
元素就可以出现在视口中。传入true或不传作为参数会让调用元素的顶部与视口顶部尽可能平齐。false则,调用元素会尽可能全部出现在视口中,(可能的话,调用元素的底部会与视口顶部平齐。)不过顶部不一定平齐  

### 专有扩展  

专有扩展，当前仅有部分浏览器支持，应谨慎使用  

#### 文档模式

页面的文档模式决定了可以使用什么功能，到IE9总共有4种文档模式IE5,IE7,IE8,IE9;  
可通过标签指定`<meta http-equiv="X-UA-Compatible" content="IE={IEVersion}">`其中IEVersion的取值可以是:Edge,EmulateIE9,EmulateIE8,EmulateIE7,9,8,7,5  

#### children属性  

该属性只包含元素类型的子节点(不含文本和注释),其他方面与childNodes相同  

#### contains()方法  

元素中包含contains()方法,传入节点,用于判断节点是否是调用元素的子节点;  
另外compareDocumentPosition()也可用于判断节点之间的关系  

#### 插入文本  

innerText和outerText属性是与innerHTML和outerHTML相对应的两个属性,这两个属性专用于处理文本节点,innerText会返回元素中所有的文本节点字符串,而设置innerText和outerText时分别会替换所有子节点DOM和包括调用者自身在内的DOM  

#### 滚动  

除前面提到的scrollIntoView()方法外,元素还扩展了几种滚动方法:  
scrollIntoViewIfNeeded(alignCenter):仅在当前元素不可见时,滚动使其可见;  
scrollByLines(lineCount):将元素的内容滚动指定的行高  
scrollByPages(pageCount):将元素的内容滚动指定的页面高度  
  
scrollIntoView()和scrollIntoViewIfNeeded()的作用对象是元素的容器,而scrollByLines()和scrollByPages()影响的则是元素自身  
  
## DOM2和DOM3  

### DOM变化  

#### 针对XML命名空间的变化  

HTML不支持XML命名空间,但XHTML支持XML命名空间。命令空间可用于避免页面中不同语言的冲突。  
命名空间要使用xmlns特性来指定。XHTML的命名空间是 <http://www.w3.org/1999/xhtml>  
相应的类型变化：  
Node类型增加了localName, namespaceURI, prefix属性isDefaultNamespace(namespaceURI), lookupNamespaceURI(prefix), lookupPrefix(namespaceURI)方法  
Document类型增加了createElementNS(namespaceURI, tagName), createAttributeNS(namespaceURI, attributeName), getElementsByTagNameNS(namespaceURI, tagName)方法  
Element类型增加了getAttributeNS(namespaceURI, localName), getAttributeNodeNS(namespaceURI, localName), getElementsByTagNameNS(namespaceURI, tagName), hasAttributeNS(namespaceURI, localName), removeAttriubteNS(namespaceURI, localName), setAttributeNS(namespaceURI, qualifiedName, value), setAttributeNodeNS(attNode)方法  
NamedNodeMap类型增加了getNamedItemNS(namespaceURI, localName), removeNamedItemNS(namespaceURI, localName), setNamedItemNS(node)方法  

#### 与命名空间无关的变化  

DocumentType类型新增了3个属性:publicId、systemId和internalSubset  
Document类型新增了importNode()方法和 defaultView,implementation属性  
Node类型增加了isSupported(),isSameNode(),isEqualNode(),setUserData(),getUserData()方法  
框架元素增加了contentDocument属性  
  
### 样式  

#### 访问元素样式  

style属性可用于访问元素的内联样式，对于样式名有连字符‘-’的改为小驼峰方式访问,对于float样式通过cssFloat方式来放问.  
style对象还有cssText,length,以及可以通过索引的方式来访问等特性  
通过document.defaultView.getComputedStyle('元素名', null)方法可以获取元素的计算样式,即对应实际效果  

#### 操作样式表  

通过document.styleSheets集合可以获取到样式表,每个css规则对应一个样式表,通过样式表可以读写css规则中的各个属性,如:  

```css  
div.box {  
  background-color: blue;  
  width: 100px;  
  height: 200px;  
}  
```  

```JavaScript  
var sheet = document.styleSheets[0];  
var rules = sheet.cssRules || sheet.rules;  
var rule = rules[0];  
alert(rule.selectorText);  
alert(rule.style.cssText);  
alert(rule.style.backgroundColor);  
alert(rule.style.width);  
alert(rule.style.height);  
```  

向样式表中添加规则使用insertRule()方法,删除则用deleteRule()  

#### 元素大小  

offsetHeight,offsetHeight元素的大小含边框,offsetLeft/offsetTop元素的左/上外边框至包含元素(祖先节点中最近的一个有大小的元素)的左/上内边框之间的像素距离  
clientHeight/clientWidth元素内容区域(包含内边距)  
scrollHeight/scrollWidth在没有滚动条的情况下,元素内容的大小;scrollLeft/scrollTop被隐藏在内容区域左侧/上方的像素数。通过设置这个属性可以改变元素的滚动位置。对于不含滚动条的页面,这两组属性在不同的浏览器中表现不一致,需谨慎使用  
元素的方法getBoundingClientRect()返回一个包含left,top,right,bottom属性的矩形对象,用于标定元素相对于视口的位置  
  
### 遍历  

NodeIterator和TreeWalker对象用于辅助完成DOM的顺序遍历，这两个类型都是执行深度优先遍历操作  

#### NodeIterator  

document.createNodeIterator(root,whatToShow,filter,entityReferenceExpansion)方法用于创建NodeIterator类,  
该类主要有nextNode()和previousNode()方法，nextNode()首次调用返回根节点,最后一个节点调用时返回null,previousNode()方法类似  

#### TreeWalker  

该类使用document.createTreeWalker()方法创建,接受参数与NodeIterator的创建方法类似  
此类型在NodeIterator的基础上增加了parentNode(),firstChild(),lastChild(),nextSibling(),previousSibling(),currentNode()方法  
  
#### 范围  

使用document.createRange()方法可用于创建Range类型实例,该实例拥有startContainer,startOffset,endContainer,endOffset,commonAncestorContainer等属性,  
selectNode(refNode),selectNodeContents(refNode)方法来选择范围,setStartBefore(refNode),setStartAfter(refNode),setEndBefore(),setEndAfter()可用于精确设置上述属性  
setStart()和setEnd()方法传入参考节点和偏移量用于实现复杂范围选择  
创建范围后,范围内的各节点都只是相应的文档的指针;deleteContents(),extractContents(),insertNode(),surroundContents()环绕范围插入 等操作方法,都会对文档产生影响,而cloneContents()将返回范围中节点的副本  
范围中未选择任何节点称为折叠范围collapse(bool)方法用来将普通范围变为折叠范围,bool值为true时,光标落在返回开头,反之对应,且对应collapsed属性对应更新,此方法可用于确认两个节点是否紧邻  
compareBoundaryPoints()用于比较两范围是否有重合部分,cloneRange()复制范围,detach()解除对范围的引用  
上述方法在IE8及以下不适用，IE8有文本范围createTextRange()与上述概念类似  
  
## 事件  

### 事件流  

事件流描述的是从页面中接收事件的顺序  

#### 事件冒泡  

IE的事件流叫事件冒泡，事件由最具体的元素接收，然后逐级向上传播到父节点，祖先元素，根元素  

#### 事件捕获  

事件捕获事件流的传播正好与事件冒泡相反，从全局到具体  

#### DOM事件流  

DOM事件流实现了事件捕获和事件冒泡的结合，其过程为事件捕获->事件处理->事件冒泡  

### 事件处理程序  

#### html事件处理程序  

通过元素特性中添加/绑定函数的方式实现事件响应:  

```html  
<form>  
  <input type="text" name="username" value="">  
  <input type="button" value="Echo Username" onclick="alert(username.value)">  
</form>  
```  

上例展示了通过元素的onclick特性添加点击事件响应函数,由于动态扩展的函数能扩展作用域,在函数中可以访问到document和该元素本身的成员,若该元素时表单元素还可访问到其他表单字段,如上例中username.value  

#### DOM0级事件处理程序  

基本添加方式如下例:  

```JavaScript  
var btn = document.getElementById('myBtn');  
btn.onclick = function() {  
  alert(this.id); // "myBtn"  
}  
```  

#### DOM2级事件处理程序  

所有DOM节点都有addEventListener()和removeEventListener()两个方法,接收事件名,事件处理程序,bool值3个参数.其中bool为true时在捕获阶段调用处理函数,为false时在冒泡阶段调用处理函数.大多数情况下推荐在冒泡阶段调用  
在使用removeEventListener()时需传入与addEventListener()相同的参数才能移除处理程序,也就是说添加了匿名函数无法移除  

#### IE事件处理程序  

与DOM2级类似IE实现了自己的事件处理程序添加和移除方法attachEvent()和detachEvent(),这两个方法只能在冒泡节点调用响应的处理函数,其他使用方法与DOM2类似  

#### 跨浏览器的事件处理程序  

通过浏览器能力检测可写出跨浏览器的事件处理程序  

### 事件对象  

#### DOM中的事件对象  

响应函数都会默认传入event对象,触发的事件类型不同有不同的属性和方法,但他们的公共方法/属性有bubbles,preventDefault(),eventPhase,stopPropagation(),target等  

#### IE中的事件对象  

通过DOM0指定的响应函数时,event作为全局变量存在;DOM2指定时(attachEvent()方法添加),会传入event;公共方法或属性有cancelBubble(对应stopPropagation()方法),returnValue(对应preventDefault()方法),srcElement(对应target),type等  

#### 跨浏览器的事件对象  

跨浏览器事件对象与跨浏览器事件处理程序类似需要添加浏览器能力检测  

### 事件类型  

#### UI事件  

UI事件指的是那些不一定与用户操作有关的事件.UI事件主要有DOMActivate(元素是否被激活,不推荐使用此属性),load,unload,abort,error,select,resize,scroll  

+ load事件  
  
页面完全加载完成后就会触发window上的load事件,可通过JavaScript或者在`<body>`元素上增加特性的方式添加onload事件响应函数.此外`<image>`标签也支持load事件,并且在指定了src时就会开始下载资源,部分浏览器支持`<script>`标签上的load事件用来确定脚本文件加载完步  
  
+ unload事件  
  
文档被完全卸载后在window上触发,在页面切换时此事件多用于清除引用避免内存泄露,使用方法与load事件类似  
  
+ resize事件  
  
浏览器窗口宽高被调整时在window上触发此事件,持续变化过程中不同浏览器响应不同,因此不可在此事件中加入大计算量的代码  
  
+ scroll事件  
  
scroll事件也是在window对象上触发,通过`<html>`元素反应这一变化,与resize事件类似,不可在此事件中加入大计算量的代码  
  
#### 焦点事件  

焦点事件会在页面元素获得或失去焦点时触发.焦点事件有：blur,DOMFocusIn,DOMFocusOut,focus,focusin,focusout,这些事件不冒泡,其中最常用的是focus,blur.  
当焦点从一个元素移向另一个元素时,会依次触发下列事件focusout,focusin,blur,DOMFocusOut,focus,DOMFocusIn  
  
#### 鼠标与滚轮事件  

DOM3级定义了9个鼠标事件：click(单击左键或回车触发),dclick(双击),mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup  
除了mouseenter和mouseleave,所有鼠标事件都会冒泡,也可被取消,如取消mousedowm或mouseup,click事件就不会触发  

+ 客户区坐标位置  
  
通过鼠标事件event的clientX和clientY可以获取鼠标事件发生时鼠标在浏览器视窗中的坐标,pageX和pageY属性则是对应鼠标在页面中的位置,若页面不发生滚动时,两组值相应相等;screenX和screenY属性则表示鼠标在屏幕中的位置  
  
+ 修改键  
  
即组合键Shift，Ctrl，alt，Meta（win）键被按下时，event有shiftKey，ctrlKey，altKey，metaKey这几个属性的true/false来表示相应的按键是否被按下  
  
+ 相关元素  
  
mouseover发生时主目标为获得光标的元素,相关元素为失去光标的元素,mouseout的主目标则是失去光标的元素,相关元素为获得光标的元素.  
当上述两个事件发生时event的relatedTarget属性会提供相关元素信息  
  
+ 鼠标按钮  
  
点击事件中mousedown和mouseup事件的event中有button属性,取0表示主键(左键)被按下/释放,1表示滚轮按下/释放,2表示次键(右键)被按下/释放  
  
+ 更多事件信息  
  
detail属性提供了元素被单击次数的信息,此外IE还另外支持了altLeft,ctrlLeft,shiftLeft,offsetX,offsetY等属性  
  
+ 鼠标滚轮事件  
  
mousewheel事件触发会冒泡到document或window对象上,其event提供了wheelDelta属性,向前滚动时其为120的倍数,反之则为-120的倍数  
FireFox则支持DOMMouseScroll事件,滚轮信息放在了detail属性中,向前为-3的倍数,向后为3的倍数  
  
+ 触摸设备  
  
触屏设备中没有鼠标，不支持dclick事件，轻击可单击元素会触发mousemove事件,若内容没有因此变化,就会依次发生mousedown,mouseup,click事件.两个手机在屏幕上滑动且页面也移动会触发mousewheel和scroll事件  
  
+ 无障碍性问题  
  
若网站要支持无障碍访问,则仅推荐使用click事件  
  
#### 键盘与文本事件  

键盘有keydown(任意键触发)，keypress(字符键触发)，keyup.文本在插入文本框之间会发生文本事件textInput  
  
发生keydown和keyup时,event对象有keyCode属性,与键盘上的键码一一对应,发生keypress时event的charCode表示按键字符对应的ASCII编码,IE8及以前的版本则是用keyCode来存储ASCII编码  
DOM3中不再含charCode属性,而包含key和char属性,key和char都表示键名对应的字符,在非字符按键时char为null,不同的浏览器对DOM3的支持不同,开发中应该尽量避免使用上述属性  
当用户在可编辑区域中输入字符时会触发textInput事件,它的event对象包含data属性包含用户输入的字符(区分大小写),inputMethod表示文本输入的方式(键盘,粘贴等方式)  
  
#### 复合事件  

复合事件时DOM3中用于处理IME输入序列,IME可以让用户输入键盘上找不到的字符,如拉丁文键盘输入日文.  
compositionstart,IME文本复合系统打开时触发的事件,compositionupdate向字段中插入新字符触发,compositionend IME关闭时触发,这三个事件都包含data属性用于存储正在操作的文本  
  
#### 变动事件  

DOM2级的变动(mutation)事件能在DOM中的某一部分发生变化时触发,变动事件的种类有:  
DOMSubtreeModified, DOMNodeInserted, DOMNodeRemoved, DOMNodeInsertedIntoDocument, DOMNodeRemovedFromDocument, DOMAttrModified, DOMCharacterDataModified  

+ 删除节点  
  
在使用removeChild()或replaceChild()删除节点时,会在要删除的元素上触发DOMNodeRemoved事件,event对象将包含target(被删除的节点),relatedNode被删节点的父节点. 在被删节点和其子节点上会触发DOMNodeRemovedFromDocument,随后其父节点上会触发DOMSubtreeModified  
  
+ 插入节点  
  
使用appendChild()、replaceChild()或insertBefore()向DOM中插入节点时,首先触发DOMNodeInserted,然后冒泡,在新插入的节点上面触发DOMNodeInsertedIntoDocument事件,最后一个触发的事件是DOMSubtreeModified,触发于新插入节点的父节点。  
  
#### HTML5事件  

contextmenu事件  
该事件用于取消默认的上下文菜单(右键菜单)而提供自定义的菜单,事件event包含clientX和clientY等属性  
beforeunload事件  
该事件在浏览器关闭该页面时触发,常用于提示用户的行为将关闭页面,通过event.returnValue属性设置消息内容  
DOMContentLoaded事件  
该事件将在DOM树构建完成后触发,先于load事件  
readystatechange事件  
提供与文档或元素的加载状态有关的信息，event对象包含readyState属性，表示元素的5种状态  
pageshow和pagehide事件与load和unload事件对应，pageshow事件在load事件之后触发,但通过前进或后退操作页面是从缓存中恢复的,此时只会触发pageshow而不会触发load事件,pagehide与之类似  
hashchange事件  
在url中#后的部分变化时触发此事件  

#### 设备事件  

orientationchange事件在移动设备变换查看模式时触发(手机竖着或横着),window.orientation属性0表示竖屏模式,90向左旋转横向,-90向右旋转横向  
MozOrientation事件是firefox引入的事件，当设备加速计检测到方向改变时触发，该事件对象能提供设备大致朝向的变化(向左还是向右等)  
deviceorientation事件与MozOrientation事件触发方式类似，但能提供精确的设备朝向(度数)  
devicemotion事件在设备移动时触发,事件能提供加速度转向等属性  

#### 触摸与手势事件  

触摸事件touchstart，手指触摸屏幕时触发，touchmove手指在屏幕上滑动时触发，touchend手指移开屏幕时触发，touchcancel系统停止跟踪触摸时触发  
每个事件的event对象都提供了鼠标事件中的常见属性，bubbles,cancelable,view,clientX,clientY等,外加三个用于跟踪触摸的属性touches当前跟踪的Touch对象数组,targetTouchs特定于事件目标的Touch数组,changeTouchs上次触摸以来变化的Touch对象数组;  
每个Touch对象又包含clientX,clientY,identifier等属性  
gesturestart(多指触屏触发),gesturechange(多指任意位置变化触发),gestureend(任何一个手指离开屏幕触发),手势事件event对象除与触摸事件相同的属性外还有rotation和scale属性,分别表示手指变化引起的角度变化和距离变化  
  
### 内存和性能  

#### 事件委托  

对“事件处理程序过多”问题的解决方案就是事件委托,事件委托通过事件冒泡,只指定一个事  
件处理程序,管理某一类型的所有事件.  
在父级元素上添加响应事件,通过event对象获取事件发生的元素,统一处理一类响应事件,避免在每个子元素上添加响应事件.这种方式占用内存更少,DOM操作更少.  

#### 移除事件处理程序  

在不需要的时候移除响应函数,释放内存;(通过纯DOM操作的方式移除元素或卸载页面时需要移除响应函数)  

### 模拟事件  

通过js模拟事件,可主动触发事件  

#### DOM中的事件模拟  

通过使用document.createEvent()方法创建event对象,该方法接收要创建的事件类型字符串:UIEvents,MouseEvents,MutationEvents,HTMLEvents之一,再对event对象进行初始化后,通过document.dispatchEvent()方法触发事件  

+ 模拟鼠标事件  
  
通过`document.createEvent('MouseEvents')`创建的event对象有个initMouseEvent()方法接收15个参数用于初始化鼠标事件相关信息  

+ 模拟键盘事件  
  
与模拟鼠标事件类似但仅在DOM3中支持模拟键盘事件, initKeyEvent()方法用于初始化键盘事件.  
创建html模式事件也是类似,initMutationEvent()方法进行初始化  

+ 自定义DOM事件  
  
调用document.createEvent("CustomEvent")方法,返回对象中有initCustomEvent()方法,传入相应的初始化参数进行初始化  
  
#### IE中事件模拟  

在IE8及以前的版本中document.createEventObject()创建event对象,设置event属性后,通过`<元素的引用>.fireEvent('<event type>', event)`方式触发事件  
  
## 表单脚本  

### 表单的基础知识  

#### 提交表单  

使用`<input>`或`<button>`定义提交按钮,需将type属性设置为submit或image,调用元素的submit()方法也提交表单,提交表单时在将请求发送到服务器之前会触发submit事件  

#### 重置表单  

与提交类似,将type设置为reset或通过元素的reset()方法进行重置,同样也会触发reset事件  

#### 表单字段  

通过`<form>`元素可以获取到表单中的字段,如`<input>`, `<button>`等,form.elements属性按顺序存储了表单中的字段,form.elements.length获取字段的数量,通过字段名称来访问时,若出现同名字段,则会返回NodeList,按出现顺序包含该名称的所有字段  
所有表单字段都共有disabled,form,name,readOnly,tabIndex,type,value等属性  
每个表单字段都有focus(),blur()方法,H5中表单元素支持autofocus属性实现自动聚焦  
除标准事件外,所有表单都支持blur,change(失去焦点且value改变),focus事件. 其中change事件在`<select>`元素上只要value发生改变就会触发  

### 文本框脚本  

文本框主要是`<input type="text">`和`<textarea>`,前者用于单行文本输入,后者可用于多行文本  

#### 选择文本  

调用select()方法可选取文本框中的所有文本  
选择了文本后会触发select事件  
H5中添加了selectionStart和selectionEnd两个属性分别表示文本选区开头和结尾的偏移量  
H5中引入了setSelectionRange()方法,传入字符串索引的开始和结束位置,用于选择部分文本  

#### 过滤输入  

在keypress事件响应函数中根据自定义条件调用preventDefault(event)屏蔽不想要的字符输入  
H5支持beforecopy,copy,beforecut,cut,beforepaste,paste六个剪切板事件,其中除IE外before前缀的剪切板事件只会在使用右键操作时触发,其他事件则会在快捷键,右键菜单操作时都会触发.event对象中clipboardData对象可以访问到剪切板中的数据,clipboardData对象有getData(),setData(),clearData()三个方法用于对数据进行  

#### 自动切换焦点  

通过监听keyup事件配合maxlength属性,可实现输完当前字段后自动切换焦点到下一个字段  

#### HTML5约束验证API  

表单字段中支持required属性,用于表示该字段为必填字段,空着的字段各浏览器的处理方式不同  
`<input>`元素type属性支持email和url类型,并会对输入文本进行校验  
此外对数值类型还支持min,max,step属性约束  
对于文本类型增加了pattern属性,支持正则过滤,但无法阻止用户输入,只能返回值是否有效  
通过表单或表单字段的checkValidity()方法可以判断字段的值是否有效(符合约束条件)  
,另外validity属性则会详细表示为什么字段有效或无效  
对表单设置novalidate表示不对表单进行验证,若要在某个提交按钮不进行验证,可在相应的按钮上添加formnovalidate属性  

### 选择框脚本  

选择框是由`<select>`和`<option>`元素创建HTMLSelectElement类型提供了额外的属性和方法,选中`<option>`后`<select>`的value等于option的,若option未设置value则等于option的文本  

#### 选择选项  

对于单选来说通过选择框的selectedIndex属性访问选中的选项,设置该属性会导致取消以前被选中的选项(包括多选情况).通过取得对某一项的引用,设置其selected属性可以选中该项(在多选中不会影响之前选中的选项)  

#### 添加选项  

可通过DOM的方式创建元素添加元素的方式添加选项,也可通过Option()构造函数创建后添加,使用`<select>`元素的add()方法添加是最佳方案  

#### 移除选项  

可通过DOM方式移除,也可使用`<select>`元素的remove()方法,或者将选项引用置为null  

#### 移动和重排选项  

使用appendChild()方法传入要移动的选项可以将一个选项移除并插入到另一个选择框中,insertBefore()方法类似,可用于重排选项  
  
### 富文本编辑  

富文本编辑的本质是在页面中嵌入一个空白html的iframe,设置其designMode属性  

#### 使用contenteditable属性  

给页面中的任何元素加上contenteditable属性即可编辑该元素  

#### 操作富文本  

document.execCommand()方法对文档指定预定义的命令，接收3个参数：预定义的命令名称,bool是否提供命令用户界面(应该始终设置为false),执行命令的值(不需要则为null).  
该方法适也适用于对contenteditable的方式操作,各浏览器对命令的实现方式不同,因此生成的html不能保持一致  
queryCommandEnabled()方法可用来测试命令是否适用,queryCommandState()方法用于确定是否已将指定命令应用到了选择的文本,queryCommandValue()于取得执行命令时传入的值.  

#### 富文本选区  

使用iframe的getSelection()方法可以获取到实际选择的文本Selection对象,该对象支持一系列的属性和方法可以直接操作文本的DOM表现,与execCommand()方法相比能够进行更加精细的操作  
  
## HTML5脚本编程  

### 跨文档消息传递  

跨文档消息传递xdm指在不同域的页面之间传递消息，通过postMessage(data,targetOrigin)方法发送数据到当前页面的iframe或弹窗中  
接收消息时响应window对象的message事件即可,event对象包含data,origin(发送方所在域),source(发送方的window代理,即调用postMessage方法的对象),event.source仅为window的代理,不可方法其它属性,只能调用event.source.postMessage()方法  

### 原生拖放  

#### 拖放事件  

鼠标开始拖放操作时,被拖放元素上会触发dragstart事件,随后及拖动期间会持续触发的drag事件，拖动停止时触发dragend.  
某元素被放置到有效的目标上时,目标元素会依次触发dragenter,dragover,drop/dragleave,与鼠标事件类似  

#### 自定义放置目标  

有些元素不允许放置,可以重写dragenter,dragover事件来将其变成可放置目标,在firefox中还要为重写drop事件  

#### dataTransfer对象  

dataTransfer对象时event对象的一个属性,用于在拖放操作时实现数据交换,在拖动文本框时调用dataTransfer的setData()方法设置数据,在放置目标上调用getData()获取数据,其中读取数据只能在ondrop事件中读取  

#### dropEffect和effectAllowed  

作为dataTransfer对象的两个属性,dropEffect表示被拖拽元素能够执行哪种放置行为,取值有none,move,copy,link.不同的值仅会导致光标的不同样式,具体操作还需要开发人员自己实现,该属性在ondragenter中使用  
effectAllowed属性表示放置目标允许哪种dropEffect,取值为dropEffect取值种类的组合,与dropEffect一样具体业务逻辑需自行实现,该属性在ondragstart中使用  
  
此外dataTransfer对象还有addElement(element),clearData(format)setDragImage(element, x, y),types等属性或方法  
  
#### 可拖动  

给不可拖动元素设置dragable属性或者将可拖动元素的dragable属性设置为false可让可拖动性翻转  
  
## 错误处理与调试  

### 错误处理  

#### try-catch语句  

```javascript  
try {  
  // 不确定会不会出错的代码  
} catch (error) {  
  // 代码执行错误时，转到这里  
} finally {  
  // 一定会执行的code  
}  
```  

catch会接受一个error对象，该对象中常用的属性有message，  
错误类型Error派生出了EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError等类型  
通过throw操作符可以抛出错误,  
没有通过try-catch处理的错误都会触发window对象的error事件,Image对象src错误也会触发该事件  
常见的错误类型有类型转换错误(显式/隐式转换),数据类型错误,通信错误  
通过设置Image对象的src属性,可以向服务器发送请求,进而传递错误记录给服务器  

### 调试技术  

可通过console的log(),error(),info(),warn()等方法将消息输出到控制台来调试  
也可输出到页面或抛出错误来进行调试  
  
## JavaScript与XML  

由于缺乏规范,共同的功能却存在一些不同的实现。DOM2 级提供了创建空 XML 文档的 API,但没有涉及解析和序列化。  
<strong>本章内容暂时略过</strong>  
  
## E4X  

E4X的目的是为操作XML数据提供与标准ECMAScript更相近的语法。  
<strong>本章内容暂时略过</strong>  
  
## JSON  

### 解析与序列化  

JSON对象有stringify()和parse()方法用于序列化和解析json,序列化的时候所有的函数和原型成员会被忽略,undefined值也会被忽略  
JSON.stringify(),除js对象外,还可传入第二个参数数组或函数作为过滤器,第三个参数数值或字符表示缩进数或缩进字符(默认为空格缩进). js对象中还可定义toJSON函数返回其自身的JSON格式  
JSON.parse()方法,类似也可接收第二个参数函数作为过滤器  
  
## Ajax和Comet  

### XMLHttpRequest对象  

如下方代码示例,创建XMLHttpRequest对象,通过open方法启动一个请求,此时可设置请求头,调用send方法时才真正发送了请求,响应成功后XHR对象有responseText,responseXML,status,statusText几个属性会被填充  
另外在收到响应之前可调用abort()方法取消请求,并在之后解除引用  

```JavaScript  
let xhr = new XMLHttpRequest();  
// 发送异步请求时需要监听readyState的状态,4为已完成,该事件需在open调用前添加  
xhr.onreadystatechange = function() {  
  if(xhr.readyState == 4){  
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){  
      alert(xhr.responseText);  
    } else {  
      alert("Request was unsuccessful: " + xhr.status);  
    }  
  }  
};  
xhr.open('get', 'url', false);  // open方法设置请求类型,url和是否异步请求的bool值  
xhr.setRequestHeader('myHeader', 'MyValue');  
xhr.send(null);  // 发送请求,若无请求参数则传入null  
```  

设置get请求时,若在url中添加参数,需要对参数进行编码encodeURIComponent()  
设置post请求时,请求参数在调用send时设置  
  
### XMLHttpRequest 2级  

增加了FormData类用于表单数据序列化,XHR增加了timeout属性,若超时还未响应则会触发timeout事件,通过ontimeout响应函数可以处理相应的事件,overrideMimeType()方法可以强制将响应主体按照想要的格式来解析  
  
### 进度事件  

loadstart: 在接收到响应数据的第一个字节时触发.  
progress: 在接收响应期间持续不断地触发.  
error: 在请求发生错误时触发.  
abort: 在因为调用abort()方法而终止连接时触发.  
load: 在接收到完整的响应数据时触发.  
loadend: 在通信完成或者触发error、abort或load事件后触发.  
  
load事件用于替代readystatechange事件,其event对象的target属性指向XHR  
progress事件的event对象除target属性执行XHR外,还包含lengthComputable表示进度信息是否可用的bool值  
position已接收的字节数,totalSize预期的字节数  
  
### 跨资源共享  

CORS的基本思想,就是使用自定义的HTTP头部让浏览器与服务器进行沟通,从而决定请求或响应是应该成功或失败.  
跨域的XHR对象不能使用setRequestHeader()设置自定义头部,不能发送和接收cookie,调用getAllResponseHeaders()方法总会返回空字符串  
  
### 其他跨域技术  

图像Ping，利用`<img>`标签进行跨域单向通讯,通过url发送请求参数,监听load或error事件确定响应时间  
  
JSONP,通过动态的`<script>`元素和回调函数来实现跨域双向通讯,JSONP能在回调函数中直接访问响应的数据,但不安全.  
  
Comet是一种服务器向页面推送数据的技术,可通过长轮询或http流来实现  
  
SSE(Server-Sent Events,服务器发送事件)是围绕只读Comet交互推出的API或者模式. 支持短轮询、长轮询和HTTP流,
> 先使用下列代码创建一个对象`var source = new EventSource('url')`,传入url必须与页面同源  
> 其readyState属性,0表示正在连接服务器,1表示打开了连接,2表示关闭了连接  
> open事件在建立连接时触发,message在接收到新事件时触发,error在无法建立连接时触发,调用close()方法主动关闭连接  
  
web Socket使用自定义协议的API,url为`ws://`或`wss://`模式,适合用来传输小字节,要求延迟低的场景  
> 使用`var socket = new WebSocket('url')`模式创建对象,url必须为完整url,readyState属性表示连接状态  
> 连接建立后使用send()方法发送数据,仅可发送字符串;接收数据时使用onmessage监听message事件即可  
> 另外还有open,error,close事件  
  
SSE适合于常规服务器,单向通讯(读),webSocket适合双向通讯(聊天等),但需要相应服务器支持协议  
  
### 安全  

改用post请求,检查url来源,基于cookie信息验证等方式对于防范CSRF攻击毫无用处,但可使用ssl加密,或动态校验验证码等方式可以有效防范  
  
## 高级技巧  

### 高级函数  

#### 安全的类型检测  

对于原生的类型，安全的检测方法是利用toString()方法返回类的属性来判断，如：`alert(Object.prototype.toString.call(value));`value为数组类型会输出`[object Array]`  

#### 作用域安全的构造函数  

实例化时漏写构造函数的new操作符时,会将属性添加至window;通过判断构造函数中this的类型来决定是否创建一个对象再返回, 使用这种模式时,继承必须使用原型链  

#### 惰性载入函数  

在执行兼容性函数时,通常会判断方法或属性是否可用,为了尽量减少if判断分支的技巧成为惰性载入函数,惰性载入函数通过首次调用时,将函数覆盖为另一个更合适的函数,这样第二次调用时就不用再进行判断.或在函数声明时就指定适当的函数(即创建函数的函数),创建适当的函数后续调用时也不用进行判断  

#### 函数绑定  

函数的bind()方法用于绑定执行环境(this)  

#### 函数柯里化  

将函数的部分参数固定创建新的函数  

### 防篡改对象  

#### 不可扩展对象  

Object.preventExtensions(person)方法能阻止person对象继续添加属性但仍然可以修改已有的成员,Object.isExtensible(person)用于判断对象是否可扩展  

#### 密封的对象  

Object.seal(person)方法将person对象转换为密封对象,在不可扩展对象基础上,密封对象的已有成员不可被删除,Object.isSealed()用于判断对象是否为密封对象  

#### 冻结的对象  

Object.freeze(person),冻结对象的属性不可被修改,Object.isFreeze()  
  
### 高级定时器  

由于js是单线程的,定时器仅在设定时间后将函数插入到队列,但具体执行需要等到线程空闲后.  

#### 重复的定时器和Yielding Processes  

若任务队列中已有定时函数,则后一个定时函数会被跳过,避免阻塞任务队列  
对于占用资源过多的函数浏览器会弹出对话框提示用户是否继续执行,因此对于此类函数尽量采取分块处理  

#### 函数节流  

对于周期性事件,特别是进行了DOM操作的函数,需要对函数进行节流,避免多次重复执行,示例:  

```JavaScript  
function throttle(method, context) {  
  clearTimeout(method.tId);  
  method.tId= setTimeout(function(){  
    method.call(context);  
  }, 100);  
}  
```  
  
### 拖放  

利用mousedown,mousemove,mouseup事件获取鼠标的坐标,实现元素的跟随拖动  
  
## 离线应用与客户端存储  

### 离线检测  

H5定义了navigator.onLine属性表示设备是否能上网,但各浏览器支持不同,因此不太可靠.  
除此之外设备在线状态变化时也会触发online,offline事件  

### 数据存储  

#### Cookie  

cookie用于存储数据,长度受限,通过document.cookie属性获取只能获取到当前页面可用的所有cookie字符串,所有的名字和值都必须使用encodeURIComponent()或decodeURIComponent()方法来进行编解码,某些浏览器还支持cookie中设置子cookie  
  
要使用同一个localStorage对象页面必须来自同一域名(子域名无效),使用同一种协议,同一端口.存储的数据保留到用户清除浏览器缓存或js删除为止  
对Storage的修改都会触发文档上的storage事件  
Web Storage的存储大小限制是根据每个来源(域,协议端口等)来的,每个来源只能使用固定的存储大小  
  
小数据量用cookie，中等数据量用sessionStorage和localStorage，大量数据可用IndexedDB的类sql数据库  
  
#### 本地存储localStorage和sessionStorage  
  
localStorage与sessionStorage的api类似:setItem('key', 'val'),getItem('key'),removeItem('key'),clear().  
localStorage是http无关,持久化的本地存储(除非用户主动删除,否在一直都在),与cookie一样采用同源策略,有存储上限,sessionStorage与localStorage特点类似,但其回话结束后(关闭标签或窗口)就会消失  
  
## 最佳实践  
  
### 性能  

增加作用域链会增加性能开销，针对这类问题优化措施有：  
1、避免全局查找，暂存需要经常使用的全局变量  
2、避免使用with语句  
  
算法优化：  
1、避免不必要的属性查找  
2、优化循环  
3、展开循环  
4、避免双重解释  
  
最小化语句数  
1、多变声明时尽量放一起  
2、插入迭代值  
3、使用数组和字面量值  
  
优化DOM操作  
1、最小化现场更新  
2、使用innerHTML  
3、使用事件代理  
4、注意HTMLCollection，HTMLCollection是动态的，对其进行查询开销大，尽量避免  
  
## 新兴的api  
  
### Page VIsibility API  

让开发人员掌握用户是否正与页面交互  
document.hidden表示页面是否隐藏(在后台或浏览器最小化),  
document.visibilityState可能有4中状态(后台标签或最小化、前台标签、页面隐藏但能看到预览、页面在屏幕外执行预渲染),  
visibilitychange事件(页面可见状态变化时触发此事件)  
  
### Geolocation API  

js能通过这套api访问到用户的地理位置  
navigator.geolocation对象的getCurrentPosition(okFun(), failedFun(), optionObject)触发请求用户共享地理定位信息的对话框,  
okFun成功回调函数接收一个Position对象包含coords和timestamp等包含位置和时间戳的属性  
failedFun失败回调函数,也会接收一个对象包含message和code  
optionObject可选对象包含enableHighAccuracy是一个布尔值,表示必须尽可能使用最准确的位置信息;timeout是以毫秒数表示的等待位置信息的最长时间;maximumAge表示上一次取得的坐标信息的有效时间,以毫秒表示,如果时间到则重新取得新坐标信息  
  
watchPosition()方法用于跟踪用户的位置,其接收参数与getCurrentPosition()方法全相同  
  
### File API  

### Web Timing  

### Web Workers  
  