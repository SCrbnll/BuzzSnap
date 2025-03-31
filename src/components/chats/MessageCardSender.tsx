import React from "react";
import { Message } from "@/services/api/types";

interface MessageCardSenderProps {
  message: Message;
}

const MessageCardSender: React.FC<MessageCardSenderProps> = ({ message }) => {
  return (
    <div className="message-card sender">
      <div className="message-header">
        <div className="message-info">
          <p className="sender-name">{message.sender.name}</p>
          <span className="timestamp">
            {new Date(message.createdAt).toLocaleDateString()} -{" "}
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="message-bubble">{message.content}</div>
    </div>
  );
};

export default MessageCardSender;
