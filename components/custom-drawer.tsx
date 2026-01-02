import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/auth-context';
import { useRouter, usePathname } from 'expo-router';
import { Spacing, FontSizes, BorderRadius } from '../constants/colors';
import { Home, LayoutDashboard, BookOpen, PenTool, Settings } from 'lucide-react-native';

// Navigation items configuration
const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Lessons', path: '/lessons', icon: BookOpen },
    { label: 'Practice', path: '/practice', icon: PenTool },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export function CustomDrawerContent(props: any) {
    const { user, signOut, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Check if a nav item is active
    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/' || pathname === '';
        }
        return pathname.startsWith(path);
    };

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f0c29']}
            style={{ flex: 1 }}
        >
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ flex: 1 }}
                style={{ backgroundColor: 'transparent' }}
            >
                <View style={{
                    marginBottom: Spacing.lg,
                    padding: Spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
                }}>
                    <Text style={{ fontSize: FontSizes.xl, fontWeight: 'bold', color: '#8b5cf6' }}>
                        Webculus
                    </Text>
                    {isAuthenticated && user && (
                        <Text style={{ fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.xs }}>
                            Hello, {user.name}
                        </Text>
                    )}
                </View>

                <View style={{ flex: 1, paddingHorizontal: Spacing.sm }}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const IconComponent = item.icon;
                        
                        return (
                            <TouchableOpacity
                                key={item.path}
                                onPress={() => router.push(item.path as any)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: Spacing.md,
                                    paddingHorizontal: Spacing.md,
                                    marginBottom: Spacing.xs,
                                    borderRadius: BorderRadius.md,
                                    backgroundColor: active ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                    borderLeftWidth: active ? 3 : 0,
                                    borderLeftColor: '#8b5cf6',
                                }}
                            >
                                <IconComponent 
                                    size={20} 
                                    color={active ? '#8b5cf6' : 'rgba(255,255,255,0.6)'} 
                                    style={{ marginRight: Spacing.md }}
                                />
                                <Text style={{ 
                                    color: active ? '#8b5cf6' : '#fff',
                                    fontSize: FontSizes.base,
                                    fontWeight: active ? '600' : '400',
                                }}>
                                    {item.label}
                                </Text>
                                {active && (
                                    <View style={{
                                        marginLeft: 'auto',
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: '#8b5cf6',
                                    }} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{
                    padding: Spacing.lg,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(139, 92, 246, 0.2)',
                }}>
                    {isAuthenticated ? (
                        <TouchableOpacity
                            onPress={async () => {
                                await signOut();
                                router.replace('/auth/signin');
                            }}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                paddingVertical: Spacing.sm,
                                paddingHorizontal: Spacing.md,
                                borderRadius: BorderRadius.md,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.1)',
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Sign Out</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => router.push('/auth/signin')}
                            style={{
                                overflow: 'hidden',
                                borderRadius: BorderRadius.md,
                            }}
                        >
                            <LinearGradient
                                colors={['#8b5cf6', '#6366f1']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: Spacing.sm,
                                    paddingHorizontal: Spacing.md,
                                }}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </DrawerContentScrollView>
        </LinearGradient>
    );
}
