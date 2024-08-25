package com.guava.TextMe.chatMessage;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepo extends MongoRepository<ChatMessage,String> {
    List<ChatMessage> findByChatId(String chatId);
}
