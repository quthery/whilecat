package main

import (
	"app/internal/ui"
)

func main() {
	app := ui.NewApp()

	if err := app.App.SetRoot(app.MainFlex, true).Run(); err != nil {
		panic(err)
	}
	// TODO: Исправить ошибки и передалать setupGlobalKeys что бы у был список кнопок или чего нибудь другого между чем нужно менять фокус
	// TODO: Немного переделать архитектуру и возможно добавить тестов
}
