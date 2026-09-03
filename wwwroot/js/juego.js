
    const canvas = document.getElementById("juego");
    const ctx = canvas.getContext("2d");
    let DialogoActivo = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let x = 100;
    let y = 100;
    let camaraX = 0;
    let camaraY = 0;
    let npcx = 500;
    let npcy = 400;
    mundoAncho = 1000;
    mundoAlto = 1000;
    let dialogoActual = dialogos.ancianoGrecia;
    let indiceDialogo = 0;
    function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mundo
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(
        -camaraX,
        -camaraY,
        1000,
        1000
    );
    ctx.fillStyle = "black";
    ctx.fillRect(
        600 - camaraX,
        200 - camaraY,
        300,
        50
    );
    //npc
    ctx.fillStyle = "red";
    ctx.fillRect(
        npcx - camaraX,
        npcy - camaraY,
        50,
        50
    );

    // Jugador
    ctx.fillStyle = "blue";
    ctx.fillRect(
        x - camaraX,
        y - camaraY,
        50,
        50
    );}

    draw();
    let teclas = {};

    document.addEventListener("keydown", (event) => {
        teclas[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
        teclas[event.key] = false;
    });
    document.addEventListener("keydown", (event) => {

        if (event.key === "e" && CercaNPC()) {
            console.log("Hablando con el NPC");
            MostrarDialogo();
        }

    });
    function update() {
        if (DialogoActivo) { return;}

        if (teclas["ArrowUp"]) y -= 5;
        if (teclas["ArrowDown"]) y += 5;
        if (teclas["ArrowLeft"]) x -= 5;
        if (teclas["ArrowRight"]) x += 5;
        camaraX = x - canvas.width / 2;
        camaraY = y - canvas.height / 2;
        if (x < 0) x = 0;
        if (y < 0) y = 0;

        if (x > mundoAncho - 50) x = mundoAncho - 50;
        if (y > mundoAlto - 50) y = mundoAlto - 50;

    }; 

    function juego()
    {
        update();
        draw();
        requestAnimationFrame(juego);
    }
    function CercaNPC()
    {
        let distanciax = npcx - x;   
        let distanciay = npcy - y;
        let distancia = Math.sqrt(distanciax*distanciax + distanciay*distanciay);
        return distancia < 100;

    }
    function MostrarDialogo(){
        document.getElementById("dialogo").style.display = "block";
        DialogoActivo = true;
    }
    function OcultarDialogo(){
        document.getElementById("dialogo").style.display = "none";
        DialogoActivo = false;
    }
    juego();