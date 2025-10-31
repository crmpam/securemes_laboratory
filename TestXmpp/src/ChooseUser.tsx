import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Button } from "react-native";

export const ChooseUser = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Button title="Usuario A" onPress={() => navigation.navigate("", { username: "test_crmpam_a", password: "testcrmpama" })} />
      <Button title="Usuario B" onPress={() => navigation.navigate("", { username: "test_crmpam_b", password: "testcrmpamb" })} />
    </View>
  );
};
