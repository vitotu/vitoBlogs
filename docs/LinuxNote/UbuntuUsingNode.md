# Linux使用笔记

以Ubuntu为例

## Ubuntu配置

### ubuntu环境变量

设置环境变量有四个地方
/etc/profile  : 所有用户login shell载入配置
~/.profile    : 当前用户login shell载入配置
/etc/bash.bashrc ： 所有用户non-login shell载入配置
~/.bashrc     : 当前用户non-login shell载入配置

#### shell模式

+ 交互式login shell：需要登录的输入命令立即反馈输出的shell
+ 非交互式login shell：需要登录但不与用户进行交互的shell(运行shell脚本)
+ 交互式non-login shell：不需要登录的输入命令立即反馈输出的shell
+ 非交互式non-login shell：不需要登录但不与用户进行交互的shell(运行shell脚本)

通常用户打开shell为交互式shell，输入命令立即反馈输出，而非交互式则是shell脚本运行的环境

用户初次登录系统时会生成login shell扫描依次/etc/profile;~/.bash_profile;~/.bash_??;~/.profile;等文件载入初始的环境变量等配置

当用户使用gui打开新的shell时通常打开的时交互式non-login shell(不需要登录)，此时系统会在登录的环境变量基础上扫描/etc/bash.bashrc;~/.bashrc文件载入环境变量等配置

另外针对某个shell，若增加了环境变量，但没有删除，则该变量将会一直存在与此shell环境中，因此从bashrc文件中删除环境变量定义的代码，并运行source bashrc命令后该环境变量将不会消失，但重新打开新的shell时会重新载入bashrc文件，因此该变量将不存在于新的shell

判断当前shell是login shell 或non-login shell的方法：在当前shell运行指令```echo $0```若返回结果为-bash则为login shell，若是bash时则是non-login shell

另外/etc/profile还会直接运行/etc/profile.d目录下的所有非交互式.sh脚本文件，~/.profile文件也会载入~/.bashrc文件中的配置

其中/etc/profile需重启或注销生效，若使用```source /etc/profile```指令，仅对当前shell立即生效，~/.profile相同

而/etc/bash.bashrc使用source指令后立即生效，~/.bashrc相同

/etc/bash.bashrc的设置针对所有用户包括超级用户su;~/.bashrc仅针对当前用户有效

/etc/profile的设置实测仅针对登录用户有效

其中/etc/profile中指定运行/etc/profile.d/目录(若存在)下的所有非交互式sh脚本也可进行环境变量修改

#### 特殊的shell变量

结合语句案例解析：`if [ "${-#*i}" != "$-"]`  
此与语句用于判断当前shell是否不是交互式shell,`$-`是特殊变量，官方文档中定义为：
>(Hyphen.) Expands to the current option flags (the single-letter option names concatenated into a string) as specified on invocation, by the set special built-in command, or implicitly by the shell.

[参考文献](https://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html#tag_02_05_02)  
如`echo $-`可能输出himBHs，表示当前shell的-h,-m,-B,-H选项启用,而-i表示可交互式shell,-s表示从标准输入读取数据  
而`echo "${-#*i}"`是对参数"-"进行操作，官方文档定义的模式:
> ${parameter#[word]}
>> Remove Smallest Prefix Pattern. The word shall be expanded to produce a pattern. The parameter expansion shall then result in parameter, with the smallest portion of the prefix matched by the pattern deleted. If present, word shall not begin with an unquoted '#'.

> ${parameter##[word]}
>> Remove Largest Prefix Pattern. The word shall be expanded to produce a pattern. The parameter expansion shall then result in parameter, with the largest portion of the prefix matched by the pattern deleted.

[参考文献](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_02)，该语句将删除-中的前缀直到遇到第一个i(删除部分包括i)

#### 代理配置

编辑/etc/profile文件将对所有用户生效
profile中shell命令将引导运行profile.d目录中的所有sh脚本
因此也可以将代理配置写到profile.d目录中的shell脚本中

通过设置all_proxy、ftp_proxy、http_proxy、https_proxy、no_proxy并export这些环境变量来设置系统上网代理服务器

### 网络篇

curl可用于模拟get、post请求等网络请求

查看网络端口占用情况`netstat -ntlp`

### 其他

挂起后台运行指定的脚本`nohup  <脚本及运行参数>  > <输出log文件> 2>&1 &`，示例：  
后台挂起test.py程序  
`nohup test.py --arg1 > runlog.out 2>&1 &`
挂起test.py程，将运行log输出到runlog.out文件中，将标准错误(2)重定向(>)标准输出(&1)中也就是屏幕上，组合起来即为2>&1  

### shell编程

获取shell表达式的输出并重定向到a变量中  
```a=$(<shell表达式>)```  
判断路径下是否有该目录存在  

```bash
if [ -d <某路径目录> ]
then
  echo "目录存在"
else
  echo "目录不存在"
fi
```

#### xargs指令

将标准输入转换为命令行参数，`|`管道连接符将左侧的标准输出连接到右边的标准输入，但部分命令行工具不支持标准输入作为参数，仅支持命令行参数，因此xargs通常与管道符一起使用  
如：`echo "output" | xargs echo`，xargs调用形式为`xargs [-options] [command]`  
单独使用xargs命令等同于`xargs echo`并等待用户输入，按下ctrl+d结束输入，并输出用户输入的内容  
xargs默认使用空格`\s`和换行符`\n`作为分隔符，拆分标准输入为多个命令行参数，通过`-d`参数可更改分隔符

## ubuntu下mysql8.0的使用

### 忘记root密码解决方案

使用系统提供的临时账户登录去修改root账户密码：
```sudo cat /etc/mysql/debian.cnf```
复制其中的账户名和密码进行登录

```code
alter user 'root'@'localhost' identified with mysql_native_password by '新密码';
flush privileges; --立即刷新进内存 
```

### 其他账户管理

创建账号和密码
```create user '用户名'@'ip地址' identified by '密码';```
开放账户全部权限
```grant all on *.* to '用户名'@'ip地址' with grant option;```
删除权限
```revoke all privileges on 数据库名.表名 from '用户名'@'ip地址';```
删除用户
```drop user '用户名'@'ip地址'```

## docker

常用命令：

```shell
docker pull <镜像名> # 拉取镜像
docker run -it 
docker build
docker push
docker exec -it <容器id> /bin/bash # 以交互式shell的方式进入正在运行的容器
docker cp <本地文件路径> <容器id>:<容器路径> # 向docker容器中复制本机文件
```

[参考文档](https://yeasy.gitbook.io/docker_practice)

## ssh

### ssh配置代理访问github

+ win10环境: ~/.ssh/config 文件中添加以下内容(程序路径替换为自己的git安装路径)

```.ssh/config
Host github.com
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p
```

其中：
`Host github.com` ： 仅github使用该代理
`-S` 选项指sock协议默认sock5，指向代理服务器ip及端口

+ Ubuntu环境: ~/.ssh/config 文件中添加以下内容

```.ssh/config
Host github.com
	User git
	ProxyCommand nc -X 5 -x 192.168.9.100:10808 %h %p
```

利用了nc进行代理，其中
`-X 5` 参数表示选定了sock5作为通信协议

## ubuntu搭建微信小程序开发环境
