# electron-modbus-slave
一个跨平台的`Modbus`从机模拟器

## 安装
```
# 克隆本项目到本地
git clone git@github.com:fiyc/electron-modbus-slave.git 

# 安装依赖库
cd electron-modbus-slave
npm install

# 编译运行程序
npm run-script package:linux|package:mac|package:win

可执行文件目录 ./out
```

## 功能
* Mosbus 从机服务
* 同步显示模拟寄存器内容
* 设置模拟寄存器值
* 自动变化模拟寄存器值
    - 自定义变化周期
    - 自定义变化类型(递增， 固定范围内随机变化)

## 注意
1. `Coil`与`DiscreteInput`支持最大长度为 `2048`
2. `HoldingRegister`与`InputRegister`支持最大长度为`128`  

如果需要更大的长度, 可以自行修改`src/config.js`中的寄存器大小, 如下:  

```
let config = {
    /**
     * Coil模拟寄存器长度
     */
    COIL_MAX_LENGTH: 2048,

    /**
     * DiscreteInput模拟寄存器长度
     */
    INPUT_MAX_LENGTH: 2048,

    /**
     * HoldingRegister模拟寄存器长度
     */
    HOLDING_REGISTER_MAX_LENGTH: 128,

    /**
     * InputRegister模拟寄存器长度
     */
    INPUT_REGISTER_MAX_LENGTH: 128
};

module.exports = config;
```

