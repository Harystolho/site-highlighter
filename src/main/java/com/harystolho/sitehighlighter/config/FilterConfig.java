package com.harystolho.sitehighlighter.config;


import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.harystolho.sitehighlighter.filter.CookieFilter;

@Configuration
public class FilterConfig {
	
	@Bean
	public FilterRegistrationBean<CookieFilter> cookieRegistrationBean(){
		FilterRegistrationBean<CookieFilter> filter = new FilterRegistrationBean<>();
		
		filter.setFilter(new CookieFilter());
		filter.addUrlPatterns("/dashboard/*");

		return filter;
	}

}
