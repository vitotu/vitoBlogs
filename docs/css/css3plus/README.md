# css进阶知识整理

## 基础概念  

层叠样式表 (Cascading Style Sheets)  
所谓层叠，可以将整个网页想象成是一层一层的结构，层次高的将会覆盖层次低的  
  
> css代码书写位置来分又有：  

+ 行内样式  
行内样式直接通过标签的style属性书写的元素中，对该元素具有最高作用优先级0  
+ 内嵌样式  
书写在`<style></style>`标签中，具有优先级1  
+ 外链样式  
通过`<link></link>`标签中的href属性通过链接的方式导入，具有优先级1  
+ 导入式样式  
通过`@import url(***.css)`方式引入，具有最低的优先级3  
内嵌样式和外链样式冲突时，谁最后出现谁的优先级最高  
  
## 选择器  

元素选择器:标签名 { }; 类选择器: .className { }; id选择器: #id { };  
复合选择器: 选择器1选择器2{},如div.box1会选中class=box1的div标签  
群组选择器: 选择器1,选择器2,选择器3 { }  
后代选择器: 祖先元素 后代元素 后代元素 { } 后代选择器的结合方式是从右到左的(相当于从先查找目标节点，再根据其父级节点来排除不符合条件的节点，相比于从左到右的方式查找效率更高)  
直接子元素选择器: 父元素 > 子元素{}  
兄弟选择器: 兄弟元素 + 兄弟元素{},查找后一个兄弟元素; 兄弟元素 ~ 兄弟元素{} 查找后面的所有兄弟元素  
  
伪类和伪元素：  
选中本身没有标签，但仍然可识别的网页部位，如标签`<a></a>`  
a:link 正常链接; a:visited 访问过的链接; a:hover 鼠标悬浮的链接; a:active 正在点击的链接  
  
不同的选择器有不同的权重值：  

+ 内联样式：权重是 1000  
+ id选择器：权重是 100  
+ 类、属性、伪类选择器：权重是 10  
+ 元素选择器：权重是 1  
计算权重需要将一个样式的全部选择器相加,在进行计算时不允许进行进位;通用选择器 (*)，组合符 (+, >, ~, ' ')，和否定伪类 (:not) 不会影响优先级。  
`!important`修饰属性值，能够覆盖上述所有优先级计算，想要覆盖`!important`只能在优先级更高的规则中加入`!important`,应尽量避免使用该属性修饰符  
  
`p :first-child`选择p的一个后代元素,`p:first-child`选取某元素的第一个p元素，为避免混淆可引入全局选择器，将前者改写为`p *:first-child`  

## 默认样式  
  
## 盒模型  

### 块级盒子  

