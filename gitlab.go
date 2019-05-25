package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

func GetAccessToken(code string) string {

	uploadData := []byte("client_id=" + clientID + "&" +
		"client_secret=" + clientsecret + "&code=" + code +
		"&grant_type=authorization_code&redirect_uri=" + redirectURI)

	postURL := "https://gitlab.com/oauth/token"
	request, err := http.NewRequest("POST", postURL, strings.NewReader(string(uploadData)))
	if err != nil {
		panic(err)
	}
	defer request.Body.Close()
	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var git interface{}

	er := json.Unmarshal(body, &git)
	if er != nil {
		fmt.Println(er)
	}
	token := git.(map[string]interface{})
	// fmt.Println("response Body:", string(body))
	fmt.Println(token)
	return token["access_token"].(string)

}

func GetProject(access string) []interface{} {
	response, err := http.Get("https://gitlab.com/api/v4/projects?access_token=" + accesstoken + "&membership=true&per_page=100")
	if err != nil {
		fmt.Printf("The HTTP request failed with error %s\n", err)

	}
	data, _ := ioutil.ReadAll(response.Body)

	var api []interface{}
	var buf []interface{}
	err = json.Unmarshal(data, &api)
	if err != nil {
		fmt.Println(err)
	}
	page, _ := strconv.Atoi(response.Header.Get("X-Total-Pages"))
	if page > 1 {
		for i := 2; i <= page; i++ {
			response, err := http.Get("https://gitlab.com/api/v4/projects?access_token=" + accesstoken + "&membership=true&per_page=100&page=" + strconv.Itoa(i))
			if err != nil {
				fmt.Printf("The HTTP request failed with error %s\n", err)

			}
			data, _ := ioutil.ReadAll(response.Body)
			err = json.Unmarshal(data, &buf)
			if err != nil {
				fmt.Println(err)
			}
			for _, v := range buf {
				api = append(api, v)
			}

		}
	}
	return api
}
