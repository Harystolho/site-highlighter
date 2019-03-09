package com.harystolho.sitehighlighter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

	static {
		System.setProperty("user.timezone", "UTC");
	}

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
}

//TODO add share on social media
//TODO add option to choose where what document to add the highlight

//TODO add display document on the page that is being highlighted

//TODO add reminder

//TODO add keyboard shortcut

//TODO add tag to document
//TODO add sort by tag
//TODO change document's name
//TODO delete document

//TODO add account/guest

//TODO create addon