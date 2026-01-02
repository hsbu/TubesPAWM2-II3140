import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { signUp as apiSignUp } from '../../lib/api';
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

export default function SignUp() {
    const router = useRouter();
    const { isDesktop } = useResponsive();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await apiSignUp({
                name: name.trim(),
                email: email.trim(),
                password
            });

            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Failed to sign up');
            }
        } catch (e: any) {
            setError(e.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: isDesktop ? Spacing.xl : Spacing.lg }}>
                <View style={{
                    backgroundColor: ThemeColors.card,
                    borderRadius: BorderRadius.lg,
                    padding: isDesktop ? Spacing.xxl : Spacing.xl,
                    borderWidth: 1,
                    borderColor: ThemeColors.border,
                    alignItems: 'center',
                    maxWidth: isDesktop ? 450 : 400,
                    width: '100%',
                }}>
                    <View style={{
                        width: isDesktop ? 80 : 64,
                        height: isDesktop ? 80 : 64,
                        borderRadius: isDesktop ? 40 : 32,
                        backgroundColor: `${'#22c55e'}20`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: Spacing.lg,
                    }}>
                        <Text style={{ fontSize: isDesktop ? FontSizes['3xl'] : FontSizes['2xl'], color: '#22c55e' }}>✓</Text>
                    </View>
                    <Text style={{
                        fontSize: isDesktop ? FontSizes['2xl'] : FontSizes.xl,
                        fontWeight: 'bold',
                        color: ThemeColors.foreground,
                        marginBottom: Spacing.sm,
                        textAlign: 'center',
                    }}>
                        Account Created!
                    </Text>
                    <Text style={{
                        fontSize: FontSizes.base,
                        color: ThemeColors.mutedForeground,
                        textAlign: 'center',
                        marginBottom: Spacing.lg,
                    }}>
                        Please check your email to verify your account, then sign in.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/auth/signin')}
                        style={{
                            backgroundColor: ThemeColors.primary,
                            paddingVertical: Spacing.md,
                            paddingHorizontal: Spacing.xl,
                            borderRadius: BorderRadius.md,
                        }}
                    >
                        <Text style={{ color: ThemeColors.primaryForeground, fontWeight: '600' }}>
                            Go to Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

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
                            Create an account
                        </Text>
                        <Text style={{ fontSize: FontSizes.base, color: ThemeColors.mutedForeground, marginTop: Spacing.xs }}>
                            Start your learning journey with Webculus
                        </Text>
                    </View>

                {/* Sign Up Card */}
                    <View style={{
                        backgroundColor: ThemeColors.card,
                        borderRadius: BorderRadius.lg,
                        padding: isDesktop ? Spacing.xl : Spacing.lg,
                        borderWidth: 1,
                        borderColor: ThemeColors.border,
                    }}>
                    {/* Name */}
                    <View style={{ marginBottom: Spacing.md }}>
                        <Text style={{
                            fontSize: FontSizes.sm,
                            fontWeight: '500',
                            color: ThemeColors.foreground,
                            marginBottom: Spacing.xs
                        }}>
                            Full Name
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="John Doe"
                            placeholderTextColor={ThemeColors.mutedForeground}
                            autoComplete="name"
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
                    <View style={{ marginBottom: Spacing.md }}>
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
                            autoComplete="password-new"
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

                    {/* Confirm Password */}
                    <View style={{ marginBottom: Spacing.lg }}>
                        <Text style={{
                            fontSize: FontSizes.sm,
                            fontWeight: '500',
                            color: ThemeColors.foreground,
                            marginBottom: Spacing.xs
                        }}>
                            Confirm Password
                        </Text>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            placeholderTextColor={ThemeColors.mutedForeground}
                            secureTextEntry
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

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
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
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: Spacing.lg,
                    }}>
                        <Text style={{ color: ThemeColors.mutedForeground, fontSize: FontSizes.sm }}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/signin')}>
                            <Text style={{ color: ThemeColors.primary, fontSize: FontSizes.sm, fontWeight: '600' }}>
                                Sign in
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
