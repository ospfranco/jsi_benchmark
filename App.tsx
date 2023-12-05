import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { answer, getExpoRecord } from "./modules/my-module";
import { useEffect, useState } from "react";
import performance from "react-native-performance";
import { ACCESSIBILITY } from "@op-engineering/op-s2";
// Here to force op-s2 to load
const randomValue = ACCESSIBILITY.AFTER_FIRST_UNLOCK;

const jsiAnswer = global.rawAnswer;

const ITERATIONS = 10000;

const jsObject = {
  duck: 7,
};

const jsMap = new Map();
jsMap.set("duck", 7);

function jsAnswer() {
  return 42;
}

export default function App() {
  const [results, setResults] = useState<any>({
    pureTime: 0,
    expoTime: 0,
    hostObjectTime: 0,
    jsiObjectTime: 0,
    jsAccessTime: 0,
    mapAccessTime: 0,
    expoAccessTime: 0,
    jsiAccessTime: 0,
    hostObjectAccessTime: 0,
    nativeStateAccessTime: 0,
  });

  useEffect(() => {
    let start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      jsAnswer();
    }
    let end = performance.now();
    let pureTime = end - start;

    global.gc();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      answer();
    }
    end = performance.now();
    let expoTime = end - start;

    global.gc();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      global.hostObject.answer();
    }
    end = performance.now();
    let hostObjectTime = end - start;

    global.gc();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      // @ts-ignore
      global.rawAnswer();
    }
    end = performance.now();
    let jsiObjectTime = end - start;

    // // Testing access time

    global.gc();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      let quack = jsObject.duck;
    }
    end = performance.now();
    let jsAccessTime = end - start;

    global.gc();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      let quack = jsMap.get("duck");
    }
    end = performance.now();
    let mapAccessTime = end - start;

    global.gc();
    let expoObject = getExpoRecord();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      let quack = expoObject.duck;
    }
    end = performance.now();
    let expoAccessTime = end - start;

    global.gc();
    // @ts-ignore
    let jsiObject = global.getRawObject();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      let quack = jsiObject.duck;
    }
    end = performance.now();
    let jsiAccessTime = end - start;

    global.gc();
    // @ts-ignore
    let hostObject = global.__OPS2Proxy;
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      // @ts-ignore
      let quack = hostObject.duck;
    }
    end = performance.now();
    let hostObjectAccessTime = end - start;
    global.gc();

    // @ts-ignore
    let nativeStateObj = global.getNativeStateObject();
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      // @ts-ignore
      let quack = global.getDuck(nativeStateObj);
    }
    end = performance.now();
    let nativeStateAccessTime = end - start;

    setResults({
      pureTime,
      expoTime,
      hostObjectTime,
      jsiObjectTime,
      jsAccessTime,
      mapAccessTime,
      expoAccessTime,
      jsiAccessTime,
      hostObjectAccessTime,
      nativeStateAccessTime,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ANDROID (debug)</Text>
      <Text style={styles.header}>Function Calls</Text>
      <Text style={styles.label}>Pure JS </Text>
      <Text>{results.pureTime.toFixed(2)}ms</Text>
      <Text style={styles.label}>Expo Module</Text>
      <Text>
        {results.expoTime.toFixed(2)}ms →{" "}
        {(results.expoTime / results.pureTime).toFixed(2)}x
      </Text>
      <Text style={styles.label}>C++ Host Object </Text>
      <Text>
        {results.hostObjectTime.toFixed(2)}ms →{" "}
        {(results.hostObjectTime / results.pureTime).toFixed(2)}x
      </Text>
      <Text style={styles.label}>C++ JSI </Text>
      <Text>
        {results.jsiObjectTime.toFixed(2)}ms →{" "}
        {(results.jsiObjectTime / results.pureTime).toFixed(2)}x
      </Text>
      <Text style={styles.header}>Object access</Text>
      <Text style={styles.label}>JS Record</Text>
      <Text>{results.jsAccessTime.toFixed(2)}ms</Text>
      <Text style={styles.label}>JS Map</Text>
      <Text>
        {results.mapAccessTime.toFixed(2)}ms →{" "}
        {(results.mapAccessTime / results.jsAccessTime).toFixed(2)}x
      </Text>
      <Text style={styles.label}>Expo Record</Text>
      <Text>
        {results.expoAccessTime.toFixed(2)}ms →{" "}
        {(results.expoAccessTime / results.jsAccessTime).toFixed(2)}x
      </Text>
      <Text style={styles.label}>JSI Raw Object</Text>
      <Text>
        {results.jsiAccessTime.toFixed(2)}ms →{" "}
        {(results.jsiAccessTime / results.jsAccessTime).toFixed(2)}x
      </Text>
      <Text style={styles.label}>JSI Host Object</Text>
      <Text>
        {results.hostObjectAccessTime.toFixed(2)}ms →{" "}
        {(results.hostObjectAccessTime / results.jsAccessTime).toFixed(2)}x
      </Text>
      <Text style={styles.label}>Native State Object</Text>
      <Text>
        {results.nativeStateAccessTime.toFixed(2)}ms →{" "}
        {(results.nativeStateAccessTime / results.jsAccessTime).toFixed(2)}x
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "bold",
  },
  header: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
});
