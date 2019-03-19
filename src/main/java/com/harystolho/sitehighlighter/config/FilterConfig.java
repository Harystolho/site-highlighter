package com.harystolho.sitehighlighter.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.harystolho.sitehighlighter.cookie.CookieService;
import com.harystolho.sitehighlighter.filter.CookieFilter;

@Configuration
public class FilterConfig {
	
	private CookieFilter cookieFilter;

	@Autowired
	public FilterConfig(CookieFilter cookieFilter) {
		this.cookieFilter = cookieFilter;
	}
	
	@Bean
	public FilterRegistrationBean<CookieFilter> cookieRegistrationBean(){
		FilterRegistrationBean<CookieFilter> filter = new FilterRegistrationBean<>();
		
		filter.setFilter(cookieFilter);
		filter.addUrlPatterns("/dashboard/*", "/api/*");
		// TODO add filter to API
		
		
		return filter;
	}

}
