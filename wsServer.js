const ws = require('ws')
const https = require('https');
const fs = require('fs');

var _painterWs = null
var _audienceWs = []


function wsSend(wsConn, obj) {
  console.log('send ', JSON.stringify(obj))
  wsConn.send(JSON.stringify(obj));
}

function playerCleanup() {
  const wsConn = this
  if (Object.is(_painterWs, wsConn)) {
    _painterWs = null
  }
  else {
    _audienceWs = _audienceWs.filter(item => item.readyState == 0 || item.readyState == 1)
  }
  console.log('player cleanup : ', !!_painterWs, _audienceWs.length)
}

function playerAddNew(player) {
  console.log(`new player : ${player.role}`)
  if (player.role === 'painter') {
    if (!_painterWs) {
      _painterWs = player.wsConn
    }
    else {
      wsSend(player.wsConn, { type: 'error', msg: 'already has a painter' })
    }
  }
  else if (player.role === 'audience') {
    _audienceWs.push(player.wsConn)
  }
  else {
    wsSend(player.wsConn, { type: 'error', msg: `invalid role ${player.role}` })
  }
  console.log(!!_painterWs, _audienceWs.length)
  return
}

function sendMsgToAllAudience(msgObj) {
  for (let playerWs of _audienceWs) {
    if (playerWs.readyState === 1) {
      wsSend(playerWs, msgObj)
    }
  }
}

function handleMsg(msg) {
  console.log(`[SERVER] Received ${typeof msg}: ${msg}`);
  if (typeof msg != 'string') return
  try {
    let msgObj = JSON.parse(msg)
    switch (msgObj.type) {
      case 'role': playerAddNew({ role: msgObj.role, wsConn: this }); break;
      default: sendMsgToAllAudience(msgObj);
    }
  } catch (e) {
    return
  }
}

function handleConnection(wsConn, req) {
  const ip = req.connection.remoteAddress;
  console.log(`ws connection from [${ip}]`)

  // 注意 onxxx系列函数的参数是对应Event
  wsConn.onclose = playerCleanup.bind(wsConn)
  wsConn.onerror = playerCleanup.bind(wsConn)
  wsConn.on('message', handleMsg.bind(wsConn))
}

////////////////// create server //////////////////

const pathPrefix = '/etc/pki/tls/certs/'
const keypath = pathPrefix + 'server.key';
const certpath = pathPrefix + 'server.crt';
console.log(keypath, certpath);

const options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath),
};

var httpsServer = https.createServer(options, function (req, res) {
  console.log((new Date()) + ' Received HTTP(S) request for ' + req.url);

  //要是单纯的https连接就返回403
  res.writeHead(403);
  res.end("This is a  WebSockets server!\n");
})
const wssServer = new ws.Server({ server: httpsServer });
httpsServer.listen(44301);

const wsServer = new ws.Server({
  port: 44300
})

wsServer.on('connection', handleConnection)
wssServer.on('connection', handleConnection)
