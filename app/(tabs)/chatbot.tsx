import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "@/constants/colors";
import Constants from "expo-constants";
import { useFont } from "@/lib/fonts";

const CHAT_HISTORY_KEY = '@nidhi_chat_history';

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const SYSTEM_PROMPT =
  "You are a financial assistant for beginners in India. " +
  "Explain finance topics in very simple English. " +
  "If the user writes in Tamil, reply in Tamil. " +
  "Keep explanations short, clear, and beginner friendly. " +
  "Do not guarantee investment returns.";

const EN_COPY = {
  title: "Finance Chat Assistant",
  subtitle: "Savings | SIP | Govt Schemes | Budgeting",
  placeholder: "Ask your finance doubts...",
  thinking: "Preparing a simple answer...",
  suggestion1: "How should I start budgeting my monthly salary?",
  suggestion2: "What is SIP and how much should a beginner invest?",
  suggestion3: "How much emergency fund should I keep in India?",
};

export default function ChatbotScreen() {
  const { i18n } = useTranslation();
  const fonts = useFont();
  const tabBarHeight = useBottomTabBarHeight();

  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const copy = useMemo(() => EN_COPY, []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHAT_HISTORY_KEY).then((data) => {
      if (data) setMessages(JSON.parse(data));
    });
  }, []);

  const clearChat = () => {
    setMessages([]);
    setInput("");
    AsyncStorage.removeItem(CHAT_HISTORY_KEY);
  };

 const apiKey =
  Constants.expoConfig?.extra?.MISTRAL_API_KEY ||
  (Constants as any).manifest?.extra?.MISTRAL_API_KEY ||
  process.env.EXPO_PUBLIC_MISTRAL_API_KEY ||
  "";
  console.log("API KEY STATUS:", apiKey ? "Loaded" : "Missing");

  console.log("Mistral API KEY:", apiKey ? "Loaded" : "Missing");

  const saveMessages = async (msgs: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(msgs));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    saveMessages(nextMessages);

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: "API key missing. Please configure the Mistral API key.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              ...nextMessages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        }
      );

      if (!response.ok) {
  const errText = await response.text();
  console.log("Mistral API error:", errText);
  throw new Error(`API ERROR: ${errText}`);
}

      const json = await response.json();

      const reply =
        json?.choices?.[0]?.message?.content ??
        "Sorry, I could not generate a response.";

      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            id: `a_${Date.now()}`,
            role: 'assistant' as ChatRole,
            content: reply,
          },
        ];
        saveMessages(updated);
        return updated;
      });
    }  catch (error: any) {
  console.log("Mistral request failed:", error);

  setMessages((prev) => [
    ...prev,
    {
      id: `a_${Date.now()}`,
      role: "assistant",
      content:
        error?.message ||
        "AI service error. Please check internet connection.",
    },
  ]);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <>
      <Stack.Screen options={{ title: "Chat" }} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={[styles.title, { fontFamily: fonts.bold }]}>
                  {copy.title}
                </Text>
                <Text style={[styles.subtitle, { fontFamily: fonts.regular }]}>
                  {copy.subtitle}
                </Text>
              </View>

              <Pressable onPress={clearChat} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>
          </View>

          {/* CHAT AREA */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: tabBarHeight + 100,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Ask your finance doubts...</Text>

                <View style={styles.suggestionsContainer}>
                  <Pressable
                    style={styles.suggestionButton}
                    onPress={() => {
                      setInput(copy.suggestion1);
                      inputRef.current?.focus();
                    }}
                  >
                    <Text style={styles.suggestionText}>{copy.suggestion1}</Text>
                  </Pressable>

                  <Pressable
                    style={styles.suggestionButton}
                    onPress={() => {
                      setInput(copy.suggestion2);
                      inputRef.current?.focus();
                    }}
                  >
                    <Text style={styles.suggestionText}>{copy.suggestion2}</Text>
                  </Pressable>

                  <Pressable
                    style={styles.suggestionButton}
                    onPress={() => {
                      setInput(copy.suggestion3);
                      inputRef.current?.focus();
                    }}
                  >
                    <Text style={styles.suggestionText}>{copy.suggestion3}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    msg.role === "user" ? styles.userAlign : styles.botAlign,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      msg.role === "user" ? styles.userBubble : styles.botBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        msg.role === "user"
                          ? { color: "#fff" }
                          : { color: "#111827" },
                      ]}
                    >
                      {msg.content}
                    </Text>
                  </View>
                </View>
              ))
            )}

            {loading && (
              <View style={[styles.messageRow, styles.botAlign]}>
                <View
                  style={[
                    styles.bubble,
                    styles.botBubble,
                    { flexDirection: "row", alignItems: "center" },
                  ]}
                >
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>{copy.thinking}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* INPUT BAR */}
          <View style={[styles.inputWrapper, { marginBottom: tabBarHeight + 8 }]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={copy.placeholder}
              multiline
            />

            <Pressable
              style={[
                styles.sendButton,
                (!input.trim() || loading) && { opacity: 0.4 },
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || loading}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },

  title: {
    fontSize: 20,
    color: "#111827",
  },

  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyText: {
    color: "#6B7280",
  },

  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },

  clearText: {
    color: Colors.primary,
    fontWeight: "600",
  },

  suggestionsContainer: {
    marginTop: 20,
    gap: 10,
    width: "100%",
  },

  suggestionButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  suggestionText: {
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: 13,
  },

  messageRow: {
    marginVertical: 6,
    flexDirection: "row",
  },

  userAlign: {
    justifyContent: "flex-end",
  },

  botAlign: {
    justifyContent: "flex-start",
  },

  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: "80%",
  },

  userBubble: {
    backgroundColor: Colors.primary,
  },

  botBubble: {
    backgroundColor: "#E5E7EB",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#6B7280",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    maxHeight: 120,
  },

  sendButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
