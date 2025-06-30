import { Button, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion"; // Importando a biblioteca de animação

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

  // --- Nenhuma alteração necessária nas funções de lógica ---
  const submitHandler = async () => { /* ... sua lógica ... */ };
  const postDetails = (pics) => { /* ... sua lógica ... */ };
  // --- Fim da lógica ---

  return (
    <MotionVStack
      spacing={4}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Nome */}
      <FormControl id="name-signup-innovative" isRequired>
        <FormLabel color="whiteAlpha.900">Nome</FormLabel>
        <Input
          variant="filled" bg="whiteAlpha.200" color="white" _hover={{ bg: "whiteAlpha.300" }}
          _placeholder={{ color: "whiteAlpha.600" }} focusBorderColor="blue.300"
          placeholder="Seu nome completo"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* Email */}
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
      
      {/* Senha */}
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
      
      {/* Confirmar Senha */}
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

      {/* Upload de Foto */}
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