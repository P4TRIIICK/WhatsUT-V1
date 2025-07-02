import { Button, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { ChatState } from "../../Context/ChatProvider"; // Importe o ChatState

const MotionVStack = motion(VStack);

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState(); // Pegue o setUser do context

  // LÓGICA DO UPLOAD DE IMAGEM RESTAURADA
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Por favor, selecione uma imagem.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "WhatsUT"); // Seu preset do Cloudinary
      data.append("cloud_name", "dz6vzitly");    // Seu cloud name do Cloudinary
      fetch("https://api.cloudinary.com/v1_1/dz6vzitly/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Formato de imagem inválido.",
        description: "Por favor, selecione uma imagem JPG ou PNG.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  // LÓGICA DE CADASTRO RESTAURADA
  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Por favor, preencha todos os campos obrigatórios.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "As senhas não coincidem.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Cadastro realizado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // Salva o usuário no context e no localStorage
      setUser(data); 
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Ocorreu um erro no cadastro!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <MotionVStack
      spacing={4}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <FormControl id="name-signup-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Nome</FormLabel>
        <Input
          variant="filled" bg="whiteAlpha.200" color="white" _hover={{ bg: "whiteAlpha.300" }}
          _placeholder={{ color: "whiteAlpha.600" }} focusBorderColor="blue.300"
          placeholder="Seu nome completo"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email-signup-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Email</FormLabel>
        <Input
          variant="filled" bg="whiteAlpha.200" color="white" _hover={{ bg: "whiteAlpha.300" }}
          _placeholder={{ color: "whiteAlpha.600" }} focusBorderColor="blue.300"
          type="email"
          placeholder="seu.email@exemplo.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password-signup-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Crie sua Senha</FormLabel>
        <InputGroup>
            <Input
              variant="filled" bg="whiteAlpha.200" color="white" _hover={{ bg: "whiteAlpha.300" }}
              _placeholder={{ color: "whiteAlpha.600" }} focusBorderColor="blue.300"
              type={show ? "text" : "password"}
              placeholder="Pelo menos 6 caracteres"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton variant="link" color="whiteAlpha.700" onClick={() => setShow(!show)} icon={show ? <FaRegEyeSlash /> : <FaRegEye />} aria-label="Mostrar senha"/>
            </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password-signup-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Confirme sua Senha</FormLabel>
        <Input
          variant="filled" bg="whiteAlpha.200" color="white" _hover={{ bg: "whiteAlpha.300" }}
          _placeholder={{ color: "whiteAlpha.600" }} focusBorderColor="blue.300"
          type="password"
          placeholder="Repita a senha"
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic-innovative">
        <FormLabel color="whiteAlpha.900">Foto do Perfil</FormLabel>
        <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            color="white"
            variant="filled"
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.300" }}
            sx={{
              "::file-selector-button": {
                border: "none",
                outline: "none",
                mr: 2,
                height: "80%",
                bg: "whiteAlpha.300",
                color: "white",
                borderRadius: "md",
                cursor: "pointer",
                _hover: {
                  bg: "whiteAlpha.400"
                }
              },
            }}
        />
      </FormControl>
      <Button
        width="100%"
        mt={4}
        onClick={submitHandler}
        isLoading={picLoading}
        size="lg"
        bg="white"
        color="black"
        _hover={{ bg: "whiteAlpha.800" }}
      >
        Criar Conta
      </Button>
    </MotionVStack>
  );
};

export default Signup;