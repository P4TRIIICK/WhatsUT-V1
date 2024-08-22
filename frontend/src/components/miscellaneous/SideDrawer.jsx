import { useDisclosure } from "@chakra-ui/hooks";
import { IoCloseSharp } from "react-icons/io5";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { IoIosSearch } from "react-icons/io";

import "../../components/miscellaneous/styles-misc.css";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setIsOpenProfileMenu(!isOpenProfileMenu);
  };

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log("Search Results:", data);  // Debugging step
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleCloseSearch = () => {
    onClose();
    setSearch("");  // Optional: clear the search input when closing the drawer
    setSearchResult([]);
  };

  return (
    <div className="sidedrawer-container">
      <div className="button-add-friends-container">
        <button className="search-button-friend" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <span className="add-fr-text">Adicionar um amigo</span>
        </button>
      </div>
      <div className="name-logo">
        <h1 className="app-name">WhatsUT</h1>
      </div>
      <div className="user-info-container">
        <div className="user-profile-menu">
          <button className={`profile-button ${isOpenProfileMenu ? 'open' : ''}`} onClick={toggleProfileMenu}>
            <img className="avatar" src={user.pic} alt={user.name} />
            <ChevronDownIcon />
          </button>
          <ul className={`profile-menu-list ${isOpenProfileMenu ? 'open' : ''}`}>
            <ProfileModal user={user}>
              <li>
                <span>Meu perfil</span>
              </li>
            </ProfileModal>
            <li onClick={logoutHandler}>
              <span>Sair</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={`drawer ${isOpen ? 'open' : ''}`} style={{ width: isOpen ? '344px' : '200px'}}>
        <div className="drawer-overlay" onClick={onClose}></div>
        <div className="drawer-content">
          <div className="drawer-header">Procurar Usuários</div>
          <div className="drawer-body">
            <div className="search-input">
              <input
                type="text"
                placeholder="Procurar por nome/email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ outline: 'none' }}
              />
              <button className="search-button-friend-drawer" onClick={handleSearch}><IoIosSearch /></button>
              <button className="close-search_users" onClick={handleCloseSearch}><IoCloseSharp /></button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              <ul className="search-result-list">
                {searchResult.map((user) => (
                  <li key={user._id}>
                    <UserListItem user={user} handleFunction={() => accessChat(user._id)} />
                  </li>
                ))}
              </ul>
            )}
            {loadingChat && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
