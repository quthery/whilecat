package ui

import (
	"fmt"

	"github.com/charmbracelet/lipgloss"
)

func (m Model) renderTrackList(height int) string {
	var tracks []string

	title := titleStyle.Render("📋 Track List")
	tracks = append(tracks, title)
	tracks = append(tracks, "")

	trackListWidth := (m.width / 3) - 4
	if trackListWidth < 30 {
		trackListWidth = 30
	}

	contentWidth := trackListWidth - 4

	if len(m.tracks) == 0 {
		emptyMsg := dimItemStyle.Render("No tracks...")
		tracks = append(tracks, emptyMsg)
	} else {
		maxTracks := height - 6
		if maxTracks < 1 {
			maxTracks = 1
		}

		startIdx := 0
		endIdx := len(m.tracks)

		if len(m.tracks) > maxTracks {
			startIdx = m.selectedIdx - maxTracks/2
			if startIdx < 0 {
				startIdx = 0
			}
			endIdx = startIdx + maxTracks
			if endIdx > len(m.tracks) {
				endIdx = len(m.tracks)
				startIdx = endIdx - maxTracks
				if startIdx < 0 {
					startIdx = 0
				}
			}
		}

		for i := startIdx; i < endIdx; i++ {
			track := m.tracks[i]
			var line string
			icon := "♫"

			if i == m.currentTrack && m.isPlaying {
				icon = " "
			} else if i == m.currentTrack {
				icon = " "
			}

			// Truncate text to fit width
			trackText := fmt.Sprintf("%s %s - %s", icon, track.Title, track.Artist)
			if len(trackText) > contentWidth-8 {
				trackText = trackText[:contentWidth-11] + "..."
			}

			durationText := track.Duration
			lineText := fmt.Sprintf("%-*s %s", contentWidth-8, trackText, durationText)

			if i == m.selectedIdx && m.focusState == FocusTrackList {
				line = selectedItemStyle.Render(lineText)
			} else if i == m.currentTrack {
				style := normalItemStyle.Copy().Foreground(successColor).Bold(true)
				line = style.Render(lineText)
			} else {
				line = normalItemStyle.Render(lineText)
			}

			tracks = append(tracks, line)
		}

		// Show scroll indicator if needed
		if len(m.tracks) > maxTracks {
			scrollInfo := dimItemStyle.Render(fmt.Sprintf("(%d/%d)", m.selectedIdx+1, len(m.tracks)))
			tracks = append(tracks, "")
			tracks = append(tracks, scrollInfo)
		}
	}

	content := lipgloss.JoinVertical(lipgloss.Left, tracks...)

	var style lipgloss.Style
	if m.focusState == FocusTrackList {
		style = focusedBorderStyle.Copy().Width(trackListWidth).Height(height - 2)
	} else {
		style = normalBorderStyle.Copy().Width(trackListWidth).Height(height - 2)
	}

	return style.Render(content)
}
