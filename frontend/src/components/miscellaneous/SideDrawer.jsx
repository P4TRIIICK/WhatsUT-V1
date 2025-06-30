import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

// Imports do Chakra UI
import { Box, Text, Tooltip, Button, Avatar } from "@chakra-ui/react";
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/menu";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Input } from "@chakra-ui/input";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";

// Imports de Ícones
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IoIosSearch } from "react-icons/io";

// Imports de Componentes
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Por favor, digite algo na busca",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Ocorreu um erro!",
        description: "Falha ao carregar os resultados da busca",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
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
      onClose(); // Fecha o drawer após selecionar um usuário
    } catch (error) {
      toast({
        title: "Erro ao buscar o chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#1A202C" // Fundo escuro (gray.800)
        w="100%"
        p="5px 10px"
        borderBottomWidth="1px"
        borderColor="gray.700"
      >
        <Tooltip label="Adicionar um amigo" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} color="white" _hover={{ bg: "gray.700" }}>
            <IoIosSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Adicionar um amigo
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Montserrat" fontWeight="bold" color="white">
          WhatsUT
        </Text>

        <div>
          <Menu>
            <MenuButton as={Button} bg="transparent" _hover={{ bg: "gray.700" }} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg="#2D3748" borderColor="gray.600">
              <ProfileModal user={user}>
                <MenuItem color="white" _hover={{ bg: "teal.500" }}>Meu Perfil</MenuItem>
              </ProfileModal>
              <MenuDivider borderColor="gray.600" />
              <MenuItem color="white" _hover={{ bg: "teal.500" }} onClick={logoutHandler}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#2D3748" color="white">
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            Adicionar Amigos
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Procurar por nome ou email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="filled"
                bg="gray.600"
                _hover={{bg: "gray.500"}}
                focusBorderColor="teal.500"
              />
              <Button onClick={handleSearch} colorScheme="teal" isLoading={loading}>
                Ir
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;