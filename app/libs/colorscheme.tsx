import { Appearance } from 'react-native';

export const isLightTheme = () => {

    const isLightTheme = Appearance.getColorScheme() === "light"
    return isLightTheme;
}