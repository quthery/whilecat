package ui

import (
	"github.com/charmbracelet/lipgloss"
)

func (m Model) View() string {
	if m.quitting {
		return lipgloss.NewStyle().
			Foreground(successColor).
			Bold(true).
			Render("Thanks for using WhileCat! ^^\n")
	}

	statusBarHeight := 1
	helpHeight := 1
	availableHeight := m.height - statusBarHeight - helpHeight

	trackListView := m.renderTrackList(availableHeight)
	playerView := m.renderPlayer(availableHeight)

	spacer := lipgloss.NewStyle().Width(2).Render("  ")

	mainContent := lipgloss.JoinHorizontal(
		lipgloss.Top,
		trackListView,
		spacer,
		playerView,
	)

	statusBar := m.renderStatusBar()

	helpText := m.renderHelp()

	view := lipgloss.JoinVertical(
		lipgloss.Left,
		mainContent,
		statusBar,
		helpText,
	)

	return view
}
