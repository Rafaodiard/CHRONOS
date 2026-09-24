// Efectos visuales de ambiente dibujados sobre el mapa. Son puramente decorativos: no tienen
// colisión ni interacción. Todo vive en coordenadas del mapa (en píxeles de pantalla, igual que
// la cámara): cuando el jugador camina, los efectos se corren junto con el escenario.
//
// Además de los efectos por mapa hay dos globales que puede disparar cualquier parte del juego:
//   sacudirCamara(intensidad, segundos)  -> temblor de cámara
//   destelloFragmento()                  -> fogonazo y chispas doradas alrededor del jugador

// Nombre del mapa (sin .tmj, en minúsculas) -> efectos que se muestran.
const EFECTOS_VISUALES_POR_MAPA = {
    labo: ["leds", "chispasAzules", "vineta"],
    ancientgreek: ["pajaros", "gaviotas", "nubes", "polvoPies", "destellosAgua", "mariposas"],
    almacengrecia: ["motasLuz", "vineta"],
    templogrecia: ["motasLuz", "haces", "incienso", "vineta"],
    fragtemp1: ["motasLuz", "haces", "incienso", "vineta"],
    "castillo edad media": ["pajaros", "hojas", "nubes", "polvoPies"],
    castilloprincipal: ["brasas", "telaranas", "vineta"],
    castillopiso2: ["brasas", "telaranas", "vineta"],
    fragtemp2: ["brasas", "telaranas", "vineta"],
    introrev: ["polvo", "vapor", "haces"],
    recepcion: ["polvo", "haces", "vineta"],
    salamaquinas: ["polvo", "vapor", "chispas", "haces", "vineta"],
    salaelectricidad: ["polvo", "chispas", "haces", "vineta"]
};

// Color del polvo que levantan los pies (arena en Grecia, tierra en la Edad Media).
const COLOR_POLVO_PIES = {
    ancientgreek: "216, 196, 154",
    "castillo edad media": "150, 128, 98"
};

const efectosVisuales = {
    mapa: null,
    activos: [],
    particulas: [],
    bandadas: [],
    nubes: [],
    haces: [],
    telaranas: [],
    leds: [],
    emisoresIncienso: [],
    proximo: {},
    ultimoTiempo: 0,
    ultimaPosJugador: null,
    temblor: { intensidad: 0, inicio: 0, duracion: 0 },
    destello: { inicio: 0, duracion: 0 },
    electrocucion: { inicio: 0, duracion: 0, proximaChispa: 0 },
    vineta: null,
    vinetaTamaño: ""
};

// =========================================================
// UTILIDADES
// =========================================================

function azar(min, max) {
    return min + Math.random() * (max - min);
}

function tieneEfecto(nombre) {
    return efectosVisuales.activos.includes(nombre);
}

function tamañoMapaPantalla() {
    return {
        ancho: mapa.width * tamañoTilePantalla,
        alto: mapa.height * tamañoTilePantalla
    };
}

function pantallasDelMapa() {
    const { ancho, alto } = tamañoMapaPantalla();
    return (ancho * alto) / (canvas.width * canvas.height);
}

// Un punto al azar dentro de lo que la cámara está viendo, en coordenadas del mapa.
function puntoEnVista(margenX = 0, desdeY = 0, hastaY = 1) {
    return {
        x: camara.x + azar(-margenX, canvas.width + margenX),
        y: camara.y + azar(canvas.height * desdeY, canvas.height * hastaY)
    };
}

function estaEnVista(x, y, margen = 100) {
    const sx = x - camara.x;
    const sy = y - camara.y;
    return sx > -margen && sx < canvas.width + margen && sy > -margen && sy < canvas.height + margen;
}

// Rectángulos de colisión del mapa (muros, equipos, muebles) en coordenadas de pantalla-mapa.
function rectangulosColision() {
    const lista = typeof colisiones !== "undefined" && Array.isArray(colisiones) ? colisiones : [];
    return lista
        .filter(c => c.width > 0 && c.height > 0)
        .map(c => ({ x: c.x * escala, y: c.y * escala, w: c.width * escala, h: c.height * escala }));
}

