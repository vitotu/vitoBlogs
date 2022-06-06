# 图解css3核心读书笔记  

## 选择器  

### 层次选择器  

后代选择器: e f 将选取e的所有子孙后代f元素  
子选择器：e > f 仅选取e的直接子后代f元素  
相邻兄弟选择器：e + f 选取紧跟在e后面的一个兄弟元素f  
通用兄弟选择器：e ~ f 选取e后面的所有兄弟元素f  

### 伪类选择器  

伪类选择器分为：动态、目标、语言、UI状态、结构、否定伪类选择器  

#### 动态伪类选择器  

动态交互时才会体现出来的样式  
链接伪类：e:link, e:visited  
用户行为伪类：e:active, e:hover, e:focus  

#### 目标伪类选择器  

用于匹配url中“#”标志符所指定的元素，目标选择器是动态选择器，只有存在url指向该匹配的元素时，设置的样式才会生效，如:  

```html
<style type="text/css>  
  .accordionMenu :target p { /*本选择器语句在url中有#brand时指向menuSection匹配后代元素中的p元素*/  
        height: 100px;  
        overflow: auto;  
  }  
</style>  
<div class="menuSection" id="brand">  
  <h2><a href=" ">Brand</a ></h2>  
  <p>lorem ipsum dolor... </p>  
</div>  
```  

应用场景：高亮显示区块、从互相层叠的容器或图片中突出显示其中一项、tabs效果、幻灯片效果、灯箱效果、相册效果、手风琴  

#### 语言伪类选择器  

e:lang(language) 匹配指定了lang属性且属性值为language的e元素  

#### UI元素状态伪类选择器  

UI元素的状态一般包括：启用、禁用、选中、未选中、获得焦点、失去焦点、锁定、待机等,主要用于表单  
e:checked, e:enabled, e:disabled等  

#### 结构伪类选择器  

根据元素在DOM中的某些特性进行匹配  
e f:first-child, e f:last-child, e f:root, e f:nth-child(n), e f:nth-last-child(n)  
匹配e元素的对应序号子元素，且该子元素的类型为f，若第n个子元素不为f元素，则不匹配  
e f:nth-of-type(n), e f:nth-last-of-type(n), e f:first-of-type, e f:last-of-type  
匹配e元素的子元素中第n个f类型的元素  
e f:only-child 匹配e包含的f子元素，且只包含一个子元素类型为f  
e f:only-of-type 匹配e包含的f子元素，且只包含一个f类型的子元素(可以有其他类型的子元素)  
e:empty 匹配没有任何内容的元素  

#### 否定伪类选择器  

e:not(f)匹配不符合过滤规则f的e元素  
  
### 伪元素  

伪元素可用于定位文档中包含的文本，但无法在DOM中定位。伪元素表示DOM外部的某种文档结构  
::first-letter 选择文本块中的第一个字母  
::first-line 匹配元素的第一行文本  
::before, ::after 可以插入内容的额外位置配合content属性使用  
::selection 用来突出显示文本，仅支持background和color两个属性  
  
### 属性选择器  

e[attr] 匹配带有attr属性的e元素  
e[attr=val] 匹配带有attr属性的e元素，且属性值为val  
以下省略e元素，仅描述通配符，attr|=val匹配val或者以val开头的属性值  
attr~=val,匹配以空格分割的多个属性值中包含val  
attr*=val,匹配属性值中任意位置的val  
attr^=val,匹配属性值中以val开头  
attr$=val,匹配属性值中以val结尾  
  
## 边框  

### 基本属性 border-width  

`border-width`边框粗细, `border-style`边框类型(`solid`实线、`dashed`虚线), border-color边框颜色  
合并的写法border: border-width border-style(需要指定值) border-color,  
同时各属性单独写时也支持TRBL(Top/Right/Bottom/Left)的顺时针原则  

### ~~颜色属性 border-color~~(本节描述在最新的版本中过时，以实践为准)  

颜色属性的详细设置需要分开写  
`border-top-colors:[<color> | transparent]{1,4} | inherit`  
其后可以跟很多个颜色值，与宽度配合可制作渐变效果，每个颜色占据1px,最后一个颜色占据剩下的宽度，若宽度不足则后续颜色失效  

