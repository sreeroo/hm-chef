# HM Chef - Recipe App

HM Chef is a mobile application built with React Native and Expo that allows users to discover, search, create, and save their favorite recipes. It utilizes TheMealDB API for fetching a wide variety of recipes and provides a clean, themeable interface.

## Features

*   **Home Screen:** Welcomes the user and provides quick navigation.
*   **Recipe Discovery:**
    *   Displays featured recipes on the search screen.
    *   Search for recipes by name.
    *   Browse recipes by category.
*   **Recipe Creation:** Allows users to create and save their own custom recipes with names, categories, instructions, and images.
*   **My Recipes:** Displays a list of all recipes saved by the user (favorites from the API and custom creations).
*   **Recipe Details:** Shows detailed information about a recipe, including image, ingredients, and instructions, in a modal view.
*   **Favorite System:** Add recipes fetched from the API to a persistent "My Recipes" list.
*   **Theming:** Supports both Light and Dark modes, adapting to the system's theme preference.
*   **Image Picker:** Select images from the device library for custom recipes.
*   **Persistence:** Saved recipes (favorites and created) are stored locally using AsyncStorage.

## Tech Stack

*   **Framework:** React Native (with Expo)
*   **Language:** TypeScript
*   **Navigation:** Expo Router (File-based routing)
*   **State Management:** React Context API (`ThemeContext`, `RecipeContext`)
*   **UI Components:** React Native Elements (`@rneui/themed`), Custom Components
*   **API:** [TheMealDB API](https://www.themealdb.com/api.php)
*   **Image Handling:** `expo-image`, `expo-image-picker`
*   **Local Storage:** `@react-native-async-storage/async-storage`
*   **Fonts:** `@expo-google-fonts/poppins`
