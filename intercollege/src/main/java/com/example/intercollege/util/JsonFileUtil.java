package com.example.intercollege.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JsonFileUtil {

    private static final ObjectMapper objectMapper =
            new ObjectMapper();

    static {
        objectMapper.registerModule(
                new JavaTimeModule()
        );
    }

    public static <T> List<T> readList(
            String filePath,
            TypeReference<List<T>> typeReference) {

        try {

            File file = new File(filePath);

            if (!file.exists()) {
                return new ArrayList<>();
            }

            return objectMapper.readValue(
                    file,
                    typeReference
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not read JSON file: " + filePath,
                    e
            );
        }
    }


    public static <T> void writeList(
            String filePath,
            List<T> data) {

        try {

            File file = new File(filePath);

            File parent = file.getParentFile();

            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(file, data);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not write JSON file: " + filePath,
                    e
            );
        }
    }
}