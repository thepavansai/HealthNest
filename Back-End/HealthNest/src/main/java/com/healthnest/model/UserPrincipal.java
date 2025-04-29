package com.healthnest.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails{

	private User user;

	public UserPrincipal(User user) {
		this.user=user;
	}
     @Override
	 public Collection<? extends GrantedAuthority> getAuthorities() {
	        // Add "ROLE_" prefix because Spring Security expects it by default
	        return Collections.singleton(
	            new SimpleGrantedAuthority("ROLE_" + user.getRole())
	        );
	    }

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return user.getEmail();
	}

}
