# draw-something

> You draw and I guess

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## TODO

- [x] canvas实现画基本线条
- [x] 选择线条宽度,颜色
- [x] 撤销上一笔&清空画布
- [x] 保存图片
- [ ] 多图片缓存, 保存 ( 拼接生成长图 )
   
- [ ] WebSocket同步作画路径
- [ ] WebSocket同步撤销等操作
- [ ] WebSocket实现作答和正确错误提示
- [ ] 实现答题计分
- [ ] 实现鲜花＆鸡蛋
- [ ] 实现文字聊天
   
- [ ] 发送预设图案
- [ ] 发送自选图片
- [ ] 自选图片支持变换 : 轮廓画/灰度画..