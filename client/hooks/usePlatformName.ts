import { useEffect, useState } from 'react';

const DEFAULT_PLATFORM_NAME = 'Smart';

export const usePlatformName = () => {
  const [platformName, setPlatformName] = useState<string>(DEFAULT_PLATFORM_NAME);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlatformName = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/platform-settings/name');
        if (response.ok) {
          const data = await response.json();
          setPlatformName(data.platformName || DEFAULT_PLATFORM_NAME);
        }
      } catch (error) {
        console.error('Failed to fetch platform name:', error);
        setPlatformName(DEFAULT_PLATFORM_NAME);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatformName();
  }, []);

  return { platformName, isLoading };
};

export const PLATFORM_NAME = DEFAULT_PLATFORM_NAME;
