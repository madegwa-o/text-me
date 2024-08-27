package com.guava.TextMe.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public UserEntity addUser(@Payload UserEntity user){

        

        if (user.getId() != null){
            return userRepository.findById(user.getId()).orElse(null);
        }else {
            userService.saveUser(user);
            System.out.println("user: "+ user);
            return user;
        }
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public UserEntity disconnectUser(@Payload UserEntity user){
        userService.disconnectUser(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> findConnectedUser(){
        System.out.println("who called me?????");
        return ResponseEntity.ok(userService.findConnectedUser());
    }

}
