import { ViewIcon } from "@chakra-ui/icons";
import React from "react";
import { FaEye } from "react-icons/fa";
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Image,
    ModalFooter,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import "./styles-misc.css";

const ProfileModalContent = ({ isOpen, onClose, user }) => {

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    };

    return (
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent className="profile-modal-content" maxW="600px">

                <ModalBody
                    display="flex"
                    flexDir={{ base: "column", md: "row" }}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                    />
                    <Flex flexDir="column" ml={{ base: 0, md: 4 }}>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work sans"
                            fontWeight="bold"
                            textAlign="left"
                        >
                            Nome: {truncateText(user.name, 15)}
                        </Text>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work sans"
                            fontWeight="bold"
                            textAlign="left"
                        >
                            Email: {truncateText(user.email, 15)}
                        </Text>
                    </Flex>
                </ModalBody>
                <ModalFooter className="modal-footer">
                    <Button className="profile-modal-close-button" onClick={onClose}>Fechar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="profile-modal-container">
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} className="btn-view-profile"/>
            )}
            {isOpen && <ProfileModalContent isOpen={isOpen} onClose={onClose} user={user} />}
        </div>
    );
};

export default ProfileModal;