### 图片边框属性 border-image  

`border-image: none | <image> [number | percentage]{1,4} [/可选 border-width]{1,4} ? [stretch | repeat | round]{0,2}`  
总共4段值，分别指定图片来源，图片切片方式(对图片进行9宫格切片取其中四个边)，边框图片宽度(同border-width属性,设置时需加'/')，边框图片排列方式(repeat平铺、stretch拉伸等)  

### 圆角边框属性 border-radius  

`border-radius: none | length{1,4} [/可选length]{1,4}`  
圆角边框属性指定4值时遵循左上顺时针的顺序，第一个length指定水平半径，第二个指定垂直半径，第二个若省略则水平和垂直半径相同  
另外该属性还可以拆开写border-top-left-radius等，但每个浏览器支持不同，需要加上对应的前缀。webkit内核的浏览器中在`<img>`标签上使用该属性可能无法对图片进行剪切、图片无效果，`<table>`中使用该属性只有border-collapse:separate时才会生效  

### 盒子阴影属性 box-shadow  

`box-shadow:none | [inset x-offset y-offset blur-radius spread-radius color], [inset x-offset y-offset blur-radius spread-radius color]`  
x-offset在x轴上的偏移量，y-offset在y轴上的偏移量(y轴指向向下),inset(内阴影，可选值，不设置则为外阴影),blur-radius 模糊半径，可选值,spread-radius扩展半径，可选值  
另外内阴影在图片元素上无效  
  
## 背景 background  

`background: [background-color] [, background-image] [, background-repeat] [, background-attachment] [, background-position]`  
上面的代码列出了背景的基本属性：  
background-color默认值为transparent继承父元素的颜色，可以理解为透明色  
background-image默认为none，也可通过url指定图片地址  
background-repeat设置背景图片铺放方式可取值有repeat,repeat-x,repeat-y,no-repeat  
background-attachment设置背景图片是否随页面其他内容滚动，可取值有scroll, fixed  
background-position设置背景图片相对元素左上角的位置,其值可以为百分比，数字，位置关键词  

### 背景原点属性 background-origin  

`background-origin: [padding-box | border-box | content-box]`  
用于指定background-position的参考原点，三个属性值分别指定参考原点为padding的外边缘、border的外边缘、content的外边缘  
另外若background-attachment属性为fixed则本属性讲不起作用  
  
### 背景裁切属性 background-clip  

`background-clip: [border-box | padding-box | content-box]`  
用于定义背景图像的裁剪区域，其中border-box为默认值，border向外的区域将被裁减掉，padding-box:padding之外的区域将被裁减掉，content-box，content之外的区域将被裁剪掉  
  
### 背景尺寸属性 background-size  

`background-size: auto | length | percentage | cover | contain`  
指定背景图片的尺寸，控制图片在水平和垂直方向缩放  
auto默认值，保持背景图片的原始宽高，数字或百分比指定图片具体大小，cover将图片缩放铺满整个容器，保持图片原来的比例，缩放到宽或高正好铺满整个容器  
  
### 内联元素背景图像平铺循环方式 background-break  

用于指定内联元素背景图片进行平铺时的循环方式，可以取bounding-box背景图像在整个内联元素中进行平铺、each-box背景图像在行内进行平铺、continuous下一行背景图像紧接上一层背景图像进行平铺  
此属性用的较少，并且浏览器支持性不是很好，慎用  
  
### 多背景属性  

css3还支持多背景属性，通过在上述的多种属性中通过逗号分隔可指定多组背景并分别定制不同的效果  
  
## 文本  

文本css的基础属性主要分为3类：字体、颜色、文本  
> 字体类型  
`font-family`字体类型; `font-style`字体样式，默认normal，可选italic斜体、oblique倾斜; `font-weight`字体粗细;`font-size-adjust`是否强制对文本使用同一尺寸;`font-stretch`是否横向拉伸变形字体;`font-variant`定义字体大小写  
另外也可属性也可合并来写`font: font-style font-weight/line-height font-family`  
> 文本类型  
`word-spacing`词间距; `letter-spacing`字符间距; `vertical-align`文本垂直对齐方式; `text-decoration`文本修饰线; `text-indent`文本首行缩进; `text-align`文本水平对齐方式; `line-height`文本行高; `text-transform`定义文本大小写; `text-shadow`文本阴影效果; `white-space`定义文本之间空白字符间距(空格、回车等); `direction`控制文本流入方向  
> 颜色属性  
`color`文本颜色  
  
