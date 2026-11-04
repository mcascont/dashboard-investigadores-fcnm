# Archivos web del dashboard

`data_dashboard.json` se genera desde los Excel mediante el flujo seguro:

```powershell
.\actualizar_dashboard.ps1
```

El comando sincroniza `research`, valida las fuentes, respalda la version
anterior y reemplaza el JSON completo. No edite el JSON manualmente.

Para visualizar la pagina, ejecute desde la raiz del proyecto:

```powershell
.\iniciar_dashboard.ps1
```

Luego abra `http://localhost:8000` en el navegador.
