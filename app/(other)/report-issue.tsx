import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Animated,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  GiftedChat,
  IMessage,
  Send,
  Bubble,
  InputToolbar,
  MessageProps,
  Day,
  Avatar,
  MessageImage,
} from "react-native-gifted-chat";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Header } from "@/components/utils/Header";
import { Text } from "@/components/utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { Chip, Menu, Portal, Dialog } from "react-native-paper";

// Category types
type IssueCategory =
  | "technical"
  | "billing"
  | "attendance"
  | "permissions"
  | "general";

// Extend IMessage to include custom properties
interface ExtendedMessage extends IMessage {
  image?: string;
  systemMessage?: boolean;
  isTyping?: boolean;
  category?: IssueCategory;
}

// Agent info
const SUPPORT_AGENT = {
  _id: 2,
  name: "Support Team",
  avatar: require("@/assets/images/customer-service.png"),
};

// Common issue categories
const ISSUE_CATEGORIES: Array<{
  id: IssueCategory;
  label: string;
  icon: string;
}> = [
  { id: "technical", label: "Technical", icon: "settings" },
  { id: "billing", label: "Billing", icon: "receipt" },
  { id: "attendance", label: "Attendance", icon: "event" },
  { id: "permissions", label: "Permissions", icon: "vpn-key" },
  { id: "general", label: "General", icon: "help" },
];

// Simulated support agent responses
const simulateAgentResponse = (
  userMessage: string,
  category?: IssueCategory
): ExtendedMessage => {
  const responses = {
    technical: [
      "I understand you're having technical difficulties. Could you share what specific error message you're seeing?",
      "Let me help resolve your technical issue. Have you already tried restarting the application?",
      "Our technical team will look into this right away. In the meantime, could you tell me which device you're using?",
    ],
    billing: [
      "I see you have a billing concern. Could you provide your account ID or the invoice number in question?",
      "Thank you for reaching out about billing. When did you first notice the discrepancy?",
      "Our billing department will review this. For verification, could you confirm when your last payment was made?",
    ],
    attendance: [
      "I see your concern is about attendance. Could you specify the date and time in question?",
      "For attendance issues, we'll need to check the system logs. Could you tell me which session you're referring to?",
      "We take attendance accuracy very seriously. Please provide the details of the missed or incorrect check-in/out.",
    ],
    permissions: [
      "For permission-related issues, we'll need to verify your account level. What specific permission are you trying to access?",
      "Let me check your permission settings. What exactly are you unable to access?",
      "Permission requests typically require supervisor approval. Have you already submitted a formal request?",
    ],
    general: [
      "Thank you for reaching out. Could you provide more details about your issue so I can assist you better?",
      "I'd be happy to help. Could you elaborate on what you're experiencing?",
      "Let me connect you with the right department. Could you tell me more about what you need assistance with?",
    ],
  };

  const getRandomResponse = (specificCategory: IssueCategory): string => {
    const categoryResponses = responses[specificCategory];
    return categoryResponses[
      Math.floor(Math.random() * categoryResponses.length)
    ];
  };

  // Determine category based on message content or specified category
  let messageCategory: IssueCategory = category || "general";
  if (!category) {
    if (
      userMessage.toLowerCase().includes("technical") ||
      userMessage.toLowerCase().includes("error") ||
      userMessage.toLowerCase().includes("bug")
    ) {
      messageCategory = "technical";
    } else if (
      userMessage.toLowerCase().includes("bill") ||
      userMessage.toLowerCase().includes("payment") ||
      userMessage.toLowerCase().includes("charge")
    ) {
      messageCategory = "billing";
    } else if (
      userMessage.toLowerCase().includes("attendance") ||
      userMessage.toLowerCase().includes("check in") ||
      userMessage.toLowerCase().includes("checkin")
    ) {
      messageCategory = "attendance";
    } else if (
      userMessage.toLowerCase().includes("permission") ||
      userMessage.toLowerCase().includes("access") ||
      userMessage.toLowerCase().includes("allow")
    ) {
      messageCategory = "permissions";
    }
  }

  const message: ExtendedMessage = {
    _id: Math.random().toString(),
    text: getRandomResponse(messageCategory),
    createdAt: new Date(),
    user: SUPPORT_AGENT,
    systemMessage: false,
    category: messageCategory,
  };

  return message;
};

