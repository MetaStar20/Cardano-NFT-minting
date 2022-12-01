package dal

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// collection list
const (
	ColUser      = "users"
	ColSearch    = "searches"
	ColProduct   = "products"
	ColStandard  = "standards"
	ColAppConfig = "app_config"
	ColProxy     = "proxies"
)

// User is for user model
type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username" bson:"username"`
	Password string             `json:"password" bson:"password"`
	Role     string             `json:"role,omitempty" bson:"role,omitempty"`
}

// Search is for search model
type Search struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title,omitempty" bson:"title,omitempty"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	Author      string             `json:"author,omitempty" bson:"author,omitempty"`
	WebUrl      string             `json:"web_url,omitempty" bson:"web_url,omitempty"`
	IpfsUrl     string             `json:"ipfs_url,omitempty" bson:"ipfs_url,omitempty"`
	TokenUrl    string             `json:"token_url,omitempty" bson:"token_url,omitempty"`
	SentAddress string             `json:"sent_address,omitempty" bson:"sent_address,omitempty"`
	Amount      int                `json:"amount,omitempty" bson:"amount,omitempty"`
	MintedTime  *time.Time         `json:"minted_time,omitempty" bson:"minted_time,omitempty"`
}

// Product is for product model
type Product struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Asin     string             `json:"asin,omitempty"`
	Title    string             `json:"title,omitempty"`
	URL      string             `json:"url,omitempty" bson:"url,omitempty"`
	Price    float64            `json:"price,omitempty"`
	Prime    float64            `json:"prime,omitempty"`
	SearchID primitive.ObjectID `json:"search_id,omitempty" bson:"search_id,omitempty"`
}

// Standard is for standard product model
type Standard struct {
	ID    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Asin  string             `json:"asin,omitempty"`
	Price float64            `json:"price,omitempty"`
	Date  *time.Time         `json:"date,omitempty" bson:"date,omitempty"`
}

// AppConfig is for app config model
type AppConfig struct {
	AddressServer     string `json:"address_server,omitempty" bson:"address_server,omitempty"`
	AddressIpfs       string `json:"address_ipfs" bson:"address_ipfs"`
	AddressNode       string `json:"address_node,omitempty" bson:"address_node,omitempty"`
	BalanceCoin       string `json:"balance_coin,omitempty" bson:"balance_coin,omitempty"`
	AmountMintedToken string `json:"amount_minted_token,omitempty" bson:"amount_minted_token,omitempty"`
	RUN_SCRAPE        int    `json:"run_scrape,omitempty" bson:"run_scrape,omitempty"`
}

// Proxy for proxy string model
type Proxy struct {
	ID    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Proxy string             `json:"proxy,omitempty"`
}
