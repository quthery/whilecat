package ui

import (
	"app/internal/config"

	"github.com/charmbracelet/lipgloss"
)

var (
	primaryColor   = lipgloss.Color("#b0bec5")
	secondaryColor = lipgloss.Color("#2a2a2a")
	accentColor    = lipgloss.Color("#2a2a2a")
	successColor   = lipgloss.Color("#ffd580")
	textColor      = lipgloss.Color("#1e1e1e")
	dimColor       = lipgloss.Color("#6B7280")
	bgColor        = lipgloss.Color("#1e1e1e")
	borderColor    = lipgloss.Color("#4B5563")

	titleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(primaryColor).
			Background(bgColor).
			Padding(0, 1)

	focusedBorderStyle = lipgloss.NewStyle().
				Border(lipgloss.RoundedBorder()).
				BorderForeground(primaryColor).
				Padding(1, 2)

	normalBorderStyle = lipgloss.NewStyle().
				Border(lipgloss.RoundedBorder()).
				BorderForeground(borderColor).
				Padding(1, 2)

	selectedItemStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#000000")).
				Background(primaryColor).
				Bold(true).
				Padding(0, 1)

	normalItemStyle = lipgloss.NewStyle().
			Foreground(textColor).
			Padding(0, 1)

	dimItemStyle = lipgloss.NewStyle().
			Foreground(dimColor).
			Padding(0, 1)

	buttonStyle = lipgloss.NewStyle().
			Foreground(textColor).
			Background(bgColor).
			Padding(0, 2).
			Border(lipgloss.RoundedBorder()).
			BorderForeground(borderColor)

	activeButtonStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#000000")).
				Background(successColor).
				Bold(true).
				Padding(0, 2).
				Border(lipgloss.RoundedBorder()).
				BorderForeground(successColor)

	inputStyle = lipgloss.NewStyle().
			Foreground(textColor).
			Background(bgColor).
			Padding(0, 1)

	helpStyle = lipgloss.NewStyle().
			Foreground(dimColor).
			Padding(0, 1)

	statusBarStyle = lipgloss.NewStyle().
			Foreground(textColor).
			Background(primaryColor).
			Padding(0, 1).
			Bold(true)
)

func InitStyles(cfg *config.Config) {
	primaryColor = lipgloss.Color(cfg.Colors.PrimaryColor)
	secondaryColor = lipgloss.Color(cfg.Colors.SecondaryColor)
	accentColor = lipgloss.Color(cfg.Colors.AccentColor)
	successColor = lipgloss.Color(cfg.Colors.SuccessColor)
	textColor = lipgloss.Color(cfg.Colors.TextColor)
	dimColor = lipgloss.Color(cfg.Colors.DimColor)
	bgColor = lipgloss.Color(cfg.Colors.BgColor)
	borderColor = lipgloss.Color(cfg.Colors.BorderColor)

	// Пересоздаем все стили с новыми цветами
	titleStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(primaryColor).
		Background(bgColor).
		Padding(0, 1)

	focusedBorderStyle = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(primaryColor).
		Padding(1, 2)

	normalBorderStyle = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(borderColor).
		Padding(1, 2)

	selectedItemStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#000000")).
		Background(primaryColor).
		Bold(true).
		Padding(0, 1)

	normalItemStyle = lipgloss.NewStyle().
		Foreground(textColor).
		Padding(0, 1)

	dimItemStyle = lipgloss.NewStyle().
		Foreground(dimColor).
		Padding(0, 1)

	buttonStyle = lipgloss.NewStyle().
		Foreground(textColor).
		Background(bgColor).
		Padding(0, 2).
		Border(lipgloss.RoundedBorder()).
		BorderForeground(borderColor)

	activeButtonStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#000000")).
		Background(successColor).
		Bold(true).
		Padding(0, 2).
		Border(lipgloss.RoundedBorder()).
		BorderForeground(successColor)

	inputStyle = lipgloss.NewStyle().
		Foreground(textColor).
		Background(bgColor).
		Padding(0, 1)

	helpStyle = lipgloss.NewStyle().
		Foreground(dimColor).
		Padding(0, 1)

	statusBarStyle = lipgloss.NewStyle().
		Foreground(textColor).
		Background(primaryColor).
		Padding(0, 1).
		Bold(true)
}
