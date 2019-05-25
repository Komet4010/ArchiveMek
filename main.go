package main

import (
	"github.com/kataras/iris"
	"strings"
	"encoding/json"
	"strconv"
)

var clientID = "c048798ffdab3e2b06c3532dae76f1245441782a880e367ca397e6d35366bd53"
var redirectURI = "http://localhost:8080/homes/"
var clientsecret = "6824714a99df530321b808d406197ab4d6bacbeeeeea73d262bf7c5f918b00c8"
var accesstoken string

func main() {
	app := iris.New()
	app.RegisterView(iris.HTML("./views", ".html"))
	app.StaticWeb("/", "./public")

	app.Get("/", func(ctx iris.Context) {
		ctx.Redirect("https://gitlab.com/oauth/authorize?client_id=" +
			clientID + "&redirect_uri=" + redirectURI + "&response_type=code&state=open")
	})

	app.Get("/homes", func(ctx iris.Context) {
		accesstoken = GetAccessToken(ctx.URLParam("code"))
		ctx.Redirect("/home")

	})

	app.Get("/home", func(ctx iris.Context) {
		api := GetProject(accesstoken)
		if (len(api) % 100) > 0 {
			ctx.ViewData("num", (len(api)/100)+1)
		} else {
			ctx.ViewData("num", len(api)/100)
		}
		
		ctx.View("home.html")
		
	})

	app.Post("/page", func(ctx iris.Context) {
		api := GetProject(accesstoken)
		var test []interface{}
		if ctx.PostValues("st") != nil {
			st := ctx.PostValues("st")
			var tst string
			for _, v := range api {
				p := v.(map[string]interface{})
				tst = p["name"].(string)
				if strings.Contains(strings.ToLower(tst), strings.ToLower(st[0])) {
					test = append(test, v)
				}
			}
			b, _ := json.Marshal(test)
			ctx.Write(b)
			api = test
		} else {
			pageNum := ctx.PostValue("num")
			var index int

			num, _ := strconv.Atoi(pageNum)
			lastpage := (len(api) / 100) + 1
			left := len(api) % 100
			index = (num - 1) * 100
			if num == lastpage {
				for i := 0; i < left; i++ {

					test = append(test, api[index+i])
				}
			} else {

				for i := 0; i < 100; i++ {
					test = append(test, api[index+i])
				}

			}

			b, _ := json.Marshal(test)
			ctx.Write(b)
		}

	})

	app.Run(
		// Starts the web server at localhost:8080
		iris.Addr(":8080"),
		// Disables the updater.
		iris.WithoutVersionChecker,
		// Ignores err server closed log when CTRL/CMD+C pressed.
		iris.WithoutServerError(iris.ErrServerClosed),
		// Enables faster json serialization and more.
		iris.WithOptimizations,
	)
}
