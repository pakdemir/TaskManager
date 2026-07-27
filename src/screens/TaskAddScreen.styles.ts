import { StyleSheet } from 'react-native';

export const taskAddStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 },
  
  // Priority buttons
  priorityButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  priorityTab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 12, 
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  priorityTabActive: { backgroundColor: '#007BFF', borderColor: '#007BFF', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  priorityText: { fontSize: 14, fontWeight: '600' },
  priorityTextActive: { color: '#fff' },

  // Category buttons
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  categoryTabActive: { backgroundColor: 'rgba(0, 123, 255, 0.1)', borderColor: '#007BFF' },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  
  // Date Picker
  dateButton: { 
    padding: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    flex: 1
  },
  dateActionText: { color: '#007BFF', fontWeight: 'bold', fontSize: 14, marginLeft: 12 },
  dateClearText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 14, marginLeft: 12 },

  // Subtasks
  subtaskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  subtaskInput: { 
    flex: 1, 
    borderWidth: 1, 
    padding: 12, 
    borderRadius: 12,
    fontSize: 14 
  },
  subtaskDeleteBtn: { marginLeft: 12, padding: 8 },
  subtaskDeleteText: { color: '#FF3B30', fontWeight: '600' },
  addSubtaskBtn: { marginTop: 4, paddingVertical: 8, alignSelf: 'flex-start' },
  addSubtaskText: { color: '#007BFF', fontWeight: 'bold', fontSize: 14 },

  footer: { marginTop: 30, marginBottom: 20 },
});
