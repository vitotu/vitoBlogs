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

- state

不可直接修改state，直接修改不会重新渲染组件，而应该使用setState方法更新状态，setState是通过浅合并对象的方式更新数据  
setState的更新可能是异步的，为提升性能多个setState可能被合并成一个调用  
若依赖this.props和this.state的值更新下一个状态，请通过给setState传递一个函数，在函数中返回新的状态  
React同vue一样也是单向数据流的  

- 生命周期

定时器例子中，在将Clock传递给render时，constructor首先调用，其次时Clock的render函数，当Clock组件被挂载到DOM上时，componentDidMount调用，当被从DOM上移除时componentWillUnmount调用  
TODO：完善生命周期

### 事件处理

React事件命名采用小驼峰`<button onClick={this.handleClick}>click me</button>`，这里的`this.handleClick`通常是自定义组件的方法  
在`{}`中，若传递的回调函数中想通过this引用当前组件，如调用`this.setState`方法等, 需要进行特殊处理，如下例：

```jsx
class Demo extends React.Component {
  constructor(props){
    super(props);
    // 通常定义的方法引用this，需要通过bind绑定this
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){this.setState({})} // 回调函数中引用了this
  // 或定义为属性，并利用箭头函数保存this
  // handleClick = () => console.log('this is: ', this);
  render(){
    return ( // 或绑定时使用箭头函数包装
      <button onClick={()=>this.handleClick()}>click</button>
    )
  }
}
```

向事件处理函数传递额外的参数`(e)=>this.handleClick(params, e)`或`this.handleClick.bind(this, params)`  

### 条件渲染

jsx表达式中`{}`同样也支持jsx表达式嵌套，因此可以通过if-else、&&、三目运算符等方式实现有条件的渲染，当render函数返回null时，该组件也不会被渲染

### 列表和key

```jsx
const numbers = [1,2,3,4,5];
const listItems = <ul>{ // 表达式中支持map的方式渲染列表
    numbers.map(num=><li key={num.toString()}>{num}</li>)
  }</ul>
```

列表渲染需要给子元素绑定一个独一无二的key用于react高效的渲染与更新，key在兄弟节点中必须独一无二，在不同的列表渲染之间则可以重复

### 表单

- 基本示例

```jsx
class NameForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {value:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){ this.setState({value:event.target.value});}
  handleSubmit(event){
    alert('提交的名字' + this.state.value);
    event.preventDefault();
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:<input type="text" value={this.state.value} onChange={this.handleChange}/>
        </label>
        <input type="submit" value="提交"/>
      </form>
    );
  }
}
```

- textarea标签

在html中`<textarea>通过子元素定义文本</textarea>`，在react中则使用value属性代替

- select标签

select标签通过value绑定选中的值，同时option上selected属性失效

```jsx
const demo = (
  <select value={this.state.value} onChange={this.handleChange}>
    <option value="grapefruit">葡萄柚</option>
    <option value="lime">酸橙</option>
  </select>
)
```

::: tip 需要注意的点
当处理多个输入时，通常给组件绑定name属性，然后通过event.target.name取出name属性，借用name作为变量更新对应的state值`this.setState({[name]:value})`  
在受控组件上传入不为undefined或null的prop设置value，会阻止用户更改输入  
以上介绍的组件均为受控组件，即可以通过state管理其状态。另一类非受控组件如`<input type="file">`，详见  
TODO：补充非受控组件  
:::

### 状态提升

在没有共享状态库的情况下，共享的state通常需要提升到公共父组件中，并通过prop传参的方式传递对应的state和修改state的方法给子组件。以维护React的单向数据流  

### 组合和继承

React推荐使用组合而不是继承的方式实现组件间的代码复用  

- 包含关系

在使用子组件时，子组件标签包裹的所有内容都会作为一个prop属性传递给子组件，子组件中通过`props.children`进行引用，与vue的默认插槽类似  
至于命名插槽等方式可以通过prop传参的方式传递React元素的方式实现  

## 高级指引

## Hook

Hook 可以在不写class的情况下使用state和一塔react特性  
