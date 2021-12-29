import React, { useState } from "react";
import {
  Chat,
  MessageList,
  MessageInput,
  useUsers,
} from "@pubnub/react-chat-components";
import { Container, Modal, ModalHeader } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";

const ChatRoom = (props) => {
    const [users] = useUsers();
    const [open, setOpen] = useState(true);
    return(
        <Modal size="xl" isOpen={open} toggle={() => setOpen(false)}>
            <ModalHeader>{props.channel}</ModalHeader>
            <ModalBody>
                <Container style={{height: "70vh"}}>
                    <Chat {...{currentChannel: props.channel}} users={users}>
                        <MessageList className='message-list' />
                        <MessageInput />
                    </Chat>
                </Container>
            </ModalBody>
            <ModalFooter>
                <p/><p/><p/>
            </ModalFooter>
        </Modal>
    );
};

export default ChatRoom;