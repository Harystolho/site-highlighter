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
//TODO fix modal position

//TODO add frame to see highlight in the page
//TODO add display document on the page that is being highlighted

//TODO add reminder

//TODO add tag to document
//TODO add sort by tag
//TODO delete document
//TODO change document's name
//TODO add calendar to remainder's doc

//TODO add account/guest