### 文本阴影属性 text-shadow  

`text-shadow: color x-offset y-offset blur-radius`  
color阴影颜色，可选参数，若省略则采用文本颜色，x-offset、y-offset阴影在x、y轴上的偏移量，blur-radius阴影向外模糊的模糊半径  

### 溢出文本属性 text-overflow  

`text-overflow: clip | ellipsis`  
clip不显示省略符号;ellipsis文本溢出时显示省略标记(···)  
另外此属性还需要width(固定宽度)、white-space:nowrap(强制不换行)、overflow:hidden容器文本溢出时隐藏  

### 文本换行  

`word-wrap: normal | break-word`  
normal默认值，只在半角空格和连字符的地方换行;break-word在内容边界内换行，不截断英文单词  
`word-break: normal | break-all | keep-all`  
normal默认值，根据语言特点换行;break-all强行截断英文单词换行;keep-all不允许字断开  
`white-space: normal | pre | nowrap | pre-line | pre-wrap | inherit`  
normal默认值，空白处(包括回车)将被浏览器忽略;pre文本空白处将被浏览器展示;nowrap强制不换行直到碰到`<br/>`标签;pre-line合并空白符序列，但保留换行;pre-wrap保留空白序列。但正常进行换行;inherit继承父元素的对应属性  
  
## 颜色特性  

### 透明属性  

`opacity: alphaValue | inherit`  
alphaValue默认值为1，取值为0~1之间的浮点数，inherit继承父元素对应的属性值  
> 另外  
颜色的alpha通道也可以对元素设置透明度，针对元素的背景色、文字颜色、边框颜色等设置透明度，opacity则可以直接对整个元素设置透明度，并且属性能继承给后代，除此之外transparent可以给元素颜色设置完全的透明度，相当于alpha=0  
  
### 颜色模式  

css3支持的颜色模式有`rgba() hsl() hsla()`  
  
## 盒模型  

css有:inline,inline-block,block,table,absolute position,float几种盒模型，每个盒模型都由属性组合display,position,float等决定。  
盒模型的padding、content、background-image、background-color之间有不同的层次  
> 盒模型中的层次  
盒模型中的层次从顶到底依次为border;content+padding;background-image;background-color;margin;  
  
盒模型有W3C和传统IE两种解析模式  
> W3C解析模式  
外盒尺寸计算(元素空间尺寸)  
element空间尺寸 = 内容尺寸(height/width) + padding + border + margin  
内盒尺寸计算(元素大小)  
element大小 = 内容尺寸(height/width) + padding + border  
> IE传统解析模式  
外盒尺寸计算(元素空间尺寸)  
element空间尺寸 = 内容尺寸(height包含padding和border) + margin  
内盒尺寸计算(元素大小)  
element大小 = 内容尺寸(height包含padding和border)  

### 盒模型属性 box-sizing  

`box-sizing: content-box | border-box | inherit`  
content-box默认值使用W3C盒模型解析模式，border-box使用IE传统盒模型解析模式  

### 内容溢出属性 overflow-x/y  

`overflow-x/y: visible | hidden | scroll | auto | no-display | no-content`  
visible默认值不对内容做任何处理，元素将被剪切为包含对象的窗口大小，clip属性将失效，hidden内容溢出时，所有内容将隐藏，auto溢出时添加滚动条，scroll所有情况都添滚动条，no-display当元素溢出容器时不显示元素，相当于display:none；no-content当内容溢出时不显示内容  

### 自由缩放属性 resize  

`resize: none | both | horizontal | vertical | inherit`  
none用户不能拖动元素改变尺寸，both用户可以拖动改变宽高，horizontal/vertical可拖动改变宽/高，inherit继承父元素相应的属性  

### 外轮廓属性 outline  

