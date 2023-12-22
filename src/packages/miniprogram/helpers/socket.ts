import SocketStoreBase, {
  SocketState,
  SocketWrapper,
} from 'src/utils/socket-base';

class MPWeixinSocketWrapper extends SocketWrapper {
  private socket: MPWeixinSocket | null = null;

  private state: SocketState = 0;

  init(url: string) {
    this.state = SocketState.CONNECTING;
    this.socket = wx.connectSocket({
      url,
    });
    this.socket.onClose((data) => {
      this.state = SocketState.CLOSED;
      this.emit('close', data);
    });
    this.socket.onError((data) => {
      this.state = SocketState.CLOSED;
      this.emit('error', data);
    });
    this.socket.onOpen((data) => {
      this.state = SocketState.OPEN;
      this.emit('open', data);
    });
    this.socket.onMessage((data) => {
      this.emit('message', data);
    });
  }

  send(data: Object) {
    this.socket?.send({
      data,
    });
  }

  close() {
    this.socket?.close({});
    this.socket = null;
  }

  destroy(): void {
    this.socket = null;
  }

  getState(): SocketState {
    return this.state;
  }
}

export class MPWeixinSocketStore extends SocketStoreBase {
  // websocket instance
  protected socket = new MPWeixinSocketWrapper();

  public getSocket() {
    return this.socket;
  }

  onOffline() {}
}

export default new MPWeixinSocketStore();
