"use strict";

// El estado guarda la información que comparten los componentes del dashboard.
const estado = {
    metadata: null,
    registros: [],
    registrosBase: [],
    registrosFiltrados: [],
    registrosClasificados: [],
    registrosAntesExclusion: [],
    idsExcluidos: new Set(),
    idsExclusionPendientes: new Set(),
    busquedaExclusion: "",
    registrosConCuadrante: [],
    registrosAntesHistograma: [],
    intervalosHistograma: [],
    indicesIntervalosSeleccionados: new Set(),
    registrosCuadrante: [],
    categoria: "",
    subcategoria: "Consolidado",
    cuadrante: "Todos",
    outputUmbral: null,
    fwciUmbral: 1,
    fwciMaximo: null,
    outputMaximo: null,
    busqueda: "",
    ordenColumna: "FWCI",
    ordenDireccion: "desc",
    pagina: 1,
    filasPorPagina: 15,
};

// Guardamos referencias a elementos HTML para reutilizarlos sin buscarlos otra vez.
const elementos = {
    estadoCarga: document.querySelector("#estado-carga"),
    categoria: document.querySelector("#filtro-categoria"),
    subcategoria: document.querySelector("#filtro-subcategoria"),
    cuadrante: document.querySelector("#filtro-cuadrante"),
    botonRestablecer: document.querySelector("#boton-restablecer"),
    panelCoberturaTop500: document.querySelector("#panel-cobertura-top-500"),
    contextoTop500: document.querySelector("#contexto-top-500"),
    top500TotalOficiales: document.querySelector("#top-500-total-oficiales"),
    top500Presentes: document.querySelector("#top-500-presentes"),
    top500PresentesPorcentaje: document.querySelector("#top-500-presentes-porcentaje"),
    top500Ausentes: document.querySelector("#top-500-ausentes"),
    botonAusentesTop500: document.querySelector("#boton-ausentes-top-500"),
    contenidoAusentesTop500: document.querySelector("#contenido-ausentes-top-500"),
    tablaAusentesTop500: document.querySelector("#tabla-ausentes-top-500"),
    panelPanoramaIndividual: document.querySelector("#panel-panorama-individual"),
    botonExclusiones: document.querySelector("#boton-exclusiones"),
    contenidoExclusiones: document.querySelector("#contenido-exclusiones"),
    resumenExclusiones: document.querySelector("#resumen-exclusiones"),
    buscadorExclusion: document.querySelector("#buscar-exclusion"),
    listaExclusiones: document.querySelector("#lista-exclusiones"),
    resumenSeleccionExclusiones: document.querySelector("#resumen-seleccion-exclusiones"),
    botonSeleccionarExclusiones: document.querySelector("#seleccionar-exclusiones-visibles"),
    botonLimpiarExclusiones: document.querySelector("#limpiar-exclusiones"),
    botonAplicarExclusiones: document.querySelector("#aplicar-exclusiones"),
    etiquetasExclusiones: document.querySelector("#etiquetas-exclusiones"),
    buscador: document.querySelector("#buscar-investigador"),
    filtroFwciMaximo: document.querySelector("#filtro-fwci-maximo"),
    filtroOutputMaximo: document.querySelector("#filtro-output-maximo"),
    botonAplicarLimites: document.querySelector("#aplicar-filtros-numericos"),
    botonLimpiarLimites: document.querySelector("#limpiar-filtros-numericos"),
    errorFiltrosNumericos: document.querySelector("#error-filtros-numericos"),
    fechaDatos: document.querySelector("#fecha-datos"),
    resumenSeleccion: document.querySelector("#resumen-seleccion"),
    kpiInvestigadores: document.querySelector("#kpi-investigadores"),
    kpiOutput: document.querySelector("#kpi-output"),
    kpiCitas: document.querySelector("#kpi-citas"),
    kpiFwci: document.querySelector("#kpi-fwci"),
    textoUmbrales: document.querySelector("#texto-umbrales"),
    conteoC1: document.querySelector("#conteo-c1"),
    conteoC2: document.querySelector("#conteo-c2"),
    conteoC4: document.querySelector("#conteo-c4"),
    conteoC3: document.querySelector("#conteo-c3"),
    graficoScatter: document.querySelector("#grafico-scatter"),
    tablaInvestigadores: document.querySelector("#tabla-investigadores"),
    tablaResumen: document.querySelector("#tabla-resumen"),
    paginaAnterior: document.querySelector("#pagina-anterior"),
    paginaSiguiente: document.querySelector("#pagina-siguiente"),
    paginaActual: document.querySelector("#pagina-actual"),
    botonesOrden: document.querySelectorAll(".orden-tabla"),
    tituloAnalisisCuadrante: document.querySelector("#titulo-analisis-cuadrante"),
    detalleAnalisisCuadrante: document.querySelector("#detalle-analisis-cuadrante"),
    cuadranteInvestigadores: document.querySelector("#cuadrante-investigadores"),
    cuadranteOutput: document.querySelector("#cuadrante-output"),
    cuadranteFwciPromedio: document.querySelector("#cuadrante-fwci-promedio"),
    cuadranteFwciMediana: document.querySelector("#cuadrante-fwci-mediana"),
    cuadranteFwciRango: document.querySelector("#cuadrante-fwci-rango"),
    cuadranteMejorFwci: document.querySelector("#cuadrante-mejor-fwci"),
    cuadranteMejorFwciValor: document.querySelector("#cuadrante-mejor-fwci-valor"),
    cuadranteMenorFwci: document.querySelector("#cuadrante-menor-fwci"),
    cuadranteMenorFwciValor: document.querySelector("#cuadrante-menor-fwci-valor"),
    cuadranteMayorOutput: document.querySelector("#cuadrante-mayor-output"),
    cuadranteMayorOutputValor: document.querySelector("#cuadrante-mayor-output-valor"),
    panoramaGlobal: document.querySelector("#panorama-global"),
    botonPanoramaGlobal: document.querySelector("#boton-panorama-global"),
    contenidoPanoramaGlobal: document.querySelector("#contenido-panorama-global"),
    botonHistograma: document.querySelector("#boton-histograma"),
    contenidoHistograma: document.querySelector("#contenido-histograma"),
    graficoHistograma: document.querySelector("#grafico-histograma-fwci"),
    resumenHistograma: document.querySelector("#resumen-histograma"),
    botonVerInvestigadoresHistograma: document.querySelector("#ver-investigadores-histograma"),
    botonLimpiarHistograma: document.querySelector("#limpiar-histograma"),
    panelInvestigadores: document.querySelector("#panel-investigadores"),
    botonPanoramaIndividual: document.querySelector("#boton-panorama-individual"),
    contenidoPanoramaIndividual: document.querySelector("#contenido-panorama-individual"),
    buscadorGlobal: document.querySelector("#buscar-investigador-global"),
    resumenPanoramaIndividual: document.querySelector("#resumen-panorama-individual"),
    resultadosPanoramaIndividual: document.querySelector("#resultados-panorama-individual"),
    globalInvestigadores: document.querySelector("#global-investigadores"),
    globalOutput: document.querySelector("#global-output"),
    globalCitas: document.querySelector("#global-citas"),
    globalFwci: document.querySelector("#global-fwci"),
    globalFwciMediana: document.querySelector("#global-fwci-mediana"),
    globalActivos: document.querySelector("#global-activos"),
    globalPeriodoActivos: document.querySelector("#global-periodo-activos"),
    globalFwciReferencia: document.querySelector("#global-fwci-referencia"),
    globalMultidisciplinarios: document.querySelector("#global-multidisciplinarios"),
    globalHIndex: document.querySelector("#global-h-index"),
    globalHIndexDestacado: document.querySelector("#global-h-index-destacado"),
    globalNotaMetodologica: document.querySelector("#global-nota-metodologica"),
    globalUnidadAnalisis: document.querySelector("#global-unidad-analisis"),
    globalMetodoOutput: document.querySelector("#global-metodo-output"),
    globalMetodoCitas: document.querySelector("#global-metodo-citas"),
    globalMetodoFwci: document.querySelector("#global-metodo-fwci"),
};


async function cargarDatos() {
    // fetch solicita el archivo; await espera la respuesta sin bloquear la página.
    const respuesta = await fetch("./data_dashboard.json");

    if (!respuesta.ok) {
        throw new Error(
            `No se pudo cargar data_dashboard.json (${respuesta.status}).`
        );
    }

    // json() transforma el texto JSON en objetos y listas de JavaScript.
    return respuesta.json();
}