外轮廓与border类似，但不占网页空间，且只有激活或获得焦点时呈现，形状不一定为矩形  
`outline: outline-color outline-style outline-width outline-offset inherit`  
outline创建的外轮廓线各边都一样没有outline-left等属性  
  
## 伸缩布局盒模型  

### 基本概念  

css中最基本的有块布局、行内布局、表格布局、定位布局四种布局模式,而css3中引入了flex布局使容器能够改变子元素，以最佳的方式填充空间。  
flex模型规范版本众多，主要有最老版本的`display:flex`混合版本`display:flex-box`标准版本`display:flex`  
  
### 新版flexbox模型的基本使用  

#### 伸缩容器  

`display: flex | inline-flex`  

#### 伸缩流方向  

`flex-direction: row | row-reverse | column | column-reverse`

#### 伸缩换行  

`flex-wrap: nowrap | wrap | wrap-reverse`  

#### 伸缩流方向和换行  

`flex-flow: flex-direction || flex-wrap`  
为前两个属性的缩写形式  

#### 主轴对齐  

`justify-content : flex-start | flex-end | center | space-between | space-around`  
space-between伸缩项目(子元素)会平均分布在行里，并占据起点终点位置；space-around伸缩项目(子元素)会平均分布在行里，在两端保留一半的间距空间  

#### 侧轴对齐 align-items,align-self  

align-items控制伸缩项目行在侧轴的对齐方式，align-self控制伸缩项目自身在侧轴的对齐方式；align-items可以想象为侧轴的justify-content  
`align-items: flex-start | flex-end | center | baseline | stretch`  
baseline伸缩项目根据伸缩项目的基线对齐;stretch默认值，伸缩项目拉伸填充整个伸缩容器  
align-self是伸缩项目的属性，对于匿名项目而言永远和容器的align-items值相同，如果伸缩项目在侧轴上的外边距为auto，则align-self属性失效，如果align-self设置为auto，则其值计算为容器的align-items(有值时)或stretch(容器未设置align-items时)  

#### 堆栈伸缩行 align-content  

`align-content: flex-start | flex-end | center | space-between | space-around | stretch`  
该属性只在flex-wrap:wrap的多行情况下生效  
> align-content 和 align-items的区别  
align-content和align-items都是设置在侧轴对齐的属性,不同的是align-items的基本单位是每一个子项,在大部分情况下有效,而align-content的基本单位是子项构成的行,仅在两种情况下有效果1,子项多行且flex容器高度固定有多余空间2,子项单行且flex容器高度固定有多余空间,且flex-wrap:wrap;  

### 伸缩项目(子元素)的属性  

#### 伸缩性 flex  

`flex: none | [flex-grow flex-shrink || flex-basis]`  
flex-grow扩展比率，默认值为0，若所有项目都为1则等比扩展，若有一个为2其他为1，则此元素的扩展空间为其他元素的2倍；flex-shrink收缩比率，默认值为1，其值与flex-grow类似；flex-basis伸缩项目的伸缩基准值(初始值单位px)  
  
[简写解析方式](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)  

#### 显示顺序 order  

`order: <number>`  
伸缩容器会从序号最小的组开始布局，不用的item可以有相同的order属性值将被视为同一分组，同一个分组里的item根据文档顺序布局  
  
## 多列布局  

### 多列布局的基本属性  

#### columns  

`columns: column-width || column-count`  
分别定义多列中的列宽和列数  

#### 列宽属性 column-width  

类似于给列定义一个min-width，语法`column-width: auto | length`  

#### 列数属性 column-width  

`column-count: auto | integer`  
当设置了auto值时，若列数计算出来不是整数，则会直接去余取整，若指定了数值，则显示数值指定的固定列数  

#### 多列布局间距属性 column-gap  

`column-gap: normal | length`  
和margin属性类似；normal默认值，通过浏览器设置解析，一般为1em，length浮点数字和标识符组成，不能为负值  
另外当多列参数之和超过容器总宽度时，会导致列被撑破，并将当前列自动减1，列宽自适应  

#### 列边框样式属性 column-rule  

`column-rule: column-rule-width | column-rule-style | column-rule-color`  
类似于border属性，上述属性也可以拆开分成三个来写，具体参考MDN和border属性。  
column-rule-width不占有任何空间位置，z轴介于background和content之间，宽度大于列间距时会自动消失  

