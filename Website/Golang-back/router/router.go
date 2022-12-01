package router

import (
	"minting_nft.com/api"
	"minting_nft.com/config"
	"minting_nft.com/pkg/auth"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// GetRouter build all routes
func GetRouter() *gin.Engine {
	
	r := gin.Default()

	conf := cors.DefaultConfig()
	conf.AllowAllOrigins = true
	conf.AllowCredentials = true
	conf.AddAllowHeaders("authorization")
	r.Use(cors.New(conf))

	r.GET("/", api.StatusCheck)
	r.POST("api/login", api.Login)
	r.POST("api/register", api.Register)
	r.POST("api/update-role", api.UpdateRole)

	authGroup := r.Group("/")
	authGroup.Use(auth.Middleware())
	{
		authGroup.GET("api/protected", api.ProtectedUser)
		authGroup.POST("api/changepwd", api.ChangePassword)

		// setting routes
		authGroup.POST("api/setting", api.UpdateSetting)
		authGroup.PUT("api/setting/:run_status", api.RunScraping)
		authGroup.GET("api/setting", api.GetAppConfig)

		// search routes
		authGroup.POST("api/nft", api.CreateNFT)
		authGroup.PUT("api/nft", api.UpdateSearch)
		authGroup.GET("api/nft", api.ListNFT)
		authGroup.GET("api/nft/:search_id", api.GetNFT)
		authGroup.DELETE("api/nft/:search_id", api.DeleteSearch)

		// product routes
		authGroup.GET("api/product/:search_id", api.ListProduct)

		// proxy routes
		authGroup.POST("api/proxy", api.CreateProxy)
		authGroup.POST("api/proxies", api.CreateProxies)
		authGroup.GET("api/proxy", api.ListProxy)
		authGroup.DELETE("api/proxy/:proxy_id", api.DeleteProxy)
		authGroup.DELETE("api/proxies", api.DeleteProxies)

		authGroup.GET("api/logs", api.GetLogs)
	}

	return r
}

// GetPort get port from config
func GetPort() string {
	return config.Cfg.ServerConfigurations.Port
}
