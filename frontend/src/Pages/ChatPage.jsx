import { Grid } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import "./pages-styles.css";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div className="chatpage-container" style={{ overflow: "hidden" }}>
      {user && <SideDrawer className="sideDrawer" />}
      <Grid className="grid-container" style={{ overflowY: "auto" }}>
        {user && (
          <div className="myChatsBox">
            <MyChats fetchAgain={fetchAgain} />
          </div>
        )}
        {user && (
          <div className="chatboxBox">
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </Grid>
    </div>
  );
};

export default Chatpage;
