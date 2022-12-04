
// to screenshot the div
function screenshot() {
    const captureElement = document.querySelector("#img");
    html2canvas(document.querySelector(".main"))
        .then((canvas) => {
            canvas.style.display = "none";
            document.body.appendChild(canvas);
            return canvas;
        })
        .then((canvas) => {
            const image = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            const a = document.createElement("a");

            a.setAttribute(
                "download",
                new Date().toISOString() + "_screenshot_virtualchangingroom.png"
            );
            a.setAttribute("href", image);
            a.click();
            canvas.remove();
        });
}

//download img from filesystem
function choose() {
    const image_input = document.querySelector("#files");

    image_input.addEventListener("change", function () {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const uploaded_image = reader.result;
            document.querySelector(
                "#img"
            ).style.backgroundImage = `url(${uploaded_image})`;
        });
        reader.readAsDataURL(this.files[0]);
    });
}

//remove background image
function deleteImg() {
    console.log("Background is deleted");
    var bg = document.getElementById("img");
    bg.style.removeProperty("background");
    //Create popup for 3 seconds
    document.getElementById('myPopup').innerHTML = "Your image has been removed";
    $("#myPopup").fadeIn();
    setTimeout(function () { $("#myPopup").fadeOut(); }, 3000);
}

//Add clothes from sidemenu buttons
function addClothes(id) {
    var imgPath = document.getElementById(id).src;
    createDivs(imgPath);

    //calling resizable method
    interact(".dragme")
        .resizable({
            // resize from all edges and corners
            allowFrom: ".dragme",
            //specifies the edges of the element which can be resized
            edges: { left: true, right: true, bottom: true, top: true },

            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: "parent",
                    restriction: "parent",
                }),
                interact.modifiers.restrictSize({
                    min: { width: 20, height: 20 },
                    max: { width: 400, height: 600 },
                }),
                interact.modifiers.restrict({
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { left: 0, right: 0, top: 1, bottom: 1 },
                }),
            ],
            listeners: {
                start(event) {
                    if (event._interaction.downEvent.target.classList.contains("rotation-handle")) {
                        const element = event.target;
                        const rect = element.getBoundingClientRect();

                        //lisätty
                        // store the center as the element has css `transform-origin: center center`
                        element.dataset.centerX = rect.left + rect.width / 2;
                        element.dataset.centerY = rect.top + rect.height / 2;

                        // get the angle of the element when the drag starts
                        element.dataset.angle = getDragAngle(event);
                    }
                },

                // call this function on every dragmove event
                move(event) {
                    let x = parseFloat(event.target.getAttribute("data-x")) || 0;
                    let y = parseFloat(event.target.getAttribute("data-y")) || 0;
                    let angle = parseFloat(event.target.getAttribute("data-angle")) || 0;
                    
                    //past version target was path[0]. Changet it to target
                    //--> path[0] didn't work with Firefox
                    if (event._interaction.downEvent.target.classList.contains("rotation-handle")) {
                        angle = getDragAngle(event);
                    } else {
                        // update the element's style
                        event.target.style.width = event.rect.width + "px";
                        event.target.style.height = event.rect.height + "px";

                        // translate when resizing from top or left edges
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        // translate the element
                        event.target.setAttribute("data-x", x);
                        event.target.setAttribute("data-y", y);
                    }

                    event.target.style.transform = "translate(" + event.target.getAttribute("data-x") +
                        "px," + event.target.getAttribute("data-y") + "px) rotate(" + angle + "rad" + ")";
                },
                end(event) {
                    if (event._interaction.downEvent.target.classList.contains("rotation-handle") ) {
                        event.target.dataset.angle = getDragAngle(event);
                    }
                },
            },
        })

        .draggable({
            listeners: { move: window.dragMoveListener },
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: "parent",
                    endOnly: true,
                }),
                interact.modifiers.restrict({
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { left: 0, right: 0, top: 1, bottom: 1 },
                }),
            ],
        });

    //draggable method starts
    interact(".dragme").draggable({
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "parent",
                endOnly: true,
            }),

            interact.modifiers.restrict({
                restriction: "parent",
                endOnly: true,

                elementRect: { left: 10, right: 0, top: 1, bottom: 1 },
            }),
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,

            // call this function on every dragend event
            end(event) {
                var textEl = event.target.querySelector("p");

                textEl &&
                    (textEl.textContent =
                        "moved a distance of " +
                        Math.sqrt(
                            (Math.pow(event.pageX - event.x0, 2) +
                                Math.pow(event.pageY - event.y0, 2)) |
                            0
                        ).toFixed(2) +
                        "px");
            },
        },
    });

    // target elements with the "draggable" class
    interact(".dragme").draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "parent",
            }),
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,

            // call this function on every dragend event
            end(event) {
               var textEl = event.target.querySelector("p");

                textEl &&
                    (textEl.textContent =
                        "moved a distance of " +
                        Math.sqrt(
                            (Math.pow(event.pageX - event.x0, 2) +
                                Math.pow(event.pageY - event.y0, 2)) |
                            0
                        ).toFixed(2) +
                        "px");
            },
        },
    });

    function dragMoveListener(event) {
        var target = event.target;

        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
        var angle = event.target.setAttribute(
            "data-angle",
            parseFloat(event.target.dataset.angle) || 0
        );

        // translate the element
        target.style.transform = "translate(" + x + "px, " + y + "px)";
        target.style.transform = "translate(" + x + y + angle + "rad)";

        // update the position coordinates
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
        target.setAttribute(
            "data-angle",
            parseFloat(event.target.dataset.angle) || 0
        );

        
        target.getAttribute("data-y") +
            "px) rotate(" +
            event.target.getAttribute("data-angle") +
            "rad" +
            ")";

       target.style.transform =
            "translate(" +
            target.getAttribute("data-x") +
            "px, " +
            target.getAttribute("data-y") +
            "px) rotate(" +
            target.getAttribute("data-angle") +
            "rad" +
            ")";

        // Bring to front dragged element
        var t = event.target;
        t.parentNode.appendChild(target);

    }
    window.dragMoveListener = dragMoveListener;

    //draggable method is also used to implement rotation
    interact(".rotation-handle").draggable({
        onstart: function (event) {
            var box = event.target.parentElement;
            var rect = box.getBoundingClientRect();

            // store the center as the element has css `transform-origin: center center`
            box.setAttribute("data-center-x", rect.left + rect.width / 2);
            box.setAttribute("data-center-y", rect.top + rect.height / 2);

            // get the angle of the element when the drag starts
            box.setAttribute("data-angle", getDragAngle(event));
        },

        onmove: function (event) {
            var box = event.target.parentElement;
            var pos = {
                x: parseFloat(box.getAttribute("data-x")) || 0,
                y: parseFloat(box.getAttribute("data-y")) || 0,
            };
            var angle = getDragAngle(event);

            // update position and angle
            box.style.transform = "translate(" + pos.x + "px, " + 
            pos.y + "px) rotate(" + angle + "rad" +")";
        },

        // call this function on every dragend event
        onend: function (event) {
            var box = event.target.parentElement;

            //call getDragAngle function
            box.setAttribute("data-angle", getDragAngle(event));
        },
    });

    //getDragAngle function creates and saves new angle
    function getDragAngle(event) {
        var box = event.target;
        var startAngle = parseFloat(box.getAttribute("data-angle")) || 0;
        var center = {
            x: parseFloat(box.parentElement.getAttribute("data-center-x")) || 0,
            y: parseFloat(box.parentElement.getAttribute("data-center-y")) || 0,
           
        }; 
       
        var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);
        return angle - startAngle;   
    }
}

//createDivs-function create .dragme div which inside is .rotation-handle div, deleteCBtn button and image
function createDivs(imgPath) {
    var i = new Image();
    var Imgdiv = document.getElementById("img");
    var mamaDiv = document.createElement("div");
    var rotateDiv = document.createElement("div");
    var deleteBtn = document.createElement("button");

    i.onload = function () {
        deleteBtn.setAttribute("id", "deleteCBtn");
        mamaDiv.appendChild(i);
        mamaDiv.appendChild(rotateDiv);
        mamaDiv.appendChild(deleteBtn);
        Imgdiv.appendChild(mamaDiv);
        rotateDiv.setAttribute("class", "rotation-handle");
        rotateDiv.innerHTML =
            '<span class="material-symbols-outlined drag">rotate_right</span>';
        deleteBtn.innerHTML =
            '<span class="material-symbols-outlined drag">close</span>';
    };
    i.src = imgPath;
    mamaDiv.setAttribute("class", "dragme");
    $(document).on("click", ".dragme", function () {
        $(".dragme").click(function () {
            $(this).parent().append(this);
        });
    });
}
