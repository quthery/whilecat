package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/ilyakaznacheev/cleanenv"
)

const (
	DEFAULT_PATH_UNIX = "~/.config/whilecat/config.yaml"
)

type Theme struct {
	PrimaryColor   string `yaml:"primary_color"   env:"PRIMARY_COLOR"   env-description:"Primary color"   env-default:"#b0bec5"`
	SecondaryColor string `yaml:"secondary_color" env:"SECONDARY_COLOR" env-description:"Secondary color" env-default:"#2a2a2a"`
	AccentColor    string `yaml:"accent_color"    env:"ACCENT_COLOR"    env-description:"Accent color"    env-default:"#2a2a2a"`
	SuccessColor   string `yaml:"success_color"   env:"SUCCESS_COLOR"   env-description:"Success color"   env-default:"#ffd580"`
	TextColor      string `yaml:"text_color"      env:"TEXT_COLOR"      env-description:"Text color"      env-default:"#b0bec5"`
	DimColor       string `yaml:"dim_color"       env:"DIM_COLOR"       env-description:"Dim color"       env-default:"#6B7280"`
	BgColor        string `yaml:"bg_color"        env:"BG_COLOR"        env-description:"Background color" env-default:"#1e1e1e"`
	BorderColor    string `yaml:"border_color"    env:"BORDER_COLOR"    env-description:"Border color"    env-default:"#4B5563"`
}

type Config struct {
	Colors Theme `yaml:"theme"`
}

func LoadConfig(path string) (*Config, error) {
	var cfg Config

	if path == "" {
		path = DEFAULT_PATH_UNIX
	}

	path = expandPath(path)
	fmt.Println(path)
	if err := cleanenv.ReadConfig(path, &cfg); err != nil {
		return nil, err
	}

	fmt.Printf("[DEBUG] Loaded colors:\n")
	fmt.Printf("  Primary: %s\n", cfg.Colors.PrimaryColor)
	fmt.Printf("  Secondary: %s\n", cfg.Colors.SecondaryColor)
	fmt.Printf("  Accent: %s\n", cfg.Colors.AccentColor)
	fmt.Printf("  Success: %s\n", cfg.Colors.SuccessColor)
	fmt.Printf("  Text: %s\n", cfg.Colors.TextColor)
	fmt.Printf("  Dim: %s\n", cfg.Colors.DimColor)
	fmt.Printf("  Background: %s\n", cfg.Colors.BgColor)
	fmt.Printf("  Border: %s\n", cfg.Colors.BorderColor)

	return &cfg, nil
}

func expandPath(path string) string {
	if strings.HasPrefix(path, "~/") {
		home, err := os.UserHomeDir()
		if err != nil {
			return path
		}
		return filepath.Join(home, path[2:])
	}
	return path
}
