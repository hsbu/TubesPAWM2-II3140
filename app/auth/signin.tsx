import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { signIn as apiSignIn } from '../../lib/api';
import { useAuth } from '../../context/auth-context';
import { Spacing, FontSizes, BorderRadius } from '../../constants/colors';
import { useResponsive } from '../../hooks/use-responsive';
import { LinearGradient } from 'expo-linear-gradient';

const ThemeColors = {
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    foreground: '#fff',
    mutedForeground: 'rgba(255,255,255,0.6)',
    primary: '#8b5cf6',
    primaryForeground: '#fff',
    destructive: '#ef4444',
    input: 'rgba(255,255,255,0.1)',
};

export default function SignIn() {
    const router = useRouter();
    const { signIn } = useAuth();
    const { isDesktop, containerMaxWidth } = useResponsive();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please enter email and password');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            console.log('Signing in with:', email);
            const response = await apiSignIn({ email: email.trim(), password });
            console.log('Sign in response:', response);

            if (response.success && response.data.session) {
                console.log('User data from signin:', response.data.user);
                await signIn(response.data.session.access_token, response.data.user);
                router.replace('/');
            } else {
                setError(response.message || 'Failed to sign in');
            }
        } catch (e: any) {
            console.error('Sign in error:', e);
            setError(e.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    padding: isDesktop ? Spacing.xl : Spacing.lg,
                    alignItems: 'center',
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{
                    width: '100%',
                    maxWidth: isDesktop ? 450 : '100%',
                }}>
                    {/* Logo / Branding */}
                    <View style={{ alignItems: 'center', marginBottom: Spacing.xl }}>
                        <View style={{
                            width: isDesktop ? 80 : 64,
                            height: isDesktop ? 80 : 64,
                            borderRadius: BorderRadius.lg,
                            backgroundColor: ThemeColors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: Spacing.md,
                        }}>
                            <Text style={{
                                fontSize: isDesktop ? FontSizes['3xl'] : FontSizes['2xl'],
                                fontWeight: 'bold',
                                color: ThemeColors.primaryForeground,
                            }}>
                                W
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: isDesktop ? FontSizes['3xl'] : FontSizes['2xl'],
                            fontWeight: 'bold',
                            color: ThemeColors.foreground,
                        }}>
                            Welcome back
                        </Text>
                        <Text style={{ fontSize: FontSizes.base, color: ThemeColors.mutedForeground, marginTop: Spacing.xs }}>
                            Sign in to your Webculus account
                        </Text>
                    </View>

                    {/* Sign In Card */}
                    <View style={{
                        backgroundColor: ThemeColors.card,
                        borderRadius: BorderRadius.lg,
                        padding: isDesktop ? Spacing.xl : Spacing.lg,
                        borderWidth: 1,
                        borderColor: ThemeColors.border,
                    }}>
                    {/* Email */}
                    <View style={{ marginBottom: Spacing.md }}>
                        <Text style={{
                            fontSize: FontSizes.sm,
                            fontWeight: '500',
                            color: ThemeColors.foreground,
                            marginBottom: Spacing.xs
                        }}>
                            Email
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="name@example.com"
                            placeholderTextColor={ThemeColors.mutedForeground}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            style={{
                                borderWidth: 1,
                                borderColor: ThemeColors.border,
                                borderRadius: BorderRadius.md,
                                padding: Spacing.md,
                                fontSize: FontSizes.base,
                                color: ThemeColors.foreground,
                                backgroundColor: ThemeColors.input,
                            }}
                        />
                    </View>

                    {/* Password */}
                    <View style={{ marginBottom: Spacing.lg }}>
                        <Text style={{
                            fontSize: FontSizes.sm,
                            fontWeight: '500',
                            color: ThemeColors.foreground,
                            marginBottom: Spacing.xs
                        }}>
                            Password
                        </Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor={ThemeColors.mutedForeground}
                            secureTextEntry
                            autoComplete="password"
                            style={{
                                borderWidth: 1,
                                borderColor: ThemeColors.border,
                                borderRadius: BorderRadius.md,
                                padding: Spacing.md,
                                fontSize: FontSizes.base,
                                color: ThemeColors.foreground,
                                backgroundColor: ThemeColors.input,
                            }}
                        />
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View style={{
                            backgroundColor: `${Colors.chart.red}20`,
                            borderWidth: 1,
                            borderColor: `${Colors.chart.red}40`,
                            borderRadius: BorderRadius.md,
                            padding: Spacing.md,
                            marginBottom: Spacing.md,
                        }}>
                            <Text style={{ color: Colors.chart.red, fontSize: FontSizes.sm }}>
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={isLoading}
                        style={{
                            backgroundColor: ThemeColors.primary,
                            paddingVertical: Spacing.md,
                            borderRadius: BorderRadius.md,
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        <Text style={{
                            color: ThemeColors.primaryForeground,
                            textAlign: 'center',
                            fontWeight: '600',
                            fontSize: FontSizes.base,
                        }}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: Spacing.lg,
                    }}>
                        <Text style={{ color: ThemeColors.mutedForeground, fontSize: FontSizes.sm }}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                            <Text style={{ color: ThemeColors.primary, fontSize: FontSizes.sm, fontWeight: '600' }}>
                                Sign up
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </View>

                    {/* Back to Home */}
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                        style={{ marginTop: Spacing.lg, alignItems: 'center' }}
                    >
                        <Text style={{ color: ThemeColors.mutedForeground, fontSize: FontSizes.sm }}>
                            ← Back to home
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </LinearGradient>
    );
}
