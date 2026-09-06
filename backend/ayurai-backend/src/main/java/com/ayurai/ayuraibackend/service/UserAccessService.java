package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.entity.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

/** Protects personal assessment data from cross-account access. */
@Service
public class UserAccessService {

    public void requireOwner(User authenticatedUser, Long requestedUserId) {
        if (authenticatedUser == null || authenticatedUser.getId() == null ||
                !authenticatedUser.getId().equals(requestedUserId)) {
            throw new AccessDeniedException(
                    "You can only access your own AyurAI information."
            );
        }
    }
}
