package com.guava.TextMe.chatRoom;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepo chatRoomRepo;

    public Optional<String> findChatRoomId(String senderId, String recipientId, boolean createChatIdIfNotExists) {
        return chatRoomRepo.findBySenderIdAndRecipientId(senderId,recipientId)
                .map(ChatRoom::getChatId)
                .or(()->{
                    if (createChatIdIfNotExists){
                        var chatId =  createchatId( senderId,recipientId);
                        return Optional.of(chatId);
                    }
                    else {
                        return Optional.empty();
                    }
                });

    }

    private String createchatId(String senderId, String recipientId) {
        var chatId = String.format("%s_%s",senderId,recipientId);

        ChatRoom senderReciever = ChatRoom.builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();

        ChatRoom recieverSender = ChatRoom.builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();

        chatRoomRepo.save(senderReciever);
        chatRoomRepo.save(recieverSender);

        return chatId;

    }

}
