const Server = require('ws').Server

function wsSend(ws, obj) {
  ws.send(JSON.stringify(obj));
}

_painterWs = null
_audienceWs = []

const server = new Server({
  port: 44300
})

server.on('connection', function (ws) {
  console.log(`[SERVER] connection()`);

  ws.onclose = evt => {
    if (Object.is(_painterWs, ws)) {
      _painterWs = null
    }
    else {
      _audienceWs = _audienceWs.filter(item => item.readyState == 0 || item.readyState == 1)
    }
    console.log('ws close : ', !!_painterWs, _audienceWs.length)
  }

  ws.onerror = evt => {
    if (Object.is(_painterWs, ws)) {
      _painterWs = null
    }
    else {
      _audienceWs = _audienceWs.filter(item => item.readyState == 0 || item.readyState == 1)
    }
    console.log('ws error : ', !!_painterWs, _audienceWs.length)
  }

  ws.on('message', function (msg) {
    console.log(`[SERVER] Received ${typeof msg}: ${msg}`);
    if (typeof msg != 'string') return

    msg = JSON.parse(msg)
    if (msg.type === 'role') {
      if (msg.role === 'painter') {
        if (!_painterWs) {
          _painterWs = ws
        }
        else {
          wsSend(ws, { type: 'role', status: 'refuse', msg: 'already has a painter' })
          return
        }
      }
      if (msg.role === 'audience') {
        _audienceWs.push(ws)
      }
      console.log('add role : ', !!_painterWs, _audienceWs.length)
    }

    else {
      for (let playerWs of _audienceWs) {
        wsSend(playerWs, msg)
      }
    }
  })

});
