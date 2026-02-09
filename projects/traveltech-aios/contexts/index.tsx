import React from 'react';
import { AuthProvider } from './AuthContext';
import { DNAProvider } from './DNAContext';
import { ProductsProvider } from './ProductsContext';

/**
 * AppProviders wraps all context providers in the correct order
 * Order matters: Auth -> Products -> DNA
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductsProvider>
        <DNAProvider>
          {children}
        </DNAProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

// Re-export all providers and hooks
export { AuthProvider, useAuth } from './AuthContext';
export { DNAProvider, useDNA } from './DNAContext';
export { ProductsProvider, useProducts } from './ProductsContext';
