package api

import (
	"net/http"
	"strconv"

	"fmt"
	"log"

	"minting_nft.com/controller"
	"minting_nft.com/dal"
	"minting_nft.com/pkg/logger"

	"github.com/gin-gonic/gin"
	"minting_nft.com/pkg/util"
)

// UpdateSetting update existing config
func UpdateSetting(c *gin.Context) {
	var s dal.AppConfig
	defer c.Request.Body.Close()

	err := c.BindJSON(&s)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	err = dal.UpdateSetting(s)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "successs")
}

// GetAppConfig gets existing config
func GetAppConfig(c *gin.Context) {

	// get the Current config.
	s, err := dal.GetAppConfig()
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	// get Balance of current UTXO, save it into the db.

	err, out, errout := util.Shellout("$NODE_HOME/mint/get_balance.sh " + s.AddressNode)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		fmt.Printf("error: %v\n", errout)
	}
	fmt.Println("--- get_balance.sh out ---")
	fmt.Println(out)

	err = dal.UpdateBalance(out)
	if err != nil {
		log.Printf("error: %v\n", err)
	}

	// get the setting again after updating current uxto(blance ada)
	s, err = dal.GetAppConfig()
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, s)
}

// RunScraping change scraping running status
func RunScraping(c *gin.Context) {
	rs, err := strconv.Atoi(c.Param("run_status"))
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	err = dal.UpdateRunStatus(rs)
	if err != nil {
		logger.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if rs == 1 {
		controller.StartCardanoNode()
	} else {
		controller.StopCardanoNode()
	}
	c.JSON(http.StatusOK, "successs")
}
