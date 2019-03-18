package com.harystolho.sitehighlighter.dao.impl;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.AccountDAO;
import com.harystolho.sitehighlighter.model.Account;

@Service
public class MongoAccountDAO implements AccountDAO {

	private static final Logger logger = Logger.getLogger(MongoAccountDAO.class.getName());

	private final MongoOperations mongoOperations;

	@Autowired
	public MongoAccountDAO(MongoOperations mongoOperations) {
		this.mongoOperations = mongoOperations;
	}

	@Override
	public void save(Account account) {
		mongoOperations.save(account);
	}

	@Override
	public Account getAccountByEmail(String email) {
		Query query = Query.query(Criteria.where("email").is(email));

		return mongoOperations.findOne(query, Account.class);
	}

	@Override
	public Account getAccountByEmailAndPassword(String email, String password) {
		Query query = Query.query(Criteria.where("email").is(email).and("password").is(password));

		return mongoOperations.findOne(query, Account.class);
	}

}