function elegir(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// Lee el color ya dibujado en la pantalla (el mapa) en un punto. Sirve para encontrar agua o pasto
// sin tener que marcarlos en los mapas.
function colorEnPantalla(sx, sy) {
    try {
        const d = ctx.getImageData(Math.round(sx), Math.round(sy), 1, 1).data;
        return { r: d[0], g: d[1], b: d[2] };
    } catch {
        return null;
    }
}

// =========================================================
// PREPARAR UN MAPA
// =========================================================

function prepararEfectosVisuales(nombreMapa) {
    const e = efectosVisuales;
    e.mapa = nombreMapa;
    e.activos = EFECTOS_VISUALES_POR_MAPA[nombreMapa] || [];
    e.particulas = [];
    e.bandadas = [];
    e.nubes = [];
    e.haces = [];
    e.telaranas = [];
    e.leds = [];
    e.emisoresIncienso = [];
    e.ultimaPosJugador = null;

    const ahora = performance.now() / 1000;
    e.proximo = {
        bandada: ahora,
        vapor: ahora + azar(0.5, 1.5),
        chispa: ahora + azar(2, 5),
        chispaAzul: ahora + azar(2, 6),
        brasa: ahora,
        incienso: ahora,
        pies: ahora,
        agua: ahora,
        mariposa: ahora
    };

    const { ancho, alto } = tamañoMapaPantalla();
    const pantallas = pantallasDelMapa();
    const rects = rectangulosColision();

    if (tieneEfecto("polvo")) {
        for (let i = 0; i < 45; i++) e.particulas.push(crearMotaPolvo());
    }

    if (tieneEfecto("motasLuz")) {
        for (let i = 0; i < 35; i++) e.particulas.push(crearMotaLuz());
    }

    if (tieneEfecto("hojas")) {
        for (let i = 0; i < 10; i++) e.particulas.push(crearHoja());
    }

    if (tipoBandadaAlAzar()) {
        const objetivo = bandadasObjetivo();
        for (let i = 0; i < objetivo; i++) e.bandadas.push(crearBandada(tipoBandadaAlAzar(), true));
    }

    if (tieneEfecto("nubes")) {
        const cantidad = Math.max(2, Math.round(pantallas * 0.8));
        for (let i = 0; i < cantidad; i++) e.nubes.push(crearNube(azar(0, ancho)));
    }

    if (tieneEfecto("haces")) {
        const cantidad = Math.max(2, Math.round(ancho / 550));
        for (let i = 0; i < cantidad; i++) {
            e.haces.push({
                x: (i + azar(0.1, 0.9)) * ancho / cantidad,
                y: azar(-120, alto * 0.35),
                largo: azar(420, 700),
                ancho: azar(50, 100),
                alfa: azar(0.05, 0.09),
                fase: azar(0, Math.PI * 2)
            });
        }
    }

    if (tieneEfecto("telaranas")) {
        // Esquinas del mapa y esquinas superiores de algunos muros.
        const esquinas = [
            { x: 0, y: 0, desde: 0, hasta: Math.PI / 2 },
            { x: ancho, y: 0, desde: Math.PI / 2, hasta: Math.PI }
        ];
        rects.filter(r => r.w > 60 && r.h > 60)
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .forEach(r => {
                esquinas.push(Math.random() < 0.5
                    ? { x: r.x, y: r.y, desde: 0, hasta: Math.PI / 2 }
                    : { x: r.x + r.w, y: r.y, desde: Math.PI / 2, hasta: Math.PI });
            });
        e.telaranas = esquinas.map(esquina => ({
            ...esquina,
            radio: azar(45, 80),
            fase: azar(0, Math.PI * 2),
            anillos: Array.from({ length: 4 }, (_, k) => (k + 1) / 4 * azar(0.9, 1.05))
        }));
    }

    if (tieneEfecto("leds")) {
        const cantidad = Math.min(70, Math.max(12, Math.round(pantallas * 14)));
        const colores = ["120, 255, 140", "255, 90, 80", "255, 190, 70", "110, 180, 255"];
        for (let i = 0; i < cantidad; i++) {
            const r = rects.length ? elegir(rects) : { x: 0, y: 0, w: ancho, h: alto };
            e.leds.push({
                x: r.x + azar(4, Math.max(5, r.w - 4)),
                y: r.y + azar(4, Math.max(5, Math.min(r.h - 4, 48))),
                color: elegir(colores),
                periodo: azar(0.4, 2.8),
                fase: azar(0, 1),
                respira: Math.random() < 0.35
            });
        }
    }

    if (tieneEfecto("incienso")) {
        // Sale junto a objetos chicos (altares, pebeteros); si no hay, cerca del centro del mapa.
        const chicos = rects.filter(r => r.w <= 180 && r.h <= 180).sort(() => Math.random() - 0.5).slice(0, 3);
        e.emisoresIncienso = chicos.length
            ? chicos.map(r => ({ x: r.x + r.w / 2, y: r.y + r.h * 0.3 }))
            : [0, 1].map(() => ({ x: azar(ancho * 0.3, ancho * 0.7), y: azar(alto * 0.3, alto * 0.7) }));
    }
}

// =========================================================
// CREAR PARTÍCULAS
// =========================================================

function crearMotaPolvo() {
    const p = puntoEnVista(40);
    return {
        tipo: "polvo", x: p.x, y: p.y,
        vx: azar(-6, 6), vy: azar(-14, -5),
        radio: azar(0.8, 2.2), alfa: azar(0.12, 0.35), fase: azar(0, Math.PI * 2),
        infinita: true
    };
}

function crearMotaLuz() {
    const p = puntoEnVista(40);
    return {
        tipo: "motaLuz", x: p.x, y: p.y,
        vx: azar(-4, 4), vy: azar(-7, -2),
        radio: azar(1, 2.6), alfa: azar(0.25, 0.55), fase: azar(0, Math.PI * 2),
        infinita: true
    };
}

function crearHoja() {
    const p = puntoEnVista(40);
    return {
        tipo: "hoja", x: p.x, y: p.y,
        vx: azar(12, 30), vy: azar(18, 34),
        giro: azar(0, Math.PI * 2), velGiro: azar(-3, 3), fase: azar(0, Math.PI * 2),
        color: Math.random() < 0.5 ? "#8a9a3b" : "#b4893a",
        infinita: true
    };
}

function crearNubeVapor() {
    const p = puntoEnVista(0, 0.35, 1);
    const vida = azar(3.5, 6);
    return {
        tipo: "vapor", x: p.x, y: p.y,
        vx: azar(-8, 8), vy: azar(-22, -10),
        radio: azar(18, 34), crecimiento: azar(8, 16),
        vida, vidaTotal: vida, alfa: azar(0.05, 0.1)
    };
}

function crearChispas(color) {
    const p = puntoEnVista(-canvas.width * 0.15, 0.2, 0.8);
    const cantidad = color === "azul" ? Math.round(azar(4, 8)) : Math.round(azar(6, 12));
    for (let i = 0; i < cantidad; i++) {
        const angulo = azar(-Math.PI * 0.95, -Math.PI * 0.05);
        const velocidad = azar(60, 170);
        const vida = azar(0.3, 0.8);
        efectosVisuales.particulas.push({
            tipo: "chispa", color, x: p.x, y: p.y,
            vx: Math.cos(angulo) * velocidad, vy: Math.sin(angulo) * velocidad,
            vida, vidaTotal: vida
        });
    }
}

function crearBrasa() {
    // Sale de algún muro visible (donde irían las antorchas); si no hay, de cualquier punto en vista.
    const muros = rectangulosColision().filter(r => estaEnVista(r.x + r.w / 2, r.y + r.h / 2, 200));
    let x, y;
    if (muros.length) {
        const r = elegir(muros);
        x = r.x + azar(0, r.w);
        y = r.y + r.h * azar(0.2, 0.9);
    } else {
        ({ x, y } = puntoEnVista(0, 0.2, 1));
    }
    const vida = azar(1.4, 3);
    return {
        tipo: "brasa", x, y,
        vx: azar(-8, 8), vy: azar(-50, -25),
        radio: azar(1.1, 2.3), fase: azar(0, Math.PI * 2),
        vida, vidaTotal: vida
    };
}

function crearHumoIncienso(emisor) {
    const vida = azar(4, 5.5);
    return {
        tipo: "incienso", x: emisor.x, y: emisor.y, x0: emisor.x,
        vy: azar(-28, -18), fase: azar(0, Math.PI * 2),
        radio: 3, vida, vidaTotal: vida
    };
}

function crearPolvoPies(x, y, color) {
    const vida = azar(0.45, 0.8);
    return {
        tipo: "polvoPies", x, y, color,
        vx: azar(-22, 22), vy: azar(-16, -4),
        radio: azar(2, 3.2), vida, vidaTotal: vida
    };
}

function crearDestelloAgua(x, y) {
    const vida = azar(0.6, 1.1);
    return { tipo: "destelloAgua", x, y, largo: azar(3, 6), vida, vidaTotal: vida };
}

function crearMariposa(x, y) {
    const vida = azar(8, 14);
    return {
        tipo: "mariposa", x, y, x0: x, y0: y,
        deriva: azar(-12, 12), fase: azar(0, Math.PI * 2),
        color: elegir(["255, 255, 245", "250, 220, 90", "245, 150, 70", "170, 210, 255"]),
        vida, vidaTotal: vida
    };
}

function crearBrillo(x, y) {
    const angulo = azar(0, Math.PI * 2);
    const velocidad = azar(80, 240);
    const vida = azar(0.8, 1.5);
    return {
        tipo: "brillo", x, y,
        vx: Math.cos(angulo) * velocidad, vy: Math.sin(angulo) * velocidad,
        radio: azar(1.5, 3), vida, vidaTotal: vida
    };
}

function crearChispa(x, y) {
    const angulo = azar(0, Math.PI * 2);
    const velocidad = azar(120, 320);
    const vida = azar(0.25, 0.6);
    return {
        tipo: "chispa", x, y,
        vx: Math.cos(angulo) * velocidad, vy: Math.sin(angulo) * velocidad - 60,
        radio: azar(1, 2.2), vida, vidaTotal: vida
    };
}

// =========================================================
// ACTUALIZAR Y DIBUJAR PARTÍCULAS
// =========================================================

function actualizarParticula(p, dt, t) {
    switch (p.tipo) {
        case "polvo":
            p.x += (p.vx + Math.sin(t * 0.8 + p.fase) * 6) * dt;
            p.y += p.vy * dt;
            break;
        case "motaLuz":
            p.x += (p.vx + Math.sin(t * 0.5 + p.fase) * 4) * dt;
            p.y += p.vy * dt;
            break;
        case "hoja":
            p.x += (p.vx + Math.sin(t * 1.6 + p.fase) * 20) * dt;
            p.y += p.vy * dt;
            p.giro += p.velGiro * dt;
            break;
        case "vapor":
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.radio += p.crecimiento * dt;
            break;
        case "chispa":
            p.vy += 380 * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            break;
        case "brasa":
            p.x += (p.vx + Math.sin(t * 3 + p.fase) * 10) * dt;
            p.y += p.vy * dt;
            break;
        case "incienso": {
            const edad = p.vidaTotal - p.vida;
            p.y += p.vy * dt;
            p.x = p.x0 + Math.sin(t * 1.4 + p.fase) * (3 + edad * 5);
            p.radio = 3 + edad * 3;
            break;
        }
        case "polvoPies":
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= 0.92;
            p.radio += 6 * dt;
            break;
        case "mariposa":
            p.x0 += p.deriva * dt;
            p.x = p.x0 + Math.sin(t * 0.7 + p.fase) * 40;
            p.y = p.y0 + Math.sin(t * 1.3 + p.fase) * 18 + Math.sin(t * 5 + p.fase) * 3;
            break;
        case "brillo":
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= 0.94;
            p.vy *= 0.94;
            break;
        case "chispa":
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= 0.92;
            p.vy = p.vy * 0.92 + 420 * dt;
            break;
    }

    if (p.vida !== undefined) {
        p.vida -= dt;
    }

    // Las partículas "infinitas" nunca se pierden: si la cámara las saca por un borde,
    // vuelven por el opuesto.
    if (p.infinita) {
        const ancho = canvas.width + 80;
        const alto = canvas.height + 40;
        const sx = ((p.x - camara.x + 40) % ancho + ancho) % ancho - 40;
        const sy = ((p.y - camara.y + 20) % alto + alto) % alto - 20;
        p.x = sx + camara.x;
        p.y = sy + camara.y;
    }
}

function vidaRestante(p) {
    return Math.max(0, p.vida / p.vidaTotal);
}

function dibujarParticula(p, t) {
    const x = p.x - camara.x;
    const y = p.y - camara.y;

    if (x < -80 || x > canvas.width + 80 || y < -80 || y > canvas.height + 80) {
        return;
    }

    switch (p.tipo) {
        case "polvo":
            ctx.fillStyle = `rgba(255, 226, 170, ${p.alfa})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            break;
        case "motaLuz": {
            const alfa = p.alfa * (0.6 + 0.4 * Math.sin(t * 1.7 + p.fase));
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = `rgba(255, 220, 140, ${alfa * 0.35})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, 240, 200, ${alfa})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
            break;
        }
        case "hoja":
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(p.giro);
            ctx.fillStyle = p.color;
            ctx.fillRect(-3, -1.5, 6, 3);
            ctx.restore();
            break;
        case "vapor": {
            const alfa = p.alfa * Math.sin(Math.PI * (1 - vidaRestante(p)));
            const gradiente = ctx.createRadialGradient(x, y, 0, x, y, p.radio);
            gradiente.addColorStop(0, `rgba(230, 232, 235, ${alfa})`);
            gradiente.addColorStop(1, "rgba(230, 232, 235, 0)");
            ctx.fillStyle = gradiente;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "chispa": {
            const alfa = vidaRestante(p);
            ctx.strokeStyle = p.color === "azul"
                ? `rgba(${Math.round(150 + 90 * alfa)}, 210, 255, ${alfa})`
                : `rgba(255, ${Math.round(150 + 90 * alfa)}, 60, ${alfa})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - p.vx * 0.02, y - p.vy * 0.02);
            ctx.stroke();
            break;
        }
        case "brasa": {
            const vida = vidaRestante(p);
            const parpadeo = 0.7 + 0.3 * Math.sin(t * 14 + p.fase);
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = `rgba(255, ${Math.round(90 + 110 * vida)}, 40, ${vida * parpadeo * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, ${Math.round(120 + 120 * vida)}, 60, ${vida * parpadeo})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
            break;
        }
        case "incienso": {
            const alfa = 0.13 * Math.sin(Math.PI * vidaRestante(p));
            ctx.fillStyle = `rgba(205, 205, 215, ${alfa})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "polvoPies":
            ctx.fillStyle = `rgba(${p.color}, ${0.35 * vidaRestante(p)})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            break;
        case "destelloAgua": {
            const brillo = Math.sin(Math.PI * vidaRestante(p));
            const l = p.largo * brillo;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * brillo})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x - l, y);
            ctx.lineTo(x + l, y);
            ctx.moveTo(x, y - l);
            ctx.lineTo(x, y + l);
            ctx.stroke();
            break;
        }
        case "mariposa": {
            const vida = vidaRestante(p);
            const alfa = Math.min(1, vida * 4, (1 - vida) * 4);
            const aleteo = Math.abs(Math.sin(t * 14 + p.fase));
            ctx.fillStyle = `rgba(${p.color}, ${alfa})`;
            ctx.beginPath();
            ctx.ellipse(x - 2.5 * aleteo, y, 2.5 * aleteo + 0.5, 2.2, 0, 0, Math.PI * 2);
            ctx.ellipse(x + 2.5 * aleteo, y, 2.5 * aleteo + 0.5, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case "brillo": {
            const vida = vidaRestante(p);
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = `rgba(255, 215, 110, ${vida * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, 245, 210, ${vida})`;
            ctx.beginPath();
            ctx.arc(x, y, p.radio, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
            break;
        }
        case "chispa": {
            const vida = vidaRestante(p);
            ctx.globalCompositeOperation = "lighter";
            ctx.strokeStyle = `rgba(150, 210, 255, ${vida})`;
            ctx.lineWidth = p.radio;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - p.vx * 0.03, y - p.vy * 0.03);
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            break;
        }
    }
}

// =========================================================
// PÁJAROS (bandadas en todo el mapa)
// =========================================================

function bandadasObjetivo() {
    return Math.max(3, Math.min(24, Math.round(pantallasDelMapa() * 2)));
}

function tipoBandadaAlAzar() {
    const opciones = efectosVisuales.activos.filter(efecto => efecto === "pajaros" || efecto === "gaviotas");
    return opciones.length ? elegir(opciones) : null;
}

// enCualquierLugar: al entrar al mapa se reparten por todo el mapa; después nacen en un borde.
function crearBandada(tipo, enCualquierLugar = false) {
    const { ancho, alto } = tamañoMapaPantalla();
    const haciaDerecha = Math.random() < 0.5;
    const cantidad = tipo === "gaviotas" ? Math.round(azar(2, 5)) : Math.round(azar(5, 10));
    // El jugador camina a unos 240 px/s en pantalla: los pájaros tienen que ser más rápidos
    // para no quedar atrás cuando camina en su misma dirección.
    const velocidad = tipo === "gaviotas" ? azar(290, 340) : azar(340, 440);
    const direccion = haciaDerecha ? 1 : -1;

    const pajaros = [];
    for (let i = 0; i < cantidad; i++) {
        // Formación en V suelta.
        const fila = Math.ceil(i / 2);
        const lado = i % 2 === 0 ? 1 : -1;
        pajaros.push({
            dx: -direccion * fila * azar(16, 24),
            dy: lado * fila * azar(8, 14),
            fase: azar(0, Math.PI * 2),
            velAleteo: tipo === "gaviotas" ? azar(4, 6) : azar(9, 13)
        });
    }

    return {
        tipo,
        x: enCualquierLugar ? azar(0, ancho) : haciaDerecha ? -60 : ancho + 60,
        y: azar(0, alto),
        vx: velocidad * direccion,
        vy: azar(-6, 6),
        ondulacion: azar(0, Math.PI * 2),
        tamaño: tipo === "gaviotas" ? 8 : 4.5,
        color: tipo === "gaviotas" ? "rgba(245, 245, 240, 0.9)" : "rgba(30, 30, 35, 0.8)",
        pajaros
    };
}

function dibujarBandada(bandada, t) {
    const baseX = bandada.x - camara.x;
    const baseY = bandada.y - camara.y;

    // Fuera de la vista no se dibuja, pero sigue volando.
    if (baseX < -300 || baseX > canvas.width + 300 || baseY < -150 || baseY > canvas.height + 150) {
        return;
    }

    ctx.strokeStyle = bandada.color;
    ctx.lineWidth = bandada.tipo === "gaviotas" ? 2.2 : 1.6;
    ctx.lineCap = "round";

    bandada.pajaros.forEach(pajaro => {
        const x = baseX + pajaro.dx;
        const y = baseY + pajaro.dy + Math.sin(t * 1.3 + bandada.ondulacion + pajaro.fase) * 3;
        const s = bandada.tamaño;
        const alturaAla = Math.sin(t * pajaro.velAleteo + pajaro.fase) * s * 0.9;

        ctx.beginPath();
        ctx.moveTo(x - s, y - alturaAla);
        ctx.quadraticCurveTo(x - s * 0.4, y - alturaAla * 0.2, x, y);
        ctx.quadraticCurveTo(x + s * 0.4, y - alturaAla * 0.2, x + s, y - alturaAla);
        ctx.stroke();
    });
}

function bandadaFuera(bandada) {
    const { ancho, alto } = tamañoMapaPantalla();
    const margen = 300;
    return bandada.x > ancho + margen || bandada.x < -margen ||
        bandada.y > alto + margen || bandada.y < -margen;
}

// =========================================================
// NUBES, HACES DE LUZ, TELARAÑAS Y LEDS
// =========================================================

function crearNube(x) {
    const { alto } = tamañoMapaPantalla();
    return {
        x,
        y: azar(0, alto),
        rx: azar(180, 320),
        ry: azar(90, 160),
        vx: azar(12, 22),
        alfa: azar(0.07, 0.11),
        partes: Array.from({ length: 3 }, () => ({ dx: azar(-0.6, 0.6), dy: azar(-0.4, 0.4), escala: azar(0.6, 1) }))
    };
}

function dibujarNube(nube) {
    const x = nube.x - camara.x;
    const y = nube.y - camara.y;

    if (x < -nube.rx * 2 || x > canvas.width + nube.rx * 2 || y < -nube.ry * 2 || y > canvas.height + nube.ry * 2) {
        return;
    }

    nube.partes.forEach(parte => {
        const px = x + parte.dx * nube.rx;
        const py = y + parte.dy * nube.ry;
        const r = nube.rx * parte.escala;
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, nube.ry / nube.rx);
        const gradiente = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        gradiente.addColorStop(0, `rgba(10, 15, 25, ${nube.alfa})`);
        gradiente.addColorStop(1, "rgba(10, 15, 25, 0)");
        ctx.fillStyle = gradiente;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function dibujarHaz(haz, t) {
    const x = haz.x - camara.x;
    const y = haz.y - camara.y;
    const inclinacion = haz.largo * 0.45;

    if (x + haz.ancho + inclinacion < -50 || x > canvas.width + 50 || y > canvas.height + 50 || y + haz.largo < -50) {
        return;
    }

    const alfa = haz.alfa * (0.75 + 0.25 * Math.sin(t * 0.4 + haz.fase));
    const gradiente = ctx.createLinearGradient(x, y, x + inclinacion, y + haz.largo);
    gradiente.addColorStop(0, `rgba(255, 228, 170, ${alfa})`);
    gradiente.addColorStop(1, "rgba(255, 228, 170, 0)");

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = gradiente;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + haz.ancho, y);
    ctx.lineTo(x + haz.ancho * 1.6 + inclinacion, y + haz.largo);
    ctx.lineTo(x + inclinacion, y + haz.largo);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
}

function dibujarTelarana(tela, t) {
    const x = tela.x - camara.x;
    const y = tela.y - camara.y;

    if (!estaEnVista(tela.x, tela.y, tela.radio + 20)) {
        return;
    }

    const balanceo = Math.sin(t * 0.9 + tela.fase) * 0.05;
    const hilos = 5;
    const angulos = Array.from({ length: hilos }, (_, i) => tela.desde + (tela.hasta - tela.desde) * i / (hilos - 1) + balanceo);

    ctx.strokeStyle = "rgba(225, 225, 235, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    angulos.forEach(a => {
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * tela.radio, y + Math.sin(a) * tela.radio);
    });

    // Anillos que cuelgan un poco entre hilo e hilo.
    tela.anillos.forEach(factor => {
        const r = tela.radio * factor;
        for (let i = 0; i < hilos - 1; i++) {
            const a1 = angulos[i];
            const a2 = angulos[i + 1];
            const medio = (a1 + a2) / 2;
            ctx.moveTo(x + Math.cos(a1) * r, y + Math.sin(a1) * r);
            ctx.quadraticCurveTo(
                x + Math.cos(medio) * r * 0.85, y + Math.sin(medio) * r * 0.85,
                x + Math.cos(a2) * r, y + Math.sin(a2) * r
            );
        }
    });

    ctx.stroke();
}

