package util

import (
	"bytes"
	"os/exec"
	"regexp"
	"log"
	"unicode"
	"strings"
)

const ShellToUse = "bash"

func Shellout(command string) (error, string, string) {
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd := exec.Command(ShellToUse, "-c", command)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	return err, stdout.String(), stderr.String()
}

func GetNormalString(out string)(string){

	reg, err := regexp.Compile("[^a-zA-Z0-9_]+")
	if err != nil{
		log.Printf("error: %v\n",err)
	}

	address := reg.ReplaceAllString(out,"")
	return address
}

func GetNftTitle(out string)(string){

	reg, err := regexp.Compile("[^a-zA-Z]+")
	if err != nil{
		log.Printf("error: %v\n",err)
	}

	title := strings.Title(reg.ReplaceAllString(out,""))

	return title
}

func GetBalanceFromUtxoOut(out string)(string){

	reg, err := regexp.Compile("[^a-zA-Z0-9_]+")
	if err != nil{
		log.Printf("error: %v\n",err)
	}

	balance := reg.ReplaceAllString(out,"")
	return balance
}

func trimLeftChars(s string, n int) string {
    m := 0
    for i := range s {
        if m >= n {
            return s[i:]
        }
        m++
    }
    return s[:0]
}



func isInt(s string) bool {
    for _, c := range s {
        if !unicode.IsDigit(c) {
            return false
        }
    }
    return true
}

func isLetter(s string) bool {
    for _, c := range s {
        if !unicode.IsLetter(c) {
            return false
        }
    }
    return true
}

