# 实现简单的mustache

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
  <script>
    class Mustache {
      static parseTemplateToTokens(str){ // 将token分词
        let tokens = [];
        let scanner = new Scanner(str); // 新建辅助扫描类
        let words;
        while(!scanner.isEnd()){ // 未扫描到终点则继续递归
          words = scanner.scan('{{'); // 获取'{{'之前的字符
          if (words != ''){ // 处理非标签内的空格，保留如<div class="">中的空格
            let inLabel = false;
            let _words = '';
            for(let i = 0; i < words.length; i++){
              if(words[i] === '<') {
                inLabel = true;
              }else if (words[i] === '>') {
                inLabel = false;
              }
              if(!/\s/.test(words[i])){
                _words += words[i];
              } else if (inLabel) { // 检测到空格且位于标签内，则保留空格
                _words += ' ';
              }
            }
            tokens.push(['text', _words])
          }
          scanner.skip('{{'); // 跳过对'{{'的扫描
          words = scanner.scan('}}'); // 此时获取的是'{{}}'中的字符串
          if(words !== ''){
            if(words[0] === '#'){ // 模板中循环开始标志
              tokens.push(['#', words.substring(1)]);
            } else if (words[0] === '/'){ // 模板中循环结束标志
              tokens.push(['/', words.substring(1)]);
            } else {
              tokens.push(['name', words]);
            }
          }
          scanner.skip('}}');
        }
        return Mustache.nestTokens(tokens); // 处理循环，形成父子结构
      }
      static nestTokens(tokens){ // 处理模板中的循环，形成父子结构
        let nestedTokens = []; // 父子结构结果容器
        let sections = []; // 辅助栈，仅存储模板中的循环token
        let collector = nestedTokens; // 收集器指针
        for(let i = 0; i < tokens.length; i++){
          let token = tokens[i];
          switch(token[0]){
            case '#': // 发现模板中循环开始标志
              collector.push(token); // 存入向上级容器中存入token
              sections.push(token); // 入栈token
              collector = token[2] = []; // 在当前token上创建空的容器，并让收集器指向它
              break;
            case '/': // 循环结束标志
              sections.pop(); // 辅助栈出栈
              collector = sections.length > 0 ? sections[sections.length - 1][2] : nestedTokens; // 收集器指针指向父级token的容器
              break;
            default:
              collector.push(token);
          }
        }
        return nestedTokens;
      }
      static renderTemplate(tokens, data) { // 将tokens和data结合生成新html字符串
        let result = '';
        for(let i = 0; i < tokens.length; i++){
          let token = tokens[i];
          if(token[0] === 'text'){
            result += token[1];
          } else if (token[0] === 'name') { // 检测到token变量节点，使用变量进行替换
            result += Mustache.lookup(data, token[1]);
          } else if (token[0] === '#') { // 检测到token循环节点，递归处理
            result += Mustache.parseArray(token, data);
          }
        }
        return result;
      }
      /**
       * @description: 使用连点号在对象中查找深层次的属性如 lookup(obj, 'a.b.c') => obj.a.b.c
       * @param {Object} obj
       * @param {String} keyName
       * @return {any}
       */
      static lookup(obj, keyName) {
        if(keyName.indexOf('.') != -1 && keyName != '.') {
          let keys = keyName.split('.');
          let temp = obj;
          for(let i = 0; i < keys.length; i++){
            temp = temp[keys[i]];
          }
          return temp;
        }
        return obj[keyName];
      }
      static parseArray(token, data) {
        let v = Mustache.lookup(data, token[1]); // 取得变量数组
        let result = '';
        for(let i = 0; i < v.length; i++){ // 递归的处理循环节点
          result += Mustache.renderTemplate(token[2], {
            ...v[i], // 将变量数组的第i项展开，并进行拼接
            '.': v[i] // 支持模板循环中使用'.'号引用数据
          });
        }
        return result;
      }
      static test() {
        let templateStr = `
          <div>
            <ul>
              {{#students}}
              <li class="myli">
                学生{{name}}的爱好是
                <ol>
                  {{#hobbies}}
                  <li>{{.}}</li>
                  {{/hobbies}}
                </ol>
              </li>
              {{/students}}
            </ul>
          </div>
        `;
        let data = {
          students: [
            { 'name': '小明', 'hobbies': ['编程', '游泳'] },
            { 'name': '小红', 'hobbies': ['看书', '弹琴', '画画'] },
            { 'name': '小强', 'hobbies': ['锻炼'] }
          ]
        };
        let tokens = Mustache.parseTemplateToTokens(templateStr);
        let domStr = Mustache.renderTemplate(tokens, data);
        let dom = document.querySelector('#app');
        dom.innerHTML = domStr;
      }
    }
    class Scanner { // 辅助扫描类
      constructor(str){
        this.templateStr = str;
        this.pos = 0;
        this.tail = str;
      }
      scan(tag){ // 扫描并返回当前位置到指定分隔符之间的子字符串
        const start = this.pos;
        while(!this.isEnd() && this.tail.indexOf(tag) != 0){
          this.pos++;
          this.tail = this.templateStr.substring(this.pos);
        }
        return this.templateStr.substring(start, this.pos);
      }
      skip(tag){ // 如果剩余字符串以tag开头则跳过tag长度
        if(this.tail.indexOf(tag) === 0){
          this.pos+= tag.length;
          this.tail = this.templateStr.substring(this.pos);
        }
      }
      isEnd() { // 判断是否扫描完成
        return this.pos >= this.templateStr.length;
      }
    }
    Mustache.test();
  </script>
</body>
</html>
```