import { View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Item";
import { useState } from "react";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];
const ITEMS = [
  { id: "1", description: "Comprar café", status: FilterStatus.PENDING },
  { id: "2", description: "Comprar pão", status: FilterStatus.DONE },
  { id: "3", description: "Comprar leite", status: FilterStatus.PENDING },
];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING);
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<any[]>([]);

  function handleAddItem() {
    if (newItem.trim().length === 0) {
      return;
    }

    const item = {
      id: Math.random().toString(36).substring(2),
      description: newItem,
      status: FilterStatus.PENDING,
    };

    console.log(item);
    setItems((prevItems) => [...prevItems, item]);
  }

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={styles.logo} />

      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setNewItem}
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

          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onPress={() => console.log("Item pressed")}
              onRemove={() => console.log("Item removed")}
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
