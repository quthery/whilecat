package ui

import "github.com/rivo/tview"

type FocusManager struct {
	app        *tview.Application
	focusables []tview.Primitive
	current    int
}

func NewFocusManager(app *tview.Application) *FocusManager {
	return &FocusManager{
		app:        app,
		focusables: make([]tview.Primitive, 0),
		current:    0,
	}
}

func (fm *FocusManager) Register(primitive tview.Primitive) {
	fm.focusables = append(fm.focusables, primitive)
}

func (fm *FocusManager) Next() {
	if len(fm.focusables) == 0 {
		return
	}
	fm.current = (fm.current + 1) % len(fm.focusables)
	fm.app.SetFocus(fm.focusables[fm.current])
}

func (fm *FocusManager) Previous() {
	if len(fm.focusables) == 0 {
		return
	}
	fm.current--
	if fm.current < 0 {
		fm.current = len(fm.focusables) - 1
	}
	fm.app.SetFocus(fm.focusables[fm.current])
}

func (fm *FocusManager) SetFocus(primitive tview.Primitive) {
	for i, p := range fm.focusables {
		if p == primitive {
			fm.current = i
			fm.app.SetFocus(p)
			return
		}
	}
}

func (fm *FocusManager) SetInitialFocus() {
	if len(fm.focusables) > 0 {
		fm.current = 0
		fm.app.SetFocus(fm.focusables[0])
	}
}
