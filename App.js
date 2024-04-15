import { useState } from "react";
import PyModel from "./components/model";
import { StyleSheet, SafeAreaView, View ,Text, ScrollView} from "react-native";

export default function App(){
  return(
  <SafeAreaView >
   <PyModel/>
  </SafeAreaView>
  );
}