function dibujarLed(led, t) {
    if (!estaEnVista(led.x, led.y, 10)) {
        return;
    }

    const ciclo = (t / led.periodo + led.fase) % 1;
    const intensidad = led.respira ? 0.45 + 0.55 * Math.sin(ciclo * Math.PI * 2) ** 2 : ciclo < 0.55 ? 1 : 0.08;
    const x = led.x - camara.x;
    const y = led.y - camara.y;

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(${led.color}, ${intensidad * 0.28})`;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${led.color}, ${intensidad})`;
    ctx.fillRect(x - 1, y - 1, 2, 2);
    ctx.globalCompositeOperation = "source-over";
}

function dibujarVineta() {
    const clave = `${canvas.width}x${canvas.height}`;

    if (efectosVisuales.vinetaTamaño !== clave) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const gradiente = ctx.createRadialGradient(cx, cy, Math.min(cx, cy) * 0.55, cx, cy, Math.hypot(cx, cy));
        gradiente.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradiente.addColorStop(1, "rgba(0, 0, 0, 0.5)");
        efectosVisuales.vineta = gradiente;
        efectosVisuales.vinetaTamaño = clave;
    }

    ctx.fillStyle = efectosVisuales.vineta;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// =========================================================
// EFECTOS GLOBALES: TEMBLOR Y DESTELLO
// =========================================================

