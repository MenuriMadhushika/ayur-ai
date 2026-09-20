package com.ayurai.ayuraibackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.web.client.ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> handleModelUnavailable(
            org.springframework.web.client.ResourceAccessException exception) {
        return ResponseEntity.status(503).body(Map.of("status", 503,
                "message", "Skin analysis is temporarily unavailable. Please try again later."));
    }

    @ExceptionHandler(org.springframework.web.client.RestClientResponseException.class)
    public ResponseEntity<Map<String, Object>> handleModelResponse(
            org.springframework.web.client.RestClientResponseException exception) {
        int upstream = exception.getStatusCode().value();
        int status = switch (upstream) {
            case 400, 413, 415, 422 -> upstream;
            default -> 503;
        };
        String message = switch (status) {
            case 400, 422 -> "Please upload a valid JPG, PNG, or WebP image.";
            case 413 -> "Image must be 5 MB or smaller.";
            case 415 -> "Please choose a JPG, PNG, or WebP image.";
            default -> "Skin analysis is temporarily unavailable. Please try again later.";
        };
        return ResponseEntity.status(status).body(Map.of("status", status, "message", message));
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleUploadTooLarge(
            org.springframework.web.multipart.MaxUploadSizeExceededException exception) {
        return ResponseEntity.status(413).body(Map.of("status", 413,
                "message", "Image must be 5 MB or smaller."));
    }

    @ExceptionHandler(org.springframework.web.multipart.support.MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, Object>> handleMissingImage(
            org.springframework.web.multipart.support.MissingServletRequestPartException exception) {
        return ResponseEntity.badRequest().body(Map.of("status", 400,
                "message", "Please attach an image before starting the scan."));
    }

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception) {

        Map<String, Object> response = new HashMap<>();

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );

        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("message", "Validation failed");
        response.put("errors", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    // Handle general runtime errors
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}