package main

import (
	"app/internal/config"
	"app/internal/ui"
	"flag"
	"fmt"
	"log"
	"os"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	configPath := flag.String("config", "", "Path to config file (default: ~/.config/whilecat/config.yaml)")
	fmt.Println(*configPath)
	flag.Parse()

	cfg, err := config.LoadConfig(*configPath)
	if err != nil {
		log.Printf("Warning: Could not load config, using defaults: %v\n", err)
		cfg = &config.Config{
			Colors: config.Theme{
				PrimaryColor:   "#b0bec5",
				SecondaryColor: "#2a2a2a",
				AccentColor:    "#2a2a2a",
				SuccessColor:   "#ffd580",
				TextColor:      "#b0bec5",
				DimColor:       "#6B7280",
				BgColor:        "#1e1e1e",
				BorderColor:    "#4B5563",
			},
		}
	}

	ui.InitStyles(cfg)

	p := tea.NewProgram(
		ui.NewModel(),
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	)

	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running program: %v\n", err)
		os.Exit(1)
	}
}
