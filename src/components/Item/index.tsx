import { View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";

import { styles } from "./styles";
import { FilterStatus } from "@/types/FilterStatus";
import { StatusIcon } from "../StatusIcon";

type ItemData = {
  description: string;
  status: FilterStatus;
};

type ItemProps = {
  data: ItemData;
  onPress: () => void;
  onRemove: () => void;
};

export function Item({ data, onPress, onRemove }: ItemProps) {
  const { description, status } = data;

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <StatusIcon status={status} />
      </TouchableOpacity>

      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity onPress={onRemove} activeOpacity={0.8}>
        <Trash2 size={18} color="#828282" />
      </TouchableOpacity>
    </View>
  );
}
