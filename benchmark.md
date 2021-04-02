# 源代码与 Bytecode 性能测试

有人提出 Bytecode 方案可能会阻止 V8 进行进一步优化，的确是一个值得探究的问题。

测试采用 [web-tooling-benchmark](https://github.com/v8/web-tooling-benchmark), 测试脚本见 `benchmark/benchmark.js`

## 测试环境

* CPU: i5 10600KF @ 4.5 GHZ
* 内存: 32GB DDR4 @ 2666 MHZ

操作系统选择两个主要平台
  
* Windows 10 20H2, Node v12.20.1
* 虚拟机：Linux Mint @ 5.4.0-70-generic, Node v12.18.3

## 测试结果

### Windows

Source Code

```
Running Web Tooling Benchmark v0.5.3…
-------------------------------------
         acorn: 12.51 runs/s
         babel: 11.39 runs/s
  babel-minify: 14.08 runs/s
       babylon: 15.43 runs/s
         buble:  7.41 runs/s
          chai: 17.12 runs/s
  coffeescript: 10.79 runs/s
        espree: 11.21 runs/s
       esprima: 12.74 runs/s
        jshint: 13.48 runs/s
         lebab: 16.62 runs/s
       postcss: 10.88 runs/s
       prepack: 10.79 runs/s
      prettier: 10.18 runs/s
    source-map: 14.09 runs/s
        terser: 25.17 runs/s
    typescript: 12.04 runs/s
     uglify-js:  7.67 runs/s
-------------------------------------
Geometric mean: 12.47 runs/s
Total Time:  66153.1834
```

Bytecode

```
Running Web Tooling Benchmark v0.5.3…
-------------------------------------
         acorn: 12.24 runs/s
         babel: 11.21 runs/s
  babel-minify: 14.23 runs/s
       babylon: 15.40 runs/s
         buble:  7.59 runs/s
          chai: 16.76 runs/s
  coffeescript: 10.96 runs/s
        espree: 11.38 runs/s
       esprima: 12.26 runs/s
        jshint: 13.88 runs/s
         lebab: 15.82 runs/s
       postcss: 10.43 runs/s
       prepack: 10.34 runs/s
      prettier: 10.17 runs/s
    source-map: 13.48 runs/s
        terser: 25.54 runs/s
    typescript: 12.06 runs/s
     uglify-js:  7.35 runs/s
-------------------------------------
Geometric mean: 12.32 runs/s
Total Time:  65883.3875
```

### Linux

Source Code

```
Running Web Tooling Benchmark v0.5.3…
-------------------------------------
         acorn: 13.70 runs/s
         babel: 10.08 runs/s
  babel-minify: 12.61 runs/s
       babylon: 13.24 runs/s
         buble:  7.09 runs/s
          chai: 19.11 runs/s
  coffeescript:  9.26 runs/s
        espree:  9.54 runs/s
       esprima: 10.49 runs/s
        jshint: 11.13 runs/s
         lebab: 14.13 runs/s
       postcss:  8.72 runs/s
       prepack:  9.68 runs/s
      prettier:  9.50 runs/s
    source-map: 12.44 runs/s
        terser: 21.69 runs/s
    typescript: 10.66 runs/s
     uglify-js:  6.12 runs/s
-------------------------------------
Geometric mean: 11.09 runs/s
Total Time:  75290.159915
```

Bytecode

```
Running Web Tooling Benchmark v0.5.3…
-------------------------------------
         acorn: 13.73 runs/s
         babel:  9.81 runs/s
  babel-minify: 11.91 runs/s
       babylon: 12.27 runs/s
         buble:  7.07 runs/s
          chai: 17.79 runs/s
  coffeescript:  9.33 runs/s
        espree:  9.32 runs/s
       esprima: 10.54 runs/s
        jshint: 10.86 runs/s
         lebab: 14.08 runs/s
       postcss:  8.74 runs/s
       prepack:  9.04 runs/s
      prettier:  9.34 runs/s
    source-map: 11.19 runs/s
        terser: 21.02 runs/s
    typescript:  9.82 runs/s
     uglify-js:  6.37 runs/s
-------------------------------------
Geometric mean: 10.77 runs/s
Total Time:  75681.460331
```

## 结论

Bytecode 运行性能与源码持平，差异可视作误差， 在 require 环节有微弱性能优势。