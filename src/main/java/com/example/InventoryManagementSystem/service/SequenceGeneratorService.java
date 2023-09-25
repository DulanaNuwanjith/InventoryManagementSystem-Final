package com.example.InventoryManagementSystem.service;

import com.example.InventoryManagementSystem.model.DBSequence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class SequenceGeneratorService {

    private static final Logger logger = LoggerFactory.getLogger(SequenceGeneratorService.class);

    @Autowired
    private MongoOperations mongoOperations;

    public int getSequenceNumber(String sequenceName){
        logger.info("Getting sequence number for sequence: {}", sequenceName);

        Query query = new Query(Criteria.where("id").is(sequenceName));
        Update update = new Update().inc("seq", 1);
        DBSequence counter = mongoOperations.findAndModify(
                query,
                update,
                new FindAndModifyOptions().returnNew(true).upsert(true),
                DBSequence.class
        );
        int sequenceNumber = !Objects.isNull(counter) ? counter.getSeq() : 1;
        logger.info("Sequence number for sequence {}: {}", sequenceName, sequenceNumber);
        return sequenceNumber;
    }
}
