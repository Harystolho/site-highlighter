package com.harystolho.sitehighlighter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;

@Configuration
public class MongoConfig extends AbstractMongoConfiguration {

	@Value("${spring.data.mongodb.uri}")
	private String uri;

	@Override
	@Bean
	public MongoClient mongoClient() {
		return new MongoClient(new MongoClientURI(uri));
	}

	@Override
	protected String getDatabaseName() {
		return "highlight";
	}

}