// Sacude la cámara. Si ya hay un temblor más fuerte en curso, se respeta ese.
function sacudirCamara(intensidad, segundos) {
    const temblor = efectosVisuales.temblor;
    const ahora = performance.now() / 1000;
    const restante = Math.max(0, temblor.inicio + temblor.duracion - ahora);
    const actual = restante > 0 ? temblor.intensidad * (restante / temblor.duracion) : 0;

    if (intensidad >= actual) {
        temblor.intensidad = intensidad;
        temblor.inicio = ahora;
        temblor.duracion = segundos;
    }
}

// Se llama justo después de actualizarCamara(): desplaza la cámara un poco al azar.
function aplicarTemblorCamara() {
    const temblor = efectosVisuales.temblor;
    const transcurrido = performance.now() / 1000 - temblor.inicio;

    if (transcurrido >= temblor.duracion) {
        return;
    }

    const fuerza = temblor.intensidad * (1 - transcurrido / temblor.duracion);
    camara.x += azar(-1, 1) * fuerza;
    camara.y += azar(-1, 1) * fuerza;
}

function posicionJugadorMapa() {
    return {
        x: jugador.x * escala + jugador.ancho / 2,
        y: jugador.y * escala + jugador.alto / 2
    };
}

// Fogonazo de luz y chispas doradas alrededor del jugador (al obtener un fragmento temporal).
function destelloFragmento() {
    const centro = posicionJugadorMapa();
    efectosVisuales.destello = { inicio: performance.now() / 1000, duracion: 0.9 };

    for (let i = 0; i < 45; i++) {
        efectosVisuales.particulas.push(crearBrillo(centro.x, centro.y));
    }
}

