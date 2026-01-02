import React from "react"
import { View, Text } from "react-native"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface MathContentProps {
    title: string
    description: string
    sections: Array<{
        heading: string
        content: string | React.ReactNode
        example?: string | React.ReactNode
    }>
}

export function MathContent({ title, description, sections }: MathContentProps) {
    return (
        <View className="space-y-6 pb-8">
            <View>
                <Text className="text-3xl font-bold text-foreground mb-2">{title}</Text>
                <Text className="text-lg text-muted-foreground">{description}</Text>
            </View>

            {sections.map((section, index) => (
                <Card key={index} className="border-border/50 mb-4">
                    <CardHeader>
                        <CardTitle className="text-xl">{section.heading}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {typeof section.content === 'string' ? (
                            <Text className="text-foreground/90 leading-relaxed text-base">{section.content}</Text>
                        ) : (
                            section.content
                        )}

                        {section.example && (
                            <View className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                                <Text className="text-sm font-semibold text-primary mb-2">Example:</Text>
                                {typeof section.example === 'string' ? (
                                    <Text className="text-foreground/80">{section.example}</Text>
                                ) : (
                                    section.example
                                )}
                            </View>
                        )}
                    </CardContent>
                </Card>
            ))}
        </View>
    )
}
