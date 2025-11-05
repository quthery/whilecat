package ui

import (
	"time"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
)

// FocusState represents which component is currently focused
type FocusState int

const (
	FocusTrackList FocusState = iota
	FocusInput
	FocusControls
)

type Track struct {
	Title    string
	Artist   string
	Duration string
}

type Model struct {
	tracks       []Track
	selectedIdx  int
	focusState   FocusState
	textInput    textinput.Model
	isPlaying    bool
	progress     int
	currentTrack int
	width        int
	height       int
	quitting     bool
}

type tickMsg time.Time

func NewModel() Model {
	ti := textinput.New()
	ti.Placeholder = "Enter track URL from sc, yt, ..."
	ti.CharLimit = 156
	ti.Width = 50
	ti.Prompt = ""
	ti.PromptStyle = ti.PromptStyle.Width(0)

	return Model{
		tracks: []Track{
			{Title: "Track 1", Artist: "Artist Name", Duration: "3:45"},
			{Title: "Track 2", Artist: "Another Artist", Duration: "4:20"},
			{Title: "Track 3", Artist: "Cool Song", Duration: "2:58"},
			{Title: "Track 4", Artist: "Epic Music", Duration: "5:12"},
			{Title: "Track 5", Artist: "Best Hit", Duration: "3:33"},
		},
		selectedIdx:  0,
		focusState:   FocusTrackList,
		textInput:    ti,
		isPlaying:    false,
		progress:     50,
		currentTrack: 0,
	}
}

func (m Model) Init() tea.Cmd {
	return tea.Batch(
		textinput.Blink,
		tickCmd(),
	)
}

func tickCmd() tea.Cmd {
	return tea.Tick(time.Millisecond*100, func(t time.Time) tea.Msg {
		return tickMsg(t)
	})
}
