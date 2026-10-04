# Pot-App 有道翻译插件

为 [Pot](https://github.com/pot-app/pot-app) 提供的有道翻译 (`jsonapi_s`) 接口插件。

## 功能

- 支持句子、段落与单词翻译，统一返回纯文本结果

## 使用方法

1. 下载 [Release](https://github.com/LKIQBoost/pot-app-translate-plugin-yd/releases) 中的 `plugin.com.LKIQBoost.youdao.potext`
2. 在 Pot 中依次点击 `首选项` -> `服务` -> `翻译` -> `添加外部插件`，选择下载的 `.potext` 文件
3. 将 `有道翻译` 加入翻译服务即可使用

## 接口说明

请求地址：`https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4`

签名参数生成逻辑：

```text
keyfrom = "webfanyi.webmain"
client  = "webmain"
secret  = "t2he2k4m2g6QKRigK0KAmSpXKgAezywG"

flag    = (q + keyfrom).length % 10
t       = Date.now() + flag
digest  = md5(q + keyfrom)
sign    = md5(client + q + t + secret + digest)
```

请求参数：`q`、`from`、`to`、`sign`、`t`、`client`、`keyfrom`。

## 开发

```bash
zip plugin.com.LKIQBoost.youdao.potext info.json youdao.svg main.js
```

或直接推送至 GitHub，由 Actions 自动打包。
