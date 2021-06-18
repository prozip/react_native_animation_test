import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import ListView from './src/ListView';
import DetailView from './src/DetailView';
import ImgView from './src/ImgView';

const Stack = createSharedElementStackNavigator();
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListView" screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="ListView"
                    component={ListView}
                />
                <Stack.Screen
                    name="ImgView"
                    component={ImgView}
                >
                </Stack.Screen>
                <Stack.Screen
                    name="DetailView"
                    component={DetailView}
                    options={{
                        cardStyle: { backgroundColor: 'transparent' }
                    }}
                    sharedElementsConfig={(route, otherRoute, showing) => {
                        const { id } = route.params;
                        return [{ id, animation: 'fade' }]
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default App;