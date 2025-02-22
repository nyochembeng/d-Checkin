import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat, IMessage, Send } from "react-native-gifted-chat";
import { Header } from "@/components/utils/Header";
import { useTheme } from "@/lib/hooks/useTheme";
import Icon from "@expo/vector-icons/Ionicons";

const renderSend = (props: any) => {
  return (
    <Send {...props}>
      <View style={{ marginBottom: 11, marginRight: 11 }}>
        <Icon name="send" size={24} color="#0075FD" />
      </View>
    </Send>
  );
};

export default function ReportIssuePage() {
  const theme = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Set initial messages (could be a system greeting, for instance)
    setMessages([
      {
        _id: 1,
        text: "Hello! How can we help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Tech Support",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = [] as IMessage[]) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    // Here you can also send the message to your backend API if needed.
  }, []);

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <Header title="Report an Issue" showBack />

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder="Type your issue here..."
        renderAvatar={null}
        renderUsernameOnMessage={false}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        messagesContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
