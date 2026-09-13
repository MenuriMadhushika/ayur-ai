package com.ayurai.ayuraibackend.exception;

public class TooManyScanRequestsException extends RuntimeException {
    public TooManyScanRequestsException() {
        super("Too many scan attempts. Please wait a minute and try again.");
    }
}
