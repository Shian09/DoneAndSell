import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms";
import authApi from "../../api/auth";
import useAuth from "../hooks/useAuth";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function LoginScreen() {
  const auth = useAuth();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (loginInfo) => {
    Keyboard.dismiss();
    const { email, password } = loginInfo;
    setLoading(true);
    const result = await authApi.login(email, password);

    if (!result.ok) {
      setLoading(false);
      return setHasError(true);
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
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <ErrorMessage
                error="Invalid email and/or password."
                visible={hasError}
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

              {!loading && <SubmitButton title="Login" />}
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
