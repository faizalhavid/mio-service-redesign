import React from "react";
import { FlatList } from "react-native";

export default function VirtualizedView(props: any) {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={props.children}
    />
  );
}
