package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.SkinModelPrediction;
import com.ayurai.ayuraibackend.exception.SkinModelUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class SkinModelClient {
    private final RestClient restClient;

    public SkinModelClient(@Value("${app.skin-model.url}") String modelServiceUrl) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(10_000);
        requestFactory.setReadTimeout(60_000);
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl(modelServiceUrl)
                .build();
    }

    public SkinModelPrediction predict(MultipartFile image) {
        try {
            ByteArrayResource resource = new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename() == null ? "skin-scan.jpg" : image.getOriginalFilename();
                }
            };
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            HttpHeaders imageHeaders = new HttpHeaders();
            String contentType = image.getContentType();
            imageHeaders.setContentType(MediaType.parseMediaType(
                    contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE));
            body.add("image", new HttpEntity<>(resource, imageHeaders));
            SkinModelPrediction prediction = restClient.post().uri("/predict?include_skin_type=true")
                    .contentType(MediaType.MULTIPART_FORM_DATA).body(body)
                    .retrieve().body(SkinModelPrediction.class);
            if (prediction == null) {
                throw new IllegalStateException("The skin model returned an empty response");
            }
            return prediction;
        } catch (IOException error) {
            throw new IllegalArgumentException("Unable to read the uploaded image", error);
        } catch (RestClientException error) {
            throw new SkinModelUnavailableException(
                    "Skin analysis is temporarily unavailable. Please try again shortly.", error);
        }
    }
}