function llenarCategorias(categorias) {
    elementos.categoria.innerHTML = "";

    for (const item of categorias) {
        const opcion = document.createElement("option");
        opcion.value = item.categoria;
        opcion.textContent = item.categoria;
        elementos.categoria.append(opcion);
    }

    elementos.categoria.disabled = false;
}


function actualizarSubcategorias() {
    const informacionCategoria = estado.metadata.categorias.find(
        (item) => item.categoria === estado.categoria
    );

    elementos.subcategoria.innerHTML = "";

    if (informacionCategoria?.tiene_consolidado) {
        const consolidado = document.createElement("option");
        consolidado.value = "Consolidado";
        consolidado.textContent = "Todas (consolidado)";
        elementos.subcategoria.append(consolidado);
    }

    for (const nombre of informacionCategoria?.subcategorias ?? []) {
        const opcion = document.createElement("option");
        opcion.value = nombre;
        opcion.textContent = nombre;
        elementos.subcategoria.append(opcion);
    }

    estado.subcategoria = elementos.subcategoria.value;
    elementos.subcategoria.disabled = false;
}


function actualizarPanoramaGlobal() {
    // Esta funcion lee solamente metadata; no usa los registros filtrados.
    const panorama = estado.metadata.panorama_global;

    if (!panorama) {
        elementos.panoramaGlobal.hidden = true;
        return;
    }

    const indicadores = panorama.indicadores;
    const metodologia = panorama.metodologia;
    const periodo = panorama.periodo_actividad;
    const formatoEntero = (valor) => valor.toLocaleString("es-EC");
    const cantidadPorcentaje = (cantidad, porcentaje) =>
        `${formatoEntero(cantidad)} · ${porcentaje.toLocaleString("es-EC")}%`;

    elementos.globalInvestigadores.textContent =
        formatoEntero(indicadores.investigadores_unicos);
    elementos.globalOutput.textContent = formatoEntero(indicadores.output_estimado);
    elementos.globalCitas.textContent = formatoEntero(indicadores.citas_estimadas);
    elementos.globalFwci.textContent = indicadores.fwci_promedio.toLocaleString("es-EC");
    elementos.globalFwciMediana.textContent =
        `Mediana: ${indicadores.fwci_mediana.toLocaleString("es-EC")}`;
    elementos.globalActivos.textContent = cantidadPorcentaje(
        indicadores.investigadores_activos,
        indicadores.investigadores_activos_porcentaje
    );
    elementos.globalPeriodoActivos.textContent =
        `Publicación reciente: ${periodo.desde}–${periodo.hasta}`;
    elementos.globalFwciReferencia.textContent = cantidadPorcentaje(
        indicadores.fwci_sobre_referencia,
        indicadores.fwci_sobre_referencia_porcentaje
    );
    elementos.globalMultidisciplinarios.textContent = cantidadPorcentaje(
        indicadores.investigadores_multidisciplinarios,
        indicadores.investigadores_multidisciplinarios_porcentaje
    );
    elementos.globalHIndex.textContent =
        `Mediana ${indicadores.h_index_mediana.toLocaleString("es-EC")}`;
    elementos.globalHIndexDestacado.textContent =
        `Máximo: ${indicadores.h_index_maximo} · ${indicadores.investigador_h_index_maximo}`;

    elementos.globalNotaMetodologica.textContent = metodologia.nota;
    elementos.globalUnidadAnalisis.textContent = metodologia.unidad_analisis;
    elementos.globalMetodoOutput.textContent = metodologia.output;
    elementos.globalMetodoCitas.textContent = metodologia.citas;
    elementos.globalMetodoFwci.textContent = metodologia.fwci;
}


function alternarPanoramaGlobal() {
    const estaVisible = !elementos.contenidoPanoramaGlobal.hidden;

    // hidden oculta visualmente el contenido y aria-expanded informa su estado.
    elementos.contenidoPanoramaGlobal.hidden = estaVisible;
    elementos.botonPanoramaGlobal.setAttribute(
        "aria-expanded",
        String(!estaVisible)
    );
    elementos.botonPanoramaGlobal.textContent = estaVisible
        ? "Mostrar panorama"
        : "Ocultar panorama";
}


function alternarAusentesTop500() {
    const estaVisible = !elementos.contenidoAusentesTop500.hidden;
    elementos.contenidoAusentesTop500.hidden = estaVisible;
    elementos.botonAusentesTop500.setAttribute(
        "aria-expanded",
        String(!estaVisible)
    );
    elementos.botonAusentesTop500.textContent = estaVisible
        ? "Mostrar investigadores ausentes"
        : "Ocultar investigadores ausentes";
}


function abrirPanoramaIndividual(scopusId) {
    elementos.contenidoPanoramaIndividual.hidden = false;
    elementos.botonPanoramaIndividual.setAttribute("aria-expanded", "true");
    elementos.botonPanoramaIndividual.textContent = "Ocultar búsqueda";
    elementos.buscadorGlobal.value = scopusId;
    actualizarPanoramaIndividual();
    elementos.panelPanoramaIndividual.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}


function actualizarCoberturaTop500() {
    const cobertura = estado.metadata?.cobertura_top_500;
    const esVistaTop500 = cobertura
        && estado.categoria === cobertura.categoria;

    elementos.panelCoberturaTop500.hidden = !esVistaTop500;
    if (!esVistaTop500) {
        elementos.contenidoAusentesTop500.hidden = true;
        elementos.botonAusentesTop500.setAttribute("aria-expanded", "false");
        elementos.botonAusentesTop500.textContent =
            "Mostrar investigadores ausentes";
        return;
    }

    const contexto = cobertura.contexto_fuente;
    elementos.contextoTop500.textContent =
        `Periodo: ${contexto.periodo} · Datos actualizados: `
        + `${contexto.fecha_actualizacion} · Exportado: ${contexto.fecha_exportacion}.`;
    elementos.top500TotalOficiales.textContent =
        cobertura.total_oficiales.toLocaleString("es-EC");
    elementos.top500Presentes.textContent =
        cobertura.presentes.toLocaleString("es-EC");
    elementos.top500PresentesPorcentaje.textContent =
        `${formatearDecimal(cobertura.presentes_porcentaje)}% de la lista oficial`;
    elementos.top500Ausentes.textContent =
        cobertura.ausentes.toLocaleString("es-EC");

    elementos.tablaAusentesTop500.replaceChildren();
    for (const investigador of cobertura.investigadores_ausentes) {
        const fila = document.createElement("tr");
        fila.append(
            crearCelda(investigador.nombre),
            crearCelda(investigador.scopus_id),
            crearCelda(investigador.actividad || "—")
        );

        const celdaAccion = document.createElement("td");
        const boton = document.createElement("button");
        boton.className = "boton boton--tabla";
        boton.type = "button";
        boton.textContent = "Ver panorama";
        boton.addEventListener("click", () => {
            abrirPanoramaIndividual(investigador.scopus_id);
        });
        celdaAccion.append(boton);
        fila.append(celdaAccion);
        elementos.tablaAusentesTop500.append(fila);
    }
}


function formatearLimite(valor) {
    return valor.toLocaleString("es-EC", {maximumFractionDigits: 4});
}


function describirFiltrosNumericos() {
    const partes = [];

    if (estado.fwciMaximo !== null) {
        partes.push(`FWCI ≤ ${formatearLimite(estado.fwciMaximo)}`);
    }
    if (estado.outputMaximo !== null) {
        partes.push(`Output ≤ ${formatearLimite(estado.outputMaximo)}`);
    }

    return partes.length > 0 ? ` · ${partes.join(" · ")}` : "";
}


function convertirLimite(texto, nombre) {
    const textoLimpio = texto.trim().replace(",", ".");

    // Un campo vacío significa que no se aplicará ese límite.
    if (textoLimpio === "") {
        return null;
    }

    const valor = Number(textoLimpio);
    if (!Number.isFinite(valor)) {
        throw new Error(`Ingrese un número válido para ${nombre}.`);
    }
    if (valor < 0) {
        throw new Error(`${nombre} no puede ser negativo.`);
    }

    return valor;
}


