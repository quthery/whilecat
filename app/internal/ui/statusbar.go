package ui

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/lipgloss"
)

func (m Model) renderStatusBar() string {
	var status string
	if m.isPlaying {
		status = "▶ PLAYING"
	} else {
		status = "⏸ PAUSED"
	}

	trackCount := fmt.Sprintf("Tracks: %d", len(m.tracks))

	focusIndicator := ""
	switch m.focusState {
	case FocusTrackList:
		focusIndicator = "Focus: Track List"
	case FocusInput:
		focusIndicator = "Focus: Input"
	case FocusControls:
		focusIndicator = "Focus: Controls"
	}

	leftSection := statusBarStyle.Render(" " + status + " ")
	middleSection := statusBarStyle.Copy().
		Background(secondaryColor).
		Render(" " + trackCount + " ")
	rightSection := statusBarStyle.Copy().
		Background(accentColor).
		Render(" " + focusIndicator + " ")

	// Calculate spacing
	statusWidth := lipgloss.Width(leftSection) + lipgloss.Width(middleSection) + lipgloss.Width(rightSection)
	spacingNeeded := m.width - statusWidth - 2
	if spacingNeeded < 0 {
		spacingNeeded = 0
	}

	spacing := strings.Repeat(" ", spacingNeeded)

	return leftSection + " " + middleSection + spacing + rightSection
}

func (m Model) renderHelp() string {
	var help []string

	helpIcon := lipgloss.NewStyle().
		Foreground(accentColor).
		Bold(true).
		Render("💡 ")

	switch m.focusState {
	case FocusTrackList:
		help = append(help, "j/k or ↑/↓: navigate • enter/space: play • d: delete • tab: next • q: quit")
	case FocusInput:
		help = append(help, "enter: add track • tab: next • shift+tab: prev • q: quit")
	case FocusControls:
		help = append(help, "p: play/pause • s: stop • n: next • b: prev • tab: next • q: quit")
	}

	helpText := strings.Join(help, " | ")

	if m.width > 7 && len(helpText) > m.width-4 {
		truncateAt := m.width - 7
		if truncateAt > 0 && truncateAt < len(helpText) {
			helpText = helpText[:truncateAt] + "..."
		}
	}

	return helpIcon + helpStyle.Render(helpText)
}
