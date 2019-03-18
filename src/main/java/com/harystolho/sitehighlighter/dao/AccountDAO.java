package com.harystolho.sitehighlighter.dao;

import javax.servlet.http.HttpServletRequest;

import com.harystolho.sitehighlighter.model.Account;

public interface AccountDAO {

	void save(Account account);

	Account getAccountByEmail(String email);

}