#### 跨列属性 column-span  

`column-span: none | all`  
none默认不跨列，all元素跨越所有列，并在列的z轴之上  

#### 高度属性 column-fill  

`column-fill: auto | balance`  
定义多列中每列高度是否统一,auto默认值高度随内容变化而自动变化，balance高度将会根据内容最多的一列进行统一  
  
## 渐变  

在创建渐变过程中，可以指定多个中间色值，这些中间颜色值被称为色标，每个色标包含一个位置和一种颜色  

### 线性渐变  

`linear-gradient([angle | 位置关键词]， color-stop， [， color-stop])`  
第一个参数用于指定渐变角度，同时决定渐变颜色停止的位置，若省略则默认为to bottom，指定渐变方向可以使用角度也可以使用TRBL顺时针角度关键词，第二、第三个参数表示颜色的起点和终点,中间可插入多个颜色参数表明过渡色标，可以使用颜色关键词或rgba等模式。  

### 径向渐变  

`radial-gradient([[shape || size] [at position || at position]] color-stop [, color-stop])`  
position定义径向渐变的圆心位置；shape定义径向渐变的形状，主要包含两个值circle，ellipse；circle如何size和length大小相等径向渐变是一个圆形，ellipse径向渐变为椭圆；size用来确定径向渐变结束形状大小，默认值为farthest-corner,若shape设置为ellipse或省略，size可显式设置为长度值或百分比分别代表水平和垂直半径。  
color-stop类似于线性渐变的color-stop  

### 重复渐变  

使用repeating-linear-gradient和repeating-radial-gradient代替相应的属性实现重复渐变效果，其中百分比设置的色标位置将没有意义  
  
## 变形  

### 变形属性 transform  

transform指一组转换函数，可移动、缩放、旋转元素  
`transform:none | function1 [ function2...]`  
该属性可用于内联元素和块元素，参数中可以有一个到多个变形函数，以空格分割  

+ 2D变形函数  
translate()移动元素根据x，y轴重新定位元素位置，该函数有两个扩展函数translateX(),translateY()  
scale()放大或缩小元素，扩展函数scaleX(),scaleY()  
rotate()旋转元素  
skew()倾斜元素,扩展函数skewX(), skewY()  
matrix()定义矩阵变形，基于x轴和y轴坐标重新定位元素位置  
+ 3D变形函数  
translate3d()移动元素  
translate()指定3D位移在z轴的偏移量  
scale3d()缩放一个元素  
scaleZ()指定Z轴缩放向量  
rotate3d()指定元素具有一个三维旋转角度  
rotateX(), rotateY(), rotateZ()让元素具有一个旋转角度  
perspective()指定一个透视投影矩阵  
matrix3d()定义矩阵变形  

### transform-origin  

指定元素的中心点位置  
`transform-origin: 位置`  
位置支持1~3个数值或百分比或位置关键词，其中2个值时left,right为x轴位置关键词,top,bottom为y轴位置关键词;z轴不支持位置关键词  

### transform-style  

`transform-style: flat | preserve-3d`  
flat默认值，所有元素在2d平面展示  

### perspective  

透视，类似于视距指定观察者的位置，值越小用户与z平面的距离越近  
`perspective: none | length`  
none为默认值，length为大于0的值  
perspective属性用于变形元素的(容器)父元素上，perspective()函数则用于当前变形元素的transform上  

### perspective-origin  

`perspective-origin: <1~2个位置或方位关键词>`  
定义perspective的源点角度，该属性必须定义在父元素上  

### backface-visibility  

决定元素旋转背面是否可见`backface-visibility: visible | hidden`  
  
### 2D变形  

#### 位移函数  

`translate(tx, ty) //示例 transform: translate(100px, 0)`  

#### 缩放  

`scale(sx, sy)`沿x,y轴进行方法缩小，取负值时会让元素翻转再进行缩放  

#### 旋转  

`rotate(a)` 旋转角度可正可负，单位deg  

#### 倾斜  

`skew(ax, ay)`指定向x,y轴倾斜的角度  

#### 矩阵  

