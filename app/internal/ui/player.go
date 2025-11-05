package ui

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/lipgloss"
)

func (m Model) renderPlayer(height int) string {
	var sections []string

	playerWidth := ((m.width * 2) / 3) - 6
	if playerWidth < 40 {
		playerWidth = 40
	}

	title := titleStyle.Render("₍^. .^₎Ⳋ whilecat")
	sections = append(sections, title)
	sections = append(sections, "")

	if len(m.tracks) > 0 && m.currentTrack < len(m.tracks) {
		currentTrack := m.tracks[m.currentTrack]

		var musicIcon string
		if m.isPlaying {
			icons := []string{"♪", "♫", "♬", "♪"}
			musicIcon = icons[(m.progress/10)%len(icons)]
		} else {
			musicIcon = "♪"
		}

		nowPlaying := lipgloss.NewStyle().
			Foreground(successColor).
			Bold(true).
			Render(fmt.Sprintf("%s Now Playing:", musicIcon))

		trackInfoText := fmt.Sprintf("  %s - %s", currentTrack.Title, currentTrack.Artist)
		if len(trackInfoText) > playerWidth-10 {
			trackInfoText = trackInfoText[:playerWidth-13] + "..."
		}

		trackInfo := lipgloss.NewStyle().
			Foreground(textColor).
			Bold(true).
			Render(trackInfoText)

		trackDuration := lipgloss.NewStyle().
			Foreground(dimColor).
			Render(fmt.Sprintf("  Duration: %s", currentTrack.Duration))

		sections = append(sections, nowPlaying)
		sections = append(sections, trackInfo)
		sections = append(sections, trackDuration)
		sections = append(sections, "")
	}

	inputLabel := lipgloss.NewStyle().
		Foreground(accentColor).
		Bold(true).
		Render("🎵 Add Track:")

	m.textInput.Width = playerWidth - 10
	if m.textInput.Width < 20 {
		m.textInput.Width = 20
	}

	var inputBox string
	if m.focusState == FocusInput {
		inputBox = focusedBorderStyle.Copy().
			Width(playerWidth-4).
			Padding(0, 1).
			Render(m.textInput.View())
	} else {
		inputBox = normalBorderStyle.Copy().
			Width(playerWidth-4).
			Padding(0, 1).
			Render(m.textInput.View())
	}

	sections = append(sections, inputLabel)
	sections = append(sections, inputBox)
	sections = append(sections, "")

	progressBar := m.renderProgressBar(playerWidth - 10)
	sections = append(sections, progressBar)
	sections = append(sections, "")

	controls := m.renderControls()
	sections = append(sections, controls)

	content := lipgloss.JoinVertical(lipgloss.Left, sections...)

	var style lipgloss.Style
	if m.focusState == FocusInput || m.focusState == FocusControls {
		style = focusedBorderStyle.Copy().Width(playerWidth).Height(height - 2)
	} else {
		style = normalBorderStyle.Copy().Width(playerWidth).Height(height - 2)
	}

	return style.Render(content)
}

func (m Model) renderProgressBar(width int) string {
	if width < 10 {
		width = 10
	}

	filled := (m.progress * width) / 100
	if filled > width {
		filled = width
	}
	empty := width - filled

	// Create gradient effect for filled portion with different characters
	var filledBar string
	for i := 0; i < filled; i++ {
		if i == filled-1 && m.isPlaying {
			filledBar += "▶"
		} else {
			filledBar += "█"
		}
	}
	emptyBar := strings.Repeat("░", empty)

	filledStyle := lipgloss.NewStyle().Foreground(successColor).Bold(true)
	emptyStyle := lipgloss.NewStyle().Foreground(dimColor)

	bar := filledStyle.Render(filledBar) + emptyStyle.Render(emptyBar)

	percentage := lipgloss.NewStyle().
		Foreground(textColor).
		Bold(true).
		Render(fmt.Sprintf(" %3d%%", m.progress))

	progressLabel := lipgloss.NewStyle().
		Foreground(accentColor).
		Bold(true).
		Render("Progress: ")

	return progressLabel + "[" + bar + "]" + percentage
}

// renderControls renders the playback control buttons
func (m Model) renderControls() string {
	var prevBtn, playPauseBtn, stopBtn, nextBtn string

	if m.focusState == FocusControls {
		prevBtn = activeButtonStyle.Render("⏮ Prev")
		stopBtn = activeButtonStyle.Render("⏹ Stop")
		nextBtn = activeButtonStyle.Render("⏭ Next")

		if m.isPlaying {
			playPauseBtn = activeButtonStyle.Render("⏸ Pause")
		} else {
			playPauseBtn = activeButtonStyle.Render("▶ Play")
		}
	} else {
		prevBtn = buttonStyle.Render("⏮ Prev")
		stopBtn = buttonStyle.Render("⏹ Stop")
		nextBtn = buttonStyle.Render("⏭ Next")

		if m.isPlaying {
			playPauseBtn = buttonStyle.Render("⏸ Pause")
		} else {
			playPauseBtn = buttonStyle.Render("▶ Play")
		}
	}

	controls := lipgloss.JoinHorizontal(
		lipgloss.Center,
		prevBtn,
		"  ",
		playPauseBtn,
		"  ",
		stopBtn,
		"  ",
		nextBtn,
	)

	return lipgloss.NewStyle().
		Padding(1, 0).
		Render(controls)
}
