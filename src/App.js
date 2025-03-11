import './App.css';
import React from 'react';
import socket from './socket';

class NavContent extends React.Component {
  state = {
    position: "relative",
    margin: "20px",
  }

  render() {
    return (
      <div style={this.state}>
        {this.props.content}
      </div>
    );
  }
};

class NavHeader extends React.Component {
  state = {
    display: "inline-flex",
    position: "relative",
    top: "0",
    margin: 0,
    width: "100%",
    color: "white",
    backgroundColor: "black",
    boxShadow: "0px 6px 20px grey"
  };

  render() {

    return (
      <nav style={this.state}>
        {this.props.children}
      </nav>
    );
  }
};

class InputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles1: {
        position: 'absolute',
        margin: "4px",
        padding: "10px",
        left: '10px',
        width: '60px',
        borderRadius: "20px",
        zIndex: '2'
      },
      styles2: {
        position: 'relative',
        margin: "5%",
        padding: "0%",
        width: '50%',
        height: '70%',
        borderRadius: "20px",
        zIndex: '1'
      },
      styles3: {
        position: 'absolute',
        margin: "4px",
        padding: "10px",
        right: '10px',
        width: '60px',
        borderRadius: "20px",
        zIndex: '2'
      },
      input_div: {
        width: "98%",
        height: "13%",
        border: "2px solid grey",
        borderRadius: "23px",
        backgroundColor: "black"
      },
      value: null,
    };

    this.handleChange = (e) => {
      let txtValue = e.target.value.toString();
      this.setState({ value: txtValue });

      props.typingCallback();

      e.preventDefault();
    };

    this.sendMsg = () => {
      let msg = this.state.value;
      if (msg != null) {
        props.callback(msg, true);
        console.log(msg);
        document.getElementById('txtInput').value = "";
      }
    };
  }

  render() {
    return (

      <div style={this.state.input_div} className='input-div'>
        <input type="button" value={this.props.btnText} style={this.state.styles1} className="btnStartStop" onClick={this.props.connectionCallback} />

        <input id='txtInput' className='msgInput' type="text" placeholder="Write your message here" style={this.state.styles2} onChange={(e) => this.handleChange(e)} required />

        <input type="button" value="Send" style={this.state.styles3} onClick={this.sendMsg} className="btnSend" />
      </div>
    );
  }
}

function MsgComponent(props) {

  var identity = "Stranger";
  var align = "self-start";
  var color = "black";
  var borderRadius = "15px 15px 15px 0";
  var msgColor = "black";

  if ((props.type.toString()) == "sent") {
    identity = "Me";
    align = "self-end";
    msgColor = "black"
    color = "rgb(25, 100, 255)";
    borderRadius = "15px 15px 0 15px"
  }

  return (
    <div className="txtBox" style={
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: align
      }
    }>
      <div id={props.id} className="msg" style={{
        borderRadius: borderRadius,
        backgroundColor: msgColor
      }}>
        <span>
          {props.value}
        </span>
      </div>
      <p style={{ color: color }}>{identity}</p>
    </div>
  );
}

class BodyArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {
        display: "inline-flex",
        flexDirection: "column-reverse",
        position: "fixed",
        width: "100%",
        height: "calc(10%)",
        minHeight: "100%",
      },
      msg_box: {
        display: "flex",
        flexDirection: "column-reverse",
        position: "relative",
        height: "calc(100%)",
        width: "100%",
        overflow: "scroll",
        borderRadius: "0 0 8px 8px",
        backgroundImage: "linear-gradient(to bottom right, white, grey, rgb(73, 73, 73), rgb(27, 27, 27))",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundttachment: "fixed",
        zIndex: 10
      },
      msgList: [],
      roomId: null,
      socketRequested: false,
      btnText: "Start"
    }


    this.setMsg = (inputMsg, flag = false) => {
      let msgType = 'received';

      if (flag) {
        socket.emit('message-sent', inputMsg, this.state.roomId);
        msgType = 'sent';
      }

      let messages = this.state.msgList;
      messages.unshift({
        type: msgType,
        value: inputMsg
      });
      this.setState({ msgList: messages });

      console.log(this.state.msgList)
    }

    this.toggleTyping = () => {
      let messages = this.state.msgList;

      if (messages.length != 0) {

        if (messages[0]['value'] != ". . .") {
          this.setMsg(". . .");

          setTimeout(() => {
            messages = messages.slice(1);
            this.setState({ msgList: messages });
          }, 500);
        }

      }
      else {
        this.setMsg(". . .");

        setTimeout(() => {
          messages = messages.slice(1);
          this.setState({ msgList: messages });
        }, 500);
      }
    }

    this.startConnection = () => {
      if (this.state.btnText == "Start") {
        socket.emit('start-connection');
        this.setState({btnText: "Stop"});
      }
      else{
        socket.emit('stranger-disconnected');
        this.setState({btnText: "Start"});
      }
    }

    this.typingCallback = () => {
      socket.emit('typing-event', this.state.roomId);
    }

  }

  render() {

    const messages = this.state.msgList;
    return (

      <div style={this.state.styles} >
        <InputComponent width1="15%" width2="60%" width3="15%" callback={this.setMsg} typingCallback={this.typingCallback} connectionCallback={this.startConnection} btnText={this.state.btnText} />

        <div className="msg_box" style={this.state.msg_box}>

          {
            messages.map((msgs) => {
              let id = null;
              if (msgs.value == ". . .") {
                id = "typing"
              }
              return <MsgComponent type={msgs.type} value={msgs.value} id={id} />
            })
          }

          <div className='status' style={{
            position: 'fixed',
            top: 'calc(30px + 30px)',
            alignSelf: 'center',
            padding: '6px',
            border: '2px solid',
            display: "none"
          }}></div>

        </div>


        <NavHeader>
          <NavContent content="Vibe Chat" />
        </NavHeader>
      </div>
    );
  }

  componentDidMount() {
    const status = document.getElementsByClassName('status');

    socket.on("connect", () => {
      console.log("Connected to Server");
    });

    socket.on("waiting-for-connection", conn => {
      console.log("waiting for a Stranger to connect.......");
      status[0].style.display = "initial";
      status[0].textContent = 'Waiting for a Stranger';
    });

    socket.on("connection-successful", (id) => {
      console.log("connection done: ", id);
      this.setState({ roomId: id });
      status[0].style.display = "initial";
      status[0].textContent = 'Stranger Connected'
    });

    socket.on('typing', () => {
        this.toggleTyping();
        console.log("typed");
    });

      socket.on("message-received", (message) => {
        this.setMsg(message);
        console.log(message);
      });

      socket.on("stranger-disconnected", () => {
        this.setState({ roomId: null });
        socket.emit('disconnect');
        status[0].style.display = "initial";
        status[0].textContent = 'Disconnected';
        this.setState({btnText: "Start"});
      });
  }
}

function App() {
  return (
    <BodyArea />
  );
}

export default App;
