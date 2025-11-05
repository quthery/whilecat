package ui

import (
	tea "github.com/charmbracelet/bubbletea"
)

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			m.quitting = true
			return m, tea.Quit

		case "tab":
			m.focusState = (m.focusState + 1) % 3
			if m.focusState == FocusInput {
				m.textInput.Focus()
			} else {
				m.textInput.Blur()
			}
			return m, nil

		case "shift+tab":
			m.focusState--
			if m.focusState < 0 {
				m.focusState = 2
			}
			if m.focusState == FocusInput {
				m.textInput.Focus()
			} else {
				m.textInput.Blur()
			}
			return m, nil
		}

		switch m.focusState {
		case FocusTrackList:
			return m.handleTrackListInput(msg)

		case FocusInput:
			switch msg.String() {
			case "enter":
				if m.textInput.Value() != "" {
					// Add new track
					m.tracks = append(m.tracks, Track{
						Title:    m.textInput.Value(),
						Artist:   "Unknown Artist",
						Duration: "0:00",
					})
					m.textInput.SetValue("")
				}
				return m, nil
			default:
				m.textInput, cmd = m.textInput.Update(msg)
				return m, cmd
			}

		case FocusControls:
			return m.handleControlsInput(msg)
		}

	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		return m, nil

	case tickMsg:
		if m.isPlaying {
			m.progress++
			if m.progress > 100 {
				m.progress = 0
				m.currentTrack = (m.currentTrack + 1) % len(m.tracks)
			}
		}
		return m, tickCmd()
	}

	if m.focusState == FocusInput {
		m.textInput, cmd = m.textInput.Update(msg)
		cmds = append(cmds, cmd)
	}

	return m, tea.Batch(cmds...)
}

func (m Model) handleTrackListInput(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.String() {
	case "j", "down":
		if m.selectedIdx < len(m.tracks)-1 {
			m.selectedIdx++
		} else {
			m.selectedIdx = 0
		}

	case "k", "up":
		if m.selectedIdx > 0 {
			m.selectedIdx--
		} else {
			m.selectedIdx = len(m.tracks) - 1
		}

	case "enter", " ":
		m.currentTrack = m.selectedIdx
		m.isPlaying = true
		m.progress = 0

	case "d":
		if len(m.tracks) > 0 {
			m.tracks = append(m.tracks[:m.selectedIdx], m.tracks[m.selectedIdx+1:]...)
			if m.selectedIdx >= len(m.tracks) && len(m.tracks) > 0 {
				m.selectedIdx = len(m.tracks) - 1
			}
		}
	}

	return m, nil
}

func (m Model) handleControlsInput(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.String() {
	case " ", "p":
		// Toggle play/pause
		m.isPlaying = !m.isPlaying

	case "s":
		m.isPlaying = false
		m.progress = 0

	case "n", "right":
		if len(m.tracks) > 0 {
			m.currentTrack = (m.currentTrack + 1) % len(m.tracks)
			m.progress = 0
		}

	case "b", "left":
		if len(m.tracks) > 0 {
			m.currentTrack--
			if m.currentTrack < 0 {
				m.currentTrack = len(m.tracks) - 1
			}
			m.progress = 0
		}

	case "j", "down":
		return m, nil

	case "k", "up":
		return m, nil
	}

	return m, nil
}
