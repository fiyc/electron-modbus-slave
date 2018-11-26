/**
* @Author: fiyc
* @Date : 2018-11-26 14:11
* @FileName : memory.js
* @Description : 
    - modbus 数据存储模块
*/

let memeryPool = {
    Coil: Buffer.alloc(256),
    Input: Buffer.alloc(256),
    HoldingRegister: Buffer.alloc(256),
    InputRegister: Buffer.alloc(256),
};

const unit = {
    Coil: 1,
    Input: 1,
    HoldingRegister: 2,
    InputRegister: 2
}

let typeConvert = function (typeCode) {
    typeCode = (typeCode || "1").toString();
    if (typeCode === "1") {
        return "Coil";
    } else if (typeCode === "2") {
        return "Input";
    } else if (typeCode === "3") {
        return "HoldingRegister";
    } else if (typeCode === "4") {
        return "InputRegister";
    } else {
        return "Coil";
    }
}

let getBuf = function (typeCode) {
    let registerType = typeConvert(typeCode);
    let resultBuf = memeryPool[registerType];
    return resultBuf;
}

/**
 * 从一个buffer中按照bit位读取
 * @param {Buffer} buf 
 * @param {int} bitStart 
 * @param {int} length 
 */
let bitRead = function (buf, bitStart, length) {
    //根据bit的开始位与长度, 计算需要获取到buffer中的byte的开始位与结束位
    let startByte = parseInt(bitStart / 8);
    let endByte = parseInt((bitStart + length) / 8);

    //计算在buffer中需要移除的头偏移与尾偏移
    let headShift = bitStart;
    let footShift = (endByte - startByte + 1) * 8 - headShift - length;

    //获取buffer
    //let byteValue = read(buf, startByte, endByte - startByte + 1);
    let byteValue = Buffer.from(buf.slice(startByte, endByte + 1));

    //整体向左偏移headShift位
    for (let i = 0; i < byteValue.length; i++) {
        if (i === byteValue.length - 1) {
            let current = byteValue.readUInt8(i);
            current = current << headShift;
            byteValue.writeUInt8(current, i);
        } else {
            let current = byteValue.readUInt8(i);
            let next = byteValue.readUInt8(i + 1);
            current = current << headShift;
            next = next >> (8 - headShift);
            current = (current | next) & 0xff;
            byteValue.writeUInt8(current, i);
        }
    }

    return byteValue;
}

/**
 * 向一个buffer中按照bit位写入单个值
 * @param {Buffer} buf 
 * @param {int} bitStart 
 * @param {bit} bitValue 
 */
let bitWriteSingle = function (buf, bitStart, bitValue) {
    var byteStart = parseInt(bitStart / 8);
    // var shift = 7 - bitStart % 8; //对应的coil顺序为 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    var shift = bitStart % 8; //对应的coil顺序为 7 6 5 4 3 2 1 0 15 14 13 12 11 10 9 8
    var originValue = buf.readUInt8(byteStart);
    var finalBuf = originValue ^ ((originValue & (1 << shift)) ^ (bitValue << shift))
    buf.writeUInt8(finalBuf, byteStart);
}

/**
 * 向一个buffer中按照bit位写入多个值(buffer)
 * @param {Buffer} buf 
 * @param {int} bitStart 
 * @param {Buffer} bufValue 
 */
let bitWriteMultipleWithBuffer = function (buf, bitStart, bufValue) {
    let binaryStr = '';
    for (let i = 0; i < bufValue.length; i++) {
        binaryStr += bufValue.readUInt8(i).toString(2);
    }

    binaryStr = binaryStr.split('').reverse().join('')

    for (let i = 0; i < binaryStr.length; i++) {
        let currentValue = parseInt(binaryStr.slice(i, i + 1));
        bitWriteSingle(buf, bitStart + i, currentValue);
    }
}

/**
 * 向一个buffer中按照bit位写入多个值(int)
 * @param {Buffer} buf 
 * @param {int} bitStart 
 * @param {int} intValue 
 */
let bitWriteMultipleWithInt = function (buf, bitStart, intValue) {
    let binaryStr = intValue.toString(2);

    for (let i = 0; i < binaryStr.length; i++) {
        let currentValue = parseInt(binaryStr.slice(i, i + 1));
        bitWriteSingle(buf, bitStart + i, currentValue);
    }
}

/**
 * 从一个buffer中按照byte位读取, 需要注意 Register读取长度1是2个字节, 因此这里length在实际的Buffer中需要乘以2
 * @param {Buffer} buf 
 * @param {int} startByte 
 * @param {int} length 
 */
let byteRead = function (buf, startByte, length) {
    if (startByte + length * 2 > buf.length) {
        console.error(`request data out of buffer, address: ${start}, length: ${length}\r\n`);
        return Buffer.alloc(length * 2);
    }

    return Buffer.from(buf.slice(startByte, startByte + length * 2));
}

/**
 * 向一个buffer中按照byte位写入, 由于Register是2个字节, 所以这里写入使用writeUInt16BE
 * @param {Buffer} buf 
 * @param {int} startByte 
 * @param {int} intValue 
 */
let byteWriteSingle = function (buf, startByte, intValue) {
    buf.writeUInt16BE(intValue, startByte);
}

/**
 * 向一个buffer中按照byte位写入
 * @param {Buffer} buf 
 * @param {int} startByte 
 * @param {Buffer} bufValue 
 */
let byteWriteMultiple = function (buf, startByte, bufValue) {
    for (var i = 0; i < bufValue.length; i++) {
        var writeValue = bufValue.readUInt8(i);
        buf.writeUInt8(writeValue, startByte + i);
    }
}



let read = function (buf, start, length) {
    if (start + length > buf.length) {
        console.error(`request data out of buffer, address: ${start}, length: ${length}\r\n`);
        return Buffer.alloc(length);
    }

    return Buffer.from(buf.slice(start, length));
}


let MemoryHander = {
    Read: {
        Coil: function (start, length) {
            let targetBuf = getBuf(1);
            return bitRead(targetBuf, start, length);
        },
        Input: function (start, length) {
            let targetBuf = getBuf(2);
            return bitRead(targetBuf, start, length);
        },
        HoldingRegister: function (start, length) {
            let targetBuf = getBuf(3);
            return byteRead(targetBuf, start, length);
        },

        InputRegister: function (start, length) {
            let targetBuf = getBuf(4);
            return byteRead(targetBuf, start, length);
        }
    },
    Write: {
        SingleRegister: function (byteAddress, value) {
            let targetBuf = getBuf(3);
            byteWriteSingle(targetBuf, byteAddress, value);
        },

        SingleCoil: function (bitAddress, value) {
            let targetBuf = getBuf(1);
            bitWriteSingle(targetBuf, bitAddress, value);
        }

    }
}
module.exports = MemoryHander;




