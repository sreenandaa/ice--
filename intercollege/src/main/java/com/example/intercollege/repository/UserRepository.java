
package com.example.intercollege.repository;

import com.example.intercollege.model.User;
import com.example.intercollege.util.JsonFileUtil;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    @Value("${app.data.directory:data}")
    private String dataDirectory;

    // GET THE USER FILE PATH
    private String filePath() {
        return Paths.get(dataDirectory, "users.json").toString();
    }

    // GET ALL USERS
    public List<User> findAll() {
        return JsonFileUtil.readList(
                filePath(),
                new TypeReference<List<User>>() {}
        );
    }

    // FIND USER BY USERNAME
    public Optional<User> findByUsername(String username) {
        return findAll()
                .stream()
                .filter(user ->
                        user.getUsername() != null &&
                        user.getUsername().equals(username)
                )
                .findFirst();
    }

    // CREATE USER
    public User save(User user) {
        List<User> users = findAll();

        users.add(user);

        JsonFileUtil.writeList(
                filePath(),
                users
        );

        return user;
    }

    // UPDATE USER
    public User update(User updatedUser) {
        List<User> users = findAll();

        for (int i = 0; i < users.size(); i++) {
            User existingUser = users.get(i);

            if (existingUser.getId() != null &&
                    existingUser.getId().equals(updatedUser.getId())) {

                users.set(i, updatedUser);

                JsonFileUtil.writeList(
                        filePath(),
                        users
                );

                return updatedUser;
            }
        }

        return null;
    }
}