css3中的变形函数都可以通过矩阵来实现，2D矩阵总共提供6个参数`matrix(a,b,c,d,e,f)`对应矩阵如下：  
$\begin{bmatrix} a & c & e \\ b & d & f \\ 0 & 0 & 1 \\ \end{bmatrix}$  
通过矩阵变换规则$\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix}$=$\begin{bmatrix} a & c & e \\ b & d & f \\ 0 & 0 & 1 \\ \end{bmatrix}$$\begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$  

### 3D变形  

3d变形的属性值与2d的类似，仅多了一个z轴  
3d位移`translate3d(tx, ty, tz)`  
3d缩放`scale3d(sx, sy, sz)`需配合其他函数使用  
3d旋转`rotateX(a), rotateY(a), rotateZ(a)`指定绕x,y,z轴旋转a度，也可合并写`rotate3d(x, y, z, a)`x, y, z分别描述绕对应轴旋转的矢量值取0~1之间, a为元素在3d空间旋转的角度值  
3d矩阵`matrix3d()`其推算法是和2d的矩阵变换类似  
  
### 多重变形  

`transform: transform-function ... transform-function`该属性支持多重变形函数  
  
## 过渡  

过渡属性transition是一个复合属性`transition:transition-property || transition-duration || transition-timing-function || transition-delay [, transition-property || transition-duration || transition-timing-function || transition-delay]`  
主要包含:  
transition-property指定过渡或动态模拟的css属性  
transition-duration完成过渡所需时间  
transition-timing-function过渡函数  
transition-delay过渡开始出现的延迟时间  

### transition-property  

`transition-property: none | all | single-transition-property [, single-transition-property]`  
single-transition-property支持多种属性,background-color,border-color等  
支持的属性参见属性表  

### transition-duration  

`transition-duration: time [, time]`time单位s或ms,默认值为0,设置的值与transition-property对应  

### transition-timing-function  

`transition-timing-function: single-transition-timing-function [, single-transition-timing-function]`  
single-transition-timing-function主要包括:ease, linear, ease-in, ease-out, ease-in-out,三次贝塞尔曲线cubic-bezier(p0, p1, p2, p3),step  

### transition-delay  

`transition-delay: time [, time]`正整数时,元素过渡效果会在一定的延时后触发,负整数时,元素的过渡效果会从该时间点开始显示,之前的效果被截断  
  
### 触发过渡  

伪元素触发hover,active,focus,checked等触发方式  
媒体查询触发 如`@media only screen and (max-width: 960px)`  

### 过渡技巧  

css3的过渡是异步运行的,对于同一个属性,不同的浏览器可能会触发不同的TransitionEnd事件  
浏览器对于属性值取百分比时不支持动画效果,而取值为auto时,不同浏览器会有不同的行为  
当一个属性引起另一个属性的变化时,部分浏览器支持隐式过渡  
在元素从一种状态返回正常状态时可以设置"关闭"过渡效果  
对于webkit内核的浏览器,部分过渡效果会留下"痕迹",通过设置`-webkit-transform: translate(0);`属性利用translate(0)函数自带的硬件加速可消除"痕迹"  
  
## 动画  

动画通过声明关键帧,然后调用定义好的关键帧来实现  
动画属性animation是一个复合属性,包含了: animation-name,animation-duration,animation-timing-function,animation-delay,animation-iteration-count,animation-direction,animation-play-state,animation-fill-mode八个子属性  
  
### 关键帧  

定义关键帧，其中from相当于0%，to相当于100%，中间可以定义多种百分比，也可以通过","分隔的书写  

```css  
@keyframes <name> {  
  from {  
    /* css style */  
  }  
  percentage {  
    /* css style */  
  }  
  to {  
    /* css style*/  
  }  
}  
```  

在animation-name属性处指定关键帧名称即可调用定义好的关键帧  

### 动画子属性  

#### 调用动画 animation-name  

`animation-name: none | name [, name]`none为默认值name需与定义的name相同,可指定多个name  

#### 动画播放时间 animation-duration  

`animation-duration: time [, time]`与transition-duration类似,负值会被视为0  

#### 动画播放方式 animation-timing-function  

