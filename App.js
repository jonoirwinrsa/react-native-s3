import { withAuthenticator } from "aws-amplify-react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import ImageFeed from "./components/ImageFeed";

const App = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <ImageFeed />
  </SafeAreaView>
);

export default withAuthenticator(App, { includeGreetings: true });