function leerFiltrosNumericos() {
    elementos.errorFiltrosNumericos.hidden = true;
    elementos.filtroFwciMaximo.removeAttribute("aria-invalid");
    elementos.filtroOutputMaximo.removeAttribute("aria-invalid");

    try {
        const fwciMaximo = convertirLimite(
            elementos.filtroFwciMaximo.value,
            "FWCI"
        );
        const outputMaximo = convertirLimite(
            elementos.filtroOutputMaximo.value,
            "Output"
        );

        estado.fwciMaximo = fwciMaximo;
        estado.outputMaximo = outputMaximo;
        return true;
    } catch (error) {
        elementos.errorFiltrosNumericos.textContent = error.message;
        elementos.errorFiltrosNumericos.hidden = false;
        return false;
    }
}


function aplicarFiltrosNumericos() {
    estado.registrosAntesExclusion = estado.registrosClasificados.filter(
        (registro) => {
            const cumpleFwci = estado.fwciMaximo === null
                || Number(registro.FWCI) <= estado.fwciMaximo;
            const cumpleOutput = estado.outputMaximo === null
                || Number(registro.Output) <= estado.outputMaximo;

            return cumpleFwci && cumpleOutput;
        }
    );


}


function alternarExclusiones() {
    const estaVisible = !elementos.contenidoExclusiones.hidden;
    elementos.contenidoExclusiones.hidden = estaVisible;
    elementos.botonExclusiones.setAttribute("aria-expanded", String(!estaVisible));
    elementos.botonExclusiones.textContent = estaVisible
        ? "Mostrar exclusiones"
        : "Ocultar exclusiones";

    if (!estaVisible) {
        actualizarListaExclusiones();
        elementos.buscadorExclusion.focus();
    }
}


function obtenerInvestigadoresParaExcluir(aplicarBusqueda = true) {
    const consulta = aplicarBusqueda
        ? normalizarTexto(estado.busquedaExclusion)
        : "";
    const investigadores = new Map();

    for (const registro of estado.registrosBase) {
        const id = String(registro["Scopus author ID"] ?? "").trim();
        if (id && !investigadores.has(id)) {
            investigadores.set(id, {id, nombre: registro.Name});
        }
    }

    return Array.from(investigadores.values())
        .filter((investigador) =>
            !consulta
            || normalizarTexto(investigador.nombre).includes(consulta)
            || investigador.id.includes(consulta)
        )
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}


function conjuntosIguales(conjuntoA, conjuntoB) {
    return conjuntoA.size === conjuntoB.size
        && Array.from(conjuntoA).every((valor) => conjuntoB.has(valor));
}


function actualizarControlesExclusiones(investigadoresVisibles = null) {
    const visibles = investigadoresVisibles ?? obtenerInvestigadoresParaExcluir();
    const cantidad = estado.idsExclusionPendientes.size;
    elementos.resumenSeleccionExclusiones.textContent =
        `${cantidad.toLocaleString("es-EC")} seleccionado(s) para excluir.`;
    elementos.botonAplicarExclusiones.disabled = conjuntosIguales(
        estado.idsExclusionPendientes,
        estado.idsExcluidos
    );
    elementos.botonLimpiarExclusiones.disabled =
        estado.idsExclusionPendientes.size === 0 && estado.idsExcluidos.size === 0;
    elementos.botonSeleccionarExclusiones.disabled = visibles.length === 0;

    const todosVisiblesSeleccionados = visibles.length > 0
        && visibles.every((investigador) =>
            estado.idsExclusionPendientes.has(investigador.id)
        );
    elementos.botonSeleccionarExclusiones.textContent = todosVisiblesSeleccionados
        ? "Quitar selección visible"
        : "Seleccionar visibles";
}


function actualizarListaExclusiones() {
    const investigadores = obtenerInvestigadoresParaExcluir();
    elementos.listaExclusiones.replaceChildren();

    if (investigadores.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "tabla-vacia";
        mensaje.textContent = "No hay investigadores para esta búsqueda.";
        elementos.listaExclusiones.append(mensaje);
        actualizarControlesExclusiones(investigadores);
        return;
    }

    for (const investigador of investigadores) {
        const etiqueta = document.createElement("label");
        etiqueta.className = "exclusion-opcion";
        const casilla = document.createElement("input");
        casilla.type = "checkbox";
        casilla.value = investigador.id;
        casilla.checked = estado.idsExclusionPendientes.has(investigador.id);
        casilla.addEventListener("change", () => {
            if (casilla.checked) {
                estado.idsExclusionPendientes.add(investigador.id);
            } else {
                estado.idsExclusionPendientes.delete(investigador.id);
            }
            actualizarControlesExclusiones(investigadores);
        });

        const texto = document.createElement("span");
        texto.className = "exclusion-opcion__texto";
        const nombre = document.createElement("strong");
        nombre.textContent = investigador.nombre;
        const id = document.createElement("small");
        id.textContent = `Scopus ID: ${investigador.id}`;
        texto.append(nombre, id);
        etiqueta.append(casilla, texto);
        elementos.listaExclusiones.append(etiqueta);
    }

    actualizarControlesExclusiones(investigadores);
}


function actualizarEtiquetasExclusiones() {
    elementos.etiquetasExclusiones.replaceChildren();
    const investigadores = obtenerInvestigadoresParaExcluir(false).filter(
        (investigador) => estado.idsExcluidos.has(investigador.id)
    );
    elementos.etiquetasExclusiones.hidden = investigadores.length === 0;

    for (const investigador of investigadores) {
        const etiqueta = document.createElement("span");
        etiqueta.className = "exclusiones__etiqueta";
        const texto = document.createElement("span");
        texto.textContent = investigador.nombre;
        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.setAttribute("aria-label", `Reincorporar a ${investigador.nombre}`);
        quitar.textContent = "×";
        quitar.addEventListener("click", () => {
            estado.idsExcluidos.delete(investigador.id);
            estado.idsExclusionPendientes.delete(investigador.id);
            aplicarFiltros();
        });
        etiqueta.append(texto, quitar);
        elementos.etiquetasExclusiones.append(etiqueta);
    }
}


function actualizarPanelExclusiones() {
    const cantidad = estado.idsExcluidos.size;
    elementos.resumenExclusiones.textContent = cantidad === 0
        ? "Ningún investigador excluido."
        : `${cantidad.toLocaleString("es-EC")} investigador(es) excluido(s) del análisis.`;
    actualizarListaExclusiones();
    actualizarEtiquetasExclusiones();
}


function aplicarExclusiones() {
    estado.registrosConCuadrante = estado.registrosAntesExclusion.filter(
        (registro) => !estado.idsExcluidos.has(
            String(registro["Scopus author ID"] ?? "").trim()
        )
    );
    estado.registrosFiltrados = estado.registrosConCuadrante;
}


function limpiarExclusiones(aplicar = true) {
    estado.idsExcluidos.clear();
    estado.idsExclusionPendientes.clear();
    estado.busquedaExclusion = "";
    elementos.buscadorExclusion.value = "";

    if (aplicar) {
        estado.pagina = 1;
        aplicarFiltros();
    }
}

function limpiarFiltrosNumericos(aplicar = true) {
    estado.fwciMaximo = null;
    estado.outputMaximo = null;
    elementos.filtroFwciMaximo.value = "";
    elementos.filtroOutputMaximo.value = "";
    elementos.errorFiltrosNumericos.hidden = true;

    if (aplicar) {
        estado.pagina = 1;
        aplicarFiltros();
    }
}

function actualizarResumenSeleccion() {
    const descripcionSubcategoria =
        estado.subcategoria === "Consolidado"
            ? "Vista consolidada"
            : estado.subcategoria;

    const detalleExclusiones = estado.idsExcluidos.size === 0
        ? ""
        : ` · ${estado.idsExcluidos.size.toLocaleString("es-EC")} excluido(s)`;

    const detalleCuadrante = estado.cuadrante === "Todos"
        ? ""
        : ` · ${estado.cuadrante}: `
            + `${estado.registrosCuadrante.length.toLocaleString("es-EC")} visibles`;

    elementos.resumenSeleccion.textContent =
        `${estado.categoria} · ${descripcionSubcategoria} · `
        + `${estado.registrosFiltrados.length.toLocaleString("es-EC")} registros`
        + describirFiltrosNumericos()
        + detalleExclusiones
        + detalleCuadrante;
}


