import React,{useState} from "react";
import { View} from "react-native";
import { Button } from 'react-native-paper';
import { DatePickerModal,DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";

export function InputDatePickerPaper({
    defaultDate,
    whithDate,
    render
}) {
    const [inputDate, setInputDate] =useState(defaultDate)

    return (
      <SafeAreaProvider>
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
          <DatePickerInput
            locale="en"
            label={whithDate}
            value={inputDate}
            onChange={(d) => {
              // alert(ceMois.toString()+ " " +maintenant.toString())
                setInputDate(d);
                render(d)
                }}
            inputMode="start"
            inputProps={{ placeholder: '',}}
          />
        </View>
      </SafeAreaProvider>
    )
  }