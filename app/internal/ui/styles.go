package ui

import "github.com/charmbracelet/lipgloss"

var (
	primaryColor   = lipgloss.Color("#7C3AED") // Purple
	secondaryColor = lipgloss.Color("#EC4899") // Pink
	accentColor    = lipgloss.Color("#3B82F6") // Blue
	successColor   = lipgloss.Color("#10B981") // Green
	textColor      = lipgloss.Color("#E5E7EB") // Light gray
	dimColor       = lipgloss.Color("#6B7280") // Dim gray
	bgColor        = lipgloss.Color("#1F2937") // Dark gray
	borderColor    = lipgloss.Color("#4B5563") // Medium gray

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