function filtrarDatos() {
    // Cuando se elige Consolidado usamos el archivo general de la categoría.
    const esConsolidado = estado.subcategoria === "Consolidado";

    return estado.registros.filter((registro) => {
        const perteneceCategoria =
            registro.categoria === estado.categoria;

        if (esConsolidado) {
            return (
                perteneceCategoria
                && registro.nivel === "Categoria"
                && registro.subcategoria === "Consolidado"
            );
        }

        // Si se eligió una subcategoría, no mezclamos sus registros
        // con los del archivo consolidado de la categoría.
        return (
            perteneceCategoria
            && registro.nivel === "Subcategoria"
            && registro.subcategoria === estado.subcategoria
        );
    });
}


function aplicarFiltros() {
    estado.registrosBase = filtrarDatos();
    actualizarCoberturaTop500();
    prepararCuadrantes();
    aplicarFiltrosNumericos();
    aplicarExclusiones();
    actualizarPanelExclusiones();
    actualizarResumenCuadrantes();
    aplicarFiltroCuadrante();
    reconstruirHistograma();
    actualizarResumenSeleccion();
    actualizarKPIs();
    actualizarScatter();
    actualizarAnalisisCuadrante();
    actualizarTabla();

}


const COLORES_CUADRANTES = {
    C1: "#1f7a4d",
    C2: "#2563eb",
    C3: "#64748b",
    C4: "#dc4c3f",
};

const NOMBRES_CUADRANTES = {
    C1: "C1 · Destacados",
    C2: "C2 · Alto impacto",
    C3: "C3 · Alta producción",
    C4: "C4 · Bajo desempeño",
};


function numeroDeterminista(texto) {
    // Genera siempre la misma variación para el mismo Scopus author ID.
    let hash = 0;

    for (const caracter of String(texto)) {
        hash = ((hash << 5) - hash + caracter.charCodeAt(0)) | 0;
    }

    return Math.abs(hash % 10000) / 10000;
}


function mantenerDentroDelCuadrante(
    valor,
    umbral,
    correspondeZonaAlta,
    separacion
) {
    if (correspondeZonaAlta) {
        return Math.max(valor, umbral + separacion);
    }

    return Math.min(valor, umbral - separacion);
}


function crearCoordenadasVisuales(registros) {
    const frecuencias = new Map();

    for (const registro of registros) {
        const clave = `${registro.Output}|${registro.FWCI}`;
        frecuencias.set(clave, (frecuencias.get(clave) ?? 0) + 1);
    }

    return registros.map((registro) => {
        const outputReal = Number(registro.Output);
        const fwciReal = Number(registro.FWCI);
        const clave = `${registro.Output}|${registro.FWCI}`;

        if (frecuencias.get(clave) === 1) {
            return {
                ...registro,
                OutputVisual: outputReal,
                FwciVisual: fwciReal,
            };
        }

        const id = registro["Scopus author ID"];
        const variacionX = (numeroDeterminista(`${id}-x`) - 0.5) * 0.24;
        const variacionY = (numeroDeterminista(`${id}-y`) - 0.5) * 0.05;

        const zonaOutputAlta = ["C1", "C3"].includes(registro.Cuadrante);
        const zonaFwciAlta = ["C1", "C2"].includes(registro.Cuadrante);

        const outputVisual = mantenerDentroDelCuadrante(
            outputReal + variacionX,
            estado.outputUmbral,
            zonaOutputAlta,
            0.01
        );

        const fwciVisual = mantenerDentroDelCuadrante(
            fwciReal + variacionY,
            estado.fwciUmbral,
            zonaFwciAlta,
            0.005
        );

        return {
            ...registro,
            OutputVisual: Math.max(0, outputVisual),
            FwciVisual: Math.max(0, fwciVisual),
        };
    });
}


function crearFondosCuadrantes(xFinal, yFinal) {
    const zonas = [
        ["C2", 0, estado.outputUmbral, estado.fwciUmbral, yFinal],
        ["C1", estado.outputUmbral, xFinal, estado.fwciUmbral, yFinal],
        ["C4", 0, estado.outputUmbral, 0, estado.fwciUmbral],
        ["C3", estado.outputUmbral, xFinal, 0, estado.fwciUmbral],
    ];

    return zonas.map(([cuadrante, x0, x1, y0, y1]) => ({
        type: "rect",
        xref: "x",
        yref: "y",
        x0,
        x1,
        y0,
        y1,
        fillcolor: COLORES_CUADRANTES[cuadrante],
        opacity: 0.055,
        line: {width: 0},
        layer: "below",
    }));
}


function crearTrazasScatter() {
    const datosVisuales = crearCoordenadasVisuales(
        estado.registrosCuadrante
    );

    return ["C1", "C2", "C3", "C4"].flatMap((cuadrante) => {
        const registros = datosVisuales.filter(
            (registro) => registro.Cuadrante === cuadrante
        );

        if (registros.length === 0) {
            return [];
        }

        return [{
            type: "scattergl",
            mode: "markers",
            name: `${NOMBRES_CUADRANTES[cuadrante]} (${registros.length})`,
            // Las coordenadas visuales separan coincidencias sin cambiar
            // el cuadrante. El hover conserva Output y FWCI reales.
            x: registros.map((registro) => registro.OutputVisual),
            y: registros.map((registro) => registro.FwciVisual),
            text: registros.map((registro) => registro.Name),
            customdata: registros.map((registro) => [
                registro.Output,
                registro.FWCI,
                registro.Citations,
                registro["h-index"],
                registro.Cuadrante,
                registro["Scopus author ID"],
            ]),
            marker: {
                size: 7,
                color: COLORES_CUADRANTES[cuadrante],
                opacity: 0.52,
                line: {width: 0.4, color: "white"},
            },
            hovertemplate:
                "<b>%{text}</b><br>"
                + "Output: %{customdata[0]:.0f}<br>"
                + "FWCI: %{customdata[1]:.2f}<br>"
                + "Citas: %{customdata[2]:.0f}<br>"
                + "h-index: %{customdata[3]:.0f}<br>"
                + "Cuadrante: %{customdata[4]}<br>"
                + "Scopus ID: %{customdata[5]}"
                + "<extra></extra>",
        }];
    });
}


async function actualizarScatter() {
    if (typeof Plotly === "undefined") {
        throw new Error("Plotly no está disponible para crear el gráfico.");
    }

    const datosBase = estado.registrosConCuadrante;

    if (datosBase.length === 0 || estado.outputUmbral === null) {
        await Plotly.react(
            elementos.graficoScatter,
            [],
            {
                annotations: [{
                    text: "No existen datos para esta selección.",
                    showarrow: false,
                    x: 0.5,
                    y: 0.5,
                    xref: "paper",
                    yref: "paper",
                }],
            }
        );
        return;
    }

    const outputMaximo = Math.max(
        ...datosBase.map((registro) => Number(registro.Output))
    );
    const fwciMaximo = Math.max(
        ...datosBase.map((registro) => Number(registro.FWCI))
    );
    const xFinal = outputMaximo * 1.06;
    const yFinal = Math.max(fwciMaximo * 1.08, estado.fwciUmbral * 1.5);

    const layout = {
        autosize: true,
        height: 590,
        margin: {l: 65, r: 100, t: 70, b: 65},
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        hovermode: "closest",
        legend: {
            orientation: "h",
            x: 0,
            y: 1.10,
            xanchor: "left",
            yanchor: "bottom",
        },
        xaxis: {
            title: "Output (producción científica)",
            range: [0, xFinal],
            gridcolor: "#e8edf3",
            zeroline: false,
        },
        yaxis: {
            title: "FWCI (impacto científico)",
            range: [0, yFinal],
            gridcolor: "#e8edf3",
            zeroline: false,
        },
        shapes: [
            ...crearFondosCuadrantes(xFinal, yFinal),
            {
                type: "line",
                x0: estado.outputUmbral,
                x1: estado.outputUmbral,
                y0: 0,
                y1: yFinal,
                line: {color: "#334155", width: 1.5, dash: "dash"},
            },
            {
                type: "line",
                x0: 0,
                x1: xFinal,
                y0: estado.fwciUmbral,
                y1: estado.fwciUmbral,
                line: {color: "#334155", width: 1.5, dash: "dash"},
            },
        ],
        annotations: [
            {
                x: estado.outputUmbral,
                y: 1.03,
                xref: "x",
                yref: "paper",
                text: `Mediana Output: ${estado.outputUmbral}`,
                showarrow: false,
                yanchor: "bottom",
                font: {size: 11, color: "#334155"},
            },
            {
                x: 1.01,
                y: estado.fwciUmbral,
                xref: "paper",
                yref: "y",
                text: `FWCI: ${estado.fwciUmbral}`,
                showarrow: false,
                xanchor: "left",
                font: {size: 11, color: "#334155"},
            },
        ],
    };

    const configuracion = {
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "select2d"],
        scrollZoom: false,
    };

    await Plotly.react(
        elementos.graficoScatter,
        crearTrazasScatter(),
        layout,
        configuracion
    );

    // Plotly.react conserva el elemento; eliminamos el listener anterior
    // para que cada actualización tenga un solo evento de clic activo.
    elementos.graficoScatter.removeAllListeners("plotly_click");
    elementos.graficoScatter.on("plotly_click", (evento) => {
        const cuadrante = evento.points[0]?.customdata?.[4];

        if (!cuadrante) {
            return;
        }

        estado.cuadrante = cuadrante;
        elementos.cuadrante.value = cuadrante;
        aplicarFiltroCuadrante();
        reconstruirHistograma();
        actualizarResumenSeleccion();
        actualizarAnalisisCuadrante();
        estado.pagina = 1;
        actualizarTabla();
        actualizarScatter();
    });
}


