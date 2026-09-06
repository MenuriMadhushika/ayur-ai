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
            requestContentType.set(exchange.getRequestHeaders().getFirst("Content-Type"));
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.ISO_8859_1));
            byte[] response = ("{\"status\":\"estimated\",\"estimatedCategory\":\"Moderate\","
                    + "\"modelScore\":0.74,\"probabilities\":{\"Moderate\":0.74},"
                    + "\"message\":\"Estimated moderate severity.\","
                    + "\"disclaimer\":\"Not a diagnosis.\",\"modelVersion\":\"test-v1\"}")
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
        assertTrue(requestContentType.get().startsWith("multipart/form-data;boundary="));
        assertTrue(requestBody.get().contains("Content-Type: image/jpeg"));
        assertTrue(requestBody.get().contains("filename=\"face.jpg\""));
    }
}
