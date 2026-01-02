import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'expo-router';
import { updateUserProfile } from '../lib/api';
import { useState, useEffect } from 'react';
import { Spacing, FontSizes, BorderRadius } from '../constants/colors';
import { useResponsive, getContainerStyle } from '../hooks/use-responsive';

export default function Settings() {
    const { user, signOut, isAuthenticated, refreshUser } = useAuth();
    const router = useRouter();
    const { isDesktop, containerMaxWidth, containerPadding } = useResponsive();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth/signin');
        }
    }, [isAuthenticated]);

    const handleSaveProfile = async () => {
        console.log('handleSaveProfile called with:', { name, email });
        
        if (!name.trim() && !email.trim()) {
            console.log('Validation failed: both fields empty');
            Alert.alert('Error', 'Please provide at least one field to update');
            return;
        }

        setIsSaving(true);
        try {
            const updateData: { name?: string; email?: string } = {};
            if (name.trim()) updateData.name = name.trim();
            if (email.trim()) updateData.email = email.trim();

            console.log('Updating profile with:', updateData);
            const response = await updateUserProfile(updateData);
            console.log('Update profile response:', response);
            
            if (response.success) {
                console.log('Profile updated successfully, refreshing user data...');
                await refreshUser(); // Refresh user data in context
                console.log('User data refreshed');
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.replace('/auth/signin');
    };

    if (!user) {
        return (
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}
            >
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: BorderRadius.xl,
                    padding: Spacing.xxl,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    maxWidth: 400,
                    width: '100%',
                }}>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: Spacing.lg,
                    }}>
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#8b5cf6',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>⚙</Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: FontSizes['2xl'],
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: Spacing.sm,
                        textAlign: 'center',
                    }}>
                        Access Settings
                    </Text>
                    <Text style={{
                        fontSize: FontSizes.base,
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        marginBottom: Spacing.xl,
                        lineHeight: 24,
                    }}>
                        Sign in to manage your profile, update your information, and customize your experience.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/auth/signin')}
                        style={{
                            backgroundColor: '#8b5cf6',
                            paddingVertical: Spacing.md,
                            paddingHorizontal: Spacing.xxl,
                            borderRadius: BorderRadius.md,
                            width: '100%',
                            marginBottom: Spacing.md,
                        }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: FontSizes.lg }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.sm }}>
                            Don't have an account? <Text style={{ color: '#8b5cf6', fontWeight: '600' }}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#0f0c29', '#302b63', '#24243e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{
                    ...getContainerStyle(containerMaxWidth, containerPadding),
                    paddingBottom: Spacing.xxl,
                }}>
                    {/* Header */}
                    <View style={{ marginBottom: Spacing.xl }}>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes['4xl'] : FontSizes['3xl'],
                            fontWeight: 'bold',
                            color: '#fff',
                        }}>
                            Settings
                        </Text>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes.xl : FontSizes.lg,
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: Spacing.xs,
                        }}>
                            Manage your account
                        </Text>
                    </View>

                    {/* Profile Information */}
                    <View style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: BorderRadius.xl,
                        padding: isDesktop ? Spacing.xl : Spacing.lg,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)',
                        marginBottom: Spacing.lg,
                        maxWidth: isDesktop ? 1600 : '100%',
                    }}>
                        <Text style={{ fontSize: FontSizes.xl, fontWeight: '600', color: '#fff', marginBottom: Spacing.xs }}>
                            Profile Information
                        </Text>
                        <Text style={{ fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.6)', marginBottom: Spacing.lg }}>
                            Update your personal details
                        </Text>

                        <View style={{ marginBottom: Spacing.md }}>
                            <Text style={{ fontSize: FontSizes.sm, fontWeight: '500', color: '#fff', marginBottom: Spacing.xs }}>
                                Full Name
                            </Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Your name"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: BorderRadius.md,
                                    padding: Spacing.md,
                                    fontSize: FontSizes.base,
                                    color: '#fff',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                }}
                            />
                        </View>

                        <View style={{ marginBottom: Spacing.lg }}>
                            <Text style={{ fontSize: FontSizes.sm, fontWeight: '500', color: '#fff', marginBottom: Spacing.xs }}>
                                Email Address
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your@email.com"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: BorderRadius.md,
                                    padding: Spacing.md,
                                    fontSize: FontSizes.base,
                                    color: '#fff',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSaveProfile}
                            disabled={isSaving}
                            style={{
                                backgroundColor: '#8b5cf6',
                                paddingVertical: Spacing.md,
                                borderRadius: BorderRadius.md,
                                opacity: isSaving ? 0.6 : 1,
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Out */}
                    <TouchableOpacity
                        onPress={handleSignOut}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            paddingVertical: Spacing.md,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)',
                            maxWidth: isDesktop ? 1600 : '100%',
                        }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
