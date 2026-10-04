import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'nutripal_favorites';

export const useFavorites = () => {
    const [favoriteMealIds, setFavoriteMealIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (storedFavorites) {
                setFavoriteMealIds(new Set(JSON.parse(storedFavorites)));
            }
        } catch (error) {
            console.error("Error reading favorites from localStorage", error);
            setFavoriteMealIds(new Set());
        }
    }, []);

    const toggleFavorite = useCallback((mealId: number) => {
        setFavoriteMealIds(prevFavorites => {
            const newFavorites = new Set(prevFavorites);
            if (newFavorites.has(mealId)) {
                newFavorites.delete(mealId);
            } else {
                newFavorites.add(mealId);
            }
            try {
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(newFavorites)));
            } catch (error) {
                console.error("Error saving favorites to localStorage", error);
            }
            return newFavorites;
        });
    }, []);

    const isFavorite = useCallback((mealId: number) => {
        return favoriteMealIds.has(mealId);
    }, [favoriteMealIds]);

    return { isFavorite, toggleFavorite };
};
