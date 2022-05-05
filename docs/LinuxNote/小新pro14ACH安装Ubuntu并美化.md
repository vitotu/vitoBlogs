# 小新pro14锐龙版安装Ubuntu

码农一名，新买了个小新pro14的R7版本，想着用来做生产力工具，平时不怎么玩游戏，就准备装个win10、Ubuntu双系统，平时用Ubuntu作为主力系统敲代码  
win10就不说了，关于Ubuntu网上搜索相关教程，说是R7-5800还太新，Ubuntu的支持不是太好，键盘/触控板/网卡等失灵问题，而对应的解决方案大都是升级内核，因此准备一步到位直接安装Ubuntu21.04版本

## Ubuntu 21.04安装

+ 1、在win10系统上压缩出120G的磁盘大小给Ubuntu安装系统(磁盘管理器-->压缩卷)
+ 2、关闭win10快速重启功能(电源-->电源计划-->更改不可编辑项)
+ 3、在Ubuntu官网上现在Ubuntu21.04的iso文件，准备一个U盘按照官网[教程](https://ubuntu.com/tutorials/create-a-usb-stick-on-windows#1-overview)创建启动盘
+ 4、做好启动盘后，插入u盘，在启动电脑的时候按f12，选择从u盘中启动系统，即可进入Ubuntu的安装界面，点击试用Ubuntu，先简单体验下，确认有没有什么明显的bug
+ 5、开始安装Ubuntu
+ 6、安装成功后,调试硬件基本没有什么问题，屏幕亮度被默认为最高/最低,通过屏幕亮度快捷键也能够调整屏幕亮度，其他硬件上触控板、键盘、屏幕、充电、wifi等都没有网上所说的问题，看来新笔记本还是要配新系统。
+ 7、配置系统(双系统时间同步问题，软件源配置、开机自动加载win10系统的磁盘)

### 硬件问题

> 蓝牙无法开启可尝试执行下面的命令

```code
sudo rmmod btusb
sleep 1
sudo modprobe btusb
```

## 常用软件安装

+ 中文输入法：中文输入法我选择的是搜狗的linux版本，首选需要先安装fcitx小企鹅输入法框架，然后去搜狗官网下载最新的适配20.04版本的输入法，```sudo dpkg -i <包名>```即可安装
+ chrome，虚拟机选用kvm，wps的linux版，vim，git，网易云音乐
+ kvm虚拟机主要参考这篇[文章](https://cloud.tencent.com/developer/article/1657533)
+ 开发环境软件vscode、node、vue、nginx、jdk，及环境变量，包源配置

## 系统美化

系统美化主要参考这篇[文章](https://zhuanlan.zhihu.com/p/176977192)

```bash
sudo apt update
sudo apt install gnome-tweaks chrome-gnome-shell
sudo apt install gtk2-engines-murrine gtk2-engines-pixbuf 
sudo apt install sassc optipng inkscape libcanberra-gtk-module libglib2.0-dev libxml2-utils
sudo apt install gnome-tweak-tool gnome-shell-extensions
```
