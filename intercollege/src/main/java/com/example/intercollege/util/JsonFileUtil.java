package com.example.intercollege.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

public class JsonFileUtil {

    private static final Logger log =
            LoggerFactory.getLogger(JsonFileUtil.class);

    private static final ObjectMapper objectMapper =
            new ObjectMapper();

    // One lock so two requests never read/write the same file at once.
    private static final Object LOCK = new Object();

    static {
        objectMapper.registerModule(new JavaTimeModule());
    }

    public static <T> List<T> readList(
            String filePath,
            TypeReference<List<T>> typeReference) {

        synchronized (LOCK) {
            try {
                File file = new File(filePath).getAbsoluteFile();

                if (!file.exists() || file.length() == 0) {
                    return new ArrayList<>();
                }

                return objectMapper.readValue(file, typeReference);

            } catch (IOException e) {
                throw new RuntimeException(
                        "Could not read JSON file: " + filePath, e);
            }
        }
    }

    public static <T> void writeList(
            String filePath,
            List<T> data) {

        synchronized (LOCK) {
            try {
                File file = new File(filePath).getAbsoluteFile();
                File parent = file.getParentFile();

                if (parent != null && !parent.exists()) {
                    parent.mkdirs();
                }

                // Write to a temp file first, then swap it in,
                // so a crash can never leave a half-written JSON file.
                File temp = new File(parent, file.getName() + ".tmp");

                objectMapper
                        .writerWithDefaultPrettyPrinter()
                        .writeValue(temp, data);

                try {
                    Files.move(
                            temp.toPath(),
                            file.toPath(),
                            StandardCopyOption.REPLACE_EXISTING,
                            StandardCopyOption.ATOMIC_MOVE);
                } catch (AtomicMoveNotSupportedException e) {
                    Files.move(
                            temp.toPath(),
                            file.toPath(),
                            StandardCopyOption.REPLACE_EXISTING);
                }

                log.info("Saved {} record(s) to {}",
                        data.size(), file);

            } catch (IOException e) {
                throw new RuntimeException(
                        "Could not write JSON file: " + filePath, e);
            }
        }
    }
}