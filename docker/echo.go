package main

import (
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/", echo)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}

var (
	ln = []byte("> ")
	lf = []byte("\n")
	sp = []byte(" ")
	hr = []byte(": ")
)

func echo(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	w.Write(ln)
	w.Write([]byte(r.Method))
	w.Write(sp)
	w.Write([]byte(r.URL.Path))
	w.Write(sp)
	w.Write([]byte(r.Proto))
	w.Write(lf)

	for head, value := range r.Header {
		w.Write(ln)
		w.Write([]byte(head))
		w.Write(hr)
		for _, v := range value {
			w.Write([]byte(v))
		}
		w.Write(lf)
	}

	if _, err := io.Copy(w, r.Body); err == nil {
		w.Write(lf)
	}
}
