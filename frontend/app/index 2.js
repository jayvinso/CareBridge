import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatbotScreen from '../screens/ChatbotScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#f8f8f8' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatbotScreen} />
    </Tab.Navigator>
  );
}
