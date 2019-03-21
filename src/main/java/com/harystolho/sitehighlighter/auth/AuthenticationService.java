package com.harystolho.sitehighlighter.auth;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

/**
 * If a person using the highlight script/addon wants to authenticate with the
 * server, this is how it works: <br>
 * - The script makes a request to '/auth/temporaryId', the server creates a
 * temporary id and returns it <br>
 * - the script opens a new window/tab at the URL
 * '/auth/?temporary-id={id_here}', now the user should sign in<br>
 * - If the login is successful the window is closed and the server attaches a
 * token to the {temp_id} specified in the query URL <br>
 * - When the window/tab is opened a loop also starts at the user's browser, the
 * loop sends requests to '/auth/token/{temporary-id}' to check if the user has
 * signed in, if he has the server returns a token, if he hasn't the server
 * returns a 202 status for some minutes(the loop keeps sending requests until
 * the server returns a 4XX error)<br>
 * - The token value is stored in the localStorage in the browser as
 * 'highlight.authToken'
 * 
 * @author Harystolho
 *
 */
@Service
public class AuthenticationService {

	private Map<String, String> temporaryIds; // TODO add expiry date to ids

	private String INVALID_TOKEN = "invalid_token";

	public AuthenticationService() {
		this.temporaryIds = new HashMap<>();
	}

	public String generateId() {
		String newId = UUID.randomUUID().toString().replaceAll("-", "")
				+ UUID.randomUUID().toString().replaceAll("-", "");

		if (temporaryIds.containsKey(newId)) {
			return generateId();
		} else {
			temporaryIds.put(newId, INVALID_TOKEN);
			return newId;
		}
	}

	public void bindCookie(String tempId, Cookie cookie) {
		temporaryIds.put(tempId, cookie.getValue());
	}

	/**
	 * 
	 * @param temporaryId
	 * @return <code>null</code> if there wasn't a request with this {temporaryId}.
	 *         <code>Optional.of(token)</code> If the user signed in successfully.
	 *         <code>Optional.empty()</code> If there was a request with this
	 *         {temporaryId} but the user hasn't signed in yet
	 */
	public Optional<String> getAuthToken(String temporaryId) {
		String token = temporaryIds.get(temporaryId);

		if (token == null) {
			return null;
		} else if (token != INVALID_TOKEN) {
			temporaryIds.remove(temporaryId);
			return Optional.of(token);
		} else {
			return Optional.empty();
		}
	}

	// TODO if the user is already logged in ?

}
