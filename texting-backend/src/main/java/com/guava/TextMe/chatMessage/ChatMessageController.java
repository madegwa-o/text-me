package com.guava.TextMe.chatMessage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class ChatMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService messageService;

    @MessageMapping("/chat")
    public void saveAndSendMessage(@Payload ChatMessage chatMessage){

        System.out.println("Got a message");
        ChatMessage savedMsg = messageService.save(chatMessage);

        System.out.println("saved message" + savedMsg);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiver(),
                "/queue/messages",
                new ChatNotification(
                        chatMessage.getId(),
                        chatMessage.getSender(),
                        chatMessage.getReceiver(),
                        chatMessage.getContent()
                )
        );
    }

    @GetMapping("messages/{senderUserName}/{recipientUserName}")
    public  ResponseEntity<List<ChatMessage> >findChatMessages(
            @PathVariable("senderUserName") String senderUserName,
            @PathVariable("recipientUserName") String recipientUserName){

        return ResponseEntity.ok(messageService.findChatMessages(senderUserName,recipientUserName));

    }
}
