import { ACCESSIBILITY } from "@op-engineering/op-s2";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import performance from "react-native-performance";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from "victory-native";
import { answer, getExpoRecord } from "./modules/my-module";
import { LinearGradient } from 'expo-linear-gradient';
// Here to force op-s2 to load
const randomValue = ACCESSIBILITY.AFTER_FIRST_UNLOCK;

const jsiAnswer = global.rawAnswer;

const ITERATIONS = 10000;

const jsObject = {
  duck: 7,
};

const jsMap = new Map();
jsMap.set("duck", 7);

const chartTheme = {...VictoryTheme.material}
chartTheme.axis.style.tickLabels.fill = 'white'



function jsAnswer() {
  return 42;
}

export default function App() {

  const [data, setData] = useState([])
  const [accessData, setAccessData] = useState([])

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

    setData([
      {source: 'Expo', time: expoTime},
      {source: 'HostObject', time: hostObjectTime},
      {source: 'JSI fn', time: jsiObjectTime},
      {source: 'Vanilla JS', time: pureTime},
    ])
    
    setAccessData([
      {source: 'JSI Native State', time: nativeStateAccessTime},
      {source: 'HostObject', time: hostObjectAccessTime},
      {source: 'JS Map', time: mapAccessTime},
      {source: 'Expo', time: expoAccessTime},
      {source: 'JSI', time: jsiAccessTime},
      {source: 'Vanilla JS', time: jsAccessTime},
    ])
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.background}
      />
      <Text style={styles.title}>{Platform.OS}</Text>
      <Text style={styles.subtitle}>{ITERATIONS} iterations</Text>
      
      <VictoryChart 
      width={350} 
      height={250} theme={chartTheme} padding={{left: 100, top: 40, bottom: 75, right: 60}}>
        <Text style={styles.subtitle}>Function call</Text>
          <VictoryBar 
            style={{ data: { fill: "white" }, labels: {fill: 'white'} }}
            labels={({ datum }) => `${datum.time.toFixed(2)}ms`}
            padding={200}
            data={data} 
            x="source" 
            y="time" 
            horizontal 
            alignment="start" 
            barWidth={20} 
            // style={{ labels: { fill: "red" } }} 
            labelComponent={<VictoryLabel dy={-8} />}
          />
          <VictoryAxis style={{grid: {stroke: 'transparent'}}}/>
          {/* <VictoryAxis dependentAxis/> */}
        </VictoryChart>
      <VictoryChart width={350} height={300} theme={chartTheme} padding={{left: 100, top: 40, bottom: 75, right: 60}}>
        <Text style={styles.subtitle}>Property access</Text>
          <VictoryBar 
            style={{ data: { fill: "white" }, labels: {fill: 'white'} }}
            labels={({ datum }) => `${datum.time.toFixed(2)}ms`}
            padding={200}
            data={accessData} 
            x="source" 
            y="time" 
            horizontal 
            alignment="start" 
            barWidth={20} 
            // style={{ labels: { fill: "red" } }} 
            labelComponent={<VictoryLabel dy={-8}/>}
          />
          <VictoryAxis style={{grid: {stroke: 'transparent'}}}/>
        </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    color: 'white'
  },
  subtitle: {
    color: 'white',
    marginBottom: 40
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
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