绝大多数盒子会和父元素一样宽，每个盒子都会换行  
![avatar](https://mdn.mozillademos.org/files/16558/box-model.png)  
如图content区域用来显示内容，大小可通过width和height设置，而盒子的实际大小需要再各自的方向上加上padding和border  
  
另外通过设置`box-sizing:border-box`可以将标准盒模型转为代替盒模型，代替盒模型的实际宽高就是其设置值，而content的宽高则是实际宽高的基础上减去各自方向上padding和border的大小  
  
内边距padding与外边距不同其值必须为正，应用与元素的任何背景都将显示在内边距后面  
  
### 内联盒子  

inline box盒子不会换行，width和height不会起作用,垂直方向的padding、margin、border可用，但不会推开其他inline盒子，水平方向的则会推开。内边距和边框可能会与段落内的其他单词重叠  
  
`display:inline-block`提供了一个特殊的中间态，其width和height生效，margin、border、padding都会生效且推开其他元素，但不会换行  
  
css外部显示类型来决定盒子是块级还是内联，内部显示类型决定盒子内部元素(子元素)如何布局,如设置`display:flex`  

## BFC

BFC（Block Formatting Context）即[块级格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)  
简单理解类似独立的布局作用域，创建了一个新的BFC，BFC内部的布局不受外部干扰  

常见的触发BFC的css属性有：

+ `<html>`根元素
+ float不为none
+ position为absolute或fixed
+ display为inline-block,table类,flow-root,flex,grid
+ overflow不为visible
+ contain值为layout，content，paint  

创建新的BFC具有以下特性

1. 包含内部浮动：计算BFC高度时将包含内部浮动元素
2. 排除外部浮动：新建的BFC不与外部的任何浮动元素重叠
3. 阻止外边距重叠

PS：`display:flow-root`用于创建一个新的流式布局，通常用于无副作用的创建一个新的BFC

### 外边距折叠

外边距折叠(Margin collapsing)：当两个元素的margin相邻时只会取较大的margin值作为两元素的实际间距，这种现象称为外边距折叠。[参考文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)  
若外边距折叠中有负值的情况，则为折叠后实际间距为最大值和最小值(负值)之和，若都为负值，则取最大值  

通常两元素触发外边距折叠需要同时满足条件：  

1. 都是普通流中的元素且属于同一个 BFC  
2. 没有被 padding、border、clear 或非空内容隔开
3. 两个或两个以上垂直方向的「相邻元素」(兄弟元素或父子元素)

PS：父子元素重叠的部分将会溢出到父级块元素的外面  

另外空的块级元素margin-top和margin-bottom贴在一起时(inline、clear-fix及其他几何属性)，也会自行触发外边距折叠

+ 清除外边距折叠的方法
  1. 破坏上述三个条件
  2. 后一个元素上设置clear-fix

## 文本属性

### line-height和继承

line-height可设置为纯数字、百分比、带单位的数字，默认值为inherit(继承)，其中纯数字、百分比、em等单位数字表示相对元素字体大小倍数(单位px除外)，但除纯数字外，其他值在被子元素继承时，都是以固定值继承，即继承了相对父元素字体大小计算后的固定行高，因此为避免不必要的问题推荐使用纯数字的方式设置行高

## 函数  

calc(), url(), rgb(), hsl(), rgba(), linear-gradient(),repeat()  

## @规则  

```css
@supports (feature) {}/* 特性查询，支持feature特性的浏览器会生效其后的规则 */
@media () {}/* 媒体查询 */
@import /* 导入样式表 */
```

## 层叠、优先级、继承  

层叠：相同优先级的css规则应用到同一元素时，后出现的将覆盖之前的相同属性  
优先级：越具体越，作用范围越小，优先级就越高，详见[选择器](#选择器)中的权重部分  
继承：css中根据DOM层级，部分属性(如：color)会从父级DOM继承  
控制继承的属性值有：inherit(开启继承),initial(默认属性优先，其次继承),unset(自然值优先,其次initial),revert  
配合all属性，可以一次性控制几乎所有的属性的继承  
[参考文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/inheritance)  
  
## css定位总结  

静态定位(Static positioning)是每个元素默认的属性;  
相对定位(Relative positioning)允许我们相对于元素在正常的文档流中的位置移动它;  
绝对定位(Absolute positioning)将元素完全从页面的正常布局流(normal layout flow)中移出;  
固定定位(Fixed positioning)与绝对定位非常类似，但是它是将一个元素相对浏览器视口固定，而不是相对另外一个元素;  
粘性定位(Sticky positioning)，它会让元素先保持和position: static一样的定位，当它的相对视口位置(offset from the viewport)达到某一个预设值时，他就会像position: fixed一样定位。  

## css布局总结  

### 正常布局流  

块级元素的内容宽度是其父元素的100%，其高度与其内容高度一致,按照书写顺序自上而下排布。  
内联元素的height/width与内容一致。只会在文本或元素溢出时换行  

### flex布局  

flex布局又称flex-box布局，在容器上设置`display:flex 或 inline-flex 或 -webkit-flex`属性  

+ flex-direction属性定义主轴方向，row(-reverse横向)/column(-reverse纵向),cross axis交叉轴与主轴垂直，轴的起点、终点分别用start和end表示  
+ flex-warp属性，默认值为nowarp，会尝试缩小flex-item适应容器，若无法缩小将发生溢出，设置为warp/warp-reverse时则会换行  
+ flex-flow由两个值组成分别是flex-direction和flex-warp的简写  
+ align-items属性定义元素在交叉轴方向上的对齐方式，stretch拉伸，默认值，flex-start交叉轴起点对齐，flex-end，center,baseline项目的第一行文字的基线对齐  
+ justify-content属性定义主轴方向对齐方式flex-start、flex-end、center、space-around每个元素左右间隔相等、space-between元素之间间隔相等(头尾不留空间)  
+ align-content属性定义了多根轴线的对齐方式(交叉轴方向的justify-content)。如果项目只有一根轴线，该属性不起作用,取值：flex-start | flex-end | center | space-between | space-around | stretch

其子元素将都变成flex-item,并且子元素的float、clear和vertical-align属性将失效  
flex-item上的属性：  

+ order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0  
+ flex-basis属性定义了item在主轴的空间大小(空间不足时可能缩小)，默认值为auto，若同时设置了width/height则flex-basis不为auto时拥有更高的优先级  
+ flex-grow属性定义了沿主轴方向放大比例，默认为0，设置为非0数字时，所有item按数字比例分配剩余空间，若item总宽度大于容器则此属性失效，item按flex-shrink规则缩小  
+ flex-shrink属性定义了收缩比例，默认值为1，其值为压缩剩余空间(负剩余空间)的比例，同时兼顾了达到item的min-width属性值时不再缩小  
+ flex由flex-grow、flex-shrink、flex-basis组成，特殊缩写值{initial:0 1 auto, auto:1 1 auto, none:0 0 auto, 1:1 1 0}  
+ align-self属性指定对应item的交叉轴方向的对齐方式，可覆盖align-items属性，取值auto(默认值) | flex-start | flex-end | center | baseline | stretch

### grid网格  

grid网格布局
容器上的属性：

+ display: grid | inline-grid 容器中的item的属性float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效
+ grid-template-columns/grid-template-rows属性定义了每列/每行的宽度/高度，如：`grid-template-columns:33.33% 100px 1fr 2fr`。
  + 对于重复的值可以使用repeat(n, template)函数,n表示要重复的次数，template表示复制模板，可以时单个值或多个值，n为auto-fill时，表示列/行尽可能多的容纳单元格
  + 宽度中，fr为分配剩余宽度的比例单位，minmax()产生一个长度范围，此外可以取auto值
  + 属性值之间可以用方括号添加网格线名称方便后续引用，如：`grid-template-rows:[c1 cx] 100px [c2] auto [c3]`
+ [grid-]column-gap/[grid-]row-gap属性表示列/行间距，其中grid-前缀可省略
+ [grid-]gap属性是上述两属性的缩写`<grid-row-gap> <grid-column-gap>`
+ grid-template-areas属性用于定义区域，不需要的区域用`.`表示，如：`grid-template-areas: "header header ." "main main sidebar" ". footer footer"`
+ grid-auto-flow属性定义元素放置顺序，默认为row先行后列，也可为column，而row dense和column dense表示其后的元素尽可能的填满不出现空格
+ justify-items/align-items/place-items属性设置单元格内容的水平/垂直对齐方式,取值为start、end、center、stretch(默认值)，place-items为两属性的缩写align-items justify-items
+ align-content/justify-content/place-content表示整个内容区域的垂直/水平分布方式，取值为start、end、center、stretch、space-around、space-between、space-evenly，space-evenly表示item与item间隔、item与容器边缘间隔相等，而space-around的item间距是边缘间距的2倍，place-content同样时align-content和justify-content的缩写
+ grid-auto-columns/grid-auto-rows属性用于指定浏览器创建的多余的网格的列宽和行高，如网格只有3列，而某item指定在第5列，浏览器则会自动生成多余的列
+ grid-template是grid-template-columns、grid-template-rows、gird-template-areas的简写
+ grid是grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow属性的简写  

子元素item上的属性：  

+ grid-column-start/grid-column-end/grid-row-start/grid-row-end属性指定item边框的起始位置，
  + 其值可以用网格线序号表示，如  `{grid-column-start: 2; grid-column-end: 4;}`表示第2个垂直网格线开始，第4个结束，该item空一格后横向占据两格空间，高度未指定保持默认；
  + 可以用网格线名称表示，grid-template-(columns/rows)属性中定义的网格线名称
  + 使用`span n`关键字时表示跨越n个网格
  + 若产生了item重叠，则用z-index指定item重叠顺序
+ grid-column/grid-row属性分别时其后缀-start,-end属性的简写形式，书写格式为`grid-(column/row):<start-line> / <end -line>`，若省略斜杠和end-line则默认跨域一个网格
+ grid-area指定item放置区域，区域名在grid-template-areas属性中指定；还可用作grid-(row/column)-(start/end)属性的缩写形式`grid-area: <row-start> / <column-start> / <row-end> / <column-end>`
+ justify-self/align-self/place-self属性指定单元格内容的水平/垂直对齐方式，与(justify/align)-items属性的用法类似，而place-self则为两者缩写：`place-self: <align-self> <justify-self>;`

### float浮动  

+ float指定元素沿其容器的左侧或右侧放置，该元素将被移出文档流。取值为left | right | none | inline-start | inline-end  
+ float将使用块布局，因此display设置为内联也无效，但float对flex元素不生效  
+ float会生成[BFC块格式上下文](#bfc)
  + 浮动定位和清除浮动时只会应用于同一个BFC内的元素。
  + 浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。
  + [外边距折叠](#外边距折叠)（Margin collapsing）也只会发生在属于同一BFC的块级元素之间。

>清除浮动的几种方法:  
由于浮动元素脱离文档流，因此浮动元素无法撑开父元素，造成父元素“高度塌陷”问题，清除浮动的目标就是让父元素的高度恢复正常
>>
>> + clear:both(左右不允许出现浮动元素，还可指定left,right,none,inherit等值) 在浮动元素后的相邻兄弟元素加上此属性可解决“高度塌陷问题”
>> + 给父级元素设置固定高度；设置父级元素浮动；父级元素设置inline-block；使用`<br clear="both">`元素清除浮动(与clear方向相同)；父级设置overflow:hidden(使浮动元素回到容器层撑起父元素高度，需配合width或zoom属性使用)
>> + (推荐解决方案)在容器元素上使用`:before或:after`伪元素(css3中的写法为双冒号`::before`)，如下
>>
```css
.parent:after {
  content: ""; /* 也可设置为'.'，'020'等不可见的内容*/
  display: block;
  clear: both;
  visibility: hidden; /* 上方三个属性缺一不可，下方两个属性可选*/
  height: 0;
}
```

总结：清除浮动的方法主要分为两类：1、利用clear属性，2、触发父元素的BFC使父元素包含浮动元素

例如：在清除浮动中设置父元素overflow:hidden时创建了脱离根元素`<html>`的BFC，在计算父元素(新的BFC)高度时，子元素即时浮动也能参与高度计算，因此能够撑开父元素高度

### position定位

position属性可取static(默认值),relative,fixed,absolute,sticky  

+ 取static时，元素按照源码顺序正常文档流进行布局，top、bottom、left、right方位属性无效
+ relative,absolute,fixed都是基于参考点进行定位
  + relative相对于自身static位置进行定位，可搭配方位属性指定偏移方向和距离
  + absolute相对于上级元素进行定位，若上级元素(一般为父元素)的position属性是static时，则参考点变为根元素html，并且absolute定位导致元素脱离文档流
  + fixed相对于视口(浏览器窗口)进行定位，元素位置不随页面滚动而变化
+ sticky类似与relative和fixed的结合,该属性需配合方位属性使用，否则将失去fixed效果。当页面滚动，父元素开始脱离视口，且该元素将保持与视口不小于方位属性值距离，直到父元素完全脱离视口，该元素恢复relative并随父元素一起脱离视口  

### table表格布局  

表格布局可以利用table标签或将display属性设置为table实现，标签与css对应如下：

+ table    { display: table }
+ tr       { display: table-row }
+ thead    { display: table-header-group }
+ tbody    { display: table-row-group }
+ tfoot    { display: table-footer-group }
+ col      { display: table-column }
+ colgroup { display: table-column-group }
+ td, th   { display: table-cell }
+ caption  { display: table-caption }

设置相应的属性可以让元素表现得像表格中的相应元素  
注意：由于flex，grid布局的出现，表格布局在逐渐淘汰，但在IE8,9上仍然时不错的解决方案

### column多列布局  

创建类似于报纸的多列流式布局，顺序先列后行
容器上设置的属性：

+ column-count 列数  
+ column-width // 指定最小列宽  
+ column-gap // 列间距  
+ column-rule // 列分隔样式
+ columns：column-count column-width 两种属性的简写  
子元素上设置的属性：
+ break-inside/page-break-inside  // 是否折行

### 媒体查询  

```css  
@media media-type and (media-feature-rule) {  
  /* CSS rules go here */  
}  
```  

其中media-type可以是all、print、screen、speech，或在使用特殊的media-feature-rule时可以省略，  
与逻辑使用and关键字，或使用`,`符号，非用not关键字  

### 响应式布局设计  

响应式布局设计是由多种布局方式组合的方式，  
包含媒体查询、响应式图像、多列布局、flex盒子布局、网格布局、响应式排版等技术  

+ 利用媒体查询与rem结合，在屏幕宽度达到阈值时，修改根字体大小从而达到自适应
+ 视口元标签`<meta name="viewport" content="width=device-width,initial-scale=1">`，content中可设置的属性：  
  + width=device-width  
  + initial-scale：设定了页面的初始缩放，我们设定为1。  
  + height：特别为视口设定一个高度。  
  + minimum-scale：设定最小缩放级别。  
  + maximum-scale：设定最大缩放级别。  
  + user-scalable：如果设为no的话阻止缩放。  

## display:none和visibility:hidden的区别

+ display:none 元素不占用空间，不会出现在渲染树中；会触发reflow进行渲染；不是继承属性连同子元素会一起消失；读屏器不会读取内容
+ visibility:hidden 元素占据空间，会出现在渲染树中；会触发repaint，不会进行渲染；是继承属性，子元素可以单独出现；读屏器会读取内容

## 实现响应式布局大屏幕三等分到小屏幕一等分

方案一：使用grid布局，grid-template-columns控制等分，gap控制间距，媒体查询实现响应式

方案二：grid布局自动判断容器大小，自动撑满并均分

```css
.container {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```

## ref
