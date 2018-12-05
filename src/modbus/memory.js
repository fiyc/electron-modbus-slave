/**
* @Author: fiyc
* @Date : 2018-11-26 14:11
* @FileName : memory.js
* @Description : 
    - modbus 数据存储模块
*/

let config = require('../config');
const coilByteLength = Math.ceil((Number(config.COIL_MAX_LENGTH) || 2048) / 8);
const inputByteLength = Math.ceil((Number(config.INPUT_MAX_LENGTH) || 2048) / 8);
const holdingRegisterByteLength = Math.ceil((Number(config.HOLDING_REGISTER_MAX_LENGTH) || 128) * 2);
const inputRegisterByteLength = Math.ceil((Number(config.INPUT_REGISTER_MAX_LENGTH) || 128) * 2);

let memeryPool = {
    Coil: Buffer.alloc(coilByteLength),
    Input: Buffer.alloc(inputByteLength),
    HoldingRegister: Buffer.alloc(holdingRegisterByteLength),
    InputRegister: Buffer.alloc(inputRegisterByteLength),
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

let bitRead = function(buf, bitStart, length){
    length = Math.ceil(length / 8) * 8;
    let readStart = Math.floor(bitStart / 8);
    let readEnd = Math.ceil((bitStart + length) / 8);

    let readBuf = Buffer.from(buf.slice(readStart, readEnd));
    let resultBuf = Buffer.alloc(Math.ceil(length / 8));

    if(resultBuf.length === readBuf.length){
        resultBuf = readBuf;
    }else{
        let shift = bitStart % 8;
        for(let i=0; i<resultBuf.length; i++){
            let current = readBuf.readUInt8(i);
            let next = readBuf.readUInt8(i + 1);
            current = current << shift;
            next = next >> (8 - shift);

            current = (current | next) & 0xff;
            resultBuf.writeUInt8(current, i);
        }
    }

    let index = 0;
    for(let byteValue of resultBuf.values()){
        byteValue=((byteValue&0xf0)>>4) | ((byteValue&0x0f)<<4); 
        byteValue=((byteValue&0xCC)>>2) | ((byteValue&0x33)<<2); 
        byteValue=((byteValue&0xAA)>>1) | ((byteValue&0x55)<<1); 
        resultBuf.writeUInt8(byteValue, index);
        index++;
    }

    return resultBuf;


}

/**
 * 向一个buffer中按照bit位写入单个值
 * @param {Buffer} buf 
 * @param {int} bitStart 
 * @param {bit} bitValue 
 */
let bitWriteSingle = function (buf, bitStart, bitValue) {
    var byteStart = Math.floor(bitStart / 8);
    var shift = 7 - bitStart % 8; //对应的coil顺序为 7 6 5 4 3 2 1 0 15 14 13 12 11 10 9 8
    var originValue = buf.readUInt8(byteStart);
    var finalBuf = originValue ^ ((originValue & (1 << shift)) ^ (bitValue << shift))
    buf.writeUInt8(finalBuf, byteStart);
}


/**
 * 从一个buffer中按照byte位读取, 需要注意 Register读取长度1是2个字节, 因此这里length在实际的Buffer中需要乘以2
 * @param {Buffer} buf 
 * @param {int} startByte 
 * @param {int} length 
 */
let byteRead = function (buf, startByte, length) {
    if (startByte * 2 + length * 2 > buf.length) {
        console.error(`request data out of buffer, address: ${start}, length: ${length}\r\n`);
        return Buffer.alloc(length * 2);
    }

    return Buffer.from(buf.slice(startByte * 2, startByte * 2 + length * 2));
}

/**
 * 向一个buffer中按照byte位写入, 由于Register是2个字节, 所以这里写入使用writeUInt16BE
 * @param {Buffer} buf 
 * @param {int} startByte 
 * @param {int} intValue 
 */
let byteWriteSingle = function (buf, startByte, intValue) {
    buf.writeUInt16BE(intValue, startByte * 2);
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
        HoldingRegister: function (byteAddress, value) {
            let targetBuf = getBuf(3);
            byteWriteSingle(targetBuf, byteAddress, value);
        },

        Coil: function (bitAddress, value) {
            let targetBuf = getBuf(1);
            bitWriteSingle(targetBuf, bitAddress, value);
        },
        InputRegister: function (byteAddress, value) {
            let targetBuf = getBuf(4);
            byteWriteSingle(targetBuf, byteAddress, value);
        },

        Input: function (bitAddress, value) {
            let targetBuf = getBuf(2);
            bitWriteSingle(targetBuf, bitAddress, value);
        }

    }
}
module.exports = MemoryHander;