function consolidarInvestigadoresHistograma(registros) {
    const agrupados = new Map();

    for (const registro of registros) {
        const id = String(registro["Scopus author ID"] ?? "").trim();
        const fwci = Number(registro.FWCI);
        const output = Number(registro.Output);

        if (!id || !Number.isFinite(fwci)) {
            continue;
        }

        if (!agrupados.has(id)) {
            agrupados.set(id, {
                id,
                nombre: registro.Name,
                valoresFwci: [],
                valoresOutput: [],
            });
        }

        const investigador = agrupados.get(id);
        investigador.valoresFwci.push(fwci);
        if (Number.isFinite(output)) {
            investigador.valoresOutput.push(output);
        }
    }

    return Array.from(agrupados.values()).map((investigador) => ({
        id: investigador.id,
        nombre: investigador.nombre,
        fwci: calcularMediana(investigador.valoresFwci),
        output: investigador.valoresOutput.length > 0
            ? Math.max(...investigador.valoresOutput)
            : 0,
    }));
}


function crearIntervalosFwci(investigadores) {
    if (investigadores.length === 0) {
        return [];
    }

    const maximo = Math.max(...investigadores.map((item) => item.fwci));
    if (maximo === 0) {
        return [{minimo: 0, maximo: 0, etiqueta: "0", investigadores: []}];
    }

    // Los cortes son mas estrechos cerca de 1, donde interesa comparar
    // el impacto con el referente mundial, y mas amplios para valores altos.
    const cortes = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];
    const limites = cortes.filter((valor) => valor < maximo);
    if (limites[0] !== 0) {
        limites.unshift(0);
    }
    limites.push(maximo);

    return limites.slice(0, -1).map((minimo, indice) => {
        const maximoIntervalo = limites[indice + 1];
        const esUltimo = indice === limites.length - 2;
        return {
            minimo,
            maximo: maximoIntervalo,
            esUltimo,
            etiqueta: `${formatearDecimal(minimo)}–${formatearDecimal(maximoIntervalo)}`,
            investigadores: [],
        };
    });
}


function reconstruirHistograma() {
    estado.indicesIntervalosSeleccionados.clear();
    const investigadores = consolidarInvestigadoresHistograma(
        estado.registrosAntesHistograma
    );
    estado.intervalosHistograma = crearIntervalosFwci(investigadores);

    for (const investigador of investigadores) {
        const indice = estado.intervalosHistograma.findIndex((intervalo) =>
            investigador.fwci >= intervalo.minimo
            && (intervalo.esUltimo
                ? investigador.fwci <= intervalo.maximo
                : investigador.fwci < intervalo.maximo)
        );

        if (indice >= 0) {
            estado.intervalosHistograma[indice].investigadores.push(investigador);
        }
    }

    estado.registrosCuadrante = estado.registrosAntesHistograma.slice();
    renderizarHistograma();
}


function aplicarSeleccionHistograma() {
    if (estado.indicesIntervalosSeleccionados.size === 0) {
        estado.registrosCuadrante = estado.registrosAntesHistograma.slice();
    } else {
        const ids = new Set();
        for (const indice of estado.indicesIntervalosSeleccionados) {
            for (const investigador of estado.intervalosHistograma[indice].investigadores) {
                ids.add(investigador.id);
            }
        }
        estado.registrosCuadrante = estado.registrosAntesHistograma.filter(
            (registro) => ids.has(String(registro["Scopus author ID"] ?? "").trim())
        );
    }

    estado.pagina = 1;
    actualizarResumenSeleccion();
    actualizarScatter();
    actualizarAnalisisCuadrante();
    actualizarTabla();
    renderizarHistograma();
}


async function renderizarHistograma() {
    const intervalos = estado.intervalosHistograma;
    const total = consolidarInvestigadoresHistograma(
        estado.registrosAntesHistograma
    ).length;
    const haySeleccion = estado.indicesIntervalosSeleccionados.size > 0;

    elementos.botonLimpiarHistograma.disabled = !haySeleccion;
    elementos.botonVerInvestigadoresHistograma.disabled = total === 0;
    elementos.resumenHistograma.textContent = haySeleccion
        ? `${estado.registrosCuadrante.length.toLocaleString("es-EC")} investigadores en ${estado.indicesIntervalosSeleccionados.size} rango(s) seleccionado(s).`
        : `${total.toLocaleString("es-EC")} investigadores. Seleccione una o varias barras para filtrar.`;

    if (intervalos.length === 0) {
        await Plotly.react(elementos.graficoHistograma, [], {
            margin: {t: 35, r: 20, b: 55, l: 55},
            annotations: [{
                text: "No hay investigadores para los filtros actuales.",
                showarrow: false,
                x: 0.5,
                y: 0.5,
                xref: "paper",
                yref: "paper",
            }],
            xaxis: {visible: false},
            yaxis: {visible: false},
        }, {responsive: true, displaylogo: false});
        return;
    }

    const colores = intervalos.map((_, indice) => {
        if (!haySeleccion) return "#75a9d6";
        return estado.indicesIntervalosSeleccionados.has(indice)
            ? "#1f4f82"
            : "#d7e3ed";
    });
    const datosPersonalizados = intervalos.map((intervalo) => {
        const cantidad = intervalo.investigadores.length;
        const porcentaje = total > 0 ? cantidad * 100 / total : 0;
        const promedioFwci = cantidad > 0
            ? intervalo.investigadores.reduce((suma, item) => suma + item.fwci, 0) / cantidad
            : 0;
        const promedioOutput = cantidad > 0
            ? intervalo.investigadores.reduce((suma, item) => suma + item.output, 0) / cantidad
            : 0;
        return [intervalo.etiqueta, porcentaje, promedioFwci, promedioOutput];
    });

    await Plotly.react(elementos.graficoHistograma, [{
        type: "bar",
        x: intervalos.map((intervalo) => intervalo.etiqueta),
        y: intervalos.map((intervalo) => intervalo.investigadores.length),
        customdata: datosPersonalizados,
        marker: {color: colores, line: {color: "#1f4f82", width: 1}},
        hovertemplate: "Rango FWCI: %{customdata[0]}<br>Investigadores: %{y}<br>Porcentaje: %{customdata[1]:.1f}%<br>FWCI promedio: %{customdata[2]:.2f}<br>Output promedio: %{customdata[3]:.1f}<extra>Haga clic para seleccionar</extra>",
    }], {
        margin: {t: 30, r: 20, b: 75, l: 55},
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        bargap: 0.12,
        xaxis: {title: "Rango de FWCI", tickangle: -25, fixedrange: true},
        yaxis: {title: "Investigadores", rangemode: "tozero", dtick: 1, fixedrange: true, gridcolor: "#dbe5ef"},
        showlegend: false,
    }, {responsive: true, displaylogo: false, scrollZoom: false});

    elementos.graficoHistograma.removeAllListeners("plotly_click");
    elementos.graficoHistograma.on("plotly_click", (evento) => {
        const indice = evento.points[0]?.pointIndex;
        if (!Number.isInteger(indice)) return;
        if (estado.indicesIntervalosSeleccionados.has(indice)) {
            estado.indicesIntervalosSeleccionados.delete(indice);
        } else {
            estado.indicesIntervalosSeleccionados.add(indice);
        }
        aplicarSeleccionHistograma();
    });
}


