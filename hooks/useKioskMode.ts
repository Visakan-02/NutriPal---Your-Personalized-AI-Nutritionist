
import { useEffect, useRef, useCallback } from 'react';

export const useKioskMode = (onIdle: () => void, timeout: number = 120000) => {
    const timeoutId = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        timeoutId.current = window.setTimeout(() => {
            onIdle();
        }, timeout);
    }, [onIdle, timeout]);

    const handleActivity = useCallback(() => {
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => window.addEventListener(event, handleActivity));
        resetTimer();

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [handleActivity, resetTimer]);
};
