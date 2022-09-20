# scss基础使用

## 简介  

scss/sass是css的超集，类似与typescript和JavaScript的关系，最终将转换为css上线,其语法格式有scss和sass(使用“缩进”代替“花括号”)两种  
  
本笔记仅参考了中文网中的[快速入门](https://www.sass.hk/guide/)和[中文文档](https://www.sass.hk/docs/)两个部分，更详细的请参考[英文版api](https://sass-lang.com/documentation)  
  
## 注释  

多行注释`/* */`会被编译到css中，单行注释`//`则不会  
带`!`号的多行注释  

```scss  
/*!  
  版权信息  
*/  
```  

通常用于加入版权信息，在处于压缩模式的css下也不会被删除  
  
## 变量  

变量以美元符号开头，赋值方法与 CSS 属性的写法一样  

```scss  
$width: 1600px;  
$pen-size: 3em;  
// 直接使用变量名称调用变量  
#app {  
    height: $width;  
    font-size: $pen-size;  
}  
// 支持块级作用域  
#foo {  
  $width: 5em !global; // !global将局部变量转换为全局变量  
  width: $width; // 5em  
}  
  
#bar {  
  width: $width; // 5em  
}  
```  

## 数据类型  

SassScript 支持 7 种主要的数据类型：  
  
+ 数字，`1, 2, 13, 10px`  
+ 字符串，有引号字符串与无引号字符串，`"foo", 'bar', baz`  
+ 颜色，`blue, #04a3f9, rgba(255,0,0,0.5)`  
+ 布尔型，`true, false`，只有自身是false和null才会返回false，其他一切都将返回true  
+ 空值，`null`，与任何类型进行算数运算  
+ 数组 (list)，用空格或逗号作分隔符，`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`  
+ maps, 相当于 JavaScript 的 object，`(key1: value1, key2: value2)`  
  
SassScript 也支持其他 CSS 属性值，比如 Unicode 字符集，或 !important 声明。然而Sass 不会特殊对待这些属性值，一律视为无引号字符串。  
  
`type-of($value)`判断数据类型  
  
### 字符串  

使用插值语法(模板字符串)`#{}`(interpolation)时，有引号字符串将被编译为无引号字符串，这样便于在mixin中引用选择器名  
  
### 数字  

带单位的数字，单位会和数字当做一个整体，进行算数运算  
  
### 数组  

参考[英文文档](https://sass-lang.com/documentation/modules/list)  
  
### 颜色  

支持颜色函数  
`$color1: lighten($color, 15%);`  
  
## 运算  

### 数字运算  

对于加法/减法运算,带有字符串类型的会变成拼接,其中减法会带着运算符拼接  
a.纯数字：只要有单位，结果必有单位,不同单位之间会进行必要的转换  
b.纯字符串：第一个字符串有无引号决定结果是否有引号  
c数字和字符串：第一位有引号，结果必为引号；第一位对应数字非数字且最后一位带有引号，则结果必为引号  
  
乘除取余运算  

+ 乘法:  
  
每个字段必须前部分为数字，且两个字段只能一个后部分是字符(因为此时后缀被当被单位看待了)。其余编译不通过  
  
+ 除法:  
  
`/` 在 CSS 中通常起到分隔数字的用途  
以下三种情况 / 将被视为除法运算符号：  
> 1.如果值，或值的一部分，是变量或者函数的返回值
> 2.如果值被圆括号包裹  
> 3.如果值是算数表达式的一部分  
  
不会四舍五入，精确到小数点后5位  
每个字段必须前部分为数字，且当前者只是单纯数字无单位时，后者(除数)后部分不能有字符。其余结果就按顺序去除空格后拼接起来。  
(因为此时后缀被当被单位看待了)  
  
取余:  
值与"%"之间必须要有空格，否则会被看做字符串  

### 关系运算符  

大前提：两端必须为数字 或 前部分数字后部分字符  

### 相等运算符  

前部分为不带引号数字时，对比的仅仅是数字部分；反之，忽略引号，要求字符一一对应  

### 布尔运算符  

值与"and"、"or"和"not"之间必须要有空格，否则会被看做字符  

### 颜色运算符  

颜色与颜色之间运算是分段计算进行的，也就是分别计算r、g、b部分的值  
颜色值与数字之间是分段分别与数字进行运算  
RGB和HSL,如果颜色值包含alpha channel（rgba或hsla两种颜色值），必须拥有相等的alpha值才能进行运算，因为算术运算不会作用于alpha值。  
  
### 运算优先级  

1、`()`  
2、`*`、`/`、`%`  
3、`+`、`-`  
4、`>` 、`<`、`>=`、`<=`  
  
## 嵌套语法  

scss选择器可嵌套书写  
  
选择器嵌套时，其嵌套处理逻辑类似于外层选择器与内层拼接，因此跨层次嵌套必须书写中间层  
对于特殊的[父选择器](#父选择器)`&`符号将被替换为父选择器名称  
同样`> + ~`选择器和群组选择器也支持  
  
属性嵌套时：  

```scss  
.funky {  
  font: {  
    family: fantasy;  
    size: 30em;  
    weight: bold;  
  }  
}  
/*  
被编译为  
.funky {  
  font-family: fantasy;  
  font-size: 30em;  
  font-weight: bold; }  
*/  
```  

`:`符号将被转义为`-`  

## 杂货语法  

占位符选择器,以`%`开头的选择器,不选取任何元素,通常用于继承等场景  

### 插值语法  

类似于模板字符串  
通过 #{} 插值语句可以在选择器、属性名和属性值中使用变量。  

### 父选择器&  

更接近于指向当前元素  

```scss  
a {  
    color: yellow;  
    &:hover{  
        color: green;  
    }  
    &:active{  
        color: blank;  
    }  
}  
```  

### `!default`  

设置变量默认值,变量是null空值时将视为未被!default赋值  

### `!global`  

将局部变量提升为全局变量  
  
### `!optional`  

当@extend相关代码出现语法错误时，编译器可能会给我们”乱”编译为css，我们加上这个参数可以在出现问题后不让他编译该部分代码  
  
## @-Rule指令  

### `@import`  

仅可导入scss/sass文件，若传入css或url等参数将被作为普通的css语句。  
若不希望将导入的scss文件独立编译为CSS只需要在文件名前添加下划线，但导入语句中却不需要添加下划线，如：  
文件名_colors.scss，导入`@import "colors";`  
  
嵌套的代码中导入，对应的被导入代码将只在局部作用域生效。不可以在混合指令(mixin)或控制指令(control directives)中嵌套@import  
  
### `@media`指令  

与CSS中用法一样，但允许其在CSS规则中嵌套  
如果 @media 嵌套在 CSS 规则内，编译时，@media 将被编译到文件的最外层，包含嵌套的父选择器  
  
### `@extend`继承  
  
<strong style="color:red">继承的基本原理类似于：`.seriousError @extend .error`，那么样式表中的任何一处`.error`都用`.error.seriousError`这一选择器组进行替换。</strong>  
  
.seriousError不仅会继承.error自身的所有样式，任何跟.error有关的组合选择器样式也会被.seriousError以组合选择器的形式继承  
  
不要继承后代选择器,如:  

```scss  
#admin .tabbar a {  
  font-weight: bold;  
}  
#demo .overview .fakelink {  
  @extend a;  
}  
```  

因为后代选择器之间的层级不确定,scss会根据不同的层级组合生成多种选择器组合,上述代码编译后会生成:  

```css  
#admin .tabbar a,  
#admin .tabbar #demo .overview .fakelink,  
#demo .overview #admin .tabbar .fakelink {  
  font-weight: bold; }  
```  
  
在`@media`中不可继承外部的代码块  
  
### 混合  

`@mixin`给一大段样式赋予一个名字,通过`@include`引用对应的混合器,`.`调用会把混合器中的所有样式提取出来放在@include被调用的地方.  
  
<strong style="color:red">由于混合器是替换代码的方式调用,因此滥用可能会导致css文件过大</strong>  
  
混合器可以以类似函数的方式定义参数，给`@include`调用,如下是使用了默认参数的混合器  

```scss  
@mixin link-colors(  
    $normal,  
    $hover: $normal,  
    $visited: $normal  
  )  
{  
  color: $normal;  
  &:hover { color: $hover; }  
  &:visited { color: $visited; }  
}  
// 调用时可以这样调用  
@include link-colors(red)  
```  

当不确定有多少个参数时,可以使用类似与es6中的`...`标志符，对参数变量声明(`@include`时也可使用该标志符，效果类似与es6)，如下：  

```scss  
@mixin box-shadow($shadows...) {  
  -moz-box-shadow: $shadows;  
  -webkit-box-shadow: $shadows;  
  box-shadow: $shadows;  
}  
.shadows {  
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);  
}  
  
// 编译为  
.shadowed {  
  -moz-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;  
  -webkit-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;  
  box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;  
}  
```  
  
## 控制指令  
  
### if  

```scss  
@if #{条件} {  
  //业务代码  
} @else if #{条件} {  
  // 业务代码  
} @else {  
  // 业务代码  
}  
```  

### for  

指令包含  
`@for $var from <start> through <end>`和  
`@for $var from <start> to <end>`两种形式  
两种`<start>和<end>`都必须为整数值，前者包含end而后者不含  
  
### `@each`  

指令格式为`@each $var in <list>`,`<list>`是一连串的值(值列表)，与js类似的迭代，可多值同时迭代，或迭代map  
  
### `@while`  

while循环直到条件满足  

```scss  
@while #{condition} {  
  // 业务代码  
}  
```  
  
## 函数指令  

支持自定义函数，并在属性值或script中使用;  
  
```scss  
$grid-width: 40px;  
$gutter-width: 10px;  
  
@function grid-width($n) {  
  @return $n * $grid-width + ($n - 1) * $gutter-width;  
}  
  
#sidebar { width: grid-width(5); }  
```  

### 输出格式  

此部分实用性不强，参考[官方文档](https://www.sass.hk/docs/)  

## scss与js联动

基于webpack、sass-loader在vue项目中，scss中的变量可以导入到js中使用  

```scss
// @/styles/variables.scss
$--color-primary: skyblue;
$--border-width: 2px;

:export {
  colorPrimary: $--color-primary;
  borderWidth: $--border-width;
}
```

```js
import styleVariables from '@/styles/variables.scss'
console.log(styleVariables) // { colorPrimary: 'skyblue', borderWidth: '2px'}
```
