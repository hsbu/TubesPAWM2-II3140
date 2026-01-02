import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps extends TouchableOpacityProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    children: React.ReactNode;
}

export function Button({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
}: ButtonProps) {
    return (
        <TouchableOpacity
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                {
                    "bg-primary": variant === "default",
                    "bg-destructive": variant === "destructive",
                    "border border-input bg-background": variant === "outline",
                    "bg-secondary": variant === "secondary",
                    "bg-transparent hover:bg-accent hover:text-accent-foreground": variant === "ghost",
                    "text-primary underline-offset-4 hover:underline": variant === "link",
                    "h-10 px-4 py-2": size === "default",
                    "h-9 rounded-md px-3": size === "sm",
                    "h-11 rounded-md px-8": size === "lg",
                    "h-10 w-10": size === "icon",
                },
                className
            )}
            {...props}
        >
            <Text
                className={cn(
                    "text-sm font-medium",
                    {
                        "text-primary-foreground": variant === "default",
                        "text-destructive-foreground": variant === "destructive",
                        "text-accent-foreground": variant === "outline" || variant === "ghost" || variant === "link",
                        "text-secondary-foreground": variant === "secondary",
                    }
                )}
            >
                {children}
            </Text>
        </TouchableOpacity>
    );
}
