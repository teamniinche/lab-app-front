import React, { useState } from "react";
import { View, Button, Text } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

const MyDatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View>
      <Button title="Sélectionner une date" onPress={() => setShow(true)} />
      <Text>{date.toLocaleDateString()}</Text>
      
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};


export default MyDatePicker;
