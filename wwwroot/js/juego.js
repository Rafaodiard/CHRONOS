
    const canvas = document.getElementById("juego");
    const ctx = canvas.getContext("2d");

    let x = 100;
    let y = 100;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, 50, 50);
    }

    draw();
    let teclas = {};

    document.addEventListener("keydown", (event) => {
        teclas[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
        teclas[event.key] = false;
    });

    function update() {
        if (teclas["ArrowUp"]) y -= 5;
        if (teclas["ArrowDown"]) y += 5;
        if (teclas["ArrowLeft"]) x -= 5;
        if (teclas["ArrowRight"]) x += 5;

    }; 

    function juego()
    {
        update();
        draw();
        requestAnimationFrame(juego);
    }
    juego();