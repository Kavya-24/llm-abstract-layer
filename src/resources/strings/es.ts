const en = {
    // Errores del proveedor LLM
    LLM_ERROR_MISSING_API_KEY: "Se requiere una clave API para inicializar el proveedor LLM",
    LLM_ERROR_AUTHENTICATION_FAILED: "Falló la autenticación con el proveedor ${provider}",
    LLM_ERROR_RATE_LIMIT: "Se excedió el límite de solicitudes para el proveedor ${provider}",
    LLM_ERROR_RETRY_AFTER: "Por favor, inténtelo de nuevo después de ${seconds} segundos",
    LLM_ERROR_VALIDATION_FAILED: "La validación de la solicitud falló para ${provider}: ${details}",
    LLM_ERROR_CONNECTION_FAILED: "Falló la conexión con el proveedor ${provider}",
    LLM_ERROR_PROVIDER_ERROR: "Error del proveedor ${provider} (estado: ${status})",
    LLM_ERROR_UNKNOWN: "Ocurrió un error desconocido con el proveedor ${provider}",
    LLM_ERROR_STREAMING_FAILED: "La transmisión falló para el proveedor ${provider}",
    LLM_ERROR_STRUCTURED_OUTPUT_FAILED: "La validación de la salida estructurada falló para el proveedor ${provider}",
    LLM_MISSING_REQUEST_MESSAGES: "Faltan los mensajes de entrada",

    // Registro del proveedor LLM
    LOG_LLM_AUTHENTICATION_ERROR: "Error de autenticación LLM",
    LOG_LLM_RATE_LIMIT_ERROR: "Error de límite de solicitudes LLM",
    LOG_LLM_VALIDATION_ERROR: "Error de validación LLM",
    LOG_LLM_STREAMING_ERROR: "Error de transmisión LLM",
    LOG_LLM_STRUCTURED_OUTPUT_ERROR: "Error de salida estructurada LLM",
    LOG_LLM_ERROR: "Error LLM",

} as const;

export default en;