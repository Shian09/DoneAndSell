import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import authApi from "../../api/auth";
import useAuth from "../hooks/useAuth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  image: Yup.array().max(1, "You cannot select more than one image"),
});

export default function RegisterScreen() {
  const auth = useAuth();
  const [error, setError] = useState();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (userInfo) => {
    Keyboard.dismiss();
    setLoading(true);
    const result = await authApi.register(userInfo);

    if (!result.ok) {
      setHasError(true);
      setLoading(false);
      if (result.data) setError(result.data.error);
      else {
        setError("An unexpected error occurred.");
      }
      return;
    }
    setLoading(false);
    setHasError(false);
    auth.login(result.data);
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <View style={styles.wholeView}>
        <Screen style={styles.container}>
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 150}
          >
            <Image
              style={styles.logo}
              source={require("../assets/logo-red.png")}
            />

            <AppForm
              initialValues={{ name: "", email: "", password: "", image: [] }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={hasError} />
              <AppFormImagePicker name="image" />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                name="name"
                placeholder="Name"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="email"
                placeholder="Email"
                textContentType="emailAddress"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
              />
              {!loading && <SubmitButton title="Register" />}
            </AppForm>
          </KeyboardAvoidingView>
        </Screen>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wholeView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 20,
  },
});
