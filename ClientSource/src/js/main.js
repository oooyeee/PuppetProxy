import { EE } from "../../../lib/common_utils.js"

window.addEventListener("load", () => {
    "use strict";
    let DOM = {};

    DOM["logo"] = document.querySelector("header > .header__logo");
    DOM["stream"] = document.querySelector("#stream-window");
    DOM["status"] = document.querySelector("#status-bar");
    DOM["heading"] = document.querySelector(".main-wrapper > h1");
    DOM["form__hint"] = document.getElementById("form__hint")

    DOM["form_interactions"] = document.querySelector(".form--interactions")
    DOM["interaction_options"] = document.getElementById("form--interactions__options")
    DOM["form_login"] = document.querySelector(".form--login")
    DOM["form_register"] = document.querySelector(".form--register")

    DOM["checkbox-modal-register"] = document.getElementById("checkbox-modal-register")
    DOM["checkbox-modal-login"] = document.getElementById("checkbox-modal-login")

    DOM["form_login"].addEventListener("submit", LoginHandler)
    DOM["form_register"].addEventListener("submit", RegisterHandler)
    DOM["form_interactions"].addEventListener("submit", InteractionsHandler)

    let loginEE = new EE();
    let registerEE = new EE();
    let wsEE = new EE();
    let ws;
    wsEE.on("ws_open", () => {
        if (ws && ws.OPEN) {
            ws.close();
        }

        function StartWS() {
            ws = new WebSocket("ws://localhost:9999/ws");
            ws.addEventListener("open", (ev) => {
                console.log(":: Opened WS ::")

                ws.send(JSON.stringify({ "type": "open browser", "json": {} }))
            })

            let count = 1;

            ws.addEventListener("message", function (ev) {
                console.log(["screenshot N", count]);
                UpdateImage(DOM["stream"], ev.data);
                DOM["status"].innerText = "screenshot N: " + count++;
            });

            ws.addEventListener("close", function (ev) {
                ws = null
                console.log(["== ws close ==", ev]);
                setTimeout(() => { StartWS() }, 5000);
            });
        }

        StartWS();


    });

    registerEE.on("json", (json) => {
        DOM["status"].innerText = `hello, ${json.name}`;
        DOM["heading"].innerText = `hello, ${json.name}`;
        DOM["form__hint"].innerText = json.token.belongsTo;
        localStorage.setItem("name", json.name);
        localStorage.setItem("token", JSON.stringify(json.token));
        wsEE.emit("ws_open");
    });

    loginEE.on("json", (json) => {
        DOM["status"].innerText = `hello, ${json.name}`;
        DOM["heading"].innerText = `hello, ${json.name}`;
        DOM["form__hint"].innerText = json.token.belongsTo;
        localStorage.setItem("name", json.name);
        localStorage.setItem("token", JSON.stringify(json.token));
        wsEE.emit("ws_open");
    });


    function LoginHandler(event) {
        event.preventDefault();
        let formElements = DOM["form_login"].elements
        let url = DOM["form_login"].getAttribute("action")
        let uuid = formElements["uuid"].value
        let pw = formElements["password"].value
        let jsonData = JSON.stringify({
            id: uuid,
            password: pw
        })

        console.log([url, jsonData]);
        fetch(url, { method: "post", body: jsonData })
            .then((response) => {
                console.log(response.status);
                // console.log(await response.json())
                // console.log(response);
                return response.json()
            }).then((json) => {
                console.log(json)
                DOM["checkbox-modal-login"].checked = false;
                loginEE.emit("json", json)
            }).catch(err => {
                console.log(err);
            })
    }

    function RegisterHandler(event) {
        event.preventDefault();
        let formElements = DOM["form_register"].elements
        let url = DOM["form_register"].getAttribute("action")
        let name = formElements["name"].value
        let pw = formElements["password"].value
        let jsonData = JSON.stringify({
            name: name,
            password: pw
        })

        console.log([url, jsonData]);

        fetch(url, { method: "post", body: jsonData })
            .then((response) => {
                console.log(response.status);
                // console.log(await response.json())
                // console.log(response);
                return response.json()
            }).then((json) => {
                console.log(json)
                DOM["checkbox-modal-register"].checked = false;
                registerEE.emit("json", json)
            }).catch(err => {
                console.log(err);
            })


    }

    function InteractionsHandler(event) {
        event.preventDefault();

        let formElements = DOM["form_interactions"].elements
        let url = DOM["form_interactions"].getAttribute("action")
        let selectedOption = DOM["interaction_options"].value
        let text = formElements["keyboard_input"].value

        let jsonData = JSON.stringify({
            type: selectedOption,
            json: {
                text: text
            }
        })
        if (ws && ws.OPEN) {
            console.log("attempting to send data over WS")
            ws.send(jsonData);
        } else {
            console.log("attempted interaction, websocket is not open")
        }
        console.log(["value", selectedOption])
    }


    function UpdateImage(el, data) {
        el.setAttribute("src", `data:image/webp; base64, ${data}`)
    }

});


