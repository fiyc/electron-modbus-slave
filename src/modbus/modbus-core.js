/**
* @Author: fiyc
* @Date : 2018-11-26 14:01
* @FileName : modbus-core.js
* @Description : 
    - modbus 核心服务
*/

let stampit = require('stampit');
let modbus = require('node-modbus');
let memory = require('./memory');

let currentServer;
let customServer = function(port){
    return stampit()
        .refs({
            'logEnabled': true,
            'port': port,
            'responseDelay': 10,
            'whiteListIPs': null,
        })
        .compose(modbus.server.tcp.complete)
        .init(function(){
            var init = function(){
                this.on('readCoilsRequest', function(start, quantity){
                    let v = memory.Read.Coil(start, quantity);
                    for (var i = 0; i < v.length; i++) {
                        var c = this.getCoils();
                        var value = v.readUInt8(i);
                        c.writeUInt8(value, i);
                    }
                });

                this.on('readHoldingRegistersRequest', function(start, quantity){
                    var v = memory.Read.HoldingRegister(start, quantity);
                    for (var i = 0; i < v.length; i++) {
                        this.getHolding().writeUInt8(v.readUInt8(i), i);
                    }
                });

                this.on('readDiscreteInputsRequest', function(start, quantity){
                    var v = memory.Read.Input(start, quantity);
                    for (var i = 0; i < v.length; i++) {
                        this.getDiscrete().writeUInt8(v.readUInt8(i), i);
                    }
                });

                this.on('readInputRegistersRequest', function(start, quantity){
                    var v = memory.Read.InputRegister(start, quantity);
                    for (var i = 0; i < v.length; i++) {
                        this.getInput().writeUInt8(v.readUInt8(i), i);
                    }
                });

                this.on('postWriteSingleRegisterRequest', function(adr, value){
                    console.log(`postWriteSingleRegisterRequest: ${adr}, ${value}`);
                    memory.Write.HoldingRegister(adr/2, value);
                });


                this.on('postWriteSingleCoilRequest', function(adr, value){
                    console.log(`postWriteSingleCoilRequest: ${adr}, ${value}`);
                    memory.Write.Coil(adr, value);
                });

            }.bind(this);

            init();
        })();
}


module.exports = {
    start: function(port){
        if(currentServer){
            currentServer.close();
        }

        currentServer = customServer(port);
    },

    stop: function(){
        if(currentServer){
            currentServer.close();
        }
    }
};