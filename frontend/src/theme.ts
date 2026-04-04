/**
 * theme.ts (MUI v7-compatible overrides)
 *
 * Goal: match your palette/layout and avoid deprecated theme override keys like:
 * - MuiButton.styleOverrides.containedPrimary  (deprecated in v7)
 *
 * Instead we style variants using class selectors on `root`, e.g.:
 * - &.MuiButton-contained.MuiButton-colorPrimary
 *
 * This should remove the IDE warning.
 */

import { createTheme } from "@mui/material/styles";

export const COLORS = {
    // Base
    bg: "#0B0B0C",
    surface: "#141313",
    border: "rgba(255,255,255,0.10)",

    // Palette
    cream: "#E9E1D8",
    neon: "#E6FF00",
    brown: "#2B211B",
    sage: "#7B7A67",
    orange: "#FF6A00",

    // Text
    text: "rgba(255,255,255,0.92)",
    subtext: "rgba(255,255,255,0.70)",
};

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: COLORS.neon },
        secondary: { main: COLORS.orange },
        background: {
            default: COLORS.bg,
            paper: COLORS.surface,
        },
        text: {
            primary: COLORS.text,
            secondary: COLORS.subtext,
        },
    },

    shape: { borderRadius: 22 },

    typography: {
        fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        h4: { fontWeight: 900, letterSpacing: -0.8 },
        h6: { fontWeight: 850, letterSpacing: -0.2 },
        button: { textTransform: "none", fontWeight: 800 },
    },

    components: {
        // Paper/Card “soft borders” on dark backgrounds
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: `1px solid ${COLORS.border}`,
                    backgroundImage: "none",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: `1px solid ${COLORS.border}`,
                    backgroundImage: "none",
                },
            },
        },

        /**
         * Buttons
         * IMPORTANT: In MUI v7, avoid deprecated keys like `containedPrimary`.
         * Use class combinations on root instead.
         */
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    paddingLeft: 16,
                    paddingRight: 16,

                    /**
                     * Primary contained button:
                     * variant="contained" + color="primary"
                     */
                    "&.MuiButton-contained.MuiButton-colorPrimary": {
                        backgroundColor: COLORS.neon,
                        color: "#0b0b0c",
                    },
                    "&.MuiButton-contained.MuiButton-colorPrimary:hover": {
                        backgroundColor: "#d7f200",
                    },

                    /**
                     * Primary outlined button:
                     * variant="outlined" + color="primary"
                     */
                    "&.MuiButton-outlined.MuiButton-colorPrimary": {
                        borderColor: "rgba(255,255,255,0.22)",
                        color: "rgba(255,255,255,0.90)",
                    },
                    "&.MuiButton-outlined.MuiButton-colorPrimary:hover": {
                        borderColor: "rgba(255,255,255,0.35)",
                        backgroundColor: "rgba(255,255,255,0.06)",
                    },
                },
            },
        },

        // TextField defaults for consistent forms
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "small",
            },
        },

        // Outlined inputs styling (pill-ish)
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.04)",
                },
                notchedOutline: {
                    borderColor: "rgba(255,255,255,0.18)",
                },
            },
        },

        // Toggle buttons used in the “Sort” toggle
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    borderColor: "rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.82)",
                    "&.Mui-selected": {
                        backgroundColor: "rgba(230,255,0,0.18)",
                        color: "rgba(255,255,255,0.95)",
                        borderColor: "rgba(230,255,0,0.35)",
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "rgba(230,255,0,0.24)",
                    },
                },
            },
        },
    },
});