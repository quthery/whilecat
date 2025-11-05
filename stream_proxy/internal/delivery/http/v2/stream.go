package v2

import (
	"io"
	"log"
	"net/http"
	"time"

	ffmpeg_go "github.com/u2takey/ffmpeg-go"
)

func StreamMerge(videoReader io.Reader, audioReader io.Reader, w io.Writer) error {
	log.Printf("Starting FFmpeg stream merge")
	stream := ffmpeg_go.
		Input("pipe:0", ffmpeg_go.KwArgs{"format": "mp4"}).
		Output("pipe:1", ffmpeg_go.KwArgs{
			"c:v":      "copy",      // Без перекодирования видео
			"c:a":      "aac",       // Кодируем аудио в AAC
			"f":        "mp4",
			"movflags": "frag_keyframe+empty_moov", // Для потокового вывода
		})

	log.Printf("FFmpeg command prepared, adding input streams")
	stream = stream.WithInput(videoReader)
	log.Printf("Video input added")
	stream = stream.WithInput(audioReader)
	log.Printf("Audio input added")
	stream = stream.WithOutput(w)
	log.Printf("Output stream added")

	log.Printf("Running FFmpeg command")
	err := stream.Run()
	if err != nil {
		log.Printf("FFmpeg error: %v", err)
		return err
	}
	log.Printf("FFmpeg completed successfully")
	return nil
}

func StreamHandler(w http.ResponseWriter, r *http.Request) {
	videoURL := r.URL.Query().Get("video")
	audioURL := r.URL.Query().Get("audio")

	if videoURL == "" || audioURL == "" {
		http.Error(w, "Missing video or audio URL parameters", http.StatusBadRequest)
		return
	}

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Получаем видео поток
	videoResp, err := client.Get(videoURL)
	if err != nil {
		log.Printf("Error fetching video: %v", err)
		http.Error(w, "Error fetching video stream", http.StatusInternalServerError)
		return
	}
	defer videoResp.Body.Close()

	if videoResp.StatusCode != http.StatusOK {
		log.Printf("Video stream returned status: %d", videoResp.StatusCode)
		http.Error(w, "Video stream not available", videoResp.StatusCode)
		return
	}

	// Получаем аудио поток
	audioResp, err := client.Get(audioURL)
	if err != nil {
		log.Printf("Error fetching audio: %v", err)
		http.Error(w, "Error fetching audio stream", http.StatusInternalServerError)
		return
	}
	defer audioResp.Body.Close()

	if audioResp.StatusCode != http.StatusOK {
		log.Printf("Audio stream returned status: %d", audioResp.StatusCode)
		http.Error(w, "Audio stream not available", audioResp.StatusCode)
		return
	}

	// Настраиваем заголовки ответа
	w.Header().Set("Content-Type", "video/mp4")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("Cache-Control", "no-cache")

	// Запускаем объединение потоков
	log.Printf("Starting stream merge for video: %s and audio: %s", videoURL, audioURL)
	err = StreamMerge(videoResp.Body, audioResp.Body, w)
	if err != nil {
		log.Printf("Error merging streams: %v", err)
		http.Error(w, "Error merging streams", http.StatusInternalServerError)
		return
	}
	log.Printf("Stream merge completed successfully")
}