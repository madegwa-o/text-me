package com.guava.TextMe.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<UserEntity,String> {
    List<UserEntity> findAllByStatus(Status status);

}
