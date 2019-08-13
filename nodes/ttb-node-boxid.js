module.exports = function(RED) {
  'use strict';
  const fs = require('fs')
  const deviceId = require('node-machine-id')

  function boxid(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.on("input",function(msg) {
      let boxid = null
      const initPromise = new Promise(r => r())
      initPromise
      .then(_ =>{
        if(RED.settings.functionGlobalContext && RED.settings.functionGlobalContext.hasOwnProperty('settingslib') && typeof RED.settings.functionGlobalContext.settingslib.loadSettings === 'function'){
          return RED.settings.functionGlobalContext.settingslib.loadSettings().id
        } else {
          return deviceId.machineId({original: true})
        }
      })
      .then(id => {
        boxid = id
      })
      .finally(_ =>{
        if(boxid){
          msg.boxid = boxid;
          msg.payload = msg.boxid;
        }
        node.send(msg);
      })
    })
  }
  RED.nodes.registerType('ttb-node-boxid', boxid);
};
