package com.shopfast.app.modelos;

import java.util.List;
public class ShoppingListResponse {
    private String id;
    private String name;
    private List<String> items;
    private String user_id;
    private String created_at;


    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<String> getItems() {
        return items;
    }

    public String getUser_id() {
        return user_id;
    }

    public String getCreated_at() {
        return created_at;
    }
}
