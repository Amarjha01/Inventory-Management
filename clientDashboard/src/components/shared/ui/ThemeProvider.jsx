const ThemeProvider = ({ theme, children, className = "" }) => {
  return (
    <div
      style={{
        "--theme-bg": theme.background,
        "--theme-header": theme.header,
        "--theme-surface": theme.surface,
        "--theme-surface-alt": theme.surfaceAlt,

        "--theme-primary": theme.primary,
        "--theme-primary-light": theme.primaryLight,
        "--theme-primary-dark": theme.primaryDark,

        "--theme-text": theme.text,
        "--theme-text-secondary": theme.textSecondary,
        "--theme-text-primary": theme.textOnPrimary,

        "--theme-border": theme.border,
        "--theme-selected-border": theme.selectedBorder,

        "--theme-secondary": theme.secondary,
      }}
      className={`
        bg-(--theme-bg)
        text-(--theme-text)
        transition-colors
        duration-500
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;