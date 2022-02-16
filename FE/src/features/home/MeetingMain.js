/* eslint-disable */
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { useEffect, useState, Component, createRef } from "react";
import "./MeetingMain.css";
import UserVideoComponent from "./UserVideoComponent";
import backendUrl from "../setup/hld_url";
import OPENVIDU_URL from "../setup/openvidu_url";
import OPENVIDU_SECET from "../setup/openvidu_secret";
import Messages from "../chat/Messages";
import {
  IoMicSharp,
  IoMicOffSharp,
  IoVideocamOff,
  IoVideocam,
  IoCameraSharp,
  IoExit,
  IoMdCopy,
  IoCopy,
  IoGameController,
  IoBeer,
} from "react-icons/io5";
import html2canvas from "html2canvas";
import CountDown from "./CountDown";
import { FormControl, FormControlLabel, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";

import Swal from "sweetalert2";

import { IoMdExpand, IoMdContract } from "react-icons/io";

import { Container, Row, Col } from "react-bootstrap";

import Cheersmain from "./Cheersmain";

// const OPENVIDU_SERVER_URL = OPENVIDU_URL;
// const OPENVIDU_SERVER_SECRET = OPENVIDU_SECET;
const OPENVIDU_SERVER_URL = "https://i6c202.p.ssafy.io";
const OPENVIDU_SERVER_SECRET = "HOMELAND";

const BEUrl = backendUrl;
const btn_size = "36";
const icon_color = "rgb(52, 62, 117)";
const icon_color_off = "rgb(89, 96, 138)";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionData: [],
      mySessionId: "",
      myUserName: "",
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      messages: [],
      message: "",
      audiostate: true,
      screenstate: true,
      videostate: true,
      captured: "",
      cnt: false,
      previewOpen: false,
      connectionUser: [],
      userId: "guest",
      connectionId: "",
      connections: [],
      width: window.innerWidth,
      height: window.innerHeight,
      liar: [],
      liarOrNot: "",
      liarSubject: "",
      gamePanel: false,
      isRandomAllowed: true,
      cheers: false,
      
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.clickLeave = this.clickLeave.bind(this);
    this.paneltoggle = this.paneltoggle.bind(this);
    // chat
    this.chattoggle = this.chattoggle.bind(this);
    this.messageContainer = createRef(null);
    this.sendmessageByClick = this.sendmessageByClick.bind(this);
    this.sendmessageByEnter = this.sendmessageByEnter.bind(this);
    this.handleChatMessageChange = this.handleChatMessageChange.bind(this);
    // 짠효과
    this.cheersToggle = this.cheersToggle.bind(this);
    // 방장나가기 방폭파
    this.pubOut = this.pubOut.bind(this);


  }

  pubOut() {
    setTimeout(() => {
      this.leaveSession();
    }, 1000);
  }

  cheersToggle() {

    this.setState({ cheers: !this.state.cheers });
    setTimeout(() => {
      this.setState({ cheers: !this.state.cheers });
    }, 6000);
  }

  escFunction(event) {
    if ((event.key === 27) | (event.which === 27)) {
      this.closeModalCapture();
      this.closeModalLeave();
      //Do whatever when esc is pressed
    }
  }

  paneltoggle() {
    this.setState({ gamePanel: !this.state.gamePanel });
  }

  handleScreenMode = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  handleChatMessageChange(e) {
    this.setState({
      message: e.target.value,
    });
  }
  // 채팅 자동 하단 스크롤
  componentDidUpdate(previousProps, previousState) {
    if (this.refs.chatoutput != null) {
      this.refs.chatoutput.scrollTop = this.refs.chatoutput.scrollHeight;
    }
    
    this.showVideoControls();
  }

  chattoggle() {
    this.setState({ chaton: !this.state.chaton });
  }

  sendmessageByClick() {
    if (this.state.message !== "") {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            userName: this.state.myUserName,
            text: this.state.message,
            boxClass: "messages__box--operator",
            bigBoxClass: "messages__bigBox--operator",
          },
        ],
      });
      const mySession = this.state.session;

      mySession.signal({
        data: `${this.state.myUserName},${this.state.message}`,
        to: [],
        type: "chat",
      });
    }

    this.setState({
      message: "",
    });
  }

  sendmessageByEnter(e) {
    if (e.key === "Enter") {
      if (this.state.message !== "") {
        this.setState({
          messages: [
            ...this.state.messages,
            {
              userName: this.state.myUserName,
              text: this.state.message,
              boxClass: "messages__box--operator",
              bigBoxClass: "messages__bigBox--operator",
            },
          ],
        });
        const mySession = this.state.session;

        mySession.signal({
          data: `${this.state.myUserName},${this.state.message}`,
          to: [],
          type: "chat",
        });

        this.setState({
          message: "",
        });
      }
    }
  }

  sendCaptureSignal() {
    const mySession = this.state.session;

    mySession.signal({
      data: "start capture",
      to: [],
      type: "captureSignal",
    });
  }

  sendCheersSignal() {
    const mySession = this.state.session;

    mySession.signal({
      data: "start cheers",
      to: [],
      type: "cheersSignal",
    });
  }

  sendPubOut() {
    const mySession = this.state.session;

    mySession.signal({
      data: "out put",
      to: [],
      type: "putOut",
    });
  }

  openModalCapture = () => {
    Swal.fire({
      title: "사진이 마음에 드시나요??",
      html: `<div id="preview"></div>`,
      showDenyButton: true,
      confirmButtonText: "저장하기",
      denyButtonText: `저장 안하기`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSaveAs(
          this.state.captured.toDataURL("image/png"),
          "HomeLanDrink.png"
        );
      } else if (result.isDenied) {
        this.closeModalCapture();
      }
    });
  };

  closeModalCapture = () => {
    this.setState({ modalOpen_capture: false });
    this.setState({ previewOpen: false });
  };

  openModalLeave = () => {
    Swal.fire({
      title: "정말 방을 떠나시겠습니까?",
      showDenyButton: true,
      confirmButtonText: "더 놀기",
      denyButtonText: `종료하기`,
    }).then((result) => {
      if (result.isDenied) {
        this.leaveSession();
      }
    });
  };

  clickLeave = () => {
    this.closeModalLeave();
    this.leaveSession();
  };

  componentDidMount() {
    // 로그인한 유저의 정보 얻기 위한 api 요청
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    if (token) {
      axios({
        url: `${BEUrl}/api/v1/users/me`,
        method: "get",
        headers: config,
      }).then((res) => {
        this.setState({
          myUserName: res.data.nickname,
          userId: res.data.userId,
        });
      });
    }
    window.addEventListener("beforeunload", this.onbeforeunload);
    window.addEventListener("resize", this.handleScreenMode);
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    document.removeEventListener("keydown", this.escFunction, false);
    window.removeEventListener("resize", this.handleScreenMode);
    this.leaveSession();
  }

  onbeforeunload(event) {}

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();
    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---
        mySession.on("connectionCreated", (event) => {
          console.log("connection");



          console.log(event.connection);
          // var connection = event.connection.connectionId
          // Object형을 넣어줘야한다.
          var connection = event.connection;
          var connectionUser = this.state.connectionUser;
          connectionUser.push(connection);
          
          //Update
          this.setState({
            connectionUser: connectionUser,
          });

          
          




          // 코넥션 오브젝트 모음 체크
          var test = this.state.connectionUser
          var sessionData = this.state.sessionData
          var connections = this.state.connections
          var subscribers = this.state.subscribers
          // var superman = this.state.superman
          console.log('코넥션 오브젝트')
          console.log(test)
          console.log('세션데이타')
          console.log(sessionData)

          console.log('코넥션즈')
          console.log(connections)
        



          // pub테스트
          var tp = this.state.publisher
          console.log(tp)
        });
        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });
        mySession.on("signal:chat", (event) => {
          let chatdata = event.data.split(",");
          if (chatdata[0] !== this.state.myUserName) {
            this.setState({
              messages: [
                ...this.state.messages,
                {
                  userName: chatdata[0],
                  text: chatdata[1],
                  boxClass: "messages__box--visitor",
                  bigBoxClass: "messages__bigBox--visitor",
                },
              ],
            });
          }
        });
        mySession.on("signal:captureSignal", (event) => {
          this.onCapture();
        });

        mySession.on("signal:cheersSignal", (event) => {
          this.cheersToggle();
        });
        // 방장 나가기
        mySession.on("signal:putOut", (event) => {
          this.pubOut();
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // 'getToken' method is simulating what your server-side should do.
        // 'token' parameter should be retrieved and returned by your own backend
        this.getToken().then((token) => {
          // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(() => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;
    
    // 세션 나가면 app.js에 false값 전달 => navbar 토글 위함
    const onIsSession = this.props.onIsSession;
    onIsSession(false);
    // console.log('======나가는놈누구냐=======')
    // console.log(mySession)
    // console.log(onIsSession)
    // mySession.connection.connectionId == this.state.connectionUser[0].connectionId
    // 방장나가면 방폭파, 이거 조정해서 버그수정도가능할듯
    if(mySession.connection.connectionId == this.state.connectionUser[0].connectionId){
      // 여기찐,여기아니면 creation time여차하면 그걸로 비교해도될듯
      this.sendPubOut()
    }
    if (mySession) {
      mySession.disconnect();
    }

    // 세션이 있을 때만 leave api 전송
    if (this.state.mySessionId) {
      axios({
        url: `${BEUrl}/api/v1/room/leave/${this.state.mySessionId}`,
        method: "post",
        data: {
          nickname: this.state.myUserName,
          connectionId: this.state.connectionId,
          userId: this.state.userId,
        },
      });
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "",
      myUserName: this.state.myUserName,
      mainStreamManager: undefined,
      publisher: undefined,
    });

  }

  render() {
    const messages = this.state.messages;
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const loginToken = localStorage.getItem("jwt");
    const onIsSession = this.props.onIsSession;

    // 방 랜덤입장 여부 체크
    const handleChangeRandomJoin = (event) => {
      event.preventDefault();
      this.setState({
        isRandomAllowed: event.target.value,
      });
    };

    // 방 랜덤입장 api
    const onRandomJoin = (event) => {
      event.preventDefault();
      axios({
        url: `${BEUrl}/api/v1/room/random-join`,
        method: "get",
      })
        .then((res) => {
          console.log(res);
          this.setState({
            mySessionId: res.data,
          });
        })
        .then(() => {
          onCheckNickname();
        });
    };

    const onCheckNickname = () => {
      if (!this.state.myUserName) {
        alert("닉네임을 입력해주세요.");
      } else {
        axios({
          url: `${BEUrl}/api/v1/room/join/${this.state.mySessionId}`,
          method: "post",
          data: {
            nickname: this.state.myUserName,
            connectionId: this.state.connectionId,
            userId: this.state.userId,
          },
        })
          .then((res) => {
            console.log(this.state.myUserName);
            console.log(this.state.connectionId);
            console.log(res);
            if (res.status === 226) {
              alert("중복된 닉네임입니다.");
            } else {
              onIsSession(true);
              this.joinSession();
            }
          })
          .catch((err) => {
            if (err.response.status === 406) {
              alert("방이 꽉 찼습니다...ㅜㅜ");
            }
          });
      }
    };

    const onCheckSession = (event) => {
      event.preventDefault();
      if (!this.state.mySessionId) {
        alert("방 번호를 입력해 주세요!");
      } else {
        axios({
          url: `${BEUrl}/api/v1/room/${this.state.mySessionId}`,
          method: "get",
          data: {
            roomId: this.state.mySessionId,
          },
        })
          .then(() => {
            onCheckNickname();
          })

          .catch((err) => {
            if (err.response.status === 404) {
              alert("방이 존재하지 않습니다.");
            }
          });
      }
    };

    const sendUserData = () => {
      axios({
        url: `${BEUrl}/api/v1/room/${this.state.mySessionId}`,
        method: "put",
        data: {
          userId: this.state.userId,
          nickname: this.state.myUserName,
          connectionId: this.state.connectionId,
          randomJoin: this.state.isRandomAllowed,
        },
      });
    };

    const onCreateRoom = (event) => {
      event.preventDefault();
      axios({
        url: `${BEUrl}/api/v1/room/create`,
        method: "get",
      })
        .then((res) => {
          this.setState({
            mySessionId: res.data,
          });
        })
        .then(() => {
          onIsSession(true);
          this.joinSession();
        })
        .then(() => {
          sendUserData();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const { mypage } = this.props;
    return (
      <div className="bg">
        {this.state.session === undefined ? (
          <Container>
            <Row className="padding-100px">
              <Col></Col>
              <Col xs={8}>
                <div id="join">
                  {/* <div id="img-div">
                    <img src="/HLD_logo_310x310.png" alt="OpenVidu logo" />
                  </div> */}
                  <div id="join-dialog" className="jumbotron vertical-center">
                    <h1 className="color-353f71"> Welcome to </h1>
                    <h1 className="color-353f71"> Home Lan Drink! </h1>
                    {loginToken ? (
                      <form className="form-group">
                        <br></br>
                        <h2 className="color-353f71">
                          안녕하세요 '{myUserName}'님!
                        </h2>
                        <br></br>
                        <Container>
                          <Row>
                            <Col md={{ span: 5, offset: 0 }}>
                              <div className="join-box">
                                <div>방 만들기</div>
                                <input
                                  className="btn join-box-inner"
                                  name="commit"
                                  type="submit"
                                  value="방 만들기"
                                  onClick={onCreateRoom}
                                />
                                <FormControl>
                                  <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={this.state.isRandomAllowed}
                                    onChange={handleChangeRandomJoin}
                                  >
                                    <FormControlLabel
                                      value={true}
                                      control={<Radio />}
                                      label="랜덤입장 가능"
                                    />
                                    <FormControlLabel
                                      value={false}
                                      control={<Radio />}
                                      label="랜덤입장 불가능"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>
                            </Col>
                            <Col md={{ span: 5, offset: 2 }}>
                              <div className="join-box">
                                <div>방 입장하기</div>
                                <br></br>
                                <Button
                                  type="submit"
                                  onClick={onRandomJoin}
                                  variant="contained"
                                >
                                  랜덤입장
                                </Button>
                                <br></br>
                                <p>방 번호를 입력하세요</p>
                                <TextField
                                  margin="normal"
                                  id="sessionId"
                                  value={mySessionId}
                                  onChange={this.handleChangeSessionId}
                                  required
                                  fullWidth
                                  label="방 번호"
                                />

                                <input
                                  type="submit"
                                  value="JOIN"
                                  className="btn btn-lg btn-color margin-right10"
                                  onClick={onCheckSession}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Container>
                      </form>
                    ) : (
                      <Row>
                        <form className="form-group">
                          <Col md={{ span: 6, offset: 3 }}>
                            <div className="join-box">
                              <br></br>
                              <br></br>
                              <p className="color-353f71">
                                닉네임을 입력해주세요.{" "}
                              </p>
                              <input
                                className="form-control input-style"
                                type="text"
                                id="userName"
                                value={myUserName}
                                onChange={this.handleChangeUserName}
                                placeholder="닉네임"
                                required
                              />
                              <br></br>
                              <br></br>
                              <p> 방번호를 입력해주세요. </p>
                              <input
                                className="form-control input-style"
                                type="text"
                                id="sessionId"
                                value={mySessionId}
                                onChange={this.handleChangeSessionId}
                                placeholder="방 번호"
                                required
                              />
                              <p className="text-center">
                                <br></br>
                                <input
                                  className="btn btn-lg btn-color"
                                  name="commit"
                                  type="submit"
                                  value="JOIN"
                                  onClick={onCheckSession}
                                />
                              </p>
                              <Button
                                type="submit"
                                onClick={onRandomJoin}
                                variant="contained"
                              >
                                랜덤입장
                              </Button>
                            </div>
                          </Col>
                        </form>
                      </Row>
                    )}
                  </div>
                </div>
              </Col>
              <Col></Col>
            </Row>
            <br></br>
            <br></br>
          </Container>
        ) : (
          <div id="session" className="padding-100px ">
            <Container>
              {/* <div id="img-div">
                <img
                  src="/HLD_logo_150x150.png"
                  alt="OpenVidu logo"
                  sizes="24"
                />
              </div> */}
              <Row>
                <Col md={{ span: 9 }}>
                  {/* screens */}
                  <div
                    id="video-container"
                    className="video-container "
                    id="capture_screen"
                  >
                    {this.state.publisher !== undefined 
                    ? (
                      <div
                        // className="stream-container-v1"
                        className={
                          this.state.connectionUser.length <= 4
                            ? "stream-container-v1"
                            : "stream-container-v2"
                        }
                        onClick={() => {
                          this.videoplay();
                        }}
                      >
                        <UserVideoComponent
                          streamManager={this.state.publisher}
                        />
                        {/* <h1>방장</h1> */}
                        {this.state.cheers === true ? (
                    <Cheersmain></Cheersmain>
                  ) : null}
                      </div>
                    ) 
                    : null
                    }
                    {/* this.leaveSession(); 방장나가면 바로함수안되나. */}
                    {/* 여기 null에서 전부 퇴장하게 세션 보내도될듯? */}
                    {this.state.subscribers.map((sub, i) => (
                      <div
                        key={i}
                        className={
                          this.state.connectionUser.length <= 4
                            ? "stream-container-v1"
                            : "stream-container-v2"
                        }
                        onClick={() => {
                          this.videoplay();
                        }}
                      >
                        <UserVideoComponent streamManager={sub} />
                        {/* <h1>스크라이버</h1> */}
                        {this.state.cheers === true ? (
                    <Cheersmain></Cheersmain>
                  ) : null}
                      </div>
                    ))}
                    {/* <h1>여기테스트1</h1> */}
                    
                  </div>
                  {/* buttons */}

                  {/* 여기일단 그대로두고 버튼만이사 */}
                  {/* 스크린샷 타이머 */}
                  <div id="CntDown"></div>
                  {this.state.cnt ? <CountDown /> : <span></span>}

                  {/* 짠효과 중앙 */}
                  {/* {this.state.cheers === true ? (
                    <Cheersmain></Cheersmain>
                  ) : null} */}
                </Col>

                <Col md={{ span: 3 }}>
                  {/* chat */}
                  {this.state.gamePanel ? <div className="panel"></div> : null}
                  <div className="height-80">
                    <div
                      // className="chatbox__support chat-height-with-panel"
                      className={
                        this.state.gamePanel
                          ? "chatbox__support chat-height-with-panel"
                          : "chatbox__support chat-height-without-panel"
                      }
                    >
                      <div className="chatbox__header">
                        방코드: {mySessionId}
                        <IoCopy
                          color="#50468c"
                          size="18"
                          title="Copy"
                          className="cursor-pointer"
                          onClick={() =>
                            navigator.clipboard.writeText(mySessionId)
                          }
                        />
                        <IoGameController
                          color="#50468c"
                          size="18"
                          className="cursor-pointer"
                          onClick={this.paneltoggle}
                        />
                      </div>

                      <div className="chatbox__messages" ref="chatoutput">
                        {/* {this.displayElements} */}
                        <Messages messages={messages} />
                        <div />
                      </div>
                      <div className="chatbox__footer">
                        <input
                          id="chat_message"
                          type="text"
                          placeholder="Write a message..."
                          onChange={this.handleChatMessageChange}
                          onKeyPress={this.sendmessageByEnter}
                          value={this.state.message}
                        />
                        <button
                          className="chatbox__send--footer"
                          onClick={this.sendmessageByClick}
                        >
                          Enter
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xs={8}>
                  {/* buttons */}
                  <div className="btn_toolbar">
                    {this.state.audiostate ? (
                      <IoMicSharp
                        color={icon_color}
                        size={btn_size}
                        onClick={() => {
                          this.state.publisher.publishAudio(
                            !this.state.audiostate
                          );
                          this.setState({ audiostate: !this.state.audiostate });
                        }}
                      />
                    ) : (
                      <IoMicOffSharp
                        color={icon_color_off}
                        size={btn_size}
                        onClick={() => {
                          this.state.publisher.publishAudio(
                            !this.state.audiostate
                          );
                          this.setState({ audiostate: !this.state.audiostate });
                        }}
                      />
                    )}
                    {this.state.videostate ? (
                      <IoVideocam
                        color={icon_color}
                        size={btn_size}
                        onClick={() => {
                          this.state.publisher.publishVideo(
                            !this.state.videostate
                          );
                          this.setState({ videostate: !this.state.videostate });
                        }}
                      />
                    ) : (
                      <IoVideocamOff
                        color={icon_color_off}
                        size={btn_size}
                        onClick={() => {
                          this.state.publisher.publishVideo(
                            !this.state.videostate
                          );
                          this.setState({ videostate: !this.state.videostate });
                        }}
                      />
                    )}
                    {!(
                      screen.width === this.state.width &&
                      screen.height === this.state.height
                    ) ? (
                      <IoMdExpand
                        color={icon_color}
                        size={btn_size}
                        onClick={() => {
                          this.openFullScreenMode();
                        }}
                      />
                    ) : (
                      <IoMdContract
                        color={icon_color_off}
                        size={btn_size}
                        onClick={() => {
                          this.closeFullScreenMode();
                        }}
                      />
                    )}
                    <IoCameraSharp
                      color={icon_color}
                      size={btn_size}
                      onClick={() => {
                        this.sendCaptureSignal();
                      }}
                    />
                    {/* 짠효과 */}
                    <IoBeer
                      color={icon_color}
                      size={btn_size}
                      onClick={() => {
                        this.sendCheersSignal();
                      }}
                    />
                    <IoExit
                      color="red"
                      size={btn_size}
                      onClick={this.openModalLeave}
                    />
                  </div>
                </Col>
                <Col xs={4}></Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          this.setState({
            connectionId: response.data.connectionId,
          });
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
  // 전체화면 설정
  openFullScreenMode() {
    console.log("fullscreen");
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();
    else if (document.webkitRequestFullscreen)
      // Chrome, Safari (webkit)
      document.documentElement.webkitRequestFullscreen();
    else if (document.mozRequestFullScreen)
      // Firefox
      document.documentElement.mozRequestFullScreen();
    else if (document.msRequestFullscreen)
      // IE or Edge
      document.documentElement.msRequestFullscreen();
  }
  // 전체화면 해제
  closeFullScreenMode() {
    console.log("closefullscreen");
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen)
      // Chrome, Safari (webkit)
      document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen)
      // Firefox
      document.mozCancelFullScreen();
    else if (document.msExitFullscreen)
      // IE or Edge
      document.msExitFullscreen();
  }

  onCapture() {
    console.log("onCapture");
    if (!this.state.previewOpen) {
      this.setState({ cnt: true, previewOpen: true });
      setTimeout(() => {
        {
          this.setState({ cnt: false });
          html2canvas(document.getElementById("capture_screen")).then(
            (canvas) => {
              this.state.captured = canvas;
              this.openModalCapture();
              document.getElementById("preview").appendChild(canvas);
            }
          );
        }
      }, 6000);
    }
  }

  onSaveAs(uri, filename) {
    console.log("onSaveAs");
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      this.closeModalCapture();
    }, 500);
  }
  showVideoControls() {
    var video = document.getElementsByTagName("video");
    for (var i = 0; i < video.length; i++) {
      video[i].controls = true;
    }
  }

  videoplay() {
    var video = document.getElementsByTagName("video");
    setTimeout(() => {
      for (var i = 0; i < video.length; i++) {
        video[i].play();
      }
    }, 100);
  }
}

export default Main;