function alternarHistograma() {
    const estaVisible = !elementos.contenidoHistograma.hidden;
    elementos.contenidoHistograma.hidden = estaVisible;
    elementos.botonHistograma.setAttribute("aria-expanded", String(!estaVisible));
    elementos.botonHistograma.textContent = estaVisible
        ? "Mostrar histograma"
        : "Ocultar histograma";

    if (!estaVisible) {
        Plotly.Plots.resize(elementos.graficoHistograma);
    }
}

function calcularMediana(valores) {
    if (valores.length === 0) {
        return null;
    }

    // slice() crea una copia para no alterar el orden de la lista original.
    const ordenados = valores.slice().sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);

    if (ordenados.length % 2 !== 0) {
        return ordenados[mitad];
    }

    return (ordenados[mitad - 1] + ordenados[mitad]) / 2;
}


function asignarCuadrante(registro, outputUmbral, fwciUmbral) {
    const outputAlto = Number(registro.Output) >= outputUmbral;
    const fwciAlto = Number(registro.FWCI) >= fwciUmbral;

    if (outputAlto && fwciAlto) {
        return "C1";
    }

    if (!outputAlto && fwciAlto) {
        return "C2";
    }

    if (!outputAlto && !fwciAlto) {
        return "C4";
    }

    return "C3";
}


function prepararCuadrantes() {
    const valoresOutput = estado.registrosBase
        .map((registro) => Number(registro.Output))
        .filter((valor) => Number.isFinite(valor));

    estado.outputUmbral = calcularMediana(valoresOutput);
    estado.fwciUmbral = Number(estado.metadata.umbral_fwci) || 1;

    if (estado.outputUmbral === null) {
        estado.registrosClasificados = [];
        estado.registrosConCuadrante = [];
        return;
    }

    // {...registro} crea una copia y añade Cuadrante sin modificar el JSON original.
    estado.registrosClasificados = estado.registrosBase.map(
        (registro) => ({
            ...registro,
            Cuadrante: asignarCuadrante(
                registro,
                estado.outputUmbral,
                estado.fwciUmbral
            ),
        })
    );

}


function aplicarFiltroCuadrante() {
    estado.registrosAntesHistograma = estado.cuadrante === "Todos"
        ? estado.registrosConCuadrante.slice()
        : estado.registrosConCuadrante.filter(
            (registro) => registro.Cuadrante === estado.cuadrante
        );

    // La selección de barras siempre parte del cuadrante visible actual.
    estado.registrosCuadrante = estado.registrosAntesHistograma.slice();
}


function contarCuadrantes() {
    const conteos = {C1: 0, C2: 0, C3: 0, C4: 0};

    for (const registro of estado.registrosConCuadrante) {
        conteos[registro.Cuadrante] += 1;
    }

    return conteos;
}


function actualizarResumenCuadrantes() {
    const conteos = contarCuadrantes();

    elementos.conteoC1.textContent = conteos.C1.toLocaleString("es-EC");
    elementos.conteoC2.textContent = conteos.C2.toLocaleString("es-EC");
    elementos.conteoC4.textContent = conteos.C4.toLocaleString("es-EC");
    elementos.conteoC3.textContent = conteos.C3.toLocaleString("es-EC");

    elementos.textoUmbrales.textContent = estado.outputUmbral === null
        ? "No existen datos para calcular los umbrales."
        : `Mediana Output: ${estado.outputUmbral.toLocaleString("es-EC")} · `
            + `Umbral FWCI: ${estado.fwciUmbral.toLocaleString("es-EC")}`;
}


function calcularKPIs(registros) {
    if (registros.length === 0) {
        return {
            investigadores: 0,
            output: 0,
            citas: 0,
            fwciPromedio: null,
        };
    }

    // Set conserva valores únicos; así un ID repetido se cuenta una sola vez.
    const idsUnicos = new Set(
        registros.map((registro) => registro["Scopus author ID"])
    );

    // reduce() recorre la lista y acumula todos los valores en un total.
    const output = registros.reduce(
        (total, registro) => total + (Number(registro.Output) || 0),
        0
    );

    const citas = registros.reduce(
        (total, registro) => total + (Number(registro.Citations) || 0),
        0
    );

    const valoresFwci = registros
        .map((registro) => Number(registro.FWCI))
        .filter((valor) => Number.isFinite(valor));

    const sumaFwci = valoresFwci.reduce(
        (total, valor) => total + valor,
        0
    );

    const fwciPromedio = valoresFwci.length > 0
        ? sumaFwci / valoresFwci.length
        : null;

    return {
        investigadores: idsUnicos.size,
        output,
        citas,
        fwciPromedio,
    };
}


