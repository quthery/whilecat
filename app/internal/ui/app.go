package ui

import "github.com/rivo/tview"

type UI struct {
	App      *tview.Application
	MainFlex *tview.Flex
	Focus    *FocusManager
}

func NewApp() *UI {
	app := tview.NewApplication()
	mainFlex := tview.NewFlex().SetDirection(tview.FlexRow)
	focusManager := NewFocusManager(app)

	ui := &UI{
		App:      app,
		MainFlex: mainFlex,
		Focus:    focusManager,
	}

	ui.Setup()

	return ui
}

func (ui *UI) Setup() {
	trackListPanel := ui.TrackListPanel()

	playerPanel := ui.PlayerPanel()
	TrackFlex := tview.NewFlex().SetDirection(tview.FlexColumn)

	TrackFlex.AddItem(trackListPanel, 0, 1, false)

	TrackFlex.AddItem(playerPanel, 0, 2, true)

	ui.MainFlex.AddItem(TrackFlex, 0, 1, false)

	ui.Focus.Register(playerPanel)
	ui.Focus.Register(trackListPanel)

	ui.Focus.SetInitialFocus()
}
