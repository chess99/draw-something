


class WsClient {
  constructor(config) {
    this.host = config.host || 'localhost'
    this.playerRole = config.playerRole || 'audience'

    this._conn = null
    this._wsProcMap = {}

    this.connect()
  }

  connect() {
    let that = this

    let wsType = window.location.protocol === 'https:' ? 'wss' : 'ws'
    let port = window.location.protocol === 'https:' ? 44301 : 44300
    let url = `${wsType}://${this.host}:${port}`
    console.log('connect to ', url)
    this._conn = new WebSocket(url);

    this._conn.onopen = function (evt) {
      console.log('ws open')
      that.send({ type: "role", role: that.playerRole })
    }
    this._conn.onclose = function (evt) {
      console.log("ws close")
      setTimeout(() => { that.connect() }, 5000)
    }
    this._conn.onerror = function (evt) {
      console.log("ws error")
      this._conn.close()
    }
    this._conn.onmessage = function (evt) {
      console.log('message : ', evt.data)
      var msg = JSON.parse(evt.data)
      if (msg.type in that._wsProcMap) {
        that._wsProcMap[msg.type](msg)
      }
    }
  }

  bind(msgType, func) {
    this._wsProcMap[msgType] = func
  }

  send(obj) {
    this._conn.send(JSON.stringify(obj));
  }
}

export default WsClient
