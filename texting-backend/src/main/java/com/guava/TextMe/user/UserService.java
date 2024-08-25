package com.guava.TextMe.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void saveUser(UserEntity user) {
        user.setStatus(Status.ONLINE);
        userRepository.save(user);
    }

    public void disconnectUser(UserEntity user) {
        user.setStatus(Status.OFFLINE);
        userRepository.save(user);
    }

    public List<UserEntity> findConnectedUser() {
        return userRepository.findAllByStatus(Status.ONLINE);
    }
}
