import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FolderPlus, Edit2, Trash2, Check, Tag } from 'lucide-react-native';
import useCategoryStore from '../stores/categoryStore';
import useUIStore from '../stores/uiStore';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

// Premium Tailwind Colors
const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'];

export default function CategoryManagementScreen({ navigation }: any) {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { isDarkMode } = useUIStore();
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddOrUpdate = async () => {
    if (!newCatName.trim()) return Alert.alert('Hata', 'Lütfen geçerli bir kategori adı girin.');
    try {
      if (editingId) {
        await updateCategory(editingId, { name: newCatName.trim(), color: newCatColor });
        setEditingId(null);
      } else {
        await addCategory({ name: newCatName.trim(), color: newCatColor });
      }
      setNewCatName('');
      setNewCatColor(COLORS[0]);
    } catch (e: any) {
      Alert.alert('Hata', 'İşlem başarısız oldu.');
    }
  };

  const startEditing = (cat: any) => {
    setEditingId(cat.id);
    setNewCatName(cat.name);
    setNewCatColor(cat.color || COLORS[0]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewCatName('');
    setNewCatColor(COLORS[0]);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Kategoriyi Sil', 'Bu kategoriyi silmek istediğinize emin misiniz? Görevleriniz silinmez ancak kategorisiz kalır.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteCategory(id) }
    ]);
  };

  // Theme configuration
  const bgColor = isDarkMode ? '#121212' : '#F4F7FB';
  const panelBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
  const labelColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const subtleBg = isDarkMode ? '#2A2A2A' : '#F3F4F6';

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.formCard, { backgroundColor: panelBg }]}>
            <View style={styles.formHeaderRow}>
              <View style={[styles.iconWrapper, { backgroundColor: `${newCatColor}20` }]}>
                <FolderPlus size={24} color={newCatColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.formTitle, { color: textColor }]}>
                  {editingId ? 'Kategoriyi Düzenle' : 'Kategori Oluştur'}
                </Text>
                <Text style={[styles.formSubtitle, { color: labelColor }]}>
                  {editingId ? 'Seçili kategorinin detaylarını değiştirin' : 'Görevlerinizi organize etmek için yeni kategori ekleyin'}
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <CustomInput
                label="Kategori Adı"
                placeholder="Örn: Ev, İş, Alışveriş..."
                value={newCatName}
                onChangeText={setNewCatName}
              />
            </View>

            <Text style={[styles.colorLabel, { color: textColor }]}>Kategori Rengi</Text>
            <View style={styles.colorGrid}>
              {COLORS.map(color => {
                const isSelected = newCatColor === color;
                return (
                  <TouchableOpacity 
                    key={color} 
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color },
                      isSelected ? styles.colorCircleSelected : undefined,
                      isSelected ? { borderColor: color, borderWidth: 3 } : undefined
                    ]}
                    onPress={() => setNewCatColor(color)}
                    activeOpacity={0.8}
                  >
                    {isSelected && <Check size={18} color="#FFFFFF" strokeWidth={3} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <View style={styles.actionBtnWrapper}>
                <CustomButton 
                  title={editingId ? "Değişiklikleri Kaydet" : "Kategoriyi Ekle"} 
                  onPress={handleAddOrUpdate} 
                />
              </View>
              {editingId && (
                <View style={[styles.actionBtnWrapper, { marginLeft: 12 }]}>
                  <CustomButton title="Vazgeç" onPress={cancelEditing} variant="outline" />
                </View>
              )}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: textColor }]}>Kategorilerim</Text>
          
          {categories.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: panelBg }]}>
              <Tag size={40} color={labelColor} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Text style={{ color: labelColor, fontSize: 16, textAlign: 'center' }}>
                Henüz hiç kategori oluşturmadınız.
              </Text>
            </View>
          ) : (
            categories.map((item, index) => (
              <View key={item.id} style={[styles.catItem, { backgroundColor: panelBg }]}>
                <View style={styles.catInfo}>
                  <View style={[styles.catIconBox, { backgroundColor: `${item.color || '#3B82F6'}15` }]}>
                    <Tag size={20} color={item.color || '#3B82F6'} />
                  </View>
                  <Text style={[styles.catName, { color: textColor }]}>{item.name}</Text>
                </View>
                <View style={styles.catActions}>
                  <TouchableOpacity onPress={() => startEditing(item)} style={[styles.iconBtn, { backgroundColor: subtleBg }]}>
                    <Edit2 size={18} color={textColor} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.iconBtn, { backgroundColor: subtleBg }]}>
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  formCard: { 
    padding: 24, 
    borderRadius: 24, 
    marginBottom: 32, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12, 
    elevation: 4 
  },
  formHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconWrapper: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  formSubtitle: { fontSize: 13 },
  inputContainer: { marginBottom: 8 },
  colorLabel: { fontSize: 15, fontWeight: '700', marginBottom: 16, marginTop: 12 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 32 },
  colorCircle: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  colorCircleSelected: { transform: [{ scale: 1.1 }] },
  actionRow: { flexDirection: 'row' },
  actionBtnWrapper: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginLeft: 4 },
  emptyState: { padding: 32, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  catItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    elevation: 2 
  },
  catInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  catIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  catName: { fontSize: 16, fontWeight: '600' },
  catActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});
