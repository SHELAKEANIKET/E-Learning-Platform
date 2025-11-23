import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContextProvider";
import React, { useEffect, useRef, useState } from "react";
import { connectWebSocket } from "../helper/webSocket.js";
import axios from "axios";

const CourseDiscussion = () => {
  const { baseUrl, user, getCourseNameById } = useApp();
  const { courseId } = useParams();
  const userId = user?._id;
  const userName = user?.name;
  let timer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]); // discussion messages
  const socket = useRef();
  const [text, setText] = useState(""); // input message
  const [typers, setTypers] = useState([]); // names of typers
  const [courseData, setCourseData] = useState("");

  const getMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/discussion-messages/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessages(Array.isArray(res.data?.messages) ? res.data?.messages : []); // always array
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCourseName() {
      try {
        if (!courseId) return;

        const res = await getCourseNameById(courseId);
        setCourseData(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchCourseName();
  }, [courseId]);

  // handle events
  useEffect(() => {
    getMessages();

    // socket events
    socket.current = connectWebSocket();

    socket.current.emit("join_room", userName, courseId);

    // server event when new user join to group
    socket.current.on("join_room", (message) => {
      console.log(message);
    });

    // listen new message
    socket.current.on("newMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // replace sender's temp message
    socket.current.on("messageConfirmed", (message) => {
      setMessages((prev) => {
        const withoutTemp = prev.filter(
          (msg) =>
            !(
              msg.temp &&
              msg.message === message.message &&
              msg.userId === message.userId
            )
        );
        return [...withoutTemp, message];
      });
    });

    // listen typers name - typing event
    socket.current.on("typing", (userName) => {
      setTypers((prev) => {
        const alreadyExists = prev.find((typer) => typer === userName);
        if (!alreadyExists) {
          return [...prev, userName]; // add new typer in the 'typers' array
        }

        return prev; // return prev array as it is
      });
    });

    // listen typers name - stop typing event
    socket.current.on("stopTyping", (userName) => {
      setTypers((prev) => prev.filter((typer) => typer !== userName)); // remove that user when he stop the typing
    });

    // cleanup
    return () => {
      socket.current.off("join_room");
      socket.current.off("newMessage");
      socket.current.off("messageConfirmed");
      socket.current.off("typing");
      socket.current.off("stopTyping");
      socket.current.disconnect();
    };
  }, [courseId, userName]);

  //! handle typing events
  useEffect(() => {
    // send the username to server (for broadcasting) of typing event
    if (text) {
      socket.current.emit("typing", userName, courseId); // send to server
      clearTimeout(timer.current); // clear previous timer
    }

    // start new timer when user stops typing
    timer.current = setTimeout(() => {
      socket.current.emit("stopTyping", userName, courseId); // send to server
    }, 1000);

    // cleanup
    return () => {
      clearTimeout(timer.current);
    };
  }, [text, userName]);

  // format the time
  function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return "";

    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }

  // send the message function
  function sendMessage() {
    const userMsg = text.trim(); // user input message
    if (!userMsg) return;

    // Message
    const msg = {
      courseId,
      userId,
      message: userMsg,
      createdAt: new Date().toISOString(),
      temp: true,
    };

    setMessages((prev) => [...prev, msg]);

    // emit message to server
    socket.current.emit("sendMessage", msg);

    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="my-12 text-white min-h-screen flex items-center justify-center flex-col max-w-screen-2xl mx-auto">
      <h1 className="text-xl my-5 font-semibold italic">{courseData.title}</h1>
      <div className="w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden mx-4">
        {/* CHAT HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold">
            {userName.toUpperCase().slice(0, 1)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#303030]">
              Discusssion
            </div>
            {typers.length ? (
              <div className="text-xs text-black">
                {typers.join(", ")} is typing...
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="text-sm text-gray-500">
            {" "}
            <span className="font-medium text-[#303030] capitalize">
              {userName}
            </span>
          </div>
        </div>

        {/* CHAT MESSAGE LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
          {messages.length > 0 &&
            messages.map((msg, index) => {
              const mine =
                msg.userId === userId ||
                msg.userId?._id === userId ||
                msg.userId?.name === userName;

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${
                    mine ? "justify-end" : "justify-start"
                  } px-3`}
                >
                  <div
                    className={`max-w-[78%] py-3 px-4 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                      mine
                        ? "bg-[#7efdd3] text-black rounded-br-2xl"
                        : "bg-white text-black rounded-bl-2xl"
                    }`}
                  >
                    {!mine && (
                      <div className="text-[12px] font-semibold text-[#1a73e8] mb-1">
                        {msg.userId?.name}
                      </div>
                    )}

                    <div className="break-words whitespace-pre-wrap">
                      {msg.message}
                    </div>

                    {/* Time */}
                    <div className="text-[11px] text-gray-500 flex justify-end items-center gap-1">
                      {msg.temp ? (
                        <>
                          <span className="animate-pulse text-gray-400">
                            Sending...
                          </span>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </>
                      ) : (
                        <>{formatTime(msg.createdAt)}</>
                      )}
                    </div>

                    {/* <div className="flex justify-end items-center mt-1">
                      <div className="text-[11px] text-gray-500 text-right">
                        {formatTime(msg.createdAt)}
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
        </div>

        {/* CHAT TEXTAREA */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-2 overflow-hidden border-gray-200 rounded-full">
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full resize-none px-4 py-4 text-sm outline-none text-black"
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white px-4 py-2 mr-2 rounded-full text-sm font-medium cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDiscussion;
