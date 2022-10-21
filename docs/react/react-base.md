# react基础教程

[v18.2.0版本文档](https://zh-hans.reactjs.org/docs/hello-world.html)

## 核心概念

### jsx

jsx时js的一个扩展与，允许在js中书写xml的语法，是react官方推荐的写法  
TODO：jsx的优缺点  

在jsx中通过`{}`使用js表达式(任意有效的js表达式均可), 如:`const count = <div>{1+1}</div>`  
jsx本身也是表达式，可以赋给变量或作为函数的返回值  
在jsx中指定属性也可通过`{}`使用js表达式，属性名称采用js风格的小驼峰，如:`class` => `className`  
React DOM 在渲染所有输入内容之前，默认会进行转义,防止XSS攻击  
在底层Babel会把jsx转义为`React.createElement()`函数调用，即创建虚拟DOM的函数  

### 元素渲染

React构建的应用通常时单根节点，挂载示例:

```jsx
const root = ReactDOM.createRoot(document.getElementById('css 选择器'));
const element = <h1>Hello, world</h1>;
root.render(element); // 更新时重新调用render即可
// React会自定比元素的更新和之前的状态，仅更新需要变更的部分
```

### 组件和Props

在React中组件更像是js函数，接收任意入参props，并返回React元素  
通过function来定义的组件被称为函数式组件，通常使用class来定义组件，如：

```jsx
function Welcome(props){  // 函数式组件
  return <div>{props.name}</div>
}
class CustomComponent extends React.Component { // 普通自定义组件
  render(){ // 通过render方法(渲染函数)，返回React元素
    return (<div>you dom， {this.props.name}</div>)
  } // 除render外还可添加其他属性
}
const element = <Welcome name="Sara"/> // jsx中的属性及子组件都会传递给props对象
```

PS：props不应该在组件内被修改  

### State和生命周期

State与props类似，但state是私有的, 一个定时器组件的例子  

```jsx
class Clock extends React.Component {
  constructor(props){ // 组件被传递给render使会调用构造函数
    super(props); // class组件应始终使用props参数调用父类构造函数以继承属性和方法
    this.state = {date:new Date()}; // 初始化state
  }
  componentDidMount(){ // 组件首次被渲染到DOM中(挂载)时调用
    this.timerID = setInterval(()=>this.tick(), 1000);
  } // 挂载时设置定时器，并记录id
  componentWillUnmount(){ // 组件被从DOM中删除(卸载)时调用
    clearInterval(this.timerID);
  } // 卸载时根据id清除定时器
  tick(){ // 除React规定的属性方法外可自定义任意属性方法
    this.setState({date:new Date()}); // setState方法用于更新state
  }
  render(){
    return (
      <div>It is { this.state.date.toLocaleString()}.</div>
    )
  }
}
```

不可直接修改state，直接修改不会重新渲染组件，而应该使用setState方法更新状态，setState是通过浅合并对象的方式更新数据  
setState的更新可能是异步的，为提升性能多个setState可能被合并成一个调用  
若依赖this.props和this.state的值更新下一个状态，请通过给setState传递一个函数，在函数中返回新的状态  
React同vue一样也是单向数据流的  

### 事件处理

React事件命名采用小驼峰`<button onClick={this.handleClick}>click me</button>`，这里的`this.handleClick`通常是自定义组件的方法  
向事件处理函数传递额外的参数`(e)=>this.handleClick(params, e)`或`this.handleClick.bind(this, params)`  

### 条件渲染

jsx表达式中`{}`同样也支持jsx表达式嵌套，因此可以通过if-else、&&、三目运算符等方式实现有条件的渲染，当render函数返回null时，该组件也不会被渲染

### 列表和key

```jsx
const numbers = [1,2,3,4,5];
const listItems = <ul>{
    numbers.map(num=><li key={num.toString()}>{num}</li>)
  }</ul>
```

## 高级指引

## Hook
