#!/usr/bin/env sh
# 增量更新发布
# TODO：配合增量打包
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
# cd docs/.vuepress/dist

# 如果不存在，则创建发布目录，并进入该目录
DIR="./dist/"
[ ! -d "$DIR" ] && mkdir -p "$DIR"

cd ./dist
# 若.git目录不存在则拉取发布项目，构建目录
workdir=$(pwd)
if [ ! -d ".git" ]; then
  git clone git@github.com:vitotu/vitotu.github.io.git
  cp -rf vitotu.github.io/. ./
  rm -rf vitotu.github.io
  git config --global --add safe.directory "$workdir"
fi
# 拉取更新
git pull
# 复制打包文件到当前目录
rm -rf ./*
cp -rf ../docs/.vuepress/dist/. ./
# 如果是发布到自定义域名
# echo 'www.yourwebsite.com' > CNAME

# git init
git add -A
git commit -m 'deploy'

# 如果你想要部署到 https://USERNAME.github.io
# git push -f git@github.com:vitotu/vitotu.github.io.git master
git push origin master

# 如果发布到 https://USERNAME.github.io/<REPO>  REPO=github上的项目
# git push -f git@github.com:USERNAME/<REPO>.git master:gh-pages

cd -