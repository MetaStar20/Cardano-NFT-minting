package api

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
	"strconv"

	"github.com/tidwall/gjson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"minting_nft.com/dal"
	"minting_nft.com/pkg/logger"
	"minting_nft.com/pkg/util"

	"github.com/gin-gonic/gin"
)

// CreateSearch create new search
func CreateNFT(c *gin.Context) {
	var s dal.Search
	defer c.Request.Body.Close()

	var upload_path = "uploads"
	if _, err := os.Stat(upload_path); os.IsNotExist(err) {
		os.Mkdir(upload_path, 0700)
	}
	upload_file, err := c.FormFile("upload_file")
	if err != nil {
		log.Println("Upload file error", err)
		c.JSON(http.StatusInternalServerError, "Select the upload image !")
		return
	}

	upload_file_name := strings.ReplaceAll(upload_file.Filename, " ", "_")
	upload_err := c.SaveUploadedFile(upload_file, upload_path+"/"+upload_file_name)
	if upload_err != nil {
		log.Println("save file error...........", upload_err)
		c.JSON(http.StatusInternalServerError, "File save error...")
		return
	}

	log.Println("upload file name...", upload_file_name)

	if err != nil {
		log.Println("File upload and save file error............", upload_file_name)
		c.JSON(http.StatusInternalServerError, "File upload error...")
		return
	}

	// get sent_address from database.
	config, err := dal.GetAppConfig()
	if err != nil {
		logger.Println(err)
	}

	// Check if UTxo has enough ada for minting NFT : set 5..
	err, balance, errout := util.Shellout("$NODE_HOME/mint/get_balance.sh " + config.AddressNode)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		c.JSON(http.StatusInternalServerError, "Getting AddressNode error.")
	}

	arr_balance := strings.Fields(balance)

	cur_balance, err := strconv.Atoi(arr_balance[0])

	fmt.Printf("Alert: %v\n", "Cur Balance ......... " + arr_balance[0])

	if err != nil {
		fmt.Printf("error: %v\n", "Parsing Balance Error")
		c.JSON(http.StatusInternalServerError, "Parsing Balance Error")
		return
	}

	if cur_balance < 5000000 {
		fmt.Printf("error: %v\n", "Not enough Balance : " + arr_balance[0] + " lovelace")
		c.JSON(http.StatusInternalServerError, "Not enough Balance : " + arr_balance[0] + " lovelace")
		return
	}

	s.Title = util.GetNftTitle(c.PostForm("title"))
	s.Description = c.PostForm("description")
	s.Author = c.PostForm("author")
	s.WebUrl = c.PostForm("web_url")
	s.SentAddress = config.AddressServer

	// Run ipfs.sh and get the ipfs url.
	err, out, errout := util.Shellout("$NODE_HOME/mint/ipfs.sh " + upload_path + "/" + upload_file_name + " " + config.AddressIpfs)
	if err != nil {
		log.Printf("error: %v\n", err)
		log.Printf("error: %v\n", errout)
		c.JSON(http.StatusInternalServerError, "IPFS upload error,Try again with other again")
		return
	}
	fmt.Println("--- ipfs.sh out ---")
	fmt.Println(out)
	/// get ipfs address from out file.

	status := gjson.Get(out, "ok")
	if status.String() == "false" {
		c.JSON(http.StatusInternalServerError, "IPFS response error,Try again with other again")
		return
	}
	cid := gjson.Get(out, "value.cid")

	fmt.Println("---------------- ipfs cid--------------------")

	println(cid.String())

	s.IpfsUrl = "https://gateway.ipfs.io/ipfs/" + cid.String()
	IPfsHash := cid.String()

	caddress := "addr_test1qqwauxvuqp9nl85r9g3r72un9rs8rfu5rvjg9q7lvp9m8tvr6wugsa2cxncpxtscm5zcu8pzxklxtew7zmzw437mt46s8cwtal"

	/** mint NFT... (Should trim space because one parameter is divided into two parts if space exists.)
	 **** Paramters List...
	 * s.Title
	 * s.Description
	 * s.Author
	 * s.WebUrl
	 * s.SentAddress
	 * s.IpfsUrl
	 * current node utxo address.(config.AddressNode)
	 * caddress
	**************/
	/* To avoid to change parameter order, validate paramters.*/

	if len(s.Title) == 0 {
		s.Title = "Cardano_NFT"
	}

	if len(s.Description) == 0 {
		s.Description = "This is Cardano NFT from Camil Saliba"
	}

	if len(s.Author) == 0 {
		s.Author = "Camil Saliba"
	}

	if len(s.WebUrl) == 0 {
		s.WebUrl = s.IpfsUrl
	}

	if len(s.SentAddress) == 0 {
		s.SentAddress = caddress
	}


	err, out, errout = util.Shellout("$NODE_HOME/mint/mint.sh '" + s.Title + "' '" + s.Description + "' '" + s.Author + "' '" + s.WebUrl + "' '" + s.SentAddress + "' '" + IPfsHash + "' '" + config.AddressNode + "' '" + caddress + "'")
	if err != nil {
		log.Printf("error: %v\n", err)
		log.Printf("error: %v\n", errout)
		c.JSON(http.StatusInternalServerError, "Minting error...")
		return
	}

	log.Printf("mint shell output....: %v\n", out)

	err, token_detail, errout := util.Shellout("cat $NODE_HOME/mint/metadata/tx_id")
	if err != nil {
		log.Printf("error: %v\n", token_detail)
		log.Printf("error: %v\n", err)
		log.Printf("error: %v\n", errout)
		c.JSON(http.StatusInternalServerError, "Minting error...")
		return
	}

	s.TokenUrl = token_detail
	s.Amount = 1

	t := time.Now()
	s.MintedTime = &t

	// start minting for new created nft.
	// go func(search dal.Search) {
	// 	controller.StartRecursiveScraping(search.ID)
	// }(ns)

	ns, err := dal.CreateNFT(s)
	if err != nil {
		logger.Println(ns.Title)
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "successs")
}

// UpdateSearch update existing search
func UpdateSearch(c *gin.Context) {
	var s dal.Search
	defer c.Request.Body.Close()

	err := c.BindJSON(&s)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	err = dal.UpdateSearch(s)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "successs")
}

// DeleteSearch delete a search
func DeleteSearch(c *gin.Context) {
	searchID, err := primitive.ObjectIDFromHex(c.Param("search_id"))
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	err = dal.DeleteSearch(searchID)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "successs")
}

// ListNFT get all searches
func ListNFT(c *gin.Context) {
	ss, err := dal.ListNFT()
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, ss)
}

// GetNFT get a search
func GetNFT(c *gin.Context) {
	searchID, err := primitive.ObjectIDFromHex(c.Param("search_id"))
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	s, err := dal.GetNFTByID(searchID)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, s)
}
