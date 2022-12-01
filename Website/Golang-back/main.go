package main

import (
	"log"
	"math/rand"
	"net/http"
	"time"

	// "minting_nft.com/controller"

	_ "github.com/joho/godotenv/autoload"
	"minting_nft.com/config"
	"minting_nft.com/dal"
	"minting_nft.com/pkg/logger"
	r "minting_nft.com/router"
)

func main() {
	config.LoadConfig("config/config.json")
	dal.LoadDB()
	dal.MigrateDB()
	dal.CreateAdmin()
	logger.InitLogger()
	rand.Seed(time.Now().UnixNano())

	//controller.StartCardanoNode()

	router := r.GetRouter()
	s := &http.Server{
		Addr:           r.GetPort(),
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.SetKeepAlivesEnabled(false)
	log.Printf("Listening on port %s", r.GetPort())
	log.Fatal(s.ListenAndServe())
}
