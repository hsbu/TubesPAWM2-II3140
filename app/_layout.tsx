import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { AuthProvider } from '../context/auth-context';
import { CustomDrawerContent } from '../components/custom-drawer';
import { Colors } from '../constants/colors';
import { useWindowDimensions, TouchableOpacity, View, Text } from 'react-native';
import { BREAKPOINTS } from '../hooks/use-responsive';
import { Menu } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

function MenuButton() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{
                marginLeft: 16,
                padding: 10,
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(139, 92, 246, 0.3)',
            }}
        >
            <Menu size={22} color="#8b5cf6" />
        </TouchableOpacity>
    );
}

function CustomHeader({ title }: { title: string }) {
    return (
        <LinearGradient
            colors={['#0f0c29', '#302b63', '#24243e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1    }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 40,
                paddingBottom: 16,
                paddingHorizontal: 8,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(139, 92, 246, 0.2)',
            }}
        >
            <MenuButton />
            <Text style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '600',
                marginLeft: 16,
            }}>
                {title}
            </Text>
        </LinearGradient>
    );
}

export default function RootLayout() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= BREAKPOINTS.desktop;

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0f0c29' }}>
            <AuthProvider>
                <Drawer
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                    screenOptions={{
                        headerShown: !isDesktop,
                        drawerType: isDesktop ? 'permanent' : 'front',
                        drawerStyle: {
                            backgroundColor: '#1a1a2e',
                            width: isDesktop ? 280 : 256,
                            borderRightWidth: 1,
                            borderRightColor: 'rgba(139, 92, 246, 0.2)',
                        },
                        header: ({ options }) => (
                            <CustomHeader title={options.title || 'Webculus'} />
                        ),
                        overlayColor: 'rgba(0,0,0,0.7)',
                    }}
                >
                    <Drawer.Screen
                        name="index"
                        options={{ title: "Home" }}
                    />
                    <Drawer.Screen
                        name="dashboard"
                        options={{ title: "Dashboard" }}
                    />
                    <Drawer.Screen
                        name="lessons/index"
                        options={{ title: "Lessons" }}
                    />
                    <Drawer.Screen
                        name="lessons/linear-equations"
                        options={{ title: "Linear Equations" }}
                    />
                    <Drawer.Screen
                        name="lessons/linear-inequalities"
                        options={{ title: "Linear Inequalities" }}
                    />
                    <Drawer.Screen
                        name="lessons/nonlinear-systems"
                        options={{ title: "Non-Linear Systems" }}
                    />
                    <Drawer.Screen
                        name="lessons/calculus-applications"
                        options={{ title: "Calculus Applications" }}
                    />
                    <Drawer.Screen
                        name="practice"
                        options={{ title: "Practice" }}
                    />
                    <Drawer.Screen
                        name="settings"
                        options={{ title: "Settings" }}
                    />
                    <Drawer.Screen
                        name="auth/signin"
                        options={{ title: "Sign In", drawerItemStyle: { display: 'none' } }}
                    />
                    <Drawer.Screen
                        name="auth/signup"
                        options={{ title: "Sign Up", drawerItemStyle: { display: 'none' } }}
                    />
                </Drawer>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
