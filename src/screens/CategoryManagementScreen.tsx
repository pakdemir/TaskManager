import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCategoryStore from '../stores/categoryStore';
import useUIStore from '../stores/uiStore';
import CustomButton from '../components/CustomButton';

export default function CategoryManagementScreen({ navigation }: any) {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { isDarkMode } = useUIStore();
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#007BFF');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddOrUpdate = async () => {
    if (!newCatName.trim()) return Alert.alert('Hata', 'Kategori adı boş olamaz.');
    try {
      if (editingId) {
        await updateCategory(editingId, { name: newCatName.trim(), color: newCatColor });
        setEditingId(null);
      } else {
        await addCategory({ name: newCatName.trim(), color: newCatColor });
      }
      setNewCatName('');
      setNewCatColor('#007BFF');
    } catch (e: any) {
      Alert.alert('Hata', 'İşlem başarısız.');
    }
  };

  const startEditing = (cat: any) => {
    setEditingId(cat.id);
    setNewCatName(cat.name);
    setNewCatColor(cat.color);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewCatName('');
    setNewCatColor('#007BFF');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Emin misiniz?', 'Kategoriyi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteCategory(id) }
    ]);
  };

  const bgColor = isDarkMode ? '#121212' : '#f9f9f9';
  const textColor = isDarkMode ? '#fff' : '#333';
  const inputBg = isDarkMode ? '#222' : '#fff';
  const borderColor = isDarkMode ? '#444' : '#ddd';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#007BFF', fontSize: 16 }}>← Geri</Text></TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Kategori Yönetimi</Text>
      </View>

      <View style={styles.addSection}>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
          placeholder="Kategori Adı"
          placeholderTextColor="#888"
          value={newCatName}
          onChangeText={setNewCatName}
        />
        <View style={styles.colorRow}>
          {['#007BFF', '#28A745', '#DC3545', '#FFC107', '#6F42C1'].map(color => (
            <TouchableOpacity 
              key={color} 
              style={[styles.colorCircle, { backgroundColor: color, borderWidth: newCatColor === color ? 3 : 0, borderColor: textColor }]}
              onPress={() => setNewCatColor(color)}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row' }}>
           <View style={{ flex: 1, marginRight: editingId ? 8 : 0 }}>
             <CustomButton title={editingId ? "Güncelle" : "Kategori Ekle"} onPress={handleAddOrUpdate} />
           </View>
           {editingId && (
             <View style={{ flex: 1, marginLeft: 8 }}>
               <CustomButton title="İptal" onPress={cancelEditing} variant="outline" />
             </View>
           )}
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.catItem, { backgroundColor: inputBg, borderColor }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => startEditing(item)} style={{ marginRight: 16 }}>
                <Text style={{ color: '#007BFF' }}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: 'red' }}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  addSection: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  colorCircle: { width: 30, height: 30, borderRadius: 15 },
  catItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, alignItems: 'center' },
  colorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 }
});
