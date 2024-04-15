import React, { useState } from 'react';
import { Dimensions ,View, Text, Button, TextInput, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';

const fetchData = async (features) => {
  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ features }),
    });
    const data = await response.json();
    console.log("The data is",data)
    return data.riskLevel;
  } catch (error) {
    console.error("Fetching error:", error);
    return "Error fetching data";
  }
};

  const styles = StyleSheet.create({
    body:{
        marginTop:10,
        minHeight: Dimensions.get('window').height,
    },

    input_box: {
        margin: 10,
        color: 'black',
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
    },

    text_form_head:{
        color: '#FE7F9B',
        fontSize:25,
        fontWeight: 'bold',
        textAlign:'center',
        marginBottom: 20
    },

    submit_button: {
        margin: 10,
        alignItems: 'center',
        backgroundColor: '#FFB5BB',
        padding: 10,
        borderRadius: 5,
    },

    submit_button_text: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },

    message:{
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        textAlign:'center',
        fontSize: 18,
        fontWeight: 'bold'
    },

    riskContent:{
     marginTop: 30,
     marginLeft:20

    },

    riskContentHeading:{
        color:'black',
        fontSize:22,
        fontWeight:'bold',
        textAlign:'center',
    },

    riskContentBody:{
        fontSize: 18,
    }

  });

export default function PyModel() {
    const [riskLevel,setRiskLevel]= useState('')
    const [Age, setAge] = useState('');
    const [DiastolicBP, setBP] = useState('');
    const [BS, setBloodGlucose] = useState('');
    const [BodyTemp, setBodyTemp] = useState('');
    const [HeartRate, setHeartRate] = useState('');
    const [message, setMessage] = useState('');

   const prepareFeaturesArray = (Age, DiastolicBP, BS, BodyTemp, HeartRate) => {
     const parsedValues = [
       parseFloat(Age),
       parseFloat(DiastolicBP),
       parseFloat(BS),
       parseFloat(BodyTemp),
       parseFloat(HeartRate)
     ];
     return parsedValues;
   };


    const handleSubmit = async () => {
      const features = prepareFeaturesArray(Age, DiastolicBP, BS, BodyTemp, HeartRate);
      console.log("Features for prediction:", features);

      const riskLevel = await fetchData(features);
      setMessage(`Your risk level is: ${riskLevel}.`);
      setRiskLevel(riskLevel);
    };

    const renderRiskAdvice = (riskLevel) => {
      switch (riskLevel) {
        case 'high':
          return (
            <Text style={styles.riskContent}>
              <Text style={styles.riskContentHeading}>Advice for high risk level: </Text>
              <Text style={styles.riskContentBody}>
               {"\n"}- Avoid drugs and alcohol.
                {"\n"}- Identify potential health risks before getting pregnant.
                {"\n"}- Maintain a healthy body weight.
                {"\n"}- Manage preexisting health conditions.
                {"\n"}- Ensure medications are safe during pregnancy.
                {"\n"}- Quit smoking.
              </Text>
            </Text>
          );
        case 'mid':
          return (
            <Text style={styles.riskContent}>
              <Text style={styles.riskContentHeading}>Advice for mid risk level: </Text>
              <Text style={styles.riskContentBody}>
              {"\n"}- Maintain a balanced lifestyle.
              {"\n"}- Keep regular health check-ups.
              {"\n"}- Consult a healthcare professional for personalized advice.
            </Text>
            </Text>
          );
        case 'low':
          return (
            <Text style={styles.riskContent}>
              <Text style={styles.riskContentHeading}>Advice for low risk level: </Text>
              <Text style={styles.riskContentBody}>
              {"\n"}- Continue with healthy habits.
              {"\n"}- Stay active and maintain a balanced diet.
              {"\n"}- Keep track of your health indicators.
            </Text>
            </Text>
          );
        default:
          return null;
      }
    };

  return (
    <ScrollView style={styles.body}>
    <Text style={styles.text_form_head}>Form for Risk Level Checking </Text>
     <TextInput style={styles.input_box} placeholder="Age" onChangeText={setAge} value={Age} keyboardType="numeric" />
           <TextInput style={styles.input_box} placeholder="Diastolic BP" onChangeText={setBP} value={DiastolicBP} keyboardType="numeric" />
           <TextInput style={styles.input_box} placeholder="Blood Glucose" onChangeText={setBloodGlucose} value={BS} keyboardType="numeric" />
           <TextInput style={styles.input_box} placeholder="Body Temperature" onChangeText={setBodyTemp} value={BodyTemp} keyboardType="numeric" />
           <TextInput style={styles.input_box} placeholder="Heart Rate" onChangeText={setHeartRate} value={HeartRate} keyboardType="numeric" />
      <TouchableOpacity onPress={handleSubmit} style={styles.submit_button}>
        <Text style={styles.submit_button_text}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
       {renderRiskAdvice(riskLevel)}
    </ScrollView>
  );
};


//tensorflowjs_converter --input_format=keras ./notebook/final_model.h5 ./tfjs_model
