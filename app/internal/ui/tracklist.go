package ui

import (
	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

func (ui *UI) TrackListPanel() *tview.List {
	trackList := tview.NewList().
		ShowSecondaryText(true)

	trackList.AddItem("🎵 Track 1 - Artist Name", "3:45", '1', nil)
	trackList.AddItem("🎵 Track 2 - Another Artist", "4:20", '2', nil)
	trackList.AddItem("🎵 Track 3 - Cool Song", "2:58", '3', nil)
	trackList.AddItem("🎵 Track 4 - Epic Music", "5:12", '4', nil)
	trackList.AddItem("🎵 Track 5 - Best Hit", "3:33", '5', nil)

	trackList.SetMainTextColor(tcell.ColorWhite).
		SetSecondaryTextColor(tcell.ColorGray).
		SetSelectedTextColor(tcell.ColorBlack).
		SetSelectedBackgroundColor(tcell.ColorWhite)

	trackList.SetBorder(true).SetTitle("📋 Список треков")

	trackList.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		if event.Key() == tcell.KeyRune {
			current := trackList.GetCurrentItem()
			count := trackList.GetItemCount()

			switch event.Rune() {
			case 'j', 'J':
				if current < count-1 {
					trackList.SetCurrentItem(current + 1)
				} else if current == count-1 {
					trackList.SetCurrentItem(0)
				}
				return nil
			case 'k', 'K':
				if current > 0 {
					trackList.SetCurrentItem(current - 1)
				} else if current == 0 {
					trackList.SetCurrentItem(count - 1)
				}
				return nil
			}
		}
		return event
	})

	return trackList
}
