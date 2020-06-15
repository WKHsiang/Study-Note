# Webpack笔记

1. 打包出 开发环境 / 生产环境
```
{
    ...
    "scripts": {
        "build": "webpack --mode=production",
        "dev": "webpack --mode=development"
    }
    ...
}
```