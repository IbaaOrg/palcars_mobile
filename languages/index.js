import { I18n } from 'i18n-js';
import en from './en.json'
import ar from './ar.json';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, createContext } from 'react'

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {

    useEffect(() => {
        getLanguage();
    }, []);

    const [language, setLanguage] = useState('');

    const STORAGE_KEY = '@APP:languageCode';

    const translations = {
        en: en,
     
        ar: ar,
    };

    const i18n = new I18n(translations);

    i18n.enableFallback = true;

    i18n.locale = language;

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, i18n }}>
            {children}
        </LanguageContext.Provider>
    )

    async function changeLanguage(languageCode) {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, languageCode);
            setLanguage(languageCode)

        } catch (error) { }
    }

    async function getLanguage() {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEY);
            if (value !== null) {
                setLanguage(value)
            }
            else {
                setLanguage('en')
            }
        } catch (error) {
        }
    };
}