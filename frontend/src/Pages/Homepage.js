import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import "./pages-styles.css";  // Importe o CSS que criamos

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // Se o usuário já estiver logado, redireciona para a tela de chats
    if (user) history.push("/chats");
  }, [history]);

  return (
    // O Box principal agora ocupa a tela inteira e tem o fundo animado
    <Box className="aurora-background" w="100%" minH="100vh">
      <Container maxW="md" centerContent> {/* 'md' é um bom tamanho para forms */}
        
        {/* Título do App, agora estilizado para o novo design */}
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          w="100%"
          m="40px 0 15px 0"
        >
          <Text fontSize="5xl" fontFamily="Montserrat" fontWeight="bold" color="white">
            WhatsUT
          </Text>
        </Box>

        {/* O Container de Vidro que engloba as abas */}
        <Box className="glass-container" w="100%">
          <Tabs isFitted variant="soft-rounded" colorScheme="whiteAlpha">
            <TabList mb="1em">
              <Tab 
                color="white" 
                _selected={{ color: "black", bg: "white" }}
                fontWeight="semibold"
              >
                Entrar
              </Tab>
              <Tab 
                color="white" 
                _selected={{ color: "black", bg: "white" }}
                fontWeight="semibold"
              >
                Cadastre-se
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* O componente Login refatorado que te enviei */}
                <Login />
              </TabPanel>
              <TabPanel>
                {/* O componente Signup refatorado que te enviei */}
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}

export default Homepage;