package dal

import (
	"context"
	"log"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateSearch creates new search
func CreateNFT(s Search) (Search, error) {
	c := db.Collection(ColSearch)
	ctx := context.Background()

	s.WebUrl = strings.TrimSpace(s.WebUrl)
	s.IpfsUrl = strings.TrimSpace(s.IpfsUrl)
	s.TokenUrl = strings.TrimSpace(s.TokenUrl)
	rst, err := c.InsertOne(ctx, s)
	s.ID = rst.InsertedID.(primitive.ObjectID)

	log.Println(s)

	// Increase total mint NFT in App config.
	total, err := c.CountDocuments(ctx, bson.D{})
	conf := db.Collection(ColAppConfig)
	_, err = conf.UpdateMany(ctx, bson.M{}, bson.M{"$set": bson.M{
		"amount_minted_token": strconv.FormatInt(total, 10),
	}})
	return s, err
}

// UpdateSearch updates existing search
func UpdateSearch(s Search) error {
	c := db.Collection(ColSearch)
	ctx := context.Background()

	s.WebUrl = strings.TrimSpace(s.WebUrl)
	s.IpfsUrl = strings.TrimSpace(s.IpfsUrl)
	s.TokenUrl = strings.TrimSpace(s.TokenUrl)

	_, err := c.UpdateOne(ctx, bson.M{"_id": s.ID}, bson.M{"$set": bson.M{
		"title":        s.Title,
		"description":  s.Description,
		"author":       s.Author,
		"web_url":      s.WebUrl,
		"ipfs_url":     s.IpfsUrl,
		"token_url":    s.TokenUrl,
		"sent_address": s.SentAddress,
		"amount":       s.Amount,
		"minted_time":  s.MintedTime,
	}})
	return err
}

// DeleteSearch remove one search data
func DeleteSearch(id primitive.ObjectID) error {
	c := db.Collection(ColSearch)
	ctx := context.Background()

	_, err := c.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

// ListSearch get all searches
func ListNFT() ([]Search, error) {
	ss := []Search{}
	c := db.Collection(ColSearch)
	ctx := context.Background()

	cur, err := c.Find(ctx, bson.D{})
	if err != nil {
		return ss, err
	}
	defer cur.Close(ctx)

	err = cur.All(ctx, &ss)
	if err != nil {
		return ss, err
	}

	return ss, err
}

// GetNFTByID get a search by id
func GetNFTByID(id primitive.ObjectID) (*Search, error) {
	s := &Search{}
	c := db.Collection(ColSearch)
	ctx := context.Background()

	err := c.FindOne(ctx, bson.M{"_id": id}).Decode(&s)
	return s, err
}
