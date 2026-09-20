package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.SkinModelPrediction;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

class SkinModelClientTest {
    private HttpServer server;

    @AfterEach
    void stopServer() {
        if (server != null) server.stop(0);
    }

    @Test
    void sendsAnHttp11MultipartImageAndReadsPrediction() throws Exception {
        AtomicReference<String> requestContentType = new AtomicReference<>();
        AtomicReference<String> requestBody = new AtomicReference<>();
        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/predict", exchange -> {
            assertEquals("include_skin_type=true", exchange.getRequestURI().getQuery());
            requestContentType.set(exchange.getRequestHeaders().getFirst("Content-Type"));
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.ISO_8859_1));
            byte[] response = ("{\"status\":\"estimated\",\"estimatedCategory\":\"Moderate\","
                    + "\"modelScore\":0.74,\"probabilities\":{\"Moderate\":0.74},"
                    + "\"message\":\"Estimated moderate severity.\","
                    + "\"disclaimer\":\"Not a diagnosis.\",\"modelVersion\":\"test-v1\","
                    + "\"skinType\":{\"skinType\":\"uncertain\",\"confidence\":0.46,"
                    + "\"predictedClass\":\"combination\",\"requiresReview\":true,"
                    + "\"probabilities\":{\"combination\":0.46,\"dry\":0.20,\"normal\":0.14,\"oily\":0.20}}}")
                    .getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        SkinModelClient client = new SkinModelClient("http://127.0.0.1:" + server.getAddress().getPort());
        MockMultipartFile image = new MockMultipartFile("image", "face.jpg", "image/jpeg", new byte[]{1, 2, 3, 4});

        SkinModelPrediction prediction = client.predict(image);

        assertEquals("Moderate", prediction.estimatedCategory());
        assertEquals(0.74, prediction.modelScore());
        assertEquals("uncertain", prediction.skinType().skinType());
        assertEquals("combination", prediction.skinType().predictedClass());
        assertTrue(prediction.skinType().requiresReview());
        assertEquals(4, prediction.skinType().probabilities().size());
        assertTrue(requestContentType.get().startsWith("multipart/form-data;boundary="));
        assertTrue(requestBody.get().contains("Content-Type: image/jpeg"));
        assertTrue(requestBody.get().contains("filename=\"face.jpg\""));
    }

    @Test
    void unavailableSkinTypeDoesNotDiscardAcneAndLegacyResponseStillParses() throws Exception {
        AtomicReference<String> skinJson = new AtomicReference<>(
                ",\"skinType\":{\"skinType\":\"unavailable\",\"confidence\":null,"
                + "\"requiresReview\":true,\"probabilities\":{},\"message\":\"Temporarily unavailable\"}");
        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/predict", exchange -> {
            exchange.getRequestBody().readAllBytes();
            byte[] response = ("{\"status\":\"estimated\",\"estimatedCategory\":\"Mild\","
                    + "\"modelScore\":0.9,\"probabilities\":{\"Mild\":0.9},"
                    + "\"message\":\"Estimate\",\"disclaimer\":\"Not a diagnosis\","
                    + "\"modelVersion\":\"test\"" + skinJson.get() + "}").getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();
        var client = new SkinModelClient("http://127.0.0.1:" + server.getAddress().getPort());
        var image = new MockMultipartFile("image", "face.jpg", "image/jpeg", new byte[]{1});
        var unavailable = client.predict(image);
        assertEquals("Mild", unavailable.estimatedCategory());
        assertEquals("unavailable", unavailable.skinType().skinType());
        assertNull(unavailable.skinType().confidence());
        skinJson.set("");
        var legacy = client.predict(image);
        assertEquals("Mild", legacy.estimatedCategory());
        assertNull(legacy.skinType());
    }
}