使用方法类似[transition-timing-function](#transition-timing-function)  

#### 动画开始播放时间 animation-delay  

与[transition-delay](#transition-delay)类似  

#### 动画播放次数 animation-iteration-count  

`animation-iteration-count: infinite | number [, infinite/number]`定义动画播放多少次,默认为1,如果取值为infinite则会无限次播放  

#### 动画播放方向 animation-direction  

`animation-direction: normal | alternate | [, normal/alternate]`默认值为normal每次循环向前播放,alternate偶数次向前播放,奇数次向反方向播放  

#### 动画播放状态 animation-paly-state  

`animation-paly-state: running | paused [, running | paused]` running为默认值类似于音乐播放器  

#### 动画时间外的属性 animation-fill-mode  

`animation-fill-mode: none | forwards | backwards | both`定义元素动画开始前和结束后的操作  
none默认值,动画将正常进行和结束,完成最后一帧后将反转至初始帧处  
forwards动画结束后保持最后一帧  
backwards动画开始前应用第一帧  
both同时具有这两种效果  
  
## 媒体特性和responsive设计  

w3c共列出了10中媒体类型:All所有设备,Braille盲人用点字法触觉回馈设备,embossed盲文打印机,handheld便携设备,print打印用纸或打印预览图,projection各种投影设备,screen显示器,speech语音或音频合成器,tv电视机类型设备,tty电传打字机  
其中screen,all,print最为常用  

### 引用方法  

link方法通过在`<link media="screen">`标签中引用媒体类型,从而在不同的媒体类型上应用不同的样式  
xml方式与link方式类似  
@import方式`@import url(***) all`  
@media方式,此方式为css3新引进的方式,使用方法`@media screen { 选择器 { /*ccs code*/ }}`  

### 媒体特性  

媒体特性可以看做是媒体类型和css过滤结合的增强版  
示例:`@media screen and (max-width:600px) {}`  
常用的css媒体特性:(min/max)-color每种色彩的字节数,(max/min)-device-(height/width/aspect-ratio),(max/min)-(height/width)等  
通过and连接可以同时使用多个媒体特性;not用于排除其后表达式的特性;only用来指定特定的媒体类型,排除不支持媒体查询的浏览器  

### responsive布局概念  

将弹性网格布局,弹性图片,媒体和媒体查询整合起来命名为RWD(responsive web design响应式设计)  

#### 重要概念(废话)  

+ 流体网格  
  每个网格使用百分比为单位来控制大小,让网格随屏幕尺寸相应缩放  
+ 弹性图片  
  不给图片设置固定尺寸,而是根据流体网格进行缩放  
+ 媒体查询  
  通过媒体查询匹配对应的css样式  
+ 屏幕分辨率  
+ 主要断点  
  设置宽度临界点,创建媒体查询条件,每个断点对应一种样式  

#### meta标签  

许多智能手机为保证显示效果都是用了一个比实际屏幕尺寸大很多的虚拟可视区域，而插入`<meta name="viewpoint" content=""/>`标签可以自定义界面可视区域的尺寸和缩放级别  
content属性的值有:width/height可视区域的宽/高,值可以是数字或关键字device-width/height;initial-scale页面首次显示时可视区域的缩放级别;minimum/maximum-scale可视区域的最小/大缩放级别,表示用户能将页面缩小/放大的最小/大程度;user-scalable指定用户能否对页面进行缩放  
示例:禁止默认的自适应页面效果`<meta name="viewpoint" content="width=device-width,initial-scale=1.0"/>`  
另外可通过追加脚本的方式让IE9以下的浏览器支持CSS3 Media Queries媒体特性  
  
## 嵌入web字体  

```css  
@font-face {  
  font-family: <自定义的字体名称>;  
    src: 字体路径 | 字体格式 [, 字体路径 | 字体格式];  
      [font-weight: weight];  
        [font-style: style];  
}  
```  

@font-face的使用类似与@keyframe，@font-face中font-family和src是必须的，而使用时在元素的font-family属性指定相同的名称即可  
src声明的常见字体格式有ttf,otf,woff,eot,svg等  

### 调用字体  

可以使用h5定义的data-icon,如:`<div aria-hidden="true" data-icon="&#x67"></div>`  
