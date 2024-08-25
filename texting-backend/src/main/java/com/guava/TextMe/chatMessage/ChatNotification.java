package com.guava.TextMe.chatMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatNotification {

    @Id
    private String id;
    private String receiver;
    private String sender;
    private String content;
}
