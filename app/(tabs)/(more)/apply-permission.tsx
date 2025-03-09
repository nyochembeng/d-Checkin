import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Chip, Divider, Surface } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";

type FormData = {
  subject: string;
  message: string;
  category?: string;
};

type DocumentFile = {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
};

export default function ApplyPermission() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Medical Leave",
    "Family Emergency",
    "Academic Event",
    "Personal Leave",
    "Other",
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      // Pre-fill data if editing a permission
      subject: id ? "Pre-filled subject" : "",
      message: id ? "Pre-filled message" : "",
      category: id ? "Medical Leave" : undefined,
    },
  });

  // Set the initial category if editing
  useEffect(() => {
    if (id) {
      setSelectedCategory("Medical Leave"); // Replace with actual data
    }
  }, [id]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "application/msword"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newFiles = result.assets.map((asset) => ({
          name: asset.name,
          uri: asset.uri,
          size: asset.size,
          mimeType: asset.mimeType,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const removeFile = (uri: string) => {
    setFiles((prev) => prev.filter((file) => file.uri !== uri));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue("category", category);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here, you would typically send `data` and `files` to your backend
      console.log("Form Data:", {
        ...data,
        category: selectedCategory,
        files: files,
      });

      // After submission, navigate back to the permissions page
      router.replace("/permissions");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format file size to readable format
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar backgroundColor={theme.colors.background} />

      {/* Header */}
      <Header
        title={id ? "Edit Permission" : "Apply for Permission"}
        showBack
        showNotification
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Surface
          style={[styles.formCard, { backgroundColor: theme.colors.cards }]}
        >
          {/* Form Title and Description */}
          <Text
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            {id ? "Update Your Request" : "Request Details"}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.colors.mutedForeground },
            ]}
          >
            {id
              ? "Make changes to your existing permission request."
              : "Please provide detailed information about your request."}
          </Text>

          <Divider style={styles.divider} />

          {/* Category Selection */}
          <Text style={[styles.inputLabel, { color: theme.colors.foreground }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategorySelect(category)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      selectedCategory === category
                        ? theme.colors.primary
                        : `${theme.colors.primary}20`,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      selectedCategory === category
                        ? theme.colors.cards
                        : theme.colors.primary,
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Subject Input */}
          <Text style={[styles.inputLabel, { color: theme.colors.foreground }]}>
            Subject
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Subject is required",
              minLength: {
                value: 5,
                message: "Subject must be at least 5 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter a clear subject for your request"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.subject}
                outlineStyle={styles.inputOutline}
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                outlineColor={theme.colors.muted}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.mutedForeground}
                textColor={theme.colors.foreground}
              />
            )}
            name="subject"
          />
          {errors.subject && (
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              {errors.subject.message}
            </Text>
          )}

          {/* Message Input */}
          <Text style={[styles.inputLabel, { color: theme.colors.foreground }]}>
            Message
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Please provide more details (at least 10 characters)",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Explain your request in detail"
                mode="outlined"
                multiline
                numberOfLines={6}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.message}
                outlineStyle={styles.inputOutline}
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: theme.colors.background },
                ]}
                outlineColor={theme.colors.muted}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.mutedForeground}
                textColor={theme.colors.foreground}
              />
            )}
            name="message"
          />
          {errors.message && (
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              {errors.message.message}
            </Text>
          )}
        </Surface>

        {/* Supporting Documents Section */}
        <Surface
          style={[styles.formCard, { backgroundColor: theme.colors.cards }]}
        >
          <Text
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            Supporting Documents
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.colors.mutedForeground },
            ]}
          >
            Attach any relevant documents to support your request (optional).
          </Text>

          <Divider style={styles.divider} />

          {/* File Upload Button */}
          <Button
            mode="outlined"
            onPress={pickDocument}
            style={[styles.uploadButton, { borderColor: theme.colors.primary }]}
            textColor={theme.colors.primary}
            icon={({ size, color }) => (
              <MaterialIcons name="attach-file" size={size} color={color} />
            )}
          >
            Select Files
          </Button>

          {/* File List */}
          {files.length > 0 && (
            <View style={styles.filesList}>
              {files.map((file, index) => (
                <View
                  key={index}
                  style={[
                    styles.fileItem,
                    { backgroundColor: `${theme.colors.primary}10` },
                  ]}
                >
                  <View style={styles.fileInfo}>
                    <MaterialIcons
                      name={
                        file.mimeType?.includes("image")
                          ? "image"
                          : "insert-drive-file"
                      }
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.fileDetails}>
                      <Text
                        style={[
                          styles.fileName,
                          { color: theme.colors.foreground },
                        ]}
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                      <Text
                        style={[
                          styles.fileSize,
                          { color: theme.colors.mutedForeground },
                        ]}
                      >
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFile(file.uri)}
                    style={styles.removeFileButton}
                  >
                    <MaterialIcons
                      name="close"
                      size={20}
                      color={theme.colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Surface>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          disabled={isSubmitting}
          contentStyle={styles.submitButtonContent}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.cards} size="small" />
          ) : (
            <Text
              style={[styles.submitButtonText, { color: theme.colors.cards }]}
            >
              {id ? "Update Request" : "Submit Request"}
            </Text>
          )}
        </Button>

        {/* Cancel Button */}
        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.cancelButton}
          textColor={theme.colors.mutedForeground}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    marginBottom: 4,
  },
  inputOutline: {
    borderRadius: 8,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
  },
  uploadButton: {
    borderRadius: 8,
    marginVertical: 8,
  },
  filesList: {
    marginTop: 8,
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileDetails: {
    marginLeft: 10,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 12,
  },
  removeFileButton: {
    padding: 6,
  },
  submitButton: {
    borderRadius: 8,
    marginTop: 8,
    height: 48,
  },
  submitButtonContent: {
    height: 48,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 8,
  },
});