export default function ReportIssuePage() {
  const theme = useTheme();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<IssueCategory | null>(null);
  const [isCategoryDialogVisible, setIsCategoryDialogVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFaqVisible, setIsFaqVisible] = useState(false);

  const uploadProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial system greeting
    setMessages([
      {
        _id: "welcome-message",
        text: "Hello! Welcome to d-Checkin support. How can I assist you today? Please select a category for your issue or type your question below.",
        createdAt: new Date(),
        user: SUPPORT_AGENT,
        systemMessage: true,
      },
    ]);
  }, []);

  const startTypingAnimation = () => {
    setIsTyping(true);
    // Simulate agent typing for a realistic feel
    setTimeout(() => setIsTyping(false), Math.random() * 1000 + 1000);
  };

  const simulateUploadProgress = () => {
    setIsUploading(true);
    uploadProgress.setValue(0);
    Animated.timing(uploadProgress, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsUploading(false);
    });
  };

  const onSend = useCallback((newMessages: ExtendedMessage[] = []) => {
    const userMessage = newMessages[0];

    // Add user message
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Simulate agent typing
    startTypingAnimation();

    // Simulate agent response after a realistic delay
    setTimeout(() => {
      const agentResponse = simulateAgentResponse(
        userMessage.text,
        userMessage.category
      );
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [agentResponse])
      );
    }, Math.random() * 1000 + 1500);
  }, []);

  const handleSelectCategory = (category: IssueCategory) => {
    setSelectedCategory(category);
    setIsCategoryDialogVisible(false);

    // Create a message from the user with the selected category
    const categoryDetails = ISSUE_CATEGORIES.find((c) => c.id === category);
    const userMessage: ExtendedMessage = {
      _id: Math.random().toString(),
      text: `I need help with a ${categoryDetails?.label.toLowerCase()} issue.`,
      createdAt: new Date(),
      user: { _id: 1 },
      category: category,
    };

    onSend([userMessage]);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your media library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        simulateUploadProgress();

        setTimeout(() => {
          const newMessage: ExtendedMessage = {
            _id: Math.random().toString(),
            image: result.assets[0].uri,
            createdAt: new Date(),
            text: "",
            user: {
              _id: 1,
            },
            category: selectedCategory || undefined,
          };

          onSend([newMessage]);
          setIsAttachmentMenuVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "There was an error selecting the image");
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your camera"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        simulateUploadProgress();

        setTimeout(() => {
          const newMessage: ExtendedMessage = {
            _id: Math.random().toString(),
            image: result.assets[0].uri,
            createdAt: new Date(),
            text: "",
            user: {
              _id: 1,
            },
            category: selectedCategory || undefined,
          };

          onSend([newMessage]);
          setIsAttachmentMenuVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "There was an error capturing the image");
    }
  };

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={styles.sendContainer}
        disabled={!props.text && !props.image}
      >
        <View style={[styles.sendButton, { opacity: props.text ? 1 : 0.5 }]}>
          <Ionicons
            name="send"
            size={24}
            color={
              props.text ? theme.colors.primary : theme.colors.mutedForeground
            }
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props: MessageProps<ExtendedMessage>) => {
    const { currentMessage } = props;
    const isUserMessage = currentMessage?.user._id === 1;

    // Determine bubble style based on message type
    let bubbleStyle = {};
    if (currentMessage?.systemMessage) {
      bubbleStyle = {
        backgroundColor: `${theme.colors.info}30`,
        borderWidth: 1,
        borderColor: theme.colors.info,
      };
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.primary,
            borderRadius: 16,
            marginVertical: 2,
            ...(!isUserMessage ? bubbleStyle : {}),
          },
          left: {
            backgroundColor: isUserMessage
              ? theme.colors.cards
              : theme.colors.cards,
            borderRadius: 16,
            marginVertical: 2,
            ...(currentMessage?.systemMessage ? bubbleStyle : {}),
          },
        }}
        textStyle={{
          right: {
            color: theme.colors.cards,
            fontSize: 15,
          },
          left: {
            color: theme.colors.foreground,
            fontSize: 15,
          },
        }}
        bottomContainerStyle={{
          left: {
            marginBottom: 4,
          },
          right: {
            marginBottom: 4,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={[
          styles.inputToolbar,
          { backgroundColor: theme.colors.cards },
        ]}
        primaryStyle={{ alignItems: "center" }}
      >
        <View style={styles.attachmentContainer}>
          <TouchableOpacity
            onPress={() => setIsAttachmentMenuVisible(!isAttachmentMenuVisible)}
            style={styles.attachmentButton}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color={theme.colors.mutedForeground}
            />
          </TouchableOpacity>
          {!selectedCategory && (
            <TouchableOpacity
              onPress={() => setIsCategoryDialogVisible(true)}
              style={styles.categoryButton}
            >
              <MaterialIcons
                name="label-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
          {selectedCategory && (
            <Chip
              icon={() => {
                const categoryInfo = ISSUE_CATEGORIES.find(
                  (c) => c.id === selectedCategory
                );
                return (
                  <MaterialIcons
                    name={categoryInfo?.icon as any}
                    size={16}
                    color={theme.colors.primary}
                  />
                );
              }}
              onClose={() => setSelectedCategory(null)}
              style={styles.categoryChip}
              textStyle={{ fontSize: 12, color: theme.colors.primary }}
            >
              {ISSUE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </Chip>
          )}
          {/* {props.renderComposer(props)} */}
          {props.renderSend(props)}
        </View>
      </InputToolbar>
    );
  };

  const renderDay = (props: any) => {
    return (
      <Day
        {...props}
        textStyle={{
          color: theme.colors.mutedForeground,
          fontSize: 12,
          fontWeight: "600",
        }}
        wrapperStyle={{
          paddingVertical: 8,
        }}
      />
    );
  };

  const renderAvatar = (props: any) => {
    return (
      <Avatar
        {...props}
        containerStyle={{
          left: {
            marginRight: 8,
          },
        }}
        imageStyle={{
          left: {
            borderRadius: 16,
          },
        }}
      />
    );
  };

  const renderMessageImage = (props: any) => {
    return (
      <MessageImage
        {...props}
        imageStyle={{
          borderRadius: 12,
          marginHorizontal: 0,
          marginVertical: 0,
        }}
        containerStyle={{
          borderRadius: 12,
          overflow: "hidden",
        }}
      />
    );
  };

  const renderChatFooter = () => {
    if (isUploading) {
      const width = uploadProgress.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
      });

      return (
        <View style={styles.uploadContainer}>
          <View style={styles.uploadProgressContainer}>
            <Animated.View
              style={[
                styles.uploadProgress,
                {
                  backgroundColor: theme.colors.primary,
                  width,
                },
              ]}
            />
          </View>
          <Text style={styles.uploadText}>Uploading image...</Text>
        </View>
      );
    }

    if (isTyping) {
      return (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <Text style={{ color: theme.colors.mutedForeground, fontSize: 12 }}>
              Support is typing
            </Text>
            <View style={styles.typingDots}>
              <View
                style={[
                  styles.typingDot,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <View
                style={[
                  styles.typingDot,
                  { backgroundColor: theme.colors.primary, opacity: 0.7 },
                ]}
              />
              <View
                style={[
                  styles.typingDot,
                  { backgroundColor: theme.colors.primary, opacity: 0.4 },
                ]}
              />
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderFAQs = () => {
    const faqs = [
      { question: "How do I update my profile?", category: "general" },
      {
        question: "Why wasn't my attendance recorded?",
        category: "attendance",
      },
      { question: "How do I request time off?", category: "permissions" },
      { question: "The app is crashing on startup", category: "technical" },
      { question: "Why was I charged twice?", category: "billing" },
    ];

    return (
      <Portal>
        <Dialog
          visible={isFaqVisible}
          onDismiss={() => setIsFaqVisible(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Frequently Asked Questions</Dialog.Title>
          <Dialog.Content>
            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqItem}
                onPress={() => {
                  setIsFaqVisible(false);
                  const category = faq.category as IssueCategory;
                  setSelectedCategory(category);

                  const userMessage: ExtendedMessage = {
                    _id: Math.random().toString(),
                    text: faq.question,
                    createdAt: new Date(),
                    user: { _id: 1 },
                    category: category,
                  };

                  onSend([userMessage]);
                }}
              >
                <MaterialIcons
                  name={
                    (ISSUE_CATEGORIES.find((c) => c.id === faq.category)
                      ?.icon as any) || "help"
                  }
                  size={20}
                  color={theme.colors.primary}
                  style={styles.faqIcon}
                />
                <Text style={{ color: theme.colors.foreground }}>
                  {faq.question}
                </Text>
              </TouchableOpacity>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity
              onPress={() => setIsFaqVisible(false)}
              style={styles.dialogButton}
            >
              <Text style={{ color: theme.colors.primary }}>Close</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar backgroundColor={theme.colors.background} />

      <Header
        title="Support Chat"
        showBack
        rightContent={
          <View style={styles.headerRightContent}>
            <TouchableOpacity
              onPress={() => setIsFaqVisible(true)}
              style={styles.faqButton}
            >
              <MaterialIcons
                name="help-outline"
                size={24}
                color={theme.colors.foreground}
              />
            </TouchableOpacity>
          </View>
        }
      />

      {isAttachmentMenuVisible && (
        <View
          style={[
            styles.attachmentMenu,
            { backgroundColor: theme.colors.cards },
          ]}
        >
          <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
            <View
              style={[
                styles.attachmentIconContainer,
                { backgroundColor: `${theme.colors.primary}20` },
              ]}
            >
              <MaterialIcons
                name="photo-library"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text
              style={[
                styles.attachmentText,
                { color: theme.colors.foreground },
              ]}
            >
              Gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={openCamera}
          >
            <View
              style={[
                styles.attachmentIconContainer,
                { backgroundColor: `${theme.colors.primary}20` },
              ]}
            >
              <MaterialIcons
                name="camera-alt"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text
              style={[
                styles.attachmentText,
                { color: theme.colors.foreground },
              ]}
            >
              Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => {
              Alert.alert(
                "Feature Coming Soon",
                "Document upload will be available in the next update."
              );
              setIsAttachmentMenuVisible(false);
            }}
          >
            <View
              style={[
                styles.attachmentIconContainer,
                { backgroundColor: `${theme.colors.primary}20` },
              ]}
            >
              <MaterialIcons
                name="insert-drive-file"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text
              style={[
                styles.attachmentText,
                { color: theme.colors.foreground },
              ]}
            >
              Document
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Portal>
        <Dialog
          visible={isCategoryDialogVisible}
          onDismiss={() => setIsCategoryDialogVisible(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Select Issue Category</Dialog.Title>
          <Dialog.Content>
            <View style={styles.categoriesContainer}>
              {ISSUE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: `${theme.colors.primary}15` },
                  ]}
                  onPress={() => handleSelectCategory(category.id)}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={24}
                    color={theme.colors.primary}
                    style={styles.categoryIcon}
                  />
                  <Text style={{ color: theme.colors.foreground }}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity
              onPress={() => setIsCategoryDialogVisible(false)}
              style={styles.dialogButton}
            >
              <Text style={{ color: theme.colors.primary }}>Cancel</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {renderFAQs()}

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        placeholder="Type your message here..."
        renderAvatar={renderAvatar}
        renderUsernameOnMessage={true}
        alwaysShowSend
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderDay={renderDay}
        renderMessageImage={renderMessageImage}
        scrollToBottom
        renderChatFooter={renderChatFooter}
        scrollToBottomComponent={() => (
          <View
            style={[
              styles.scrollToBottomContainer,
              { backgroundColor: `${theme.colors.primary}20` },
            ]}
          >
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={theme.colors.primary}
            />
          </View>
        )}
        messagesContainerStyle={{
          backgroundColor: theme.colors.background,
          paddingBottom: 20,
        }}
        timeTextStyle={{
          right: { color: `${theme.colors.cards}80` },
          left: { color: theme.colors.mutedForeground },
        }}
        isTyping={isTyping}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqButton: {
    padding: 8,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  inputToolbar: {
    borderTopWidth: 0,
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
    minHeight: 50,
  },
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 4,
  },
  attachmentButton: {
    padding: 8,
    marginLeft: 4,
  },
  categoryButton: {
    padding: 8,
  },
  categoryChip: {
    height: 32,
    marginLeft: 4,
  },
  attachmentMenu: {
    position: "absolute",
    bottom: 70,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attachmentOption: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    width: "30%",
  },
  attachmentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 12,
    textAlign: "center",
  },
  scrollToBottomContainer: {
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  typingContainer: {
    padding: 8,
    paddingLeft: 16,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    maxWidth: "50%",
  },
  typingDots: {
    flexDirection: "row",
    marginLeft: 8,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  uploadContainer: {
    padding: 12,
    alignItems: "center",
  },
  uploadProgressContainer: {
    height: 4,
    width: "80%",
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  uploadProgress: {
    height: "100%",
  },
  uploadText: {
    fontSize: 12,
    color: "#757575",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryOption: {
    width: "48%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    marginBottom: 8,
  },
  dialogButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  faqIcon: {
    marginRight: 12,
  },
});
