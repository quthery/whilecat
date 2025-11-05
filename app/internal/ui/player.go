package ui

import (
	"fmt"
	"strings"

	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

func (ui *UI) PlayerPanel() tview.Primitive {
	percent := 50
	isPlaying := true

	progressBarText := createProgressBar(percent, 40)
	progressBar := tview.NewTextView().
		SetText(fmt.Sprintf("  %s %d%%", progressBarText, percent)).
		SetTextAlign(tview.AlignCenter).
		SetDynamicColors(true)

	playPauseBtn := tview.NewButton("⏸ Pause")
	playPauseBtn.SetSelectedFunc(func() {
		isPlaying = !isPlaying
		if isPlaying {
			playPauseBtn.SetLabel("⏸ Pause")
		} else {
			playPauseBtn.SetLabel("▶ Play")
		}
	})

	stopBtn := tview.NewButton("⏹ Stop")
	stopBtn.SetSelectedFunc(func() {
		isPlaying = false
		playPauseBtn.SetLabel("▶ Play")
	})

	prevBtn := tview.NewButton("⏮ Prev")
	prevBtn.SetSelectedFunc(func() {
	})

	nextBtn := tview.NewButton("⏭ Next")
	nextBtn.SetSelectedFunc(func() {
	})

	controlsRow := tview.NewFlex().SetDirection(tview.FlexColumn)
	controlsRow.AddItem(tview.NewBox(), 0, 1, false)
	controlsRow.AddItem(prevBtn, 10, 0, false)
	controlsRow.AddItem(tview.NewBox(), 1, 0, false)
	controlsRow.AddItem(playPauseBtn, 12, 0, false)
	controlsRow.AddItem(tview.NewBox(), 1, 0, false)
	controlsRow.AddItem(stopBtn, 10, 0, false)
	controlsRow.AddItem(tview.NewBox(), 1, 0, false)
	controlsRow.AddItem(nextBtn, 10, 0, false)
	controlsRow.AddItem(tview.NewBox(), 0, 1, false)

	inputField := tview.NewInputField()
	inputField.SetFieldWidth(40)
	inputField.SetPlaceholder("Enter track URL or path...")
	inputField.SetLabel(" 🎵 Track: ")

	inputField.SetBorder(true)
	inputField.SetFieldTextColor(tcell.Color100)

	addBtn := tview.NewButton("[+]")
	addBtn.SetSelectedFunc(func() {
	})

	inputRow := tview.NewFlex().SetDirection(tview.FlexColumn)
	inputRow.AddItem(tview.NewBox(), 1, 0, false)
	inputRow.AddItem(inputField, 0, 1, false)
	inputRow.AddItem(addBtn, 5, 0, false)
	inputRow.AddItem(tview.NewBox(), 1, 0, false)

	// Register focusable elements
	ui.Focus.Register(inputField)

	playerPanel := tview.NewFlex().SetDirection(tview.FlexRow)
	playerPanel.AddItem(tview.NewBox(), 1, 0, false) // Top padding
	playerPanel.AddItem(inputRow, 3, 0, false)
	playerPanel.AddItem(tview.NewBox(), 1, 0, false) // Spacer
	playerPanel.AddItem(progressBar, 1, 0, false)
	playerPanel.AddItem(tview.NewBox(), 0, 1, false) // Spacer
	playerPanel.AddItem(controlsRow, 3, 0, false)
	playerPanel.AddItem(tview.NewBox(), 1, 0, false) // Bottom padding

	playerPanel.SetBorder(true).
		SetTitle(" 🎧 Music Player ").
		SetBorderColor(tcell.ColorBlue)

	ui.setupGlobalKeys()

	return playerPanel
}

func (ui *UI) setupGlobalKeys() {
	ui.App.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		switch event.Key() {
		case tcell.KeyTab:
			ui.Focus.Next()
			return nil

		case tcell.KeyBacktab:
			ui.Focus.Previous()
			return nil

		case tcell.KeyCtrlP:
			return nil
		}
		return event
	})
}

func createProgressBar(percent int, width int) string {
	filled := (percent * width) / 100
	if filled > width {
		filled = width
	}
	empty := width - filled

	return "[" + strings.Repeat("█", filled) + strings.Repeat("░", empty) + "]"
}
