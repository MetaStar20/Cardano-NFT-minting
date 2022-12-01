package dal

import (
	"context"
	"log"
	"time"

	"minting_nft.com/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"golang.org/x/crypto/bcrypt"
)

var db *mongo.Database

// LoadDB loads db initails
func LoadDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.Cfg.DBURI))
	if err != nil {
		log.Fatal(err)
	}

	db = client.Database(config.Cfg.DBNAME)
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}
}

// MigrateDB migrate app config data
func MigrateDB() error {
	acs := []AppConfig{}
	c := db.Collection(ColAppConfig)
	ctx := context.Background()

	cur, err := c.Find(ctx, bson.D{})
	if err != nil {
		return err
	}
	defer cur.Close(ctx)

	err = cur.All(ctx, &acs)
	if err != nil {
		return err
	}
	if len(acs) == 0 {
		ac := AppConfig{
			AddressServer: "",
			AddressIpfs:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEJEOGUyN0UyODVDNTQ0MTllRDkzQjBjNDg3NTQ5RENCODUyOTQ3NzkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMjE2MDUwNDI0NywibmFtZSI6IkNhbWlsIFNhbGliYSJ9.-xgjhCzSpySw4wQ1YTYCRYCdwk5ER4ESKJ94tLDhtMo",
		}
		_, err = c.InsertOne(ctx, ac)
		return err
	}
	return nil
}

// MigrateDB migrate app config data
func CreateAdmin() error {
	acs := []User{}
	c := db.Collection(ColUser)
	ctx := context.Background()

	cur, err := c.Find(ctx, bson.D{})
	if err != nil {
		return err
	}
	defer cur.Close(ctx)

	err = cur.All(ctx, &acs)
	if err != nil {
		return err
	}

	hp, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.MinCost)
	Pass := string(hp)

	if len(acs) < 1 {
		ac := User{
			Username: "Camil Saliba",
			Password: Pass,
			Role:     "admin",
		}
		_, err = c.InsertOne(ctx, ac)
		return err
	}
	return nil
}
