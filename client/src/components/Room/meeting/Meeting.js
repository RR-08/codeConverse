import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../styles/Meeting.scss";
import { useWindowDimensions } from "../../../utils/windowUtils";
import { getChatWidth } from "../../../utils/getChatWidth";
import { Tooltip, IconButton, Grid } from "@material-ui/core";
import { Share, Close } from "@material-ui/icons";
import { Notification } from "../../MaterialComponents";
import Video from "./Video";
import Editor from "../Editor";

function Meeting({ socket, chatOpen, videos, roomId, userId }) {
  // const codeRef = useRef(null);
  const location = useLocation();

  const [notificationOpen, setNotificationOpen] = useState(false);
  // const [clients, setClients] = useState([]);
  const { width } = useWindowDimensions();

  const copyRoomId = () => {
    const el = document.createElement("textarea");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    setNotificationOpen(true);
  };

  const handleNotificationClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotificationOpen(false);
  };
  socket?.on("joined", ({  username, socketId }) => {
    if (username !== location.state?.username) {
      // toast.success(`${username} joined the room.`);
      console.log(`${username} joined`);
    }
    // setClients(clients);
    // socket.emit("sync-code", {
    //   code: codeRef.current,
    //   socketId,
    // });
  });

  return (
    <>
      <div
        id="meeting-area"
        style={{
          width: chatOpen ? `calc(100% - ${getChatWidth(width)})` : "100%",
        }}
      >
        <div className="meeting-info">
          <Tooltip title="Share Link">
            <IconButton onClick={copyRoomId}>
              <Share style={{ color: "#ddacf5" }} />
            </IconButton>
          </Tooltip>
          {/* <div className="room-id-area">
            <h3 className="room-id">Click to copy</h3>
          </div> */}
        </div>
        <div className="videos-area">
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            spacing={2}
            style={{ height: "100%" }}
          >
            {videos.map((video) => (
              <Grid item lg={3} md={6} xs={12} key={video.id}>
                <Video video={video} socket={socket} userId={userId} />
              </Grid>
            ))}
          </Grid>
        </div>
        <div className="editorWrap">
          <Editor
            socket={socket}
            roomId={roomId}
            // onCodeChange={(code) => {
            //   codeRef.current = code;
            // }}
          />
        </div>
      </div>
      <Notification
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={notificationOpen}
        message="Link Copied"
        autoHideDuration={2000}
        onClose={handleNotificationClose}
        action={
          <>
            <IconButton onClick={handleNotificationClose}>
              <Close fontSize="small" style={{ color: "#64379f" }} />
            </IconButton>
          </>
        }
      />
    </>
  );
}

export default Meeting;
