// import { useReducer, createContext } from "react";

const AppReducer = (state, action) => {
    if (action.type == 'ADD_MSG') {
        state.msgList.push(action.payload);
        return { ...state }
    }
    else {
        return state;
    }
}

const initialState = {
    msgList: [
        {
            type: 'sent',
            value: 'Hey Bro'
        }
    ]
}

const AppContext = React.createContext();

const AppProvider = (props) => {
    const [state, dispatch] = React.useReducer(AppReducer, initialState);

    return (
        <AppContext.Provider
            value={{
                msgList: state.msgList,
                dispatch
            }}>
            {props.children}
        </AppContext.Provider>
    );
};


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
        "background-color": "black",
        "box-shadow": "0px 6px 20px grey"
    };

    render() {

        // this.setState(this.props.style);

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
                margin: "15px",
                padding: "10px",
                width: this.props.width1,
                "border-radius": "20px",
            },
            styles2: {
                margin: "15px",
                padding: "10px",
                width: this.props.width2,
                "border-radius": "20px",
            },
            styles3: {
                margin: "15px",
                padding: "10px",
                width: this.props.width3,
                "border-radius": "20px",
            },
            input_div: {
                display: "inline-flex",
                position: "relative",
                width: "100%",
                border: "2px solid grey",
                "border-radius": "23px",
                "background-color": "black"
            },
            value: this.props.value,
        }
    }

    sendMsg = () => {
        let msg = this.state.value;
        // socket.emit("message-sent", msg, roomId);
        this.props.callback(this.state.value);
    }

    handleChange = (e) => {
        console.log(e.target.value);
        this.setState({ value: e.target.value.toString() });
        e.preventDefault()
    }

    render() {
        return (
            // <input type={this.props.type} style={this.state.styles} value={this.state.value} className="inputs" onClick={this.props.onclick} onChange={e => this.handleChange(e)} onFocus={() => { this.setState({value: ""})}}/>

            <div style={this.state.input_div}>
                <input type="button" value="Start" style={this.state.styles1} className="btnStartStop" />


                <input type="text" placeholder="Enter Value" style={this.state.styles2} className="txtInput" />

                <input type="button" value="Send" style={this.state.styles3} onClick={() => this.sendMsg()} className="btnSend" />
            </div>
        );
    }
}

class MsgComponent extends React.Component {
    state = {
        position: "relative",
        width: "max-content",
        height: "max-content",
        padding: "8px",
        margin: "15px",
        "margin-bottom": "0",
        color: "white",
        "background-color": "purple",
        "border-radius": "15px 15px 15px 0",
        border: "1px solid blue"
    }

    render() {
        var identity = "Stranger";
        var align = "self-start";

        if ((this.props.type.toString()) == "sent") {
            identity = "Me";
            align = "self-end";
            this.setState({
                "background-color": "grey",
                color: "black",
                "border-radius": "15px 15px 0px 15px",
                border: "black"
            });
        }
        return (
            <div className="txtBox" style={{ "align-items": align }}>
                <div className="msg" style={this.state}>
                    {this.props.value}
                </div>
                <p>{identity}</p>
            </div>
        );
    }
}

class BodyArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: {
                display: "inline-flex",
                "flex-direction": "column-reverse",
                position: "fixed",
                width: "100%",
                height: "calc(10%)",
                "min-height": "100%",
            },
            msg_box: {
                display: "flex",
                "flex-direction": "column-reverse",
                position: "relative",
                height: "calc(100%)",
                width: "100%",
                overflow: "scroll",
                "border-radius": "0 0 12px 12px",
                "background-image": "linear-gradient(to bottom right, white, grey, rgb(73, 73, 73), rgb(27, 27, 27))",
                "background-size": "100%",
                "background-repeat": "no-repeat",
                "background-attachment": "fixed",
                "z-index": 10
            },
            message: null
        }
    }

    getMsg = (msg) => {
        this.setState({ message: msg });
    }

    render() {

        const socket = io("https://stranger-chat-server.onrender.com/", { transports: ['websocket', 'polling', 'flashsocket'] });

        var roomId = null;

        socket.on("connect", () => {

            socket.on("waiting-for-connection", conn => {
                console.log("waiting for a Stranger to connect.......");
                p.innerText = waiting_msg;
            });

            socket.on("connection-successful", (id) => {
                console.log("connection done: ", id);
                p.innerText = connected_msg;
                roomId = id;
                btnSend.disabled = false;
            });

            socket.on("message-received", (message) => {
                console.log(message)
                var txtBox = document.getElementsByClassName("txtBox");
                var box = document.createElement("div");
                box.className = "receivedChats";

                var msg = document.createElement("div");
                msg.className = "msg";

                msg.appendChild(document.createTextNode(message));

                box.appendChild(msg);

                var identity = document.createElement("div");
                identity.className = "identity";
                identity.appendChild(document.createTextNode(stranger));
                box.appendChild(identity);

                txtBox.appendChild(box);

                txtBox.scrollTop = txtBox.scrollHeight;
            });

            socket.on("stranger-disconnected", () => {
                roomId = null;
                p.innerText = disconnected_msg;
                btnStartStop.value = "Start";
                btnSend.disabled = true;
            });
        });

        const { msgList } = React.useContext(AppContext);

        return (
            <div style={this.state.styles}>

                <InputComponent width1="15%" width2="60%" width3="15%" callback={this.getMsg} />


                <div className="msg_box" style={this.state.msg_box}>
                    {/* <MsgComponent type="sent" value="Hi Bro" />

                    <MsgComponent type="received"
                        value="Hi Viraj" />

                    <MsgComponent type="received" value="bhecndhod" /> */}

                    {
                        msgList.map((msg) => {
                            <MsgComponent type={msg.type} value={msg.value} />
                        })
                    }
                </div>


                <NavHeader>
                    <NavContent content="Vibe Chat" />
                </NavHeader>
            </div>
        );
    }
}


const root = ReactDOM.createRoot(document.getElementById("rootDiv"));
root.render(
    <AppProvider>
        <BodyArea />
    </AppProvider>
);