import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";

type FormData = {
  subject: string;
  message: string;
};

export default function ApplyPermission() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>(); // if id exists, we're editing
  const [file, setFile] = useState<DocumentPicker.DocumentPickerResult | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      // Replace these with actual data if editing
      subject: id ? "Pre-filled subject" : "",
      message: id ? "Pre-filled message" : "",
    },
  });

  const onSubmit = (data: FormData) => {
    // Here, you would typically send `data` and `file` to your backend
    console.log("Form Data:", data);
    console.log("File:", file);
    // After submission, navigate back to the permissions page
    router.replace("/permissions");
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.canceled === false) {
      setFile(result);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title={id ? "Edit Permission" : "Apply for Permission"}
        showBack
        showNotification
      />

      <View style={styles.form}>
        {/* Subject Input */}
        <Controller
          control={control}
          rules={{ required: "Subject is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Subject"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.subject}
              style={styles.input}
            />
          )}
          name="subject"
        />
        {errors.subject && (
          <Text style={styles.errorText}>{errors.subject.message}</Text>
        )}

        {/* Message Input */}
        <Controller
          control={control}
          rules={{ required: "Message is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Message"
              mode="outlined"
              multiline
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.message}
              style={[styles.input, { height: 100 }]}
            />
          )}
          name="message"
        />
        {errors.message && (
          <Text style={styles.errorText}>{errors.message.message}</Text>
        )}

        {/* File Upload Button */}
        <Button
          mode="outlined"
          onPress={pickDocument}
          style={styles.uploadButton}
        >
          {file ? "Files Selected" : "Upload Files (Optional)"}
        </Button>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          {id ? "Update Permission" : "Submit Permission"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  uploadButton: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 10,
  },
});