function actualizarKPIs() {
    const indicadores = calcularKPIs(estado.registrosFiltrados);

    elementos.kpiInvestigadores.textContent =
        indicadores.investigadores.toLocaleString("es-EC");

    elementos.kpiOutput.textContent =
        indicadores.output.toLocaleString("es-EC");

    elementos.kpiCitas.textContent =
        indicadores.citas.toLocaleString("es-EC");

    elementos.kpiFwci.textContent = indicadores.fwciPromedio === null
        ? "—"
        : indicadores.fwciPromedio.toLocaleString("es-EC", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
}


function formatearDecimal(valor) {
    return valor === null || !Number.isFinite(valor)
        ? "—"
        : valor.toLocaleString("es-EC", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
}


function buscarRegistroExtremo(registros, columna, buscarMaximo = true) {
    if (registros.length === 0) {
        return null;
    }

    return registros.reduce((seleccionado, registro) => {
        const valorActual = Number(registro[columna]);
        const valorSeleccionado = Number(seleccionado[columna]);
        const reemplazar = buscarMaximo
            ? valorActual > valorSeleccionado
            : valorActual < valorSeleccionado;

        return reemplazar ? registro : seleccionado;
    });
}


function calcularAnalisisCuadrante(registros) {
    if (registros.length === 0) {
        return null;
    }

    const indicadores = calcularKPIs(registros);
    const valoresFwci = registros
        .map((registro) => Number(registro.FWCI))
        .filter((valor) => Number.isFinite(valor));

    return {
        ...indicadores,
        fwciMediana: calcularMediana(valoresFwci),
        fwciMinimo: Math.min(...valoresFwci),
        fwciMaximo: Math.max(...valoresFwci),
        mejorFwci: buscarRegistroExtremo(registros, "FWCI", true),
        menorFwci: buscarRegistroExtremo(registros, "FWCI", false),
        mayorOutput: buscarRegistroExtremo(registros, "Output", true),
    };
}


function actualizarAnalisisCuadrante() {
    const analisis = calcularAnalisisCuadrante(estado.registrosCuadrante);

    elementos.tituloAnalisisCuadrante.textContent = estado.cuadrante === "Todos"
        ? "Todos los cuadrantes"
        : `Análisis del cuadrante ${estado.cuadrante}`;
    elementos.detalleAnalisisCuadrante.textContent =
        `${estado.categoria} · ${estado.subcategoria}`
        + describirFiltrosNumericos();

    if (analisis === null) {
        elementos.cuadranteInvestigadores.textContent = "0";
        elementos.cuadranteOutput.textContent = "0";
        elementos.cuadranteFwciPromedio.textContent = "—";
        elementos.cuadranteFwciMediana.textContent = "—";
        elementos.cuadranteFwciRango.textContent = "—";
        elementos.cuadranteMejorFwci.textContent = "—";
        elementos.cuadranteMejorFwciValor.textContent = "Sin datos";
        elementos.cuadranteMenorFwci.textContent = "—";
        elementos.cuadranteMenorFwciValor.textContent = "Sin datos";
        elementos.cuadranteMayorOutput.textContent = "—";
        elementos.cuadranteMayorOutputValor.textContent = "Sin datos";
        return;
    }

    elementos.cuadranteInvestigadores.textContent =
        analisis.investigadores.toLocaleString("es-EC");
    elementos.cuadranteOutput.textContent =
        analisis.output.toLocaleString("es-EC");
    elementos.cuadranteFwciPromedio.textContent =
        formatearDecimal(analisis.fwciPromedio);
    elementos.cuadranteFwciMediana.textContent =
        formatearDecimal(analisis.fwciMediana);
    elementos.cuadranteFwciRango.textContent =
        `${formatearDecimal(analisis.fwciMinimo)} – `
        + `${formatearDecimal(analisis.fwciMaximo)}`;

    elementos.cuadranteMejorFwci.textContent = analisis.mejorFwci.Name;
    elementos.cuadranteMejorFwciValor.textContent =
        `FWCI: ${formatearDecimal(Number(analisis.mejorFwci.FWCI))}`;
    elementos.cuadranteMenorFwci.textContent = analisis.menorFwci.Name;
    elementos.cuadranteMenorFwciValor.textContent =
        `FWCI: ${formatearDecimal(Number(analisis.menorFwci.FWCI))}`;
    elementos.cuadranteMayorOutput.textContent = analisis.mayorOutput.Name;
    elementos.cuadranteMayorOutputValor.textContent =
        `Output: ${Number(analisis.mayorOutput.Output).toLocaleString("es-EC")}`;
}


function normalizarTexto(valor) {
    return String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es");
}


function alternarPanoramaIndividual() {
    const estaVisible = !elementos.contenidoPanoramaIndividual.hidden;
    elementos.contenidoPanoramaIndividual.hidden = estaVisible;
    elementos.botonPanoramaIndividual.setAttribute(
        "aria-expanded",
        String(!estaVisible)
    );
    elementos.botonPanoramaIndividual.textContent = estaVisible
        ? "Mostrar búsqueda"
        : "Ocultar búsqueda";

    if (!estaVisible) {
        elementos.buscadorGlobal.focus();
    }
}


function crearCelda(texto, clase = "") {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) {
        celda.className = clase;
    }
    return celda;
}


function obtenerInvestigadoresGlobales(consulta) {
    const investigadores = new Map();

    for (const registro of estado.registros) {
        const id = String(registro["Scopus author ID"] ?? "").trim();
        if (!id) {
            continue;
        }

        if (!investigadores.has(id)) {
            investigadores.set(id, {
                id,
                nombre: registro.Name,
                perfil: registro["Scopus author profile"],
                registros: [],
            });
        }
        investigadores.get(id).registros.push(registro);
    }

    return Array.from(investigadores.values())
        .filter((investigador) =>
            normalizarTexto(investigador.nombre).includes(consulta)
            || normalizarTexto(investigador.id).includes(consulta)
        )
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}


function crearResultadoInvestigador(investigador) {
    const articulo = document.createElement("article");
    articulo.className = "investigador-individual";

    const encabezado = document.createElement("div");
    encabezado.className = "investigador-individual__encabezado";
    const identidad = document.createElement("div");
    const nombre = document.createElement("h3");
    nombre.textContent = investigador.nombre;
    const id = document.createElement("p");
    id.textContent = `Scopus ID: ${investigador.id}`;
    identidad.append(nombre, id);

    const categorias = new Set(
        investigador.registros.map((registro) => registro.categoria)
    );
    const subcategorias = new Set(
        investigador.registros
            .filter((registro) => registro.nivel === "Subcategoria")
            .map((registro) => `${registro.categoria}|${registro.subcategoria}`)
    );
    const metricas = document.createElement("div");
    metricas.className = "investigador-individual__metricas";
    for (const texto of [
        `${categorias.size} categoría(s)`,
        `${subcategorias.size} subcategoría(s)`,
        `${investigador.registros.length} registros`,
    ]) {
        const metrica = document.createElement("span");
        metrica.className = "investigador-individual__metrica";
        metrica.textContent = texto;
        metricas.append(metrica);
    }
    identidad.append(metricas);
    encabezado.append(identidad);

    if (String(investigador.perfil ?? "").startsWith("https://")) {
        const perfil = document.createElement("a");
        perfil.className = "boton";
        perfil.href = investigador.perfil;
        perfil.target = "_blank";
        perfil.rel = "noopener noreferrer";
        perfil.textContent = "Abrir perfil";
        encabezado.append(perfil);
    }
    articulo.append(encabezado);

    const contenedorTabla = document.createElement("div");
    contenedorTabla.className = "tabla-contenedor";
    const tabla = document.createElement("table");
    const cabecera = document.createElement("thead");
    const filaCabecera = document.createElement("tr");
    for (const titulo of ["Categoría", "Subcategoría", "Output", "FWCI", "Citas", "h-index"]) {
        const th = document.createElement("th");
        th.textContent = titulo;
        filaCabecera.append(th);
    }
    cabecera.append(filaCabecera);

    const cuerpo = document.createElement("tbody");
    const registrosOrdenados = investigador.registros.slice().sort((a, b) => {
        const categoria = a.categoria.localeCompare(b.categoria, "es");
        if (categoria !== 0) return categoria;
        if (a.nivel === "Categoria" && b.nivel !== "Categoria") return -1;
        if (b.nivel === "Categoria" && a.nivel !== "Categoria") return 1;
        return a.subcategoria.localeCompare(b.subcategoria, "es");
    });

    for (const registro of registrosOrdenados) {
        const fila = document.createElement("tr");
        const subcategoria = registro.nivel === "Categoria"
            ? "Consolidado"
            : registro.subcategoria;
        fila.append(
            crearCelda(registro.categoria),
            crearCelda(subcategoria, "investigador-individual__nivel"),
            crearCelda(Number(registro.Output).toLocaleString("es-EC")),
            crearCelda(formatearDecimal(Number(registro.FWCI))),
            crearCelda(Number(registro.Citations).toLocaleString("es-EC")),
            crearCelda(Number(registro["h-index"]).toLocaleString("es-EC"))
        );
        cuerpo.append(fila);
    }

    tabla.append(cabecera, cuerpo);
    contenedorTabla.append(tabla);
    articulo.append(contenedorTabla);
    return articulo;
}


function actualizarPanoramaIndividual() {
    const consulta = normalizarTexto(elementos.buscadorGlobal.value.trim());
    elementos.resultadosPanoramaIndividual.replaceChildren();

    if (!consulta) {
        elementos.resumenPanoramaIndividual.textContent =
            "Escriba un nombre o Scopus ID para comenzar.";
        return;
    }

    const investigadores = obtenerInvestigadoresGlobales(consulta);
    if (investigadores.length === 0) {
        elementos.resumenPanoramaIndividual.textContent =
            "No se encontraron investigadores para esta búsqueda.";
        return;
    }

    elementos.resumenPanoramaIndividual.textContent =
        `${investigadores.length.toLocaleString("es-EC")} investigador(es) encontrado(s). `
        + "Los valores se muestran por área y no se suman entre categorías.";

    for (const investigador of investigadores) {
        elementos.resultadosPanoramaIndividual.append(
            crearResultadoInvestigador(investigador)
        );
    }
}

function obtenerRegistrosTabla() {
    const textoBuscado = normalizarTexto(estado.busqueda.trim());

    const encontrados = textoBuscado
        ? estado.registrosCuadrante.filter((registro) => {
            const nombre = normalizarTexto(registro.Name);
            const id = normalizarTexto(registro["Scopus author ID"]);
            return nombre.includes(textoBuscado) || id.includes(textoBuscado);
        })
        : estado.registrosCuadrante.slice();

    const columna = estado.ordenColumna;
    const factor = estado.ordenDireccion === "asc" ? 1 : -1;

    encontrados.sort((a, b) => {
        const valorA = a[columna];
        const valorB = b[columna];

        if (typeof valorA === "number" && typeof valorB === "number") {
            return (valorA - valorB) * factor;
        }

        return String(valorA ?? "").localeCompare(
            String(valorB ?? ""),
            "es",
            {sensitivity: "base"}
        ) * factor;
    });

    return encontrados;
}


function crearFilaInvestigador(registro) {
    const fila = document.createElement("tr");
    fila.append(crearCelda(registro.Name));
    fila.append(crearCelda(Number(registro.Output).toLocaleString("es-EC")));
    fila.append(crearCelda(Number(registro.FWCI).toLocaleString("es-EC", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })));
    fila.append(crearCelda(Number(registro.Citations).toLocaleString("es-EC")));
    fila.append(crearCelda(Number(registro["h-index"]).toLocaleString("es-EC")));

    const celdaCuadrante = document.createElement("td");
    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta-cuadrante";
    etiqueta.style.backgroundColor = COLORES_CUADRANTES[registro.Cuadrante];
    etiqueta.textContent = registro.Cuadrante;
    celdaCuadrante.append(etiqueta);
    fila.append(celdaCuadrante);

    const celdaPerfil = document.createElement("td");
    const enlace = document.createElement("a");
    enlace.className = "enlace-scopus";
    enlace.href = registro["Scopus author profile"];
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Abrir";
    celdaPerfil.append(enlace);
    fila.append(celdaPerfil);

    return fila;
}


