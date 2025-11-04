import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import TabNavigator from './navigation/TabNavigator';
import LockScreen from './screens/LockScreen';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  // Optional: attempt to detect a success deep link on cold start to auto-skip lock
  useEffect(() => {
    // No persistence requested; keep simple for now
  }, []);

  return (
    <NavigationContainer>
      {isAuthed ? (
        <TabNavigator />
      ) : (
        <LockScreen onSuccess={() => setIsAuthed(true)} />
      )}
    </NavigationContainer>
  );
}
