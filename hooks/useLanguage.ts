import {
  changeLanguage as i18nChangeLanguage,
  isCurrentLanguageRTL,
} from "@/i18n";
import { useSettingsStore } from "@/store/settingsStore";
import { reloadAppAsync } from "expo";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager } from "react-native";

export function useLanguage() {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useSettingsStore();

  const isRTL = isCurrentLanguageRTL();
  const currentLanguage = i18n.language as "fa" | "en";

  const changeLanguage = useCallback(
    async (newLanguage: "fa" | "en") => {
      console.log(newLanguage, "LLLL");

      try {
        // Check if RTL direction needs to change
        const shouldBeRTL = newLanguage === "fa";
        const currentRTL = I18nManager.isRTL;

        // Change i18n language
        await i18nChangeLanguage(newLanguage);

        // Update store
        setLanguage(newLanguage);

        // Force RTL/LTR direction if it changed
        if (currentRTL !== shouldBeRTL) {
          I18nManager.forceRTL(shouldBeRTL);
          await reloadAppAsync();
        }

        console.log(`Language changed to ${newLanguage}, RTL: ${shouldBeRTL}`);
      } catch (error) {
        console.error("Error changing language:", error);
      }
    },
    [setLanguage]
  );

  // Helper function to get direction-aware styles
  const getDirectionStyle = useCallback(
    (ltrStyle: any, rtlStyle: any) => {
      return isRTL ? rtlStyle : ltrStyle;
    },
    [isRTL]
  );

  // Helper function to get direction-aware flex direction
  const getFlexDirection = useCallback(
    (defaultDirection: "row" | "column" | "row-reverse" = "row") => {
      if (defaultDirection === "column") return "column";
      if (defaultDirection === "row-reverse") {
        return isRTL ? "row" : "row-reverse";
      }
      return isRTL ? "row-reverse" : "row";
    },
    [isRTL]
  );

  // Helper function to get direction-aware text align
  const getTextAlign = useCallback(
    (align: "left" | "right" | "center" = "left") => {
      if (align === "center") return "center";
      if (align === "left") return isRTL ? "right" : "left";
      if (align === "right") return isRTL ? "left" : "right";
      return align;
    },
    [isRTL]
  );

  // Helper function to get direction-aware icon
  const getDirectionalIcon = useCallback(
    (leftIcon: string, rightIcon: string) => {
      return isRTL ? rightIcon : leftIcon;
    },
    [isRTL]
  );

  return {
    // Core translation function
    t,

    // Language state
    currentLanguage,
    isRTL,

    // Language actions
    changeLanguage,

    // Helper functions
    getDirectionStyle,
    getFlexDirection,
    getTextAlign,
    getDirectionalIcon,
  };
}
