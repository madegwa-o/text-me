package com.guava.TextMe.chatMessage;

import com.guava.TextMe.chatRoom.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatRoomService chatRoomService;
    private final ChatMessageRepo chatMessageRepo;

    public ChatMessage save(ChatMessage chatMessage) {

        String chatId = chatRoomService
                .findChatRoomId(chatMessage.getSender(),chatMessage.getReceiver(),true)
                .orElseThrow(() -> new RuntimeException("Bullshit"));

        chatMessage.setChatId(chatId);
        chatMessageRepo.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId){
        var chatId = chatRoomService.findChatRoomId(senderId,recipientId,false);

        return chatId.map(chatMessageRepo::findByChatId).orElse(new ArrayList<>());
    }
}
