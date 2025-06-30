import { Button, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  // ... (a lógica de submitHandler permanece a mesma)
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) { /* ... */ return; }
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post("/api/user/login", { email, password }, config);
      toast({ title: "Login realizado!", status: "success", /* ... */ });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({ title: "Erro!", description: error.response.data.message, status: "error", /* ... */ });
      setLoading(false);
    }
  };


  return (
    <MotionVStack
      spacing={4}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormControl id="email-login-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Email</FormLabel>
        <Input
          variant="filled"
          bg="whiteAlpha.200"
          color="white"
          _hover={{ bg: "whiteAlpha.300" }}
          _placeholder={{ color: "whiteAlpha.600" }}
          focusBorderColor="blue.300"
          value={email}
          placeholder="seu.email@exemplo.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password-login-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Senha</FormLabel>
        <InputGroup>
          <Input
            variant="filled"
            bg="whiteAlpha.200"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            _placeholder={{ color: "whiteAlpha.600" }}
            focusBorderColor="blue.300"
            type={show ? "text" : "password"}
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              variant="link"
              color="whiteAlpha.700"
              aria-label="Mostrar senha"
              onClick={() => setShow(!show)}
              icon={show ? <FaRegEyeSlash /> : <FaRegEye />}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        width="100%"
        mt={4}
        onClick={submitHandler}
        isLoading={loading}
        size="lg"
        bg="white"
        color="black"
        _hover={{ bg: "whiteAlpha.800" }}
      >
        Entrar
      </Button>
    </MotionVStack>
  );
};

export default Login;