function dibujarDestello(t) {
    const destello = efectosVisuales.destello;
    const progreso = (t - destello.inicio) / destello.duracion;

    if (!destello.duracion || progreso >= 1 || progreso < 0) {
        return;
    }

    const centro = posicionJugadorMapa();
    const x = centro.x - camara.x;
    const y = centro.y - camara.y;
    const alfa = 0.85 * (1 - progreso) ** 2;
    const radio = Math.hypot(canvas.width, canvas.height);
    const gradiente = ctx.createRadialGradient(x, y, 0, x, y, radio);
    gradiente.addColorStop(0, `rgba(255, 250, 225, ${alfa})`);
    gradiente.addColorStop(0.25, `rgba(255, 225, 150, ${alfa * 0.6})`);
    gradiente.addColorStop(1, "rgba(255, 225, 150, 0)");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Descarga eléctrica sobre el jugador: rayos que salen del cuerpo, brillo azul,
// chispas y fogonazos de pantalla. El jugador tiembla mientras dura (ver dibujarJugador).
function iniciarElectrocucion(segundos) {
    efectosVisuales.electrocucion = {
        inicio: performance.now() / 1000,
        duracion: segundos,
        proximaChispa: 0
    };
}

function electrocucionActiva() {
    const e = efectosVisuales.electrocucion;
    const transcurrido = performance.now() / 1000 - e.inicio;
    return e.duracion > 0 && transcurrido >= 0 && transcurrido < e.duracion;
}

function dibujarRayo(x1, y1, x2, y2, desvio, grosor, alfa) {
    const puntos = [[x1, y1]];
    const tramos = 7;

    for (let i = 1; i < tramos; i++) {
        const f = i / tramos;
        puntos.push([
            x1 + (x2 - x1) * f + azar(-desvio, desvio),
            y1 + (y2 - y1) * f + azar(-desvio, desvio)
        ]);
    }

    puntos.push([x2, y2]);

    const trazar = () => {
        ctx.beginPath();
        ctx.moveTo(puntos[0][0], puntos[0][1]);
        puntos.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
        ctx.stroke();
    };

    ctx.strokeStyle = `rgba(90, 170, 255, ${alfa * 0.5})`;
    ctx.lineWidth = grosor * 4;
    trazar();
    ctx.strokeStyle = `rgba(235, 248, 255, ${alfa})`;
    ctx.lineWidth = grosor;
    trazar();
}

function dibujarElectrocucion(t) {
    const e = efectosVisuales.electrocucion;
    const progreso = (t - e.inicio) / e.duracion;

    if (!e.duracion || progreso >= 1 || progreso < 0) {
        return;
    }

    const centro = posicionJugadorMapa();
    const x = centro.x - camara.x;
    const y = centro.y - camara.y;
    const tamaño = Math.max(jugador.ancho, jugador.alto);
    // Fuerte al principio, se va apagando hacia el final.
    const fuerza = 1 - progreso * 0.6;

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Brillo azul que parpadea alrededor del jugador.
    const pulso = fuerza * (0.45 + Math.random() * 0.4);
    const brillo = ctx.createRadialGradient(x, y, 0, x, y, tamaño * 2.2);
    brillo.addColorStop(0, `rgba(170, 215, 255, ${pulso})`);
    brillo.addColorStop(0.4, `rgba(70, 140, 255, ${pulso * 0.5})`);
    brillo.addColorStop(1, "rgba(70, 140, 255, 0)");
    ctx.fillStyle = brillo;
    ctx.fillRect(x - tamaño * 2.2, y - tamaño * 2.2, tamaño * 4.4, tamaño * 4.4);

    // Rayos nuevos cada frame para que chisporroteen.
    const cantidad = 2 + Math.floor(Math.random() * 4 * fuerza);
    for (let i = 0; i < cantidad; i++) {
        const angulo = azar(0, Math.PI * 2);
        const largo = tamaño * azar(0.7, 1.8);
        const origenX = x + azar(-0.25, 0.25) * jugador.ancho;
        const origenY = y + azar(-0.3, 0.3) * jugador.alto;
        dibujarRayo(
            origenX, origenY,
            x + Math.cos(angulo) * largo, y + Math.sin(angulo) * largo,
            tamaño * 0.18, azar(1.2, 2.5), fuerza
        );
    }

    ctx.globalCompositeOperation = "source-over";

    // Chispas que saltan del cuerpo.
    if (t >= e.proximaChispa) {
        e.proximaChispa = t + azar(0.04, 0.12);
        const cantidadChispas = 3 + Math.floor(Math.random() * 5);
        for (let i = 0; i < cantidadChispas; i++) {
            efectosVisuales.particulas.push(crearChispa(centro.x, centro.y));
        }
    }

    // Fogonazos de pantalla blanco azulado, más seguidos al principio.
    if (Math.random() < 0.18 * fuerza) {
        ctx.fillStyle = `rgba(200, 225, 255, ${azar(0.15, 0.4) * fuerza})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// =========================================================
// GENERAR PARTÍCULAS SEGÚN EL MAPA
// =========================================================

function generarEfectos(t) {
    const e = efectosVisuales;
    const prox = e.proximo;
    const { ancho } = tamañoMapaPantalla();

    if (tipoBandadaAlAzar() && e.bandadas.length < bandadasObjetivo() && t > prox.bandada) {
        e.bandadas.push(crearBandada(tipoBandadaAlAzar()));
        prox.bandada = t + azar(0.3, 1);
    }

    if (tieneEfecto("vapor") && t > prox.vapor) {
        e.particulas.push(crearNubeVapor());
        prox.vapor = t + azar(0.8, 2);
    }

    if (tieneEfecto("chispas") && t > prox.chispa) {
        crearChispas("naranja");
        prox.chispa = t + azar(3, 8);
    }

    if (tieneEfecto("chispasAzules") && t > prox.chispaAzul) {
        crearChispas("azul");
        prox.chispaAzul = t + azar(4, 10);
    }

    if (tieneEfecto("brasas") && t > prox.brasa) {
        e.particulas.push(crearBrasa());
        prox.brasa = t + azar(0.1, 0.3);
    }

    if (tieneEfecto("incienso") && t > prox.incienso) {
        e.emisoresIncienso.forEach(emisor => {
            if (estaEnVista(emisor.x, emisor.y, 200)) {
                e.particulas.push(crearHumoIncienso(emisor));
            }
        });
        prox.incienso = t + azar(0.25, 0.45);
    }

    // Polvo en los pies: solo si el jugador se movió desde el último frame.
    if (tieneEfecto("polvoPies")) {
        const pos = { x: jugador.x, y: jugador.y };
        const antes = e.ultimaPosJugador;
        e.ultimaPosJugador = pos;

        if (antes && (antes.x !== pos.x || antes.y !== pos.y) && t > prox.pies) {
            const color = COLOR_POLVO_PIES[e.mapa] || "180, 160, 130";
            const pieX = jugador.x * escala + jugador.ancho / 2;
            const pieY = jugador.y * escala + jugador.alto - 6;
            for (let i = 0; i < 2; i++) {
                e.particulas.push(crearPolvoPies(pieX + azar(-10, 10), pieY + azar(-3, 3), color));
            }
            prox.pies = t + 0.09;
        }
    }

    // Destellos sobre el agua: se busca un píxel azulado al azar en la pantalla.
    if (tieneEfecto("destellosAgua") && t > prox.agua) {
        for (let i = 0; i < 3; i++) {
            const sx = azar(0, canvas.width);
            const sy = azar(0, canvas.height);
            const c = colorEnPantalla(sx, sy);
            if (c && c.b > 90 && c.b > c.r + 25 && c.b >= c.g - 5) {
                e.particulas.push(crearDestelloAgua(sx + camara.x, sy + camara.y));
            }
        }
        prox.agua = t + 0.08;
    }

    // Mariposas sobre el pasto: pocas a la vez, cerca de un píxel verde.
    if (tieneEfecto("mariposas") && t > prox.mariposa) {
        const vivas = e.particulas.filter(p => p.tipo === "mariposa").length;
        if (vivas < 8) {
            const sx = azar(0, canvas.width);
            const sy = azar(0, canvas.height);
            const c = colorEnPantalla(sx, sy);
            if (c && c.g > c.r + 12 && c.g > c.b + 12) {
                e.particulas.push(crearMariposa(sx + camara.x, sy + camara.y));
            }
        }
        prox.mariposa = t + 0.4;
    }

    // Las nubes cruzan el mapa y vuelven a entrar por el borde opuesto.
    e.nubes.forEach(nube => {
        if (nube.x - nube.rx * 2 > ancho) {
            Object.assign(nube, crearNube(-nube.rx * 2));
        }
    });
}

// =========================================================
// ACTUALIZAR Y DIBUJAR (se llama una vez por frame desde juego.js)
// =========================================================

function actualizarYDibujarEfectosVisuales() {
    // Mientras el mapa nuevo se está cargando no hay nada que mostrar.
    if (!mapa) {
        return;
    }

    const nombreMapa = typeof obtenerNombreMapa === "function" ? obtenerNombreMapa(rutaMapa) : null;

    if (nombreMapa !== efectosVisuales.mapa) {
        prepararEfectosVisuales(nombreMapa);
    }

    const ahoraMs = performance.now();
    const t = ahoraMs / 1000;
    const dt = Math.min(0.05, efectosVisuales.ultimoTiempo ? (ahoraMs - efectosVisuales.ultimoTiempo) / 1000 : 0);
    efectosVisuales.ultimoTiempo = ahoraMs;

    // Primero se generan (algunos leen los colores del mapa ya dibujado) y después se dibujan encima.
    generarEfectos(t);

    ctx.save();

    efectosVisuales.nubes.forEach(nube => {
        nube.x += nube.vx * dt;
        dibujarNube(nube);
    });

    efectosVisuales.haces.forEach(haz => dibujarHaz(haz, t));
    efectosVisuales.telaranas.forEach(tela => dibujarTelarana(tela, t));
    efectosVisuales.leds.forEach(led => dibujarLed(led, t));

    efectosVisuales.particulas.forEach(p => actualizarParticula(p, dt, t));
    efectosVisuales.particulas = efectosVisuales.particulas.filter(p => p.infinita || p.vida > 0);
    efectosVisuales.particulas.forEach(p => dibujarParticula(p, t));

    efectosVisuales.bandadas.forEach(bandada => {
        bandada.x += bandada.vx * dt;
        bandada.y += bandada.vy * dt;
        dibujarBandada(bandada, t);
    });
    efectosVisuales.bandadas = efectosVisuales.bandadas.filter(bandada => !bandadaFuera(bandada));

    if (tieneEfecto("vineta")) {
        dibujarVineta();
    }

    dibujarDestello(t);
    dibujarElectrocucion(t);

    ctx.restore();
}
