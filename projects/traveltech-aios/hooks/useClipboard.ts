import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      setTimeout(() => {
        setCopied(false);
      }, timeout);

      return true;
    } catch (err) {
      setError(err as Error);
      setCopied(false);
      return false;
    }
  }, [timeout]);

  return { copy, copied, error };
}
