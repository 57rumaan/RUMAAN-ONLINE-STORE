import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5": variant === "default",
            "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground": variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm": variant === "destructive",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg rounded-2xl": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Input
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Textarea
export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Modal / Dialog
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none"
          >
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="text-xl font-display font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Badge
export function Badge({ children, variant = "default", className }: { children: React.ReactNode, variant?: "default" | "success" | "outline" | "destructive", className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
      variant === "default" && "bg-primary/10 text-primary",
      variant === "success" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      variant === "outline" && "border border-border text-foreground",
      variant === "destructive" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      className
    )}>
      {children}
    </span>
  );
}
