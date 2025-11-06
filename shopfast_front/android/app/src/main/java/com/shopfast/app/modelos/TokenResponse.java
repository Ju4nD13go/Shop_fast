package com.shopfast.app.modelos;

public class TokenResponse {
    private String access_token;
    private String token_type;
    private UserResponse user;


    public String getAccess_token() {
        return access_token;
    }

    public String getToken_type (){
        return token_type;
    }

    public UserResponse getUser() {
        return user;
    }
}
