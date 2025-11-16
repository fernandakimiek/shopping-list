import { useEffect, useState } from "react";

import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Item";
import { itemsStorage, ItemStorage } from "@/storage/ItemsStorage";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING);
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<ItemStorage[]>([]);

  async function handleAddItem() {
    if (newItem.trim().length === 0) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar.");
    }

    const item = {
      id: Math.random().toString(36).substring(2),
      description: newItem,
      status: FilterStatus.PENDING,
    };

    await itemsStorage.add(item);
    await getItemsByStatus();
    setNewItem("");
    setFilter(FilterStatus.PENDING);

    Alert.alert("Adicionado", `Adicionado ${newItem} à lista de compras.`);
  }

  async function getItemsByStatus() {
    try {
      const storedItems = await itemsStorage.getByStatus(filter);
      setItems(storedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Erro", "Não foi possível carregar os items.");
    }
  }

  async function handleRemoveItem(id: string) {
    try {
      await itemsStorage.remove(id);
      await getItemsByStatus();
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos items?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => onClear(),
      },
    ]);
  }

  async function onClear() {
    try {
      await itemsStorage.clear();
      setItems([]);
    } catch (error) {
      console.error("Erro ao remover items", error);
      Alert.alert("Erro", "Não foi possível remover os items.");
    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id);
      await getItemsByStatus();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status do item.");
    }
  }

  useEffect(() => {
    getItemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={styles.logo} />

      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setNewItem}
          value={newItem}
        />
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)}
            />
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onPress={() => handleToggleItemStatus(item.id)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>Nenhum item aqui</Text>
          )}
        />
      </View>
    </View>
  );
}
