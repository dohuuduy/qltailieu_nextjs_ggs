'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
}

interface AlertDialogTitleProps {
  children: React.ReactNode
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
}

interface AlertDialogFooterProps {
  children: React.ReactNode
}

interface AlertDialogActionProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'destructive'
  className?: string
}

interface AlertDialogCancelProps {
  children: React.ReactNode
  onClick?: () => void
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative animate-in fade-in-0 zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  )
}

export function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg border max-w-md w-full mx-4 p-6",
      className
    )}>
      {children}
    </div>
  )
}

export function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
  return (
    <div className="space-y-2 mb-4">
      {children}
    </div>
  )
}

export function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {children}
    </h2>
  )
}

export function AlertDialogDescription({ children }: AlertDialogDescriptionProps) {
  return (
    <p className="text-sm text-gray-600">
      {children}
    </p>
  )
}

export function AlertDialogFooter({ children }: AlertDialogFooterProps) {
  return (
    <div className="flex justify-end space-x-2 mt-6">
      {children}
    </div>
  )
}

export function AlertDialogAction({ 
  children, 
  onClick, 
  variant = 'default',
  className 
}: AlertDialogActionProps) {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      className={className}
    >
      {children}
    </Button>
  )
}

export function AlertDialogCancel({ children, onClick }: AlertDialogCancelProps) {
  return (
    <Button 
      onClick={onClick}
      variant="outline"
    >
      {children}
    </Button>
  )
}