package proxy

import (
	"bufio"
	"fmt"
	"net"

	"github.com/valyala/fasthttp"
)

func FastHTTPProxyDialer(proxyAddr string) fasthttp.DialFunc {
	return func(addr string) (net.Conn, error) {
		conn, err := fasthttp.Dial(proxyAddr)
		if err != nil {
			return nil, err
		}

		req := "CONNECT " + addr + " HTTP/1.1\r\n"
		// req += "Proxy-Authorization: Basic THlUejJFOmp4a2ozSw==\r\n"
		req += "\r\n"

		if _, err := conn.Write([]byte(req)); err != nil {
			return nil, err
		}

		res := fasthttp.AcquireResponse()
		defer fasthttp.ReleaseResponse(res)

		res.SkipBody = true

		if err := res.Read(bufio.NewReader(conn)); err != nil {
			conn.Close()
			return nil, err
		}
		if res.Header.StatusCode() != fasthttp.StatusOK {
			conn.Close()
			return nil, fmt.Errorf("could not connect to proxy")
		}
		return conn, nil
	}
}