function actualizarIndicadorOrden() {
    for (const boton of elementos.botonesOrden) {
        const indicadorAnterior = boton.querySelector("span");
        indicadorAnterior?.remove();

        if (boton.dataset.columna === estado.ordenColumna) {
            const indicador = document.createElement("span");
            indicador.setAttribute("aria-hidden", "true");
            indicador.textContent = estado.ordenDireccion === "asc" ? " ↑" : " ↓";
            boton.append(indicador);
        }
    }
}


function actualizarTabla() {
    const registros = obtenerRegistrosTabla();
    const totalPaginas = Math.max(
        1,
        Math.ceil(registros.length / estado.filasPorPagina)
    );

    estado.pagina = Math.min(Math.max(estado.pagina, 1), totalPaginas);

    const inicio = (estado.pagina - 1) * estado.filasPorPagina;
    const fin = inicio + estado.filasPorPagina;
    const registrosPagina = registros.slice(inicio, fin);

    elementos.tablaInvestigadores.replaceChildren();

    if (registrosPagina.length === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda("No se encontraron investigadores.");
        celda.colSpan = 7;
        celda.className = "tabla-vacia";
        fila.append(celda);
        elementos.tablaInvestigadores.append(fila);
    } else {
        for (const registro of registrosPagina) {
            elementos.tablaInvestigadores.append(
                crearFilaInvestigador(registro)
            );
        }
    }

    const primerRegistro = registros.length === 0 ? 0 : inicio + 1;
    const ultimoRegistro = Math.min(fin, registros.length);
    elementos.tablaResumen.textContent =
        `Mostrando ${primerRegistro.toLocaleString("es-EC")}–`
        + `${ultimoRegistro.toLocaleString("es-EC")} de `
        + `${registros.length.toLocaleString("es-EC")} investigadores`;

    elementos.paginaActual.textContent =
        `Página ${estado.pagina} de ${totalPaginas}`;
    elementos.paginaAnterior.disabled = estado.pagina <= 1;
    elementos.paginaSiguiente.disabled = estado.pagina >= totalPaginas;
    actualizarIndicadorOrden();
}


function mostrarCargaCorrecta() {
    elementos.estadoCarga.className = "estado estado--correcto";
    elementos.estadoCarga.textContent =
        `Datos cargados: ${estado.metadata.total_registros.toLocaleString("es-EC")} registros.`;
}


function mostrarError(error) {
    elementos.estadoCarga.className = "estado estado--error";
    elementos.estadoCarga.textContent = error.message;
    console.error(error);
}


function conectarEventos() {
    elementos.botonAusentesTop500.addEventListener(
        "click",
        alternarAusentesTop500
    );
    elementos.botonExclusiones.addEventListener("click", alternarExclusiones);
    elementos.buscadorExclusion.addEventListener("input", () => {
        estado.busquedaExclusion = elementos.buscadorExclusion.value.trim();
        actualizarListaExclusiones();
    });
    elementos.botonSeleccionarExclusiones.addEventListener("click", () => {
        const visibles = obtenerInvestigadoresParaExcluir();
        const todosSeleccionados = visibles.length > 0
            && visibles.every((item) => estado.idsExclusionPendientes.has(item.id));
        for (const investigador of visibles) {
            if (todosSeleccionados) {
                estado.idsExclusionPendientes.delete(investigador.id);
            } else {
                estado.idsExclusionPendientes.add(investigador.id);
            }
        }
        actualizarListaExclusiones();
    });
    elementos.botonLimpiarExclusiones.addEventListener("click", () => {
        limpiarExclusiones();
    });
    elementos.botonAplicarExclusiones.addEventListener("click", () => {
        estado.idsExcluidos = new Set(estado.idsExclusionPendientes);
        estado.pagina = 1;
        aplicarFiltros();
    });
    elementos.botonPanoramaGlobal.addEventListener(
        "click",
        alternarPanoramaGlobal
    );

    elementos.botonHistograma.addEventListener("click", alternarHistograma);
    elementos.botonPanoramaIndividual.addEventListener(
        "click",
        alternarPanoramaIndividual
    );
    elementos.buscadorGlobal.addEventListener(
        "input",
        actualizarPanoramaIndividual
    );
    elementos.botonLimpiarHistograma.addEventListener("click", () => {
        estado.indicesIntervalosSeleccionados.clear();
        aplicarSeleccionHistograma();
    });
    elementos.botonVerInvestigadoresHistograma.addEventListener("click", () => {
        elementos.panelInvestigadores.scrollIntoView({behavior: "smooth", block: "start"});
    });

    elementos.categoria.addEventListener("change", () => {
        estado.categoria = elementos.categoria.value;
        limpiarExclusiones(false);
        actualizarSubcategorias();
        elementos.cuadrante.value = "Todos";
        estado.cuadrante = "Todos";
        estado.pagina = 1;
        aplicarFiltros();
    });

    elementos.subcategoria.addEventListener("change", () => {
        estado.subcategoria = elementos.subcategoria.value;
        limpiarExclusiones(false);
        elementos.cuadrante.value = "Todos";
        estado.cuadrante = "Todos";
        estado.pagina = 1;
        aplicarFiltros();
    });

    elementos.botonAplicarLimites.addEventListener("click", () => {
        if (!leerFiltrosNumericos()) {
            return;
        }

        estado.pagina = 1;
        aplicarFiltros();
    });

    elementos.botonLimpiarLimites.addEventListener("click", () => {
        limpiarFiltrosNumericos();
    });

    for (const campo of [elementos.filtroFwciMaximo, elementos.filtroOutputMaximo]) {
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                elementos.botonAplicarLimites.click();
            }
        });
    }
    elementos.cuadrante.addEventListener("change", () => {
        estado.cuadrante = elementos.cuadrante.value;
        aplicarFiltroCuadrante();
        reconstruirHistograma();
        actualizarResumenSeleccion();
        actualizarScatter();
        actualizarAnalisisCuadrante();
        estado.pagina = 1;
        actualizarTabla();

    });

    elementos.botonRestablecer.addEventListener("click", () => {
        elementos.categoria.selectedIndex = 0;
        estado.categoria = elementos.categoria.value;
        actualizarSubcategorias();
        elementos.cuadrante.value = "Todos";
        estado.cuadrante = "Todos";
        estado.busqueda = "";
        elementos.buscador.value = "";
        limpiarFiltrosNumericos(false);
        limpiarExclusiones(false);
        estado.pagina = 1;
        aplicarFiltros();
    });

    elementos.buscador.addEventListener("input", () => {
        estado.busqueda = elementos.buscador.value;
        estado.pagina = 1;
        actualizarTabla();
    });

    elementos.paginaAnterior.addEventListener("click", () => {
        estado.pagina -= 1;
        actualizarTabla();
    });

    elementos.paginaSiguiente.addEventListener("click", () => {
        estado.pagina += 1;
        actualizarTabla();
    });

    for (const boton of elementos.botonesOrden) {
        boton.addEventListener("click", () => {
            const columna = boton.dataset.columna;

            if (estado.ordenColumna === columna) {
                estado.ordenDireccion =
                    estado.ordenDireccion === "asc" ? "desc" : "asc";
            } else {
                estado.ordenColumna = columna;
                estado.ordenDireccion = columna === "Name" ? "asc" : "desc";
            }

            estado.pagina = 1;
            actualizarTabla();
        });
    }
}


async function iniciarDashboard() {
    try {
        const documento = await cargarDatos();

        estado.metadata = documento.metadata;
        estado.registros = documento.records;

        actualizarPanoramaGlobal();
        llenarCategorias(estado.metadata.categorias);
        estado.categoria = elementos.categoria.value;
        actualizarSubcategorias();
        aplicarFiltros();

        elementos.cuadrante.disabled = false;
        elementos.buscador.disabled = false;
        elementos.buscadorGlobal.disabled = false;
        elementos.buscadorExclusion.disabled = false;
        elementos.botonAplicarExclusiones.disabled = false;
        elementos.filtroFwciMaximo.disabled = false;
        elementos.filtroOutputMaximo.disabled = false;
        elementos.botonAplicarLimites.disabled = false;
        elementos.botonLimpiarLimites.disabled = false;

        const fecha = new Date(estado.metadata.generado_en_utc);
        elementos.fechaDatos.textContent =
            `Datos generados: ${fecha.toLocaleString("es-EC")}`;

        conectarEventos();
        mostrarCargaCorrecta();

    } catch (error) {
        mostrarError(error);
    }
}


iniciarDashboard();
