import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Calendar } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { taskAddStyles as styles } from '../screens/TaskAddScreen.styles';

interface TaskDatePickerProps {
  dueDate: Date;
  setDueDate: (d: Date) => void;
  isDateSelected: boolean;
  setIsDateSelected: (val: boolean) => void;
  showDatePicker: boolean;
  setShowDatePicker: (val: boolean) => void;
  panelBg: string;
  borderColor: string;
  textColor: string;
  labelColor: string;
  isDarkMode: boolean;
}

export default function TaskDatePicker({
  dueDate,
  setDueDate,
  isDateSelected,
  setIsDateSelected,
  showDatePicker,
  setShowDatePicker,
  panelBg,
  borderColor,
  textColor,
  labelColor,
  isDarkMode
}: TaskDatePickerProps) {

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: labelColor }]}>Son Tarih</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Platform.OS === 'web' ? (
          React.createElement('input', {
            type: 'date',
            value: isDateSelected ? dueDate.toISOString().split('T')[0] : '',
            min: new Date().toISOString().split('T')[0],
            onChange: (e: any) => {
              const val = e.target.value;
              if (val) {
                const date = new Date(val);
                if (!isNaN(date.getTime())) {
                  setDueDate(date);
                  setIsDateSelected(true);
                }
              } else {
                setIsDateSelected(false);
              }
            },
            style: { flex: 1, padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, fontSize: '16px', backgroundColor: panelBg, color: textColor, outline: 'none' }
          })
        ) : (
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.dateButton, { backgroundColor: panelBg, borderColor: borderColor }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: textColor, fontWeight: '500' }}>
              {isDateSelected ? dueDate.toLocaleDateString('tr-TR') : "Tarih Seçiniz"}
            </Text>
            <Calendar size={20} color={textColor} />
          </TouchableOpacity>
        )}

        {isDateSelected && (
          <TouchableOpacity onPress={() => { setIsDateSelected(false); if(Platform.OS === 'ios') setShowDatePicker(false); }}>
            <Text style={styles.dateClearText}>Temizle</Text>
          </TouchableOpacity>
        )}
        
        {showDatePicker && Platform.OS === 'ios' && (
          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
            <Text style={styles.dateActionText}>Onayla</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && Platform.OS !== 'web' && (
        <View style={{ marginTop: 16 }}>
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (Platform.OS === 'android') setShowDatePicker(false);
              if (event.type === 'set' && selectedDate) {
                setDueDate(selectedDate);
                setIsDateSelected(true);
              }
            }}
            minimumDate={new Date()}
            themeVariant={isDarkMode ? "dark" : "light"}
            textColor={isDarkMode ? "#ffffff" : "#000000"}
          />
        </View>
      )}
    </View>
  );
}
