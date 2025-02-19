import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "../lib/hooks/useRedux";
import { incremented, amountAdded } from "@/lib/slices/counterSlice";
import { useFetchArrayQuery } from "@/lib/api/counterApi";
import { Button, Card } from "react-native-paper";
import { Text } from "@/components/ui/Text";

export default function Index() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  // const { data = [], error, isLoading } = useFetchArrayQuery();

  function handleFirstClick() {
    dispatch(incremented());
  }
  function handleSecondClick() {
    dispatch(amountAdded(5));
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card>
        <Card.Title
          title="Counter App"
          subtitle="This is a card for the counter app"
        />
        <Card.Content>
          <Text testID="counter_text">Value of count = {count}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="outlined"
            onPress={handleFirstClick}
            testID="increment_1"
          >
            +1
          </Button>
          <Button
            mode="outlined"
            onPress={handleSecondClick}
            testID="increment_5"
          >
            +